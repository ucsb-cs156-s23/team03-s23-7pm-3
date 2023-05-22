import { render, screen, waitFor } from "@testing-library/react";
import IceCreamShopDetailsPage from "main/pages/IceCreamShops/IceCreamShopDetailsPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { apiCurrentUserFixtures }  from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { iceCreamShopFixtures } from "fixtures/iceCreamShopFixtures";
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

describe("IceCreamShopDetailsPage tests", () => {

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
        axiosMock.onGet("/api/icecreamshops").timeout();

        const restoreConsole = mockConsole();

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <IceCreamShopDetailsPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
        
        await waitFor(() => { expect(axiosMock.history.get.length).toBeGreaterThanOrEqual(1); });

        const errorMessage = console.error.mock.calls[0][0];
        expect(errorMessage).toMatch("Error communicating with backend via GET on /api/icecreamshops");
        restoreConsole();
    });

    test("loads the correct fields, and no buttons", async () => {
        const queryClient = new QueryClient();
        const iceCreamShop = iceCreamShopFixtures.oneIceCreamShop[0];
        setupAdminUser();
        axiosMock.onGet("/api/icecreamshops", { params: { id: 1 } }).reply(200, iceCreamShop);

        const { getByTestId, findByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <IceCreamShopDetailsPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
        
        await findByTestId("IceCreamShopTable-cell-row-0-col-id");
        const idField = getByTestId("IceCreamShopTable-cell-row-0-col-id");
		const titleField = getByTestId("IceCreamShopTable-cell-row-0-col-title");
		const authorField = getByTestId("IceCreamShopTable-cell-row-0-col-author");
		const descriptionField = getByTestId("IceCreamShopTable-cell-row-0-col-description")

		expect(idField).toHaveTextContent(iceCreamShops.id);
		expect(titleField).toHaveTextContent(iceCreamShops.title);
		expect(authorField).toHaveTextContent(iceCreamShops.author);
		expect(descriptionField).toHaveTextContent(iceCreamShops.description);

		expect(screen.queryByText("Delete")).not.toBeInTheDocument();
		expect(screen.queryByText("Edit")).not.toBeInTheDocument();
		expect(screen.queryByText("Details")).not.toBeInTheDocument();
    });

});

