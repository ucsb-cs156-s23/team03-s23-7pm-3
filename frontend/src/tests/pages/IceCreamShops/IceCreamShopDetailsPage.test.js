import { render, screen } from "@testing-library/react";
import IceCreamShopDetailsPage from "main/pages/IceCreamShops/IceCreamShopDetailsPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: () => ({
        id: 3
    }),
    useNavigate: () => mockNavigate
}));

jest.mock('main/utils/iceCreamShopUtils', () => {
    return {
        __esModule: true,
        iceCreamShopUtils: {
            getById: (_id) => {
                return {
                    iceCreamShop: {
                        id: 3,
                        name: "i.v. drip",
                        description: "Quaint, compact cafe serving locally roasted coffee alongside housemade baked treats & ice cream.",
                        flavor: "strawberry"
                    }
                }
            }
        }
    }
});

describe("IceCreamShopDetailsPage tests", () => {

    const queryClient = new QueryClient();
    test("renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <IceCreamShopDetailsPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("loads the correct fields, and no buttons", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <IceCreamShopDetailsPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
        expect(screen.getByText("i.v. drip")).toBeInTheDocument();
        expect(screen.getByText("Quaint, compact cafe serving locally roasted coffee alongside housemade baked treats & ice cream.")).toBeInTheDocument();
        expect(screen.getByText("strawberry")).toBeInTheDocument();

        expect(screen.queryByText("Delete")).not.toBeInTheDocument();
        expect(screen.queryByText("Edit")).not.toBeInTheDocument();
        expect(screen.queryByText("Details")).not.toBeInTheDocument();
    });

});

