import React from "react";
import OurTable, { ButtonColumn } from "main/components/OurTable";
import { useBackendMutation } from "main/utils/useBackend";
import { cellToAxiosParamsDelete, onDeleteSuccess } from "main/utils/bookUtils";
import { useNavigate } from "react-router-dom";
import { hasRole } from "main/utils/currentUser";

export default function BooksTable({ books, currentUser, showButtons = true }) {
    const navigate = useNavigate();

    const editCallback = (cell) => {
        navigate(`/books/edit/${cell.row.values.id}`)
    }

    const detailsCallback = (cell) => {
        navigate(`/books/details/${cell.row.values.id}`)
    }

    // Stryker disable all : hard to test for query caching

    const deleteMutation = useBackendMutation(
        cellToAxiosParamsDelete,
        { onSuccess: onDeleteSuccess },
        ["/api/books/all"]
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
            Header: 'TITLE',
            accessor: 'title',
        },
        {
            Header: 'AUTHOR',
            accessor: 'author',
        },
        {
            Header: 'Description',
            accessor: 'description',
        }
    ];

    if (showButtons && hasRole(currentUser, "ROLE_ADMIN")) {
        columns.push(ButtonColumn("Details", "primary", detailsCallback, "BookTable"));
        columns.push(ButtonColumn("Edit", "primary", editCallback, "BookTable"));
        columns.push(ButtonColumn("Delete", "danger", deleteCallback, "BookTable"));
    }

    // Stryker disable next-line ArrayDeclaration : [columns] is a performance optimization
    const memoizedColumns = React.useMemo(() => columns, [columns]);
    const memoizedBooks = React.useMemo(() => books, [books]);

    return <OurTable
        data={memoizedBooks}
        columns={memoizedColumns}
        testid={"BookTable"}
    />;
};