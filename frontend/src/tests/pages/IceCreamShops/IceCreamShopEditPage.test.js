import { render, screen, act, waitFor, fireEvent } from "@testing-library/react";
import IceCreamShopEditPage from "main/pages/IceCreamShops/IceCreamShopEditPage";
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
    useParams: () => ({
        id: 3
    }),
    useNavigate: () => mockNavigate
}));

const mockUpdate = jest.fn();
jest.mock('main/utils/iceCreamShopUtils', () => {
    return {
        __esModule: true,
        iceCreamShopUtils: {
            update: (_iceCreamShop) => {return mockUpdate();},
            getById: (_id) => {
                return {
                    iceCreamShop: {
                        id: 3,
                        name: "Freebirds",
                        description: "Burritos",
                        flavor: "Carne Asada"
                    }
                }
            }
        }
    }
});


describe("IceCreamShopEditPage tests", () => {

    const axiosMock =new AxiosMockAdapter(axios);
    axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither); 

    const queryClient = new QueryClient();

    test("renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <IceCreamShopEditPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("loads the correct fields", async () => {

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <IceCreamShopEditPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        expect(screen.getByTestId("IceCreamShopForm-name")).toBeInTheDocument();
        expect(screen.getByDisplayValue('Freebirds')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Burritos')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Carne Asada')).toBeInTheDocument();
    });

    test("redirects to /iceCreamShops on submit", async () => {

        const restoreConsole = mockConsole();

        mockUpdate.mockReturnValue({
            "iceCreamShop": {
                id: 3,
                name: "Baskin Robbins",
                description: "A lot of ice cream",
                flavor: "Strawberry"
            }
        });

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <IceCreamShopEditPage />
                </MemoryRouter>
            </QueryClientProvider>
        )

        const nameInput = screen.getByLabelText("Name");
        expect(nameInput).toBeInTheDocument();


        const descriptionInput = screen.getByLabelText("Description");
        expect(descriptionInput).toBeInTheDocument();

        const flavorInput = screen.getByLabelText("Most Popular Flavor");
        expect(flavorInput).toBeInTheDocument();

        const updateButton = screen.getByText("Update");
        expect(updateButton).toBeInTheDocument();

        await act(async () => {
            fireEvent.change(nameInput, { target: { value: 'Baskin Robbins' } })
            fireEvent.change(descriptionInput, { target: { value: 'A lot of ice cream' } })
            fireEvent.change(flavorInput, { target: { value: 'Strawberry' } })
            fireEvent.click(updateButton);
        });

        await waitFor(() => expect(mockUpdate).toHaveBeenCalled());
        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/iceCreamShops/list"));

        // assert - check that the console.log was called with the expected message
        expect(console.log).toHaveBeenCalled();
        const message = console.log.mock.calls[0][0];
        const expectedMessage =  `updatedIceCreamShop: {"iceCreamShop":{"id":3,"name":"Baskin Robbins","description":"A lot of ice cream","flavor":"Strawberry"}`

        expect(message).toMatch(expectedMessage);
        restoreConsole();

    });

});

