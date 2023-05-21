import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import IceCreamShopForm from "main/components/IceCreamShops/IceCreamShopForm";
import { Navigate } from 'react-router-dom'
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function IceCreamShopCreatePage() {

  const objectToAxiosParams = (iceCreamShop) => ({
    url: "/api/icecreamshop/post",
    method: "POST",
    params: {
      name: iceCreamShop.name,
      description: iceCreamShop.description,
      flavor: iceCreamShop.flavor
    }
  });

  const onSuccess = (iceCreamShop) => {
    toast(`New iceCreamShop Created - name: ${iceCreamShop.name}, description: ${iceCreamShop.description}, flavor: ${iceCreamShop.flavor}`);
  }

  const mutation = useBackendMutation(
    objectToAxiosParams,
     { onSuccess }, 
     // Stryker disable next-line all : hard to set up test for caching
     ["/api/icecreamshop/all"]
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
        <h1>Create New Ice Cream Shop</h1>
        <IceCreamShopForm submitAction={onSubmit} />
      </div>
    </BasicLayout>
  )
}