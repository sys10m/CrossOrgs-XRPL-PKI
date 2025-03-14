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

<<<<<<< Updated upstream
export { walletFunded, sendXRP, mintClient };
=======
// FIX: make it cleaner i.e. one function
const genesisMint = async (uri) => {
  const client = new xrpl.Client(net);
  try {
    await client.connect();
    const theWallet = xrpl.Wallet.fromSeed(process.env.XRPL_GENESIS_SEED);
    const transactionJson = {
      "TransactionType": "NFTokenMint",
      "Account": theWallet.classicAddress,
      "URI": xrpl.convertStringToHex(uri),
      "Flags": parseInt(1), // burnable by the issuer and the rest is false
      "TransferFee": parseInt(0),
      "NFTokenTaxon": 0 //Required, but if you have no use for it, set to zero.
    }

    const tx = await client.submitAndWait(transactionJson, { wallet: theWallet })
    client.disconnect();
    return tx.result.meta.nftoken_id;
  }
  catch (err) {
    console.log(err.toString());
    return null;
  }
}

// create sell offer to specific email
const createSellOffer = async (nftId, destinationEmail) =>{
  const client = new xrpl.Client(net);
  try{
    await client.connect();
    const theWallet = xrpl.Wallet.fromSeed(process.env.XRPL_GENESIS_SEED);
    let expirationDate = null;
    let days = 1;
    let d = new Date();
    d.setDate(d.getDate() + parseInt(days));
    expirationDate = xrpl.isoTimeToRippleTime(d);

    let transactionBlob = {
      "TransactionType": "NFTokenCreateOffer",
      "Account": theWallet.classicAddress,
      "NFTokenID": nftId,
      "Amount": "10",
      "Flags": parseInt(1)
    }
    // to take out expiration date in the future - delete this
    transactionBlob.Expiration = expirationDate;

    // get destination account
    const destinationWallet = generateXRPLAccountFromString(destinationEmail);
    transactionBlob.Destination = destinationWallet.classicAddress;

    const tx = await client.submitAndWait(transactionBlob, { wallet: theWallet })
   
    let nftSellOffers;
    try {
      nftSellOffers = await client.request({
        method: "nft_sell_offers",
        nft_id: nftId})
    } catch (err) {
      nftSellOffers = "No sell offers."
    }

    client.disconnect();
    return nftSellOffers.result.offers[0].nft_offer_index;
  }
  catch (err){
    console.log(err.toString());
    return null;
  }
}

const acceptSellOffer = async(email, offerId) => {
  const client = new xrpl.Client(net);
  const theWallet = generateXRPLAccountFromString(email);
  const transactionBlob = {
    "TransactionType": "NFTokenAcceptOffer",
    "Account": theWallet.classicAddress,
    "NFTokenSellOffer": offerId
  }
  try {
    await client.connect();
    const tx = await client.submitAndWait(transactionBlob, { wallet: theWallet });
    console.log("Sell Offer Accepted");
    client.disconnect();
    return tx.result;
  }
  catch (err) {
    console.log(err.toString());
    return null;
  }
}

const getNFTs = async (email) => {
  const client = new xrpl.Client(net);
  try {
    await client.connect();
    const theWallet = generateXRPLAccountFromString(email);
    const nfts = await client.request({
      method: "account_nfts",
      account: theWallet.classicAddress
    });
    client.disconnect();
    return JSON.stringify(nfts,null,2);
  }
  catch (err) {
    console.log(err.toString());
    return null;
  }
}

// ===== exposed operations =====

// combined operations
const CAmintFor = async (email, uri) => {
  const funded = await walletFunded(email);
  console.log(funded);
  if (!funded){
    await sendXRP(process.env.XRPL_GENESIS_SEED, email, 50);
  }
  const nftId = await genesisMint(uri);
  const offerId = await createSellOffer(nftId, email);
  const accepted = await acceptSellOffer(email, offerId);
  return accepted;
}

export { walletFunded, sendXRP, mintClient, getNFTs, CAmintFor };
>>>>>>> Stashed changes
