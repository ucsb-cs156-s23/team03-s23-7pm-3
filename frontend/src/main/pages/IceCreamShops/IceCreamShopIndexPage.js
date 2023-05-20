import React from 'react'
import Button from 'react-bootstrap/Button';
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import IceCreamShopTable from 'main/components/IceCreamShops/IceCreamShopTable';
import { iceCreamShopUtils } from 'main/utils/iceCreamShopUtils';
import { useNavigate, Link } from 'react-router-dom';

export default function IceCreamShopIndexPage() {

    const navigate = useNavigate();

    const iceCreamShopCollection = iceCreamShopUtils.get();
    const iceCreamShops = iceCreamShopCollection.iceCreamShops;

    const showCell = (cell) => JSON.stringify(cell.row.values);

    const deleteCallback = async (cell) => {
        console.log(`IceCreamShopIndexPage deleteCallback: ${showCell(cell)})`);
        iceCreamShopUtils.del(cell.row.values.id);
        navigate("/iceCreamShops/list");
    }

    return (
        <BasicLayout>
            <div className="pt-2">
                <Button style={{ float: "right" }} as={Link} to="/iceCreamShops/create">
                    Create Ice Cream Shop
                </Button>
                <h1>Ice Cream Shops</h1>
                <IceCreamShopTable iceCreamShops={iceCreamShops} deleteCallback={deleteCallback} />
            </div>
        </BasicLayout>
    )
}