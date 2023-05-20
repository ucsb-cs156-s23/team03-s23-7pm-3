import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import IceCreamShopCreatePage from "main/pages/IceCreamShops/IceCreamShopCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import mockConsole from "jest-mock-console";

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate
}));

const mockAdd = jest.fn();
jest.mock('main/utils/iceCreamShopUtils', () => {
    return {
        __esModule: true,
        iceCreamShopUtils: {
            add: () => { return mockAdd(); }
        }
    }
});

describe("IceCreamShopCreatePage tests", () => {

    const queryClient = new QueryClient();
    test("renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <IceCreamShopCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("redirects to /iceCreamShops/list on submit", async () => {

        const restoreConsole = mockConsole();

        mockAdd.mockReturnValue({
            "iceCreamShop": {
                id: 3,
                name: "Baskin Robbins",
                description: "A lot of ice cream",
                flavor: "Vanilla"
            }
        });

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <IceCreamShopCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        )

        const nameInput = screen.getByLabelText("Name");
        expect(nameInput).toBeInTheDocument();


        const descriptionInput = screen.getByLabelText("Description");
        expect(descriptionInput).toBeInTheDocument();

        const flavorInput = screen.getByLabelText("Most Popular Flavor");
        expect(flavorInput).toBeInTheDocument();

        const createButton = screen.getByText("Create");
        expect(createButton).toBeInTheDocument();

        await act(async () => {
            fireEvent.change(nameInput, { target: { value: 'Baskin Robbins' } })
            fireEvent.change(descriptionInput, { target: { value: 'A lot of ice cream' } })
            fireEvent.change(flavorInput, { target: { value: 'Vanilla' } })

            fireEvent.click(createButton);
        });

        await waitFor(() => expect(mockAdd).toHaveBeenCalled());
        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/iceCreamShops/list"));

        // assert - check that the console.log was called with the expected message
        expect(console.log).toHaveBeenCalled();
        const message = console.log.mock.calls[0][0];
        const expectedMessage =  `createdIceCreamShop: {"iceCreamShop":{"id":3,"name":"Baskin Robbins","description":"A lot of ice cream","flavor":"Vanilla"}`

        expect(message).toMatch(expectedMessage);
        restoreConsole();

    });

});

