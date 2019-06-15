
const bitcore = require('bitcore-lib')
const fetch = require('node-fetch');
const Bluebird = require('bluebird');
const Hash = bitcore.crypto.Hash;
fetch.Promise = Bluebird;

const fs = require('fs');
const TESTNET_URL = 'https://api.bitaps.com/btc/testnet/v1/'

function createAddress(){
  var privateKey = new bitcore.PrivateKey();
  var publicKey = new bitcore.PublicKey(privateKey);
  console.log(bitcore.Networks);
  var address = new bitcore.Address(publicKey,bitcore.Networks.testnet);

  fs.writeFile("./keyGen1.txt",privateKey.toWIF()+"\n"+ publicKey+"\n" + address, function(err) {
    if(err) {
       return console.log(err);
   }
   console.log("The file was saved!");
  })

}


function getAddressState(address){
  fetch(`${TESTNET_URL}blockchain/address/state/${address}`, {method : 'GET'})
  .then(res => res.json())
  .then(json => {
    console.log(json.data)
    return json.data
  });
}

function getAddressTransactions(address){
  fetch(`${TESTNET_URL}/blockchain/address/transactions/${address}`, {method : 'GET'})
  .then(res => res.json())
  .then(json => {
    console.log(json.data.list)
    return json.data.list
  });
}

function getTransaction(hash){
  fetch(`${TESTNET_URL}/blockchain/transaction/${hash}`, {method : 'GET'})
  .then(res => res.json())
  .then(json => {
    console.log(json.data)
    return json.data
  });
}

function createForwardingAddress(address){
  const body = {
    forwarding_address : address
  };

  fetch(`${TESTNET_URL}/create/payment/address`, {
    method : 'POST',
    body : JSON.stringify(body)
  })
  .then(res => res.json())
  .then(json => {
    console.log(json)
    return json
  });
}

function createWallet(password){
  const body = {
    password : password
  };

  fetch(`${TESTNET_URL}/create/wallet`, {
    method : 'POST',
    body : JSON.stringify(body)
  })
  .then(res => res.json())
  .then(json => {
    console.log(json)
    return json
  });
}

function createWalletPaymentAddress(walletID){
  var body = {
    wallet_id : walletID
  }
  fetch(`${TESTNET_URL}/create/wallet/payment/address`, {
    method : 'POST',
    body : JSON.stringify(body)
  })
  .then(res => res.json())
  .then(json => {
    console.log(json)
    return json
  });
}

function walletState(walletID, password, nonce){
  var buf = new Buffer(walletID + password);
  var key = Hash.sha256sha256(buf)

  var msg = new Buffer(wallet+nonce)
  var HMAC_signature = bitcore.crypto.Hash.sha256hmac(msg,key).toString('hex')
  console.log(HMAC_signature)
  var body = {
    "Access-Nonce" : nonce,
    "Access-Signature" : HMAC_signature
  }
  fetch(`${TESTNET_URL}/wallet/state/${walletID}`, {
    method : 'GET' ,
    headers : body
   })
  .then(res => res.json())
  .then(json => {
    console.log(json)
    return json
  });
}

function getWalletAddressList(walletID, password, nonce){
  var buf = new Buffer(walletID + password);
  var key = Hash.sha256sha256(buf)

  var msg = new Buffer(walletID + nonce)
  var HMAC_signature = bitcore.crypto.Hash.sha256hmac(msg,key).toString('hex')
  console.log(HMAC_signature)
  var body = {
    "Access-Nonce" : nonce,
    "Access-Signature" : HMAC_signature
  }
  fetch(`${TESTNET_URL}/wallet/addresses/${walletID}`, {
    method : 'GET' ,
    headers : body
   })
  .then(res => res.json())
  .then(json => {
    console.log(json)
    return json
  });
}

function sendPayment(walletID, password, nonce, destinationAddress, amount, textmemo){
  var buf = new Buffer(walletID + password);
  var key = Hash.sha256sha256(buf)

  var msg = new Buffer(walletID+nonce)
  var HMAC_signature = bitcore.crypto.Hash.sha256hmac(msg,key).toString('hex')
  console.log(HMAC_signature)
  var headers = {
    "Access-Nonce" : nonce,
    "Access-Signature" : HMAC_signature
  }
  var body = {
    receivers_list : [
      {
        address : destination,
        amount : amount
      }
    ],
    message : {
      format : "text",
      payload : textmemo||""
    }
  }
  fetch(`${TESTNET_URL}/wallet/send/payment/${walletID}`, {
    method : 'POST' ,
    headers : headers,
    body : JSON.stringify(body)
   })
  .then(res => res.json())
  .then(json => {
    console.log(json)
    return json
  });
}

// getAddressState("mjfjmkT5n79yftXFwu6nZs6kX7CCKK1rbG")
// getAddressTransactions("mjfjmkT5n79yftXFwu6nZs6kX7CCKK1rbG")
// getTransaction("4a34ba6a8161aec2862e872de0a1e8f059c57f185ed238fb6f39bd5d71b17eca")

// createForwardingAddress("mjfjmkT5n79yftXFwu6nZs6kX7CCKK1rbG")
// createWalletPaymentAddress()
// getWalletAddressList()

// sendPayment()
