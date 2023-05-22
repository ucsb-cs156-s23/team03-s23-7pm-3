import { fireEvent, render, waitFor } from "@testing-library/react";
import { bookFixtures } from "fixtures/bookFixtures";
import BooksTable from "main/components/Books/BookTable";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { currentUserFixtures } from "fixtures/currentUserFixtures";


const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'),
	useNavigate: () => mockedNavigate
}));

describe("UserTable tests", () => {
	const queryClient = new QueryClient();


	test("renders without crashing for empty table with user not logged in", () => {
		const currentUser = null;

		render(
			<QueryClientProvider client={queryClient}>
				<MemoryRouter>
					<BooksTable books={[]} currentUser={currentUser} />
				</MemoryRouter>
			</QueryClientProvider>

		);
	});
	test("renders without crashing for empty table for ordinary user", () => {
		const currentUser = currentUserFixtures.userOnly;

		render(
			<QueryClientProvider client={queryClient}>
				<MemoryRouter>
					<BooksTable books={[]} currentUser={currentUser} />
				</MemoryRouter>
			</QueryClientProvider>

		);
	});

	test("renders without crashing for empty table for admin", () => {
		const currentUser = currentUserFixtures.adminUser;

		render(
			<QueryClientProvider client={queryClient}>
				<MemoryRouter>
					<BooksTable books={[]} currentUser={currentUser} />
				</MemoryRouter>
			</QueryClientProvider>

		);
	});

	test("Has the expected colum headers and content for adminUser", () => {

		const currentUser = currentUserFixtures.adminUser;

		const { getByText, getByTestId } = render(
			<QueryClientProvider client={queryClient}>
				<MemoryRouter>
					<BooksTable books={bookFixtures.threeBooks} currentUser={currentUser} />
				</MemoryRouter>
			</QueryClientProvider>

		);

		const expectedHeaders = ["id", "Title", "Author", "Description"];
		const expectedFields = ["id", "title", "author", "description"];
		const testId = "BookTable";

		expectedHeaders.forEach((headerText) => {
			const header = getByText(headerText);
			expect(header).toBeInTheDocument();
		});

		expectedFields.forEach((field) => {
			const header = getByTestId(`${testId}-cell-row-0-col-${field}`);
			expect(header).toBeInTheDocument();
		});

		expect(getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("2");
		expect(getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("3");

		const editButton = getByTestId(`${testId}-cell-row-0-col-Edit-button`);
		expect(editButton).toBeInTheDocument();
		expect(editButton).toHaveClass("btn-primary");

		const detailsButton = getByTestId(`${testId}-cell-row-0-col-Details-button`);
		expect(detailsButton).toBeInTheDocument();
		expect(detailsButton).toHaveClass("btn-primary");

		const deleteButton = getByTestId(`${testId}-cell-row-0-col-Delete-button`);
		expect(deleteButton).toBeInTheDocument();
		expect(deleteButton).toHaveClass("btn-danger");

	});

	test("Edit button navigates to the edit page for admin user", async () => {

		const currentUser = currentUserFixtures.adminUser;

		const { getByText, getByTestId } = render(
			<QueryClientProvider client={queryClient}>
				<MemoryRouter>
					<BooksTable books={bookFixtures.threeBooks} currentUser={currentUser} />
				</MemoryRouter>
			</QueryClientProvider>

		);

		await waitFor(() => { expect(getByTestId(`BookTable-cell-row-0-col-id`)).toHaveTextContent("2"); });

		const editButton = getByTestId(`BookTable-cell-row-0-col-Edit-button`);
		expect(editButton).toBeInTheDocument();

		fireEvent.click(editButton);

		await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith('/books/edit/2'));

	});

	test("Details button navigates to the details page for admin user", async () => {

		const currentUser = currentUserFixtures.adminUser;

		const { getByText, getByTestId } = render(
			<QueryClientProvider client={queryClient}>
				<MemoryRouter>
					<BooksTable books={bookFixtures.threeBooks} currentUser={currentUser} />
				</MemoryRouter>
			</QueryClientProvider>

		);

		await waitFor(() => { expect(getByTestId(`BookTable-cell-row-0-col-id`)).toHaveTextContent("2"); });

		const detailsButton = getByTestId(`BookTable-cell-row-0-col-Details-button`);
		expect(detailsButton).toBeInTheDocument();

		fireEvent.click(detailsButton);

		await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith('/books/details/2'));

	});

});