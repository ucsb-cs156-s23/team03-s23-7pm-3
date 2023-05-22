import { render, waitFor } from "@testing-library/react";
import Footer from "main/components/Nav/Footer";

describe("Footer tests", () => {
    test("renders correctly", async () => {
        const { getByText, findByText } = render(
            <Footer />
        );
        await findByText(/This is a sample webapp using React with a Spring Boot backend./);
    });
});


