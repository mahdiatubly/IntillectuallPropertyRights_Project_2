require('dotenv').config()
//Importing Express Library.
const express = require("express")
const app = express()
const paypalCap =  require("./paypal.js");
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
app.use(express.json())
app.use(express.static('static'))
const Environment =
  process.env.NODE_ENV === "production"
    ? paypal.core.LiveEnvironment
    : paypal.core.SandboxEnvironment
const paypalClient = new paypal.core.PayPalHttpClient(
  new Environment(
    process.env.PAYPAL_CLIENT_ID,
    process.env.PAYPAL_CLIENT_SECRET
  )
)


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
  res.render('buyZwails', {paypalClientId: process.env.PAYPAL_CLIENT_ID})
})


const storeItems = new Map([
  [1, { price: 30, name: "Zwail Coin" }]
])

app.get("/", (req, res) => {
  res.render("index", {
    paypalClientId: process.env.PAYPAL_CLIENT_ID,
  })
})

app.post("/buy/coins", async (req, res) => {
  const request = new paypal.orders.OrdersCreateRequest()
  const total = req.body.items.reduce((sum, item) => {
    return sum + storeItems.get(item.id).price * item.quantity
  }, 0)
  request.prefer("return=representation")
  request.requestBody({
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "USD",
          value: total,
          breakdown: {
            item_total: {
              currency_code: "USD",
              value: total,
            },
          },
        },
        items: req.body.items.map(item => {
          const storeItem = storeItems.get(item.id)
          return {
            name: storeItem.name,
            unit_amount: {
              currency_code: "USD",
              value: storeItem.price,
            },
            quantity: item.quantity,
          }
        }),
      },
    ],
  })

  try {
    const order = await paypalClient.execute(request)
    res.json({ id: order.result.id })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})


// app.post("/:orderId/capture", async (req, res) => {
//   const { orderId } = req.params;
//   const captureData = await paypalCap.capturePayment(orderId);
//   console.log(captureData)
//   res.json(captureData);
// });


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

   
    

























