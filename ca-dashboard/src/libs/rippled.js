const xrpl = require('xrpl');
import { generateXRPLAccountFromString } from '@/libs/hash.js';

const net = process.env.XRPL_TEST_NET;

const walletFunded = async (email) => {
  const client = new xrpl.Client(net);
  try {
    await client.connect();
    const theWallet = generateXRPLAccountFromString(email);
    const theBalance = await client.getXrpBalance(theWallet.classicAddress);
    console.log(theBalance)
    let toReturn = false;
    if (theBalance > 0){
      toReturn = true;
    }
    client.disconnect()
    return toReturn;
  }
  catch (err) {
    console.log(err.toString());
    return false;
  }
}

const sendXRP = async (fromSeed, toEmail, sendAmount) => {
  const client = new xrpl.Client(net);
  try {
    await client.connect();
    const fromWallet = xrpl.Wallet.fromSeed(fromSeed);
    console.log(fromWallet);
    const toWallet = generateXRPLAccountFromString(toEmail);
    const prepared = await client.autofill({
      "TransactionType": "Payment",
      "Account": fromWallet.classicAddress,
      "DeliverMax": xrpl.xrpToDrops(sendAmount),
      "Destination": toWallet.classicAddress
    });
    const signed = fromWallet.sign(prepared);

    const tx = await client.submitAndWait(signed.tx_blob);

    client.disconnect();
  }
  catch (err) {
    console.log(err.toString());
  }
}

const mintClient = async (email, uri) => {
  const client = new xrpl.Client(net);
  try {
    await client.connect();
    //const theWallet = xrpl.Wallet.fromSeed('sEdTzWgWJQFfXyH9hBF357RtfcCuTD4');
    const theWallet = generateXRPLAccountFromString(email);
    const transactionJson = {
      "TransactionType": "NFTokenMint",
      "Account": theWallet.classicAddress,
      "URI": xrpl.convertStringToHex(uri),
      "Flags": parseInt(1), // burnable by the issuer and the rest is false
      "TransferFee": parseInt(0),
      "NFTokenTaxon": 0 //Required, but if you have no use for it, set to zero.
    }

    const tx = await client.submitAndWait(transactionJson, { wallet: theWallet })
    const nfts = await client.request({
      method: "account_nfts",
      account: theWallet.classicAddress
    })
    client.disconnect()
  }
  catch (err) {
    console.log(err.toString());
  }
}

export { walletFunded, sendXRP, mintClient };