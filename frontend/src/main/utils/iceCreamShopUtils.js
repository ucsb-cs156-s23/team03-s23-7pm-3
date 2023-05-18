// Get ice cream shops from local storage
const get = () => {
    const iceCreamShopValue = localStorage.getItem("iceCreamShops");
    if (iceCreamShopValue === undefined) {
        const iceCreamShopCollection = { nextId: 1, iceCreamShops: [] }
        return set(iceCreamShopCollection);
    }
    const iceCreamShopCollection = JSON.parse(iceCreamShopValue);
    if (iceCreamShopCollection === null) {
        const iceCreamShopCollection = { nextId: 1, iceCreamShops: [] }
        return set(iceCreamShopCollection);
    }
    return iceCreamShopCollection;
};

const getById = (id) => {
    if (id === undefined) {
        return { "error": "id is a required parameter" };
    }
    const iceCreamShopCollection = get();
    const iceCreamShops = iceCreamShopCollection.iceCreamShops;

    /* eslint-disable-next-line eqeqeq */ // we really do want == here, not ===
    const index = iceCreamShops.findIndex((r) => r.id == id);
    if (index === -1) {
        return { "error": `iceCreamShop with id ${id} not found` };
    }
    return { iceCreamShop: iceCreamShops[index] };
}

// set iceCreamShops in local storage
const set = (iceCreamShopCollection) => {
    localStorage.setItem("iceCreamShops", JSON.stringify(iceCreamShopCollection));
    return iceCreamShopCollection;
};

// add an iceCreamShop to local storage
const add = (iceCreamShop) => {
    const iceCreamShopCollection = get();
    iceCreamShop = { ...iceCreamShop, id: iceCreamShopCollection.nextId };
    iceCreamShopCollection.nextId++;
    iceCreamShopCollection.iceCreamShops.push(iceCreamShop);
    set(iceCreamShopCollection);
    return iceCreamShop;
};

// update an iceCreamShop in local storage
const update = (iceCreamShop) => {
    const iceCreamShopCollection = get();

    const iceCreamShops = iceCreamShopCollection.iceCreamShops;

    /* eslint-disable-next-line eqeqeq */ // we really do want == here, not ===
    const index = iceCreamShops.findIndex((r) => r.id == iceCreamShop.id);
    if (index === -1) {
        return { "error": `iceCreamShop with id ${iceCreamShop.id} not found` };
    }
    iceCreamShops[index] = iceCreamShop;
    set(iceCreamShopCollection);
    return { iceCreamShopCollection: iceCreamShopCollection };
};

// delete an iceCreamShop from local storage
const del = (id) => {
    if (id === undefined) {
        return { "error": "id is a required parameter" };
    }
    const iceCreamShopCollection = get();
    const iceCreamShops = iceCreamShopCollection.iceCreamShops;

    /* eslint-disable-next-line eqeqeq */ // we really do want == here, not ===
    const index = iceCreamShops.findIndex((r) => r.id == id);
    if (index === -1) {
        return { "error": `iceCreamShop with id ${id} not found` };
    }
    iceCreamShops.splice(index, 1);
    set(iceCreamShopCollection);
    return { iceCreamShopCollection: iceCreamShopCollection };
};

const iceCreamShopUtils = {
    get,
    getById,
    add,
    update,
    del
};

export { iceCreamShopUtils };