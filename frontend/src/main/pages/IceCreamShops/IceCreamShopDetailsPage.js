import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import IceCreamShopTable from 'main/components/IceCreamShops/IceCreamShopTable';
import { useBackend } from 'main/utils/useBackend';
import { useCurrentUser } from 'main/utils/currentUser'
export default function IceCreamShopDetailsPage() {
  let { id } = useParams();
  const currentUser = useCurrentUser();

  const { data: icecreamshop, error, status } =
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

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Ice Cream Shop Details</h1>
        <IceCreamShopTable icecreamshops={[icecreamshop || {}]} currentUser={currentUser} showButtons={false} />
      </div>
    </BasicLayout>
  )
}