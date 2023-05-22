import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import IceCreamShopTable from 'main/components/IceCreamShops/IceCreamShopTable';
import { iceCreamShopUtils } from 'main/utils/iceCreamShopUtils';

export default function IceCreamShopDetailsPage() {
  let { id } = useParams();

  const response = iceCreamShopUtils.getById(id);

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Ice Cream Shop Details</h1>
        <IceCreamShopTable iceCreamShops={[response.iceCreamShop]} showButtons={false} />
      </div>
    </BasicLayout>
  )
}