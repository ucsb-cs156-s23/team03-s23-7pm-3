import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import RestaurantCreatePage from "main/pages/Restaurants/RestaurantCreatePage";
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

const mockAdd = jest.fn();
jest.mock('main/utils/restaurantUtils', () => {
    return {
        __esModule: true,
        restaurantUtils: {
            add: () => { return mockAdd(); }
        }
    }
});

describe("RestaurantCreatePage tests", () => {

    const axiosMock =new AxiosMockAdapter(axios);
    axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither); 

    const queryClient = new QueryClient();
    test("renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <RestaurantCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("redirects to /restaurants on submit", async () => {

        const restoreConsole = mockConsole();

        mockAdd.mockReturnValue({
            "restaurant": {
                id: 3,
                name: "South Coast Deli",
                description: "Sandwiches and Salads"
            }
        });

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <RestaurantCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        )

        const nameInput = screen.getByLabelText("Name");
        expect(nameInput).toBeInTheDocument();


        const descriptionInput = screen.getByLabelText("Description");
        expect(descriptionInput).toBeInTheDocument();

        const createButton = screen.getByText("Create");
        expect(createButton).toBeInTheDocument();

        await act(async () => {
            fireEvent.change(nameInput, { target: { value: 'South Coast Deli' } })
            fireEvent.change(descriptionInput, { target: { value: 'Sandwiches and Salads' } })
            fireEvent.click(createButton);
        });

        await waitFor(() => expect(mockAdd).toHaveBeenCalled());
        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/restaurants"));

        // assert - check that the console.log was called with the expected message
        expect(console.log).toHaveBeenCalled();
        const message = console.log.mock.calls[0][0];
        const expectedMessage = `createdRestaurant: {"restaurant":{"id":3,"name":"South Coast Deli","description":"Sandwiches and Salads"}`
        expect(message).toMatch(expectedMessage);
        restoreConsole();

    });

});


