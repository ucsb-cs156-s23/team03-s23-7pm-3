import { render, screen, waitFor } from "@testing-library/react";
import IceCreamShopIndexPage from "main/pages/IceCreamShops/IceCreamShopIndexPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import mockConsole from "jest-mock-console";
import { apiCurrentUserFixtures }  from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate
}));

const mockDelete = jest.fn();
jest.mock('main/utils/iceCreamShopUtils', () => {
    return {
        __esModule: true,
        iceCreamShopUtils: {
            del: (id) => {
                return mockDelete(id);
            },
            get: () => {
                return {
                    nextId: 5,
                    iceCreamShops: [
                        {
                            "id": 3,
                            "name": "i.v. drip",
                            "description": "Quaint, compact cafe serving locally roasted coffee alongside housemade baked treats & ice cream.",
                            "flavor": "strawberry"
                        },
                    ]
                }
            }
        }
    }
});


describe("IceCreamShopIndexPage tests", () => {

    const axiosMock =new AxiosMockAdapter(axios);
    axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither); 

    const queryClient = new QueryClient();
    test("renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <IceCreamShopIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("renders correct fields", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <IceCreamShopIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        const createIceCreamShopButton = screen.getByText("Create Ice Cream Shop");
        expect(createIceCreamShopButton).toBeInTheDocument();
        expect(createIceCreamShopButton).toHaveAttribute("style", "float: right;");

        const name = screen.getByText("i.v. drip");
        expect(name).toBeInTheDocument();

        const description = screen.getByText("Quaint, compact cafe serving locally roasted coffee alongside housemade baked treats & ice cream.");
        expect(description).toBeInTheDocument();

        const flavor = screen.getByText("strawberry");
        expect(flavor).toBeInTheDocument();

        expect(screen.getByTestId("IceCreamShopTable-cell-row-0-col-Delete-button")).toBeInTheDocument();
        expect(screen.getByTestId("IceCreamShopTable-cell-row-0-col-Details-button")).toBeInTheDocument();
        expect(screen.getByTestId("IceCreamShopTable-cell-row-0-col-Edit-button")).toBeInTheDocument();
    });

    test("delete button calls delete and reloads page", async () => {

        const restoreConsole = mockConsole();

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <IceCreamShopIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        const name = screen.getByText("i.v. drip");
        expect(name).toBeInTheDocument();

        const description = screen.getByText("Quaint, compact cafe serving locally roasted coffee alongside housemade baked treats & ice cream.");
        expect(description).toBeInTheDocument();

        const flavor = screen.getByText("strawberry");
        expect(flavor).toBeInTheDocument();

        const deleteButton = screen.getByTestId("IceCreamShopTable-cell-row-0-col-Delete-button");
        expect(deleteButton).toBeInTheDocument();

        deleteButton.click();

        expect(mockDelete).toHaveBeenCalledTimes(1);
        expect(mockDelete).toHaveBeenCalledWith(3);

        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/iceCreamShops/list"));


        // assert - check that the console.log was called with the expected message
        expect(console.log).toHaveBeenCalled();
        const message = console.log.mock.calls[0][0];
        const expectedMessage = `IceCreamShopIndexPage deleteCallback: {"id":3,"name":"i.v. drip","description":"Quaint, compact cafe serving locally roasted coffee alongside housemade baked treats & ice cream.","flavor":"strawberry"}`;
        expect(message).toMatch(expectedMessage);
        restoreConsole();

    });

});


