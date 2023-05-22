import React from "react";
import OurTable, { ButtonColumn } from "main/components/OurTable";
import { useBackendMutation } from "main/utils/useBackend";
import { cellToAxiosParamsDelete, onDeleteSuccess } from "main/utils/iceCreamShopUtils";
import { useNavigate } from "react-router-dom";
import { hasRole } from "main/utils/currentUser";


export default function IceCreamShopsTable({ iceCreamShops, currentUser, showButtons = true }) {
    
    const navigate = useNavigate();
 
    const editCallback = (cell) => {
        navigate(`/iceCreamShops/edit/${cell.row.values.id}`)
    }

    const detailsCallback = (cell) => {
        navigate(`/iceCreamShops/details/${cell.row.values.id}`)
    }



    const deleteMutation = useBackendMutation(
        cellToAxiosParamsDelete,
        { onSuccess: onDeleteSuccess },
        ["/api/icecreamshops/all"]
    );
    

    
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
            Header: 'Most Popular Flavor',
            accessor: 'flavor',
        }
    ];

    if (showButtons && hasRole(currentUser, "ROLE_ADMIN")) {
        columns.push(ButtonColumn("Details", "primary", detailsCallback, "IceCreamShopTable"));
        columns.push(ButtonColumn("Edit", "primary", editCallback, "IceCreamShopTable"));
        columns.push(ButtonColumn("Delete", "danger", deleteCallback, "IceCreamShopTable"));
    }

    const memoizedColumns = React.useMemo(() => columns, [columns]);
    const memoizedIceCreamShops = React.useMemo(() => iceCreamShops, [iceCreamShops]);

    return <OurTable
        data={memoizedIceCreamShops}
        columns={memoizedColumns}
        testid={'IceCreamShopTable'}
    />;
};