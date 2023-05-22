import { render, queryByTestId, waitFor, fireEvent } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import IceCreamShopEditPage from "main/pages/IceCreamShops/IceCreamShopEditPage";

import { apiCurrentUserFixtures }  from "fixtures/currentUserFixtures";
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
            id: 17
        }),
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("IceCreamShopEditPage tests", () => {

    describe("when the backend doesn't return a todo", () => { 
        const axiosMock = new AxiosMockAdapter(axios);
        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/icecreamshop", { params: { id: 17 } }).timeout();
        });

        const queryClient = new QueryClient();
        test("renders header but table is not present", async () => {

            const restoreConsole = mockConsole();

            const { getByText, queryByTestId, findByText } = render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <IceCreamShopEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await findByText("Edit Ice Cream Shop");
            expect(queryByTestId("IceCreamShopForm-name")).not.toBeInTheDocument();
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
            axiosMock.onGet("/api/icecreamshop", { params: { id: 17 } }).reply(200, {
                id: 17,
                name: "Baskin Robbins",
                description: "A lot of ice cream",
                flavor: "Vanilla"
                
            });
            axiosMock.onPut('/api/icecreamshop').reply(200, {
                id: 17,
                name: "Coldstone Creamery",
                description: "The one with the cold stone",
                flavor: "Chocolate"
                
            });
        });

    
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

        test("Is populated with the data provided", async () => {

            const { getByTestId, findByTestId } = render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <IceCreamShopEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await findByTestId("IceCreamShopForm-name");
    
            const nameField = getByTestId("IceCreamShopForm-name");
            const descriptionField = getByTestId("IceCreamShopForm-description");
            const flavorField = getByTestId("IceCreamShopForm-flavor");

            expect(nameField).toHaveValue("Baskin Robbins");
            expect(descriptionField).toHaveValue("A lot of ice cream");
            expect(flavorField).toHaveValue("Vanilla");

        });

        test("Changes when you click Update", async () => {

            const { getByTestId, findByTestId } = render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <IceCreamShopEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await findByTestId("IceCreamShopForm-name");
    
            const nameField = getByTestId("IceCreamShopForm-name");
            const descriptionField = getByTestId("IceCreamShopForm-description");
            const flavorField = getByTestId("IceCreamShopForm-flavor");
            const submitButton = getByTestId("IceCreamShopForm-submit");

            expect(nameField).toHaveValue("Baskin Robbins");
            expect(descriptionField).toHaveValue("A lot of ice cream");
            expect(flavorField).toHaveValue("Vanilla");

            expect(submitButton).toBeInTheDocument();

            fireEvent.change(nameField, { target: { value: 'Coldstone Creamery' } })
            fireEvent.change(descriptionField, { target: { value: "The one with the cold stone" } })
            fireEvent.change(flavorField, { target: { value: 'Chocolate' } })

            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled);
            expect(mockToast).toBeCalledWith("IceCreamShop Updated - id: 1, name: The one with the cold stone, flavor: Chocolate");
            expect(mockNavigate).toBeCalledWith({ "to": "/icecreamshops/list" });

            expect(axiosMock.history.put.length).toBe(1); // times called
            expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
            expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
                title: "Coldstone Creamery",
                description: "The one with the cold stone",
                flavor: "Chocolate"
            })); // posted object
        });
    });
});