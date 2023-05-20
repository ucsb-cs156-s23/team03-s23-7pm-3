import React from 'react';
import IceCreamShopTable from 'main/components/IceCreamShops/IceCreamShopTable';
import { iceCreamShopFixtures } from 'fixtures/iceCreamShopFixtures';

export default {
    title: 'components/iceCreamShops/IceCreamShopTable',
    component: IceCreamShopTable
};

const Template = (args) => {
    return (
        <IceCreamShopTable {...args} />
    )
};

export const Empty = Template.bind({});

Empty.args = {
    iceCreamShops: []
};

export const ThreeSubjectsNoButtons = Template.bind({});

ThreeSubjectsNoButtons.args = {
    iceCreamShops: iceCreamShopFixtures.threeIceCreamShops,
    showButtons: false
};

export const ThreeSubjectsWithButtons = Template.bind({});
ThreeSubjectsWithButtons.args = {
    iceCreamShops: iceCreamShopFixtures.threeIceCreamShops,
    showButtons: true
};