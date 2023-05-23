import React from 'react'
import { useBackend } from 'main/utils/useBackend';

import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import IceCreamShopTable from 'main/components/IceCreamShops/IceCreamShopTable';
import { useCurrentUser } from 'main/utils/currentUser'


export default function IceCreamShopIndexPage() {

    const currentUser = useCurrentUser();
  
    const { data: icecreamshops, error: _error, status: _status } =
      useBackend(
        // Stryker disable next-line all : don't test internal caching of React Query
        ["/api/icecreamshop/all"],
        { method: "GET", url: "/api/icecreamshop/all" },
        []
      );

    return (
        <BasicLayout>
            <div className="pt-2">
                <h1>Ice Cream Shops</h1>
                <IceCreamShopTable iceCreamShops={icecreamshops} currentUser={currentUser} />
            </div>
        </BasicLayout>
    )
}