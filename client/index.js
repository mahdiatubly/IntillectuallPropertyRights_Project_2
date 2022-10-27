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
  constructor()
  {
  }

  generateKeys(){
      let keys = crypto.generateKeyPairSync("rsa", {
      modulusLength: 1024,
      publicKeyEncoding: { type: "spki", format: "pem" },
      privateKeyEncoding: { type: "pkcs8", format: "pem" },
    });
    return keys
  }

  toObj(author_public_key, author_private_key, recipient_public_key, glimp) {
    return {
      author_public_key: author_public_key,
      author_private_key: author_private_key,
      recipient_public_key: recipient_public_key,
      glimp: glimp
    }
  }

  signPaper(){
      // Convert Stringified json data to buffer  
      const data = JSON.stringify(this.toObj());
        
      // Sign the data and returned signature in buffer 
      const sign = crypto.sign("SHA256", data , this.generateKeys().privateKey);
        
      // Convert returned buffer to base64
      const signature = sign.toString('hex');
  
      // Printing the signature 
      return signature
      
  }
}

let publish = new Publish()
let author_public_key = null
let author_private_key  = null


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
    let recipient_public_key = req.body.recipient_public_key
    let glimp = req.body.upload
    console.log(publish.toObj(author_public_key, author_private_key, recipient_public_key, glimp))
    console.log(publish.signPaper())
    res.render('confirm.ejs', {publish: publish.toObj(ba.hexlify(publish.generateKeys().publicKey), author_private_key, recipient_public_key, glimp), 
      signature: publish.signPaper()})
}) 

// GET / - display the main page of the mining program.
app.get('/publishing/history', (req, res) => {
    res.render('publishingHistory.ejs')
})

// GET / - display the main page of the mining program.
app.get('/generate/account',(req, res) => {
    author_public_key = publish.generateKeys().publicKey
    author_private_key = publish.generateKeys().privateKey
    res.render('newKeys.ejs',{public_key: ba.hexlify(publish.generateKeys().publicKey), private_key: ba.hexlify(publish.generateKeys().privateKey)})
    })

   
    

























