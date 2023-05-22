import { iceCreamShopFixtures } from "fixtures/iceCreamShopFixtures";
import { iceCreamShopUtils } from "main/utils/iceCreamShopUtils";

describe("iceCreamShopUtils tests", () => {
    // return a function that can be used as a mock implementation of getItem
    // the value passed in will be convertd to JSON and returned as the value
    // for the key "iceCreamShops".  Any other key results in an error
    const createGetItemMock = (returnValue) => (key) => {
        if (key === "iceCreamShops") {
            return JSON.stringify(returnValue);
        } else {
            throw new Error("Unexpected key: " + key);
        }
    };

    describe("get", () => {

        test("When iceCreamShops is undefined in local storage, should set to empty list", () => {

            // arrange
            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock(undefined));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = iceCreamShopUtils.get();

            // assert
            const expected = { nextId: 1, iceCreamShops: [] } ;
            expect(result).toEqual(expected);

            const expectedJSON = JSON.stringify(expected);
            expect(setItemSpy).toHaveBeenCalledWith("iceCreamShops", expectedJSON);
        });

        test("When iceCreamShops is null in local storage, should set to empty list", () => {

            // arrange
            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock(null));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = iceCreamShopUtils.get();

            // assert
            const expected = { nextId: 1, iceCreamShops: [] } ;
            expect(result).toEqual(expected);

            const expectedJSON = JSON.stringify(expected);
            expect(setItemSpy).toHaveBeenCalledWith("iceCreamShops", expectedJSON);
        });

        test("When iceCreamShops is [] in local storage, should return []", () => {

            // arrange
            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 1, iceCreamShops: [] }));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = iceCreamShopUtils.get();

            // assert
            const expected = { nextId: 1, iceCreamShops: [] };
            expect(result).toEqual(expected);

            expect(setItemSpy).not.toHaveBeenCalled();
        });

        test("When iceCreamShops is JSON of three iceCreamShops, should return that JSON", () => {

            // arrange
            const threeIceCreamShops = iceCreamShopFixtures.threeIceCreamShops;
            const mockIceCreamShopCollection = { nextId: 10, iceCreamShops: threeIceCreamShops };

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock(mockIceCreamShopCollection));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = iceCreamShopUtils.get();

            // assert
            expect(result).toEqual(mockIceCreamShopCollection);
            expect(setItemSpy).not.toHaveBeenCalled();
        });
    });


    describe("getById", () => {
        test("Check that getting an iceCreamShop by id works", () => {

            // arrange
            const threeIceCreamShops = iceCreamShopFixtures.threeIceCreamShops;
            const idToGet = threeIceCreamShops[1].id;

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, iceCreamShops: threeIceCreamShops }));

            // act
            const result = iceCreamShopUtils.getById(idToGet);

            // assert

            const expected = { iceCreamShop: threeIceCreamShops[1] };
            expect(result).toEqual(expected);
        });

        test("Check that getting a non-existing iceCreamShop returns an error", () => {

            // arrange
            const threeIceCreamShops = iceCreamShopFixtures.threeIceCreamShops;

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, iceCreamShops: threeIceCreamShops }));

            // act
            const result = iceCreamShopUtils.getById(99);

            // assert
            const expectedError = `iceCreamShop with id 99 not found`
            expect(result).toEqual({ error: expectedError });
        });

        test("Check that an error is returned when id not passed", () => {

            // arrange
            const threeIceCreamShops = iceCreamShopFixtures.threeIceCreamShops;

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, iceCreamShops: threeIceCreamShops }));

            // act
            const result = iceCreamShopUtils.getById();

            // assert
            const expectedError = `id is a required parameter`
            expect(result).toEqual({ error: expectedError });
        });

    });
    describe("add", () => {
        test("Starting from [], check that adding one iceCreamShop works", () => {

            // arrange
            const iceCreamShop = iceCreamShopFixtures.oneIceCreamShop[0];
            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 1, iceCreamShops: [] }));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = iceCreamShopUtils.add(iceCreamShop);

            // assert
            expect(result).toEqual(iceCreamShop);
            expect(setItemSpy).toHaveBeenCalledWith("iceCreamShops",
                JSON.stringify({ nextId: 2, iceCreamShops: iceCreamShopFixtures.oneIceCreamShop }));
        });
    });

    describe("update", () => {
        test("Check that updating an existing iceCreamShop works", () => {

            // arrange
            const threeIceCreamShops = iceCreamShopFixtures.threeIceCreamShops;
            const updatedIceCreamShop = {
                ...threeIceCreamShops[0],
                name: "Updated Name"
            };
            const threeIceCreamShopsUpdated = [
                updatedIceCreamShop,
                threeIceCreamShops[1],
                threeIceCreamShops[2]
            ];

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, iceCreamShops: threeIceCreamShops }));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = iceCreamShopUtils.update(updatedIceCreamShop);

            // assert
            const expected = { iceCreamShopCollection: { nextId: 5, iceCreamShops: threeIceCreamShopsUpdated } };
            expect(result).toEqual(expected);
            expect(setItemSpy).toHaveBeenCalledWith("iceCreamShops", JSON.stringify(expected.iceCreamShopCollection));
        });
        test("Check that updating an non-existing iceCreamShop returns an error", () => {

            // arrange
            const threeIceCreamShops = iceCreamShopFixtures.threeIceCreamShops;

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, iceCreamShops: threeIceCreamShops }));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            const updatedIceCreamShop = {
                id: 99,
                name: "Fake Name",
                description: "Fake Description"
            }

            // act
            const result = iceCreamShopUtils.update(updatedIceCreamShop);

            // assert
            const expectedError = `iceCreamShop with id 99 not found`
            expect(result).toEqual({ error: expectedError });
            expect(setItemSpy).not.toHaveBeenCalled();
        });
    });

    describe("del", () => {
        test("Check that deleting an iceCreamShop by id works", () => {

            // arrange
            const threeIceCreamShops = iceCreamShopFixtures.threeIceCreamShops;
            const idToDelete = threeIceCreamShops[1].id;
            const threeIceCreamShopsUpdated = [
                threeIceCreamShops[0],
                threeIceCreamShops[2]
            ];

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, iceCreamShops: threeIceCreamShops }));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = iceCreamShopUtils.del(idToDelete);

            // assert

            const expected = { iceCreamShopCollection: { nextId: 5, iceCreamShops: threeIceCreamShopsUpdated } };
            expect(result).toEqual(expected);
            expect(setItemSpy).toHaveBeenCalledWith("iceCreamShops", JSON.stringify(expected.iceCreamShopCollection));
        });
        test("Check that deleting a non-existing iceCreamShop returns an error", () => {

            // arrange
            const threeIceCreamShops = iceCreamShopFixtures.threeIceCreamShops;

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, iceCreamShops: threeIceCreamShops }));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = iceCreamShopUtils.del(99);

            // assert
            const expectedError = `iceCreamShop with id 99 not found`
            expect(result).toEqual({ error: expectedError });
            expect(setItemSpy).not.toHaveBeenCalled();
        });
        test("Check that an error is returned when id not passed", () => {

            // arrange
            const threeIceCreamShops = iceCreamShopFixtures.threeIceCreamShops;

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, iceCreamShops: threeIceCreamShops }));

            // act
            const result = iceCreamShopUtils.del();

            // assert
            const expectedError = `id is a required parameter`
            expect(result).toEqual({ error: expectedError });
        });
    });
});
