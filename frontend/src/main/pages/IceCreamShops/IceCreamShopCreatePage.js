import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import IceCreamShopForm from "main/components/IceCreamShops/IceCreamShopForm";
import { useNavigate } from 'react-router-dom'
import { iceCreamShopUtils } from 'main/utils/iceCreamShopUtils';

export default function IceCreamShopCreatePage() {

  let navigate = useNavigate(); 

  const onSubmit = async (iceCreamShop) => {
    const createdIceCreamShop = iceCreamShopUtils.add(iceCreamShop);
    console.log("createdIceCreamShop: " + JSON.stringify(createdIceCreamShop));
    navigate("/iceCreamShops/list");
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