import { render, waitFor, fireEvent } from "@testing-library/react";
import OurTable, {ButtonColumn} from "main/components/OurTable";

describe("OurTable tests", () => {
    const threeRows = [
        {
            col1: 'Hello',
            col2: 'World',
        },
        {
            col1: 'react-table',
            col2: 'rocks',
        },
        {
            col1: 'whatever',
            col2: 'you want',
        }
    ];

    const clickMeCallback = jest.fn();

    const columns = [
        {
            Header: 'Column 1',
            accessor: 'col1', // accessor is the "key" in the data
        },
        {
            Header: 'Column 2',
            accessor: 'col2',
        },
        ButtonColumn("Click", "primary", clickMeCallback, "testId"),
    ];

    test("renders an empty table without crashing", () => {
        render(
            <OurTable columns={columns} data={[]} />
        );
    });

    test("renders a table with three rows without crashing", () => {
        render(
            <OurTable columns={columns} data={threeRows} />
        );
    });

    test("The button appears in the table", async () => {
        const {getByTestId, findByTestId} = render(
            <OurTable columns={columns} data={threeRows} />
        );

        await findByTestId("testId-cell-row-0-col-Click-button");
        const button = getByTestId("testId-cell-row-0-col-Click-button");
        fireEvent.click(button);
        await waitFor(()=>expect(clickMeCallback).toBeCalledTimes(1));
    });

    test("default testid is testId", async () => {
        const {getByTestId, findByTestId } = render(
            <OurTable columns={columns} data={threeRows} />
        );
        await findByTestId("testid-header-col1");
    });

    test("click on a header and a sort caret should appear", async () => {
        const {getByTestId, getByText, findByTestId, findByText } = render(
            <OurTable columns={columns} data={threeRows} testid={"sampleTestId"} />
        );

        await findByTestId("sampleTestId-header-col1");
        const col1Header = getByTestId("sampleTestId-header-col1");

        const col1SortCarets = getByTestId("sampleTestId-header-col1-sort-carets");
        expect(col1SortCarets).toHaveTextContent('');

        const col1Row0 = getByTestId("sampleTestId-cell-row-0-col-col1");
        expect(col1Row0).toHaveTextContent("Hello");

        fireEvent.click(col1Header);
        await findByText("🔼");

        fireEvent.click(col1Header);
        await findByText("🔽");

        

    });

});