import { render, waitFor, fireEvent } from "@testing-library/react";
import IceCreamShopCreatePage from "main/pages/IceCreamShops/IceCreamShopCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures }  from "fixtures/currentUserFixtures";
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

describe("IceCreamShopCreatePage tests", () => {

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
                    <IceCreamShopCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("when you fill in the form and hit submit, it makes a request to the backend", async () => {

        const queryClient = new QueryClient();

        const iceCreamShop = {
            name: "Baskin Robbins",
            description: "A lot of ice cream",
            flavor: "Vanilla"
        };

        axiosMock.onPost("/api/icecreamshop/post").reply(202, iceCreamShop)

        const { getByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <IceCreamShopCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(getByTestId("IceCreamShopForm-name")).toBeInTheDocument();
        });

        const nameField = getByTestId("IceCreamShopForm-name");
        const descriptionField = getByTestId("IceCreamShopForm-description");
        const flavorField = getByTestId("IceCreamShopForm-flavor");
        const submitButton = getByTestId("IceCreamShopForm-submit");

        fireEvent.change(nameField, { target: { value: "Baskin Robbins" } });
        fireEvent.change(descriptionField, { target: { value: "A lot of ice cream" } });
        fireEvent.change(flavorField, { target: { value: "Vanilla" } });

        expect(submitButton).toBeInTheDocument();

        fireEvent.click(submitButton);

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        expect(axiosMock.history.post[0].params).toEqual(
            {
                "name": "Baskin Robbins",
                "description": "A lot of ice cream",
                "flavor": "Vanilla"
            });

        expect(mockToast).toBeCalledWith("New iceCreamShop Created - name: Baskin Robbins, description: A lot of ice cream, flavor: Vanilla");
        expect(mockNavigate).toBeCalledWith({ "to": "/icecreamshops/list" });

    });

});

