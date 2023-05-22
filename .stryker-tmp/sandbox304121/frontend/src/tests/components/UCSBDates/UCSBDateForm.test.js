import { render, waitFor, fireEvent } from "@testing-library/react";
import UCSBDateForm from "main/components/UCSBDates/UCSBDateForm";
import { ucsbDatesFixtures } from "fixtures/ucsbDatesFixtures";
import { BrowserRouter as Router } from "react-router-dom";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));


describe("UCSBDateForm tests", () => {

    test("renders correctly", async () => {

        const { getByText, findByText } = render(
            <Router  >
                <UCSBDateForm />
            </Router>
        );
        await findByText(/Quarter YYYYQ/);
        await findByText(/Create/);
    });


    test("renders correctly when passing in a UCSBDate", async () => {

        const { getByText, getByTestId, findByTestId } = render(
            <Router  >
                <UCSBDateForm initialUCSBDate={ucsbDatesFixtures.oneDate} />
            </Router>
        );
        await findByTestId(/UCSBDateForm-id/);
        expect(getByText(/Id/)).toBeInTheDocument();
        expect(getByTestId(/UCSBDateForm-id/)).toHaveValue("1");
    });


    test("Correct Error messsages on bad input", async () => {

        const { getByTestId, getByText, findByTestId, findByText } = render(
            <Router  >
                <UCSBDateForm />
            </Router>
        );
        await findByTestId("UCSBDateForm-quarterYYYYQ");
        const quarterYYYYQField = getByTestId("UCSBDateForm-quarterYYYYQ");
        const localDateTimeField = getByTestId("UCSBDateForm-localDateTime");
        const submitButton = getByTestId("UCSBDateForm-submit");

        fireEvent.change(quarterYYYYQField, { target: { value: 'bad-input' } });
        fireEvent.change(localDateTimeField, { target: { value: 'bad-input' } });
        fireEvent.click(submitButton);

        await findByText(/QuarterYYYYQ must be in the format YYYYQ/);
        expect(getByText(/localDateTime must be in ISO format/)).toBeInTheDocument();
    });

    test("Correct Error messsages on missing input", async () => {

        const { getByTestId, getByText, findByTestId, findByText } = render(
            <Router  >
                <UCSBDateForm />
            </Router>
        );
        await findByTestId("UCSBDateForm-submit");
        const submitButton = getByTestId("UCSBDateForm-submit");

        fireEvent.click(submitButton);

        await findByText(/QuarterYYYYQ is required./);
        expect(getByText(/Name is required./)).toBeInTheDocument();
        expect(getByText(/LocalDateTime is required./)).toBeInTheDocument();

    });

    test("No Error messsages on good input", async () => {

        const mockSubmitAction = jest.fn();


        const { getByTestId, queryByText, findByTestId } = render(
            <Router  >
                <UCSBDateForm submitAction={mockSubmitAction} />
            </Router>
        );
        await findByTestId("UCSBDateForm-quarterYYYYQ");

        const quarterYYYYQField = getByTestId("UCSBDateForm-quarterYYYYQ");
        const nameField = getByTestId("UCSBDateForm-name");
        const localDateTimeField = getByTestId("UCSBDateForm-localDateTime");
        const submitButton = getByTestId("UCSBDateForm-submit");

        fireEvent.change(quarterYYYYQField, { target: { value: '20221' } });
        fireEvent.change(nameField, { target: { value: 'noon on January 2nd' } });
        fireEvent.change(localDateTimeField, { target: { value: '2022-01-02T12:00' } });
        fireEvent.click(submitButton);

        await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

        expect(queryByText(/QuarterYYYYQ must be in the format YYYYQ/)).not.toBeInTheDocument();
        expect(queryByText(/localDateTime must be in ISO format/)).not.toBeInTheDocument();

    });


    test("that navigate(-1) is called when Cancel is clicked", async () => {

        const { getByTestId, findByTestId } = render(
            <Router  >
                <UCSBDateForm />
            </Router>
        );
        await findByTestId("UCSBDateForm-cancel");
        const cancelButton = getByTestId("UCSBDateForm-cancel");

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));

    });

});


