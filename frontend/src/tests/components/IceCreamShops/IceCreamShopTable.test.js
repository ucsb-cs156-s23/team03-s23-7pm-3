import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import IceCreamShopTable, { showCell } from "main/components/IceCreamShops/IceCreamShopTable";
import { iceCreamShopFixtures } from "fixtures/iceCreamShopFixtures";
import mockConsole from "jest-mock-console";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate
}));

describe("IceCreamShopTable tests", () => {
  const queryClient = new QueryClient();

  const expectedHeaders = ["id", "Name", "Description", "Most Popular Flavor"];
  const expectedFields = ["id", "name", "description", 'flavor'];
  const testId = "IceCreamShopTable";

  test("showCell function works properly", () => {
    const cell = {
      row: {
        values: { a: 1, b: 2, c: 3 }
      },
    };
    expect(showCell(cell)).toBe(`{"a":1,"b":2,"c":3}`);
  });

  test("renders without crashing for empty table", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <IceCreamShopTable iceCreamShops={[]} />
        </MemoryRouter>
      </QueryClientProvider>
    );
  });



  test("Has the expected column headers, content and buttons", () => {

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <IceCreamShopTable iceCreamShops={iceCreamShopFixtures.threeIceCreamShops} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(header).toBeInTheDocument();
    });

    expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("2");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-name`)).toHaveTextContent("Rori’s Artisanal Creamery");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-description`)).toHaveTextContent("This is a tasty ice cream shop with special flavors in SB public market.");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-flavor`)).toHaveTextContent("mint");

    expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("3");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-name`)).toHaveTextContent("i.v. drip");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-description`)).toHaveTextContent("Quaint, compact cafe serving locally roasted coffee alongside housemade baked treats & ice cream.");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-flavor`)).toHaveTextContent("strawberry");

    expect(screen.getByTestId(`${testId}-cell-row-2-col-id`)).toHaveTextContent("4");
    expect(screen.getByTestId(`${testId}-cell-row-2-col-name`)).toHaveTextContent("Cold Stone Creamery");
    expect(screen.getByTestId(`${testId}-cell-row-2-col-description`)).toHaveTextContent("Ice cream chain offering design-your-own creations hand-mixed on a granite slab, plus shakes & more.");
    expect(screen.getByTestId(`${testId}-cell-row-2-col-flavor`)).toHaveTextContent("vanilla");

    const detailsButton = screen.getByTestId(`${testId}-cell-row-0-col-Details-button`);
    expect(detailsButton).toBeInTheDocument();
    expect(detailsButton).toHaveClass("btn-primary");

    const editButton = screen.getByTestId(`${testId}-cell-row-0-col-Edit-button`);
    expect(editButton).toBeInTheDocument();
    expect(editButton).toHaveClass("btn-primary");

    const deleteButton = screen.getByTestId(`${testId}-cell-row-0-col-Delete-button`);
    expect(deleteButton).toBeInTheDocument();
    expect(deleteButton).toHaveClass("btn-danger");

  });

  test("Has the expected column headers, content and no buttons when showButtons=false", () => {

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <IceCreamShopTable iceCreamShops={iceCreamShopFixtures.threeIceCreamShops} showButtons={false} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(header).toBeInTheDocument();
    });

    expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("2");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-name`)).toHaveTextContent("Rori’s Artisanal Creamery");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-description`)).toHaveTextContent("This is a tasty ice cream shop with special flavors in SB public market.");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-flavor`)).toHaveTextContent("mint");

    expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("3");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-name`)).toHaveTextContent("i.v. drip");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-description`)).toHaveTextContent("Quaint, compact cafe serving locally roasted coffee alongside housemade baked treats & ice cream.");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-flavor`)).toHaveTextContent("strawberry");

    expect(screen.getByTestId(`${testId}-cell-row-2-col-id`)).toHaveTextContent("4");
    expect(screen.getByTestId(`${testId}-cell-row-2-col-name`)).toHaveTextContent("Cold Stone Creamery");
    expect(screen.getByTestId(`${testId}-cell-row-2-col-description`)).toHaveTextContent("Ice cream chain offering design-your-own creations hand-mixed on a granite slab, plus shakes & more.");
    expect(screen.getByTestId(`${testId}-cell-row-2-col-flavor`)).toHaveTextContent("vanilla");

    expect(screen.queryByText("Delete")).not.toBeInTheDocument();
    expect(screen.queryByText("Edit")).not.toBeInTheDocument();
    expect(screen.queryByText("Details")).not.toBeInTheDocument();
  });


  test("Edit button navigates to the edit page", async () => {
    // arrange
    const restoreConsole = mockConsole();

    // act - render the component
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <IceCreamShopTable iceCreamShops={iceCreamShopFixtures.threeIceCreamShops} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    // assert - check that the expected content is rendered
    expect(await screen.findByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("2");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-name`)).toHaveTextContent("Rori’s Artisanal Creamery");

    const editButton = screen.getByTestId(`${testId}-cell-row-0-col-Edit-button`);
    expect(editButton).toBeInTheDocument();

    // act - click the edit button
    fireEvent.click(editButton);

    // assert - check that the navigate function was called with the expected path
    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith('/iceCreamShops/edit/2'));

    // assert - check that the console.log was called with the expected message
    expect(console.log).toHaveBeenCalled();
    const message = console.log.mock.calls[0][0];
    const expectedMessage = `editCallback: {"id":2,"name":"Rori’s Artisanal Creamery","description":"This is a tasty ice cream shop with special flavors in SB public market.","flavor":"mint"})`;
    expect(message).toMatch(expectedMessage);
    restoreConsole();
  });

  test("Details button navigates to the details page", async () => {
    // arrange
    const restoreConsole = mockConsole();

    // act - render the component
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <IceCreamShopTable iceCreamShops={iceCreamShopFixtures.threeIceCreamShops} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    // assert - check that the expected content is rendered
    expect(await screen.findByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("2");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-name`)).toHaveTextContent("Rori’s Artisanal Creamery");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-description`)).toHaveTextContent("This is a tasty ice cream shop with special flavors in SB public market.");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-flavor`)).toHaveTextContent("mint");

    const detailsButton = screen.getByTestId(`${testId}-cell-row-0-col-Details-button`);
    expect(detailsButton).toBeInTheDocument();

    // act - click the details button
    fireEvent.click(detailsButton);

    // assert - check that the navigate function was called with the expected path
    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith('/iceCreamShops/details/2'));

    // assert - check that the console.log was called with the expected message
    expect(console.log).toHaveBeenCalled();
    const message = console.log.mock.calls[0][0];
    const expectedMessage = `detailsCallback: {"id":2,"name":"Rori’s Artisanal Creamery","description":"This is a tasty ice cream shop with special flavors in SB public market.","flavor":"mint"})`;
    expect(message).toMatch(expectedMessage);
    restoreConsole();
  });

  test("Delete button calls delete callback", async () => {
    // arrange
    const restoreConsole = mockConsole();

    // act - render the component
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <IceCreamShopTable iceCreamShops={iceCreamShopFixtures.threeIceCreamShops} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    // assert - check that the expected content is rendered
    expect(await screen.findByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("2");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-name`)).toHaveTextContent("Rori’s Artisanal Creamery");

    const deleteButton = screen.getByTestId(`${testId}-cell-row-0-col-Delete-button`);
    expect(deleteButton).toBeInTheDocument();

     // act - click the delete button
    fireEvent.click(deleteButton);

     // assert - check that the console.log was called with the expected message
     await(waitFor(() => expect(console.log).toHaveBeenCalled()));
     const message = console.log.mock.calls[0][0];
     const expectedMessage = `deleteCallback: {"id":2,"name":"Rori’s Artisanal Creamery","description":"This is a tasty ice cream shop with special flavors in SB public market.","flavor":"mint"})`;
     expect(message).toMatch(expectedMessage);
     restoreConsole();
  });
});