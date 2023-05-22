import { render, waitFor, fireEvent } from "@testing-library/react";
import BooksCreatePage from "main/pages/Books/BookCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const mockToast = jest.fn();
jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');
    return {
        __esModule: true,
        ...originalModule,
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("BooksCreatePage tests", () => {

    const axiosMock = new AxiosMockAdapter(axios);

    beforeEach(() => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    });

    test("renders without crashing", () => {
        const queryClient = new QueryClient();
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <BooksCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("when you fill in the form and hit submit, it makes a request to the backend", async () => {

        const queryClient = new QueryClient();
        const book = {
            id: 17,
            title: "The Great Gatsby",
            author: "F. Scott Fitzgerald",
            description: "A story about a mysterious, rich man"
        };

        axiosMock.onPost("/api/books/post").reply(202, book);

        const { getByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <BooksCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(getByTestId("BookForm-title")).toBeInTheDocument();
        });

        const titleField = getByTestId("BookForm-title");
        const authorField = getByTestId("BookForm-author");
        const descriptionField = getByTestId("BookForm-description");
        const submitButton = getByTestId("BookForm-submit");

        fireEvent.change(titleField, { target: { value: 'The Great Gatsby' } });
        fireEvent.change(authorField, { target: { value: 'F. Scott Fitzgerald' } });
        fireEvent.change(descriptionField, { target: { value: 'A story about a mysterious, rich man' } });

        expect(submitButton).toBeInTheDocument();

        fireEvent.click(submitButton);

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        expect(axiosMock.history.post[0].params).toEqual(
            {
                "title": "The Great Gatsby",
                "author": "F. Scott Fitzgerald",
                "description": "A story about a mysterious, rich man"
            });

        expect(mockToast).toBeCalledWith("New book Created - id: 17 title: The Great Gatsby");
        expect(mockNavigate).toBeCalledWith({ "to": "/books/list" });
    });


});





