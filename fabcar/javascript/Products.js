/* eslint-disable no-unused-vars */
/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

"use strict";

const { Gateway, Wallets } = require("fabric-network");
const fs = require("fs");
const path = require("path");
let contract, gateway;
let main = async () => {
    try {
        const ccpPath = path.resolve(
            __dirname,
            "..",
            "..",
            "test-network",
            "organizations",
            "peerOrganizations",
            "org1.example.com",
            "connection-org1.json"
        );
        let ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), "wallet");
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        const identity = await wallet.get("appUser");
        if (!identity) {
            console.log(
                'An identity for the user "appUser" does not exist in the wallet'
            );
            console.log("Run the registerUser.js application before retrying");
            return;
        }

        gateway = new Gateway();
        await gateway.connect(ccp, {
            wallet,
            identity: "appUser",
            discovery: { enabled: true, asLocalhost: true },
        });

        const network = await gateway.getNetwork("mychannel");

        contract = network.getContract("fabcar");
    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }
};

async function createProduct(
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
    await main();
    try {
        await contract.submitTransaction(
            "createProduct",
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
        );
        console.log("Transaction has been submitted");
    } catch (error) {
        console.log(error);
    }

    // Disconnect from the gateway.
    await gateway.disconnect();
}
// createProduct(
//     "abc",
//     3,
//     "tn-1000",
//     "Honda",
//     "Accord",
//     "Black",
//     "Tom",
//     100,
//     1,
//     "asd"
// );

async function queryProduct(id) {
    await main();
    try {
        let result = await contract.evaluateTransaction("queryProduct", id);
        console.log(
            `Transaction has been evaluated, result is:`,
            JSON.parse(result.toString())
        );
    } catch (error) {
        console.log(error);
    }

    // Disconnect from the gateway.
    await gateway.disconnect();
}
// queryProduct(3);


async function queryAllProducts() {
    await main();
    try {

        let result = await contract.evaluateTransaction(
            "GetAll" ,"product"
        );
        console.log(
            `Transaction has been evaluated, result is:`,
            JSON.parse(result.toString())
        );
    } catch (error) {
        console.log(error);
    }

    // Disconnect from the gateway.
    await gateway.disconnect();
}
queryAllProducts();



// function to update the product status
async function updateProductStatus(id, status) {
    await main();
    try {
        await contract.submitTransaction("updateStatus", id, status);
        console.log("Transaction has been submitted");
    } catch (error) {
        console.log(error);
    }
    await gateway.disconnect();
}

// queryAllProducts();
module.exports = { createProduct, queryProduct, queryAllProducts,updateProductStatus };
