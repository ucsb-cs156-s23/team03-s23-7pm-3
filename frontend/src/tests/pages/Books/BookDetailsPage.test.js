import { render, screen, waitFor } from "@testing-library/react";
import BookDetailsPage from "main/pages/Books/BookDetailsPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { bookFixtures } from "fixtures/bookFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import mockConsole from "jest-mock-console";

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');
    return {
        __esModule: true,
        ...originalModule,
        useParams: () => ({
            id: 1
        }),
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("BookDetailsPage tests", () => {

    const axiosMock = new AxiosMockAdapter(axios);

    const setupUserOnly = () => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    };

    const setupAdminUser = () => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.adminUser);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    };

    test("renders without crashing", async () => {
        const queryClient = new QueryClient();
        setupUserOnly();
        axiosMock.onGet("/api/books").timeout();

        const restoreConsole = mockConsole();

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <BookDetailsPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => { expect(axiosMock.history.get.length).toBeGreaterThanOrEqual(1); });

        const errorMessage = console.error.mock.calls[0][0];
        expect(errorMessage).toMatch("Error communicating with backend via GET on /api/books");
        restoreConsole();
    });

    test("loads the correct fields, and no buttons", async () => {
        const queryClient = new QueryClient();
        const book = bookFixtures.oneBook[0];
        setupAdminUser();
        axiosMock.onGet("/api/books", { params: { id: 1 } }).reply(200, book);

        const { getByTestId, findByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <BookDetailsPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await findByTestId("BookTable-cell-row-0-col-id");

		const idField = getByTestId("BookTable-cell-row-0-col-id");
		const titleField = getByTestId("BookTable-cell-row-0-col-title");
		const authorField = getByTestId("BookTable-cell-row-0-col-author");
		const descriptionField = getByTestId("BookTable-cell-row-0-col-description")

		expect(idField).toHaveTextContent(book.id);
		expect(titleField).toHaveTextContent(book.title);
		expect(authorField).toHaveTextContent(book.author);
		expect(descriptionField).toHaveTextContent(book.description);

		expect(screen.queryByText("Delete")).not.toBeInTheDocument();
		expect(screen.queryByText("Edit")).not.toBeInTheDocument();
		expect(screen.queryByText("Details")).not.toBeInTheDocument();
    });

});
