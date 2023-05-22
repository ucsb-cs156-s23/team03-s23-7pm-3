
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import BookForm from 'main/components/Books/BookForm';
import { Navigate } from 'react-router-dom'
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function BooksEditPage() {
    let { id } = useParams();

    const { data: book, error, status } =
        useBackend(
            // Stryker disable next-line all : don't test internal caching of React Query
            [`/api/books?id=${id}`],
            {  // Stryker disable next-line all : GET is the default, so changing this to "" doesn't introduce a bug
                method: "GET",
                url: `/api/books`,
                params: {
                    id
                }
            }
        );


    const objectToAxiosPutParams = (book) => ({
        url: "/api/books",
        method: "PUT",
        params: {
            id: book.id,
        },
        data: {
            title: book.title,
            author: book.author,
            description: book.description
        }
    });

    const onSuccess = (book) => {
        toast(`Book Updated - id: ${book.id} title: ${book.title}`);
    }

    const mutation = useBackendMutation(
        objectToAxiosPutParams,
        { onSuccess },
        // Stryker disable next-line all : hard to set up test for caching
        [`/api/books?id=${id}`]
    );

    const { isSuccess } = mutation

    const onSubmit = async (data) => {
        mutation.mutate(data);
    }

    if (isSuccess) {
        return <Navigate to="/books/list" />
    }

    return (
        <BasicLayout>
            <div className="pt-2">
                <h1>Edit Book</h1>
                {book &&
                    <BookForm initialBook={book} submitAction={onSubmit} buttonLabel="Update" />
                }
            </div>
        </BasicLayout>
    )
}

