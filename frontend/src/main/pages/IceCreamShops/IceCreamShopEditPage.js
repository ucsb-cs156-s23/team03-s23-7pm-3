import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import { iceCreamShopUtils }  from 'main/utils/iceCreamShopUtils';
import IceCreamShopForm from 'main/components/IceCreamShops/IceCreamShopForm';
import { useNavigate } from 'react-router-dom'


export default function IceCreamShopEditPage() {
    let { id } = useParams();

    let navigate = useNavigate(); 

    const response = iceCreamShopUtils.getById(id);

    const onSubmit = async (iceCreamShop) => {
        const updatedIceCreamShop = iceCreamShopUtils.update(iceCreamShop);
        console.log("updatedIceCreamShop: " + JSON.stringify(updatedIceCreamShop));
        navigate("/iceCreamShops");
    }  

    return (
        <BasicLayout>
            <div className="pt-2">
                <h1>Edit Ice Cream Shop</h1>
                <IceCreamShopForm submitAction={onSubmit} buttonLabel={"Update"} initialContents={response.iceCreamShop}/>
            </div>
        </BasicLayout>
    )
}