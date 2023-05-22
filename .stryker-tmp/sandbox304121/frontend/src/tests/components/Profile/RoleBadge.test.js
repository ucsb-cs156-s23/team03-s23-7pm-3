import { render, waitFor } from "@testing-library/react";
import {currentUserFixtures} from "fixtures/currentUserFixtures";
import RoleBadge from "main/components/Profile/RoleBadge"

describe("RoleBadge tests", () => {

    test("renders without crashing for ROLE_USER when user has ROLE_USER", async () => {
        const {getByTestId, findByTestId} = render(
            <RoleBadge currentUser={currentUserFixtures.userOnly} role={"ROLE_USER"} />
        );
        await findByTestId("role-badge-user");
    });

    test("renders without crashing for ROLE_ADMIN when user has ROLE_ADMIN", async () => {
        const {getByTestId, findByTestId} = render(
            <RoleBadge currentUser={currentUserFixtures.adminUser} role={"ROLE_ADMIN"} />
        );
        await findByTestId("role-badge-admin");
    });

    test("renders without crashing for ROLE_ADMIN when user does NOT have ROLE_ADMIN", async () => {
        const {getByTestId, findByTestId } = render(
            <RoleBadge currentUser={currentUserFixtures.userOnly} role={"ROLE_ADMIN"} />
        );
        await findByTestId("role-missing-admin");
    });

});