import { render, screen, act, waitFor, fireEvent } from "@testing-library/react";
import BookEditPage from "main/pages/Books/BookEditPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import mockConsole from "jest-mock-console";

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: () => ({
        id: 3
    }),
    useNavigate: () => mockNavigate
}));

const mockUpdate = jest.fn();
jest.mock('main/utils/bookUtils', () => {
    return {
        __esModule: true,
        bookUtils: {
            update: (_book) => { return mockUpdate(); },
            getById: (_id) => {
                return {
                    book: {
                        id: 3,
                        title: "The Great Gatsby",
                        author: "F. Scott Fitzgerald",
                        description: "A story about a mysterious, rich man"
                    }
                }
            }
        }
    }
});


describe("BookEditPage tests", () => {

    const queryClient = new QueryClient();

    test("renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <BookEditPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("loads the correct fields", async () => {

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <BookEditPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        expect(screen.getByTestId("BookForm-title")).toBeInTheDocument();
        expect(screen.getByDisplayValue('The Great Gatsby')).toBeInTheDocument();
        expect(screen.getByDisplayValue('F. Scott Fitzgerald')).toBeInTheDocument();
        expect(screen.getByDisplayValue('A story about a mysterious, rich man')).toBeInTheDocument();
    });

    test("redirects to /books on submit", async () => {

        const restoreConsole = mockConsole();

        mockUpdate.mockReturnValue({
            "book": {
                id: 3,
                title: "The Amber Spyglass",
                author: "Philip Pullman",
                description: "The third novel in the His Dark Materials trilogy"
            }
        });

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <BookEditPage />
                </MemoryRouter>
            </QueryClientProvider>
        )

        const titleInput = screen.getByLabelText("Title");
        expect(titleInput).toBeInTheDocument();

        const authorInput = screen.getByLabelText("Author");
        expect(authorInput).toBeInTheDocument();

        const descriptionInput = screen.getByLabelText("Description");
        expect(descriptionInput).toBeInTheDocument();

        const updateButton = screen.getByText("Update");
        expect(updateButton).toBeInTheDocument();

        await act(async () => {
            fireEvent.change(titleInput, { target: { value: 'The Amber Spyglass' } })
            fireEvent.change(authorInput, { target: { value: 'Philip Pullman' } })
            fireEvent.change(descriptionInput, { target: { value: 'The third novel in the His Dark Materials trilogy' } })
            fireEvent.click(updateButton);
        });

        await waitFor(() => expect(mockUpdate).toHaveBeenCalled());
        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/books"));

        // assert - check that the console.log was called with the expected message
        expect(console.log).toHaveBeenCalled();
        const message = console.log.mock.calls[0][0];
        const expectedMessage = `updatedBook: {"book":{"id":3,"title":"The Amber Spyglass","author":"Philip Pullman","description":"The third novel in the His Dark Materials trilogy"}`

        expect(message).toMatch(expectedMessage);
        restoreConsole();

    });

});


