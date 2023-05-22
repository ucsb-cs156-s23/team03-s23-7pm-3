import React from "react";
import OurTable, { ButtonColumn } from "main/components/OurTable";
import { useNavigate } from "react-router-dom";
import { useBackendMutation } from "main/utils/useBackend";
import { cellToAxiosParamsDelete, onDeleteSuccess } from "main/utils/iceCreamShopUtils";
import { hasRole } from "main/utils/currentUser";

export default function IceCreamShopTable({ iceCreamShops, currentUser, showButtons = true }) {
    const navigate = useNavigate();

    const editCallback = (cell) => {
        navigate(`/icecreamshops/edit/${cell.row.values.id}`)
    }

    const detailsCallback = (cell) => {
        navigate(`/icecreamshops/details/${cell.row.values.id}`)
    }

    // Stryker disable all : hard to test for query caching

    const deleteMutation = useBackendMutation(
        cellToAxiosParamsDelete,
        { onSuccess: onDeleteSuccess },
        ["/api/icecreamshop/all"]
    );
    // Stryker enable all 

    // Stryker disable next-line all : TODO try to make a good test for this
    const deleteCallback = async (cell) => { deleteMutation.mutate(cell); }


    const columns = [
        {
            Header: 'id',
            accessor: 'id', // accessor is the "key" in the data
        },
        {
            Header: 'Name',
            accessor: 'name',
        },
        {
            Header: 'Description',
            accessor: 'description',
        },
        {
            Header: 'Flavor',
            accessor: 'flavor',
        }
    ];

    if (showButtons && hasRole(currentUser, "ROLE_ADMIN")) {
        columns.push(ButtonColumn("Details", "primary", detailsCallback, "IceCreamShopTable"));
        columns.push(ButtonColumn("Edit", "primary", editCallback, "IceCreamShopTable"));
        columns.push(ButtonColumn("Delete", "danger", deleteCallback, "IceCreamShopTable"));
    }

    // Stryker disable next-line ArrayDeclaration : [columns] is a performance optimization
    const memoizedColumns = React.useMemo(() => columns, [columns]);
    const memoizedIceCreamShops = React.useMemo(() => iceCreamShops, [iceCreamShops]);

    return <OurTable
        data={memoizedIceCreamShops}
        columns={memoizedColumns}
        testid={"IceCreamShopTable"}
    />;
};