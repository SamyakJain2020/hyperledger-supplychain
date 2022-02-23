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
        // load the network configuration
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

async function createUser(
    id,
    name,
    country,
    mobileNo,
    email,
    address,
    docType
) {
    await main();
    try {
        await contract.submitTransaction(
            "createUser",
            id,
            name,
            country,
            mobileNo,
            email,
            address,
            docType
        );
        console.log("Transaction has been submitted");
    } catch (error) {
        console.log(error);
    }

    // Disconnect from the gateway.
    await gateway.disconnect();
}

// createUser(
//     3,
//     "abc",
//     "India",
//     "+95-96-95-96-92",
//     "user@india.com",
//     "Kerela",
//     "buyer"
// );

async function queryUser(id, docType) {
    await main();
    try {
        const result = await contract.evaluateTransaction(
            "queryUser",
            id,
            docType
        );
        console.log(`Transaction has been submitted: ${JSON.parse(result)}`);
    } catch (error) {
        console.log(error);
    }

    // Disconnect from the gateway.
    await gateway.disconnect();
}

async function queryAllUsers(docType) {
    await main();
    try {

        let result = await contract.evaluateTransaction(
            "GetAll" ,docType
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
queryAllUsers();


module.exports = { createUser, queryUser, queryAllUsers};
