//Importing Express Library.
const express = require("express")
const app = express()

//Setting the view engine
const ejsLayout = require('express-ejs-layouts')
app.set('view engine', 'ejs')
app.use(ejsLayout)
const port = process.env.PORT || 6500

const crypto =  require("crypto")
const Buffer = require('buffer/').Buffer
const utf8 = require('utf8');
const NodeRSA = require('node-rsa');
const key = new NodeRSA();


let RSA = require('hybrid-crypto-js').RSA;
let Crypt = require('hybrid-crypto-js').Crypt;
const paypal = require('@paypal/checkout-server-sdk');


const ba = require('binascii');
const { hexlify, unhexlify } = require("binascii")
//Setting urlencoded middleware to enable me access the input provided by the use

// var bodyParser = require('body-parser')
// app.use(bodyParser.urlencoded({
//   extended: false
// }));

//Setting urlencoded middleware to enable me access the input provided by the user
app.use(express.urlencoded({extended: false}))

class Publish{
  constructor(author_public_key, author_private_key, recipient_public_key, glimp)
  {
    this.author_public_key = author_public_key,
    this.author_private_key = author_private_key,
    this.recipient_public_key = recipient_public_key,
    this.glimp = glimp
  }

  toObj() {
    return {
      author_public_key: ba.hexlify(this.author_public_key),
      recipient_public_key: ba.hexlify(this.recipient_public_key),
      glimp: this.glimp
    }
  }

  signPaper(issuerPublicKey, issuerPrivateKey, dict, receiverPublicKey){  
    const data = JSON.stringify(dict)
    const buffer = require('buffer');
    // Using Hashing Algorithm
    const algorithm = "SHA256";
    try{
      // Sign the data and returned signature in buffer
      const signature = crypto.sign(algorithm, data, issuerPrivateKey);
      console.log(signature)
      return signature.toString('hex')
    }
    catch(err){
      console.log(err)
    }
    
  }
}

//setting the listening on port 3000
app.listen(port, () => {
    console.log("Ibtsam!!! What are you doing?!")
})

// GET / - display the main page of the mining program.
app.get('/', (req, res) => {
      res.render('index.ejs')
})


// GET / - display the main page of the mining program.
app.get('/publish/paper', (req, res) => {
    res.render('publish.ejs')
})

app.post('/publish/paper', (req, res) => {
  try{
    author_public_key = ba.unhexlify(req.body.author_public_key)
    author_private_key = ba.unhexlify(req.body.author_private_key)
    let recipient_public_key = ba.unhexlify(req.body.recipient_public_key)
    let glimp = req.body.upload
    console.log(recipient_public_key)
    let publish = new Publish(author_public_key, author_private_key, recipient_public_key, glimp)
    let dict = publish.toObj()
    let signature = publish.signPaper(author_public_key, author_private_key, dict, recipient_public_key)
    ///console.log(signature)

    res.render('confirm.ejs', {publish: dict, 
                signature: signature})
  }
  catch(err){
    res.render('error.ejs', {err: err})
  }
  
}) 

// GET / - display the main page of the mining program.
app.get('/publishing/history', (req, res) => {
    res.render('publishingHistory.ejs')
})

// GET / - display the main page of the mining program.
app.get('/success', (req, res) => {
  res.render('success')
})

app.get('/error', (req, res) => {
  res.render('error')
})

app.get('/buy/coin', (req, res) => {
  res.render('buyZwails')
})

// GET / - display the main page of the mining program.
app.get('/generate/account',(req, res) => {
  let keys = crypto.generateKeyPairSync("rsa", {
    modulusLength: 1024,
    publicKeyEncoding: { type: "spki", format: "pem" },
    privateKeyEncoding: { type: "pkcs8", format: "pem" },
  })
  author_public_key = keys.publicKey
  author_private_key = keys.privateKey
  res.render('newKeys.ejs',{public_key: ba.hexlify(author_public_key), private_key: ba.hexlify(author_private_key)})
  })

   
    

























