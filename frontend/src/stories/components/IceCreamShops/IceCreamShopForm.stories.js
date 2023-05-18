import React from 'react';
import IceCreamShopForm from "main/components/IceCreamShops/IceCreamShopForm"
import { iceCreamShopFixtures } from 'fixtures/iceCreamShopFixtures';

export default {
    title: 'components/IceCreamShops/IceCreamShopForm',
    component: IceCreamShopForm
};

const Template = (args) => {
    return (
        <IceCreamShopForm {...args} />
    )
};

export const Default = Template.bind({});

Default.args = {
    submitText: "Create",
    submitAction: () => { console.log("Submit was clicked"); }
};

export const Show = Template.bind({});

Show.args = {
    IceCreamShop: iceCreamShopFixtures.oneIceCreamShop,
    submitText: "",
    submitAction: () => { }
};