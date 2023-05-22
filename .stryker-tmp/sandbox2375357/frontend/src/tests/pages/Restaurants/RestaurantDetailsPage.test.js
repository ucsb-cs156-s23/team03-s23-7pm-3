import { render, screen, waitFor } from "@testing-library/react";
import RestaurantDetailsPage from "main/pages/Restaurants/RestaurantDetailsPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { restaurantFixtures } from "fixtures/restaurantFixtures";
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

describe("RestaurantDetailsPage tests", () => {

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
        axiosMock.onGet("/api/restaurants").timeout();

        const restoreConsole = mockConsole();

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <RestaurantDetailsPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => { expect(axiosMock.history.get.length).toBeGreaterThanOrEqual(1); });

        const errorMessage = console.error.mock.calls[0][0];
        expect(errorMessage).toMatch("Error communicating with backend via GET on /api/restaurants");
        restoreConsole();
    });

    test("loads the correct fields, and no buttons", async () => {
        const queryClient = new QueryClient();
        const restaurant = restaurantFixtures.oneRestaurant[0];
        setupAdminUser();
        axiosMock.onGet("/api/restaurants", { params: { id: 1 } }).reply(200, restaurant);

        const { getByTestId, findByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <RestaurantDetailsPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await findByTestId("RestaurantTable-cell-row-0-col-id");

		const idField = getByTestId("RestaurantTable-cell-row-0-col-id");
		const nameField = getByTestId("RestaurantTable-cell-row-0-col-name");
		const descriptionField = getByTestId("RestaurantTable-cell-row-0-col-description");
        const addressField = getByTestId("RestaurantTable-cell-row-0-col-address");

		expect(idField).toHaveTextContent(restaurant.id);
		expect(nameField).toHaveTextContent(restaurant.name);
		expect(descriptionField).toHaveTextContent(restaurant.description);
        expect(addressField).toHaveTextContent(restaurant.address);

		expect(screen.queryByText("Delete")).not.toBeInTheDocument();
		expect(screen.queryByText("Edit")).not.toBeInTheDocument();
		expect(screen.queryByText("Details")).not.toBeInTheDocument();
    });

});