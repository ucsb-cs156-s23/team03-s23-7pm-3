import { fireEvent, queryByTestId, render, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import RestaurantEditPage from "main/pages/Restaurants/RestaurantEditPage";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import mockConsole from "jest-mock-console";

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
        useParams: () => ({
            id: 3
        }),
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("RestaurantEditPage tests", () => {
    describe("when the backend doesn't return a todo", () => {
        const axiosMock = new AxiosMockAdapter(axios);
        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/restaurants", { params: { id: 3 } }).timeout();
        });

        const queryClient = new QueryClient();
        test("renders header but table is not present", async () => {

            const restoreConsole = mockConsole();

            const { getByText, queryByTestId, findByText } = render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <RestaurantEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await findByText("Edit Restaurant");
            expect(queryByTestId("RestaurantForm-name")).not.toBeInTheDocument();
            restoreConsole();
        });
    });

    describe("tests where backend is working normally", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/restaurants", { params: { id: 3 } }).reply(200, {
                id: 3,
                name: "South Coast Deli",
                description: "Sandwiches and Salads",
                address: "185 S Patterson Ave"
            });
            axiosMock.onPut('/api/restaurants').reply(200, {
                id: "3",
                name: "South Coast Deli (Goleta)",
                description: "Sandwiches, Salads and more",
                address: "185 S Patterson Ave, Santa Barbara"
            });
        });

        const queryClient = new QueryClient();
        test("renders without crashing", () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <RestaurantEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
        });

        test("Is populated with the data provided", async () => {

            const { getByTestId, findByTestId } = render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <RestaurantEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await findByTestId("RestaurantForm-name");

            const idField = getByTestId("RestaurantForm-id");
            const nameField = getByTestId("RestaurantForm-name");
            const descriptionField = getByTestId("RestaurantForm-description");
            const addressField = getByTestId("RestaurantForm-address");
            const submitButton = getByTestId("RestaurantForm-submit");

            expect(idField).toHaveValue("3");
            expect(nameField).toHaveValue("South Coast Deli");
            expect(descriptionField).toHaveValue("Sandwiches and Salads");
            expect(addressField).toHaveValue("185 S Patterson Ave");
        });

        test("Changes when you click Update", async () => {
            const { getByTestId, findByTestId } = render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <RestaurantEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await findByTestId("RestaurantForm-name");

            const idField = getByTestId("RestaurantForm-id");
            const nameField = getByTestId("RestaurantForm-name");
            const descriptionField = getByTestId("RestaurantForm-description");
            const addressField = getByTestId("RestaurantForm-address");
            const submitButton = getByTestId("RestaurantForm-submit");

            expect(idField).toHaveValue("3");
            expect(nameField).toHaveValue("South Coast Deli");
            expect(descriptionField).toHaveValue("Sandwiches and Salads");
            expect(addressField).toHaveValue("185 S Patterson Ave");
            expect(submitButton).toBeInTheDocument();
            
            fireEvent.change(nameField, { target: { value: 'South Coast Deli (Goleta)' } })
            fireEvent.change(descriptionField, { target: { value: "Sandwiches, Salads and more" } })
            fireEvent.change(addressField, { target: { value: '185 S Patterson Ave, Santa Barbara' } })
            fireEvent.click(submitButton);
            
            await waitFor(() => expect(mockToast).toBeCalled);
            
            expect(mockToast).toBeCalledWith("Restaurant Updated - id: 3 name: South Coast Deli (Goleta)");
            expect(mockNavigate).toBeCalledWith({ "to": "/restaurants/list" });
            
            expect(axiosMock.history.put.length).toBe(1); // times called
            expect(axiosMock.history.put[0].params).toEqual({ id: 3 });
            expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
                name: "South Coast Deli (Goleta)",
                description: "Sandwiches, Salads and more",
                address: "185 S Patterson Ave, Santa Barbara"
            })); 
        });
    });
});
