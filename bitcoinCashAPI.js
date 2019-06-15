
const bitcore = require('bitcore-lib-cash')
const fetch = require('node-fetch');
const Bluebird = require('bluebird');
const Hash = bitcore.crypto.Hash;
fetch.Promise = Bluebird;

const fs = require('fs');

const TESTNET_URL = 'https://trest.bitcoin.com/v2'

function createAddress(){
  var privateKey = new bitcore.PrivateKey();
  var publicKey = new bitcore.PublicKey(privateKey);
  console.log(bitcore.Networks);
  var address = new bitcore.Address(publicKey,bitcore.Networks.testnet);

  fs.writeFile("./keyGen2.txt",privateKey.toWIF()+"\n"+ publicKey+"\n" + address, function(err) {
    if(err) {
       return console.log(err);
   }
   console.log("The file was saved!");
  })
}

function getAddressDetail(address){
  fetch(`${TESTNET_URL}/address/details/${address}`, {method : 'GET'})
  .then(res => res.json())
  .then(json => {
    console.log(json)
    return json
  });
}

function getAddressUTXO(address){
  fetch(`${TESTNET_URL}/address/utxo/${address}`, {method : 'GET'})
  .then(res => res.json())
  .then(json => {
    console.log(json)
    return json
  });
}

function getAddressTransactions(address){

  fetch(`${TESTNET_URL}/address/transactions/${address}`, {method : 'GET'})
  .then(res => res.json())
  .then(json => {
    console.log(json)
    return json
  });
}

function getTransaction(hash){
  fetch(`${TESTNET_URL}/blockchain/transaction/${hash}`, {method : 'GET'})
  .then(res => res.json())
  .then(json => {
    console.log(json)
    return json
  });
}

function sendPayment(privateKey, addressSender, addressDestination, amount){
  fetch(`${TESTNET_URL}/address/utxo/${addressSender}`, {method : 'GET'})
  .then(res => res.json())
  .then(json => {
    console.log(json)
    var utxo = json.utxos.map( utxo => {
      return {
      "txId" : utxo.txid,
      "outputIndex" : utxo.vout,
      "script" : json.scriptPubKey,
      "satoshis" : utxo.satoshis
    }
    })

    var hex = new bitcore.Transaction()
      .from(utxo)
      .to(addressDestination, amount)
      .change(addressSender)
      .sign(privateKey);

      fetch(`${TESTNET_URL}/rawtransactions/sendRawTransaction/${hex}`, {
        method : 'GET' ,
       })
      .then(res => res.json())
      .then(json => {
        console.log(json)
        return json
      });
});
}
// sendPayment("Kzy6JCQYunQGYWVof8AGNBxwZbKsyUUCUEUzRHMmJtyZy5h2msq9", "bchtest:qrn7g0hn03tkxfnr48nuf9qx7v5arx9cr5n3r7farh", "bchtest:qqruay09rurmwzd0p0x0v7mwysje3jfp4s8aeusa9t",1000)
// getAddressUTXO("bchtest:qrn7g0hn03tkxfnr48nuf9qx7v5arx9cr5n3r7farh")
getAddressDetail("bchtest:qqruay09rurmwzd0p0x0v7mwysje3jfp4s8aeusa9t")
// createAddress()
