/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

"use strict";

const { Contract } = require("fabric-contract-api");

class FabCar extends Contract {
    async initLedger(ctx) {
        console.info("============= START : Initialize Ledger ===========");
        const StatusEnum = {
            IN_MANUFACTURE: "IN_MANUFACTURE",
            IN_LOGISTICS: "IN_LOGISTICS",
            IN_DISTRIBUTOR: "IN_DISTRIBUTOR",
            IN_SELLER: "IN_SELLER",
            DELIVERED: "DELIVERED",
            RECEIVED: "RECEIVED",
        };
        const manufactures = [
            {
                id: 1,
                name: "Toyota",
                country: "Japan",
                mobileNo: "+852-852-852-852",
                email: "abc@123.com",
                address: "abc",
                docType: "manufacturer",
            },
            {
                id: 2,
                name: "Honda",
                country: "Denmark",
                mobileNo: "+100-100-100-100",
                email: "honda@honda.com",
                address: "denmark central town",
                docType: "manufacturer",
            },
        ];
        const sellers = [
            {
                id: 1,
                name: "Seller1",
                country: "India",
                mobileNo: "+91-91-91-91-91",
                email: "seller1@india.com",
                address: "Delhi",
                docType: "seller",
            },

            {
                id: 2,
                name: "Seller2",
                country: "India",
                mobileNo: "+92-92-92-92-92",
                email: "seller2@india.com",
                address: "Mumbai",
                docType: "seller",
            },
        ];
        const buyers = [
            {
                id: 1,
                name: "Buyer1",
                country: "India",
                mobileNo: "+99-99-99-99-99",
                email: "buyer1@india.com",
                address: "Rajasthan",
                docType: "buyer",
            },

            {
                id: 2,
                name: "Buyer2",
                country: "India",
                mobileNo: "+98-98-98-98-98",
                email: "buyer2@india.com",
                address: "Kolkata",
                docType: "buyer",
            },
        ];
        const logistics = [
            {
                id: 1,
                name: "Logistics1",
                country: "India",
                mobileNo: "+96-91-96-91-96",
                email: "logistics1@india.com",
                address: "Uttarakhand",
                docType: "logistic",
            },

            {
                id: 2,
                name: "Logistics2",
                country: "India",
                mobileNo: "+91-96-91-96-91",
                email: "logistics2@india.com",
                address: "Pune",
                docType: "logistic",
            },
        ];
        const distributors = [
            {
                id: 1,
                name: "Distributor1",
                country: "China",
                mobileNo: "+86-86-86-86-86",
                email: "distributer1@china.com",
                address: "Beijing",
                docType: "distributor",
            },
            {
                id: 2,
                name: "Distributor2",
                country: "Taiwan",
                mobileNo: "+886-886-886-886",
                email: "distributer2@taiwan.com",
                address: "Taipei",
                docType: "distributor",
            },
        ];
        const products = [
            {
                id: 1,
                name: "Toyota Camry",
                color: "blue",
                carNumber: "mh-123",
                make: "Toyota",
                model: "Camry",
                price: 100,
                quantity: 100,
                status: StatusEnum.IN_MANUFACTURE,
                docType: "product",
            },
            {
                id: 2,
                carNumber: "Dl-1234",
                name: "Honda Civic",
                color: "red",
                make: "Honda",
                model: "Civic",
                price: 200,
                status: StatusEnum.IN_LOGISTICS,
                quantity: 200,
                docType: "product",
            },
        ];

        const cars = [
            {
                id: 1,
                color: "black",
                make: "Tesla",
                model: "S",
                owner: "Adriana",
            },
            {
                id: 2,
                color: "black",
                make: "Tesla",
                model: "S",
                owner: "Adriana",
            },
        ];

        for (let i = 0; i < products.length; i++) {
            cars[i].docType = "car";
            await ctx.stub.putState(
                "MANUFACTURER " + manufactures[i].id,
                Buffer.from(JSON.stringify(manufactures[i]))
            );
            await ctx.stub.putState(
                "SELLER " + sellers[i].id,
                Buffer.from(JSON.stringify(sellers[i]))
            );
            await ctx.stub.putState(
                "BUYER " + buyers[i].id,
                Buffer.from(JSON.stringify(buyers[i]))
            );
            await ctx.stub.putState(
                "LOGISTIC " + logistics[i].id,
                Buffer.from(JSON.stringify(logistics[i]))
            );
            await ctx.stub.putState(
                "DISTRIBUTOR " + distributors[i].id,
                Buffer.from(JSON.stringify(distributors[i]))
            );
            await ctx.stub.putState(
                "PRODUCT " + products[i].id,
                Buffer.from(JSON.stringify(products[i]))
            );
            await ctx.stub.putState(
                "CAR " + cars[i].id,
                Buffer.from(JSON.stringify(cars[i]))
            );
            console.info("Added <--> ", products[i]);
        }
        console.info("============= END : Initialize Ledger ===========");
    }

    async createProduct(
        ctx,
        name,
        id,
        carNumber,
        make,
        model,
        color,
        owner,
        price,
        quantity,
        status
    ) {
        // //check if the product already exists
        // let productAsBytes = await ctx.stub.getState(id);
        // if (productAsBytes && productAsBytes.length > 0) {
        //     throw new Error(`The product ${id} already exists`);
        // }
        // //check if status is in StatusEnum
        // if(status != StatusEnum[status]){
        //     throw new Error(`The status ${status} is not valid`);
        // }

        const product = {
            name,
            id,
            carNumber,
            make,
            model,
            color,
            owner,
            price,
            quantity,
            status,
            docType: "product",
        };
        await ctx.stub.putState(
            `${product.docType.toUpperCase()} ${product.id}`,
            Buffer.from(JSON.stringify(product))
        );
    }
    async createUser(ctx,id, name, country, mobileNo, email, address, docType) {
        const user = {
            id,
            name,
            country,
            mobileNo,
            email,
            address,
            docType,
        };
        await ctx.stub.putState(
            `${user.docType.toUpperCase()} ${user.id}`,
            Buffer.from(JSON.stringify(user))
        );
    }

    async queryProduct(ctx, id) {
        const productAsBytes = await ctx.stub.getState(`PRODUCT ${id}`); // get the product from chaincode state
        if (!productAsBytes || productAsBytes.length === 0) {
            throw new Error(`${id} does not exist`);
        }
        console.log(productAsBytes.toString());
        return productAsBytes.toString();
    }

    async queryUser(ctx, id, docType) {
        const userAsBytes = await ctx.stub.getState(`${docType.toUpperCase()} ${id}`); // get the product from chaincode state
        if (!userAsBytes || userAsBytes.length === 0) {
            throw new Error(`${docType} ${id} does not exist`);
        }
        console.log(userAsBytes.toString());
        return userAsBytes.toString();
    }

    async getStatus(ctx, id) {
        const productAsBytes = await ctx.stub.getState(`PRODUCT ${id}`); // get the product from chaincode state
        if (!productAsBytes || productAsBytes.length === 0) {
            throw new Error(`${id} does not exist`);
        }
        const product = JSON.parse(productAsBytes.toString());
        return product.status;
    }

    async GetAll(ctx, docType) {
 
        let queryString = {};
        queryString.selector = {};
        queryString.selector.docType = docType;
        return await this.GetQueryResultForQueryString(ctx, JSON.stringify(queryString));
    }

    async GetQueryResultForQueryString(ctx, queryString){
 
        let resultsIterator = await ctx.stub.getQueryResult(queryString);
        let results = await this.GetAllResults(resultsIterator, false);
        
        return JSON.stringify(results);
        }
        
        async GetAllResults(iterator, isHistory) {
        let allResults = [];
        let res = await iterator.next();
        while (!res.done) {
        if (res.value && res.value.value.toString()) {
        let jsonRes = {};
        console.log(res.value.value.toString('utf8'));
        if (isHistory && isHistory === true) {
        jsonRes.TxId = res.value.tx_id;
        jsonRes.Timestamp = res.value.timestamp;
        try {
        jsonRes.Value = JSON.parse(res.value.value.toString('utf8'));
        } catch (err) {
        console.log(err);
        jsonRes.Value = res.value.value.toString('utf8');
        }
        } else {
        jsonRes = JSON.parse(res.value.value.toString('utf8'));
        // jsonRes.Key = res.value.key;
        // try {
        // jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
        // } catch (err) {
        // console.log(err);
        // jsonRes.Record = res.value.value.toString('utf8');
        // }
        }
        allResults.push(jsonRes);
        }
        res = await iterator.next();
        }
        iterator.close();
        return allResults;
        }

    
    async updateStatus(ctx, id, status) {
        //checks if the product exist   
        const productAsBytes = await ctx.stub.getState(`PRODUCT ${id}`); // get the product from chaincode state
        if (!productAsBytes || productAsBytes.length === 0) {
            throw new Error(`${id} does not exist`);
        }
        // ?? modififer checks

        //checks if status is in StatusEnum
        if(status != StatusEnum[status]){
            throw new Error(`The status ${status} is not valid`);
        }
        //update the status
        const product = JSON.parse(productAsBytes.toString());
        product.status = status;
        await ctx.stub.putState(
            `PRODUCT ${id}`,
            Buffer.from(JSON.stringify(product))
        );
    }

}

module.exports = FabCar;
