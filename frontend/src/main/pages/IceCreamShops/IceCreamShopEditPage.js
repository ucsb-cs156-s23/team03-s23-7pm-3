import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import IceCreamShopForm from 'main/components/IceCreamShops/IceCreamShopForm';
import { Navigate } from 'react-router-dom'
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";


export default function IceCreamShopEditPage() {
    let { id } = useParams();

    const { data: iceCreamShop, error, status } =
        useBackend(
            // Stryker disable next-line all : don't test internal caching of React Query
            [`/api/icecreamshop?id=${id}`],
            {  // Stryker disable next-line all : GET is the default, so changing this to "" doesn't introduce a bug
                method: "GET",
                url: `/api/icecreamshop`,
                params: {
                    id
                }
            }
        );


    const objectToAxiosPutParams = (iceCreamShop) => ({
        url: "/api/iceCreamShop",
        method: "PUT",
        params: {
            id: iceCreamShop.id,
        },
        data: {
            name: iceCreamShop.name,
            description: iceCreamShop.description,
            flavor: iceCreamShop.flavor
        }
    });

    const onSuccess = (iceCreamShop) => {
        toast(`iceCreamShop Updated - id: ${iceCreamShop.id}, name: ${iceCreamShop.name}, description: ${iceCreamShop.description}, flavor: ${iceCreamShop.flavor}`);
    }

    const mutation = useBackendMutation(
        objectToAxiosPutParams,
        { onSuccess },
        // Stryker disable next-line all : hard to set up test for caching
        [`/api/icecreamshop?id=${id}`]
    );

    const { isSuccess } = mutation

    const onSubmit = async (data) => {
        mutation.mutate(data);
    }

    if (isSuccess) {
        return <Navigate to="/icecreamshops/list" />
    }

    return (
        <BasicLayout>
            <div className="pt-2">
                <h1>Edit Ice Cream Shop</h1>
                {
                    iceCreamShop && <IceCreamShopForm initialIceCreamShop={iceCreamShop} submitAction={onSubmit} buttonLabel="Update" />
                }
                
            </div>
        </BasicLayout>
    )
}