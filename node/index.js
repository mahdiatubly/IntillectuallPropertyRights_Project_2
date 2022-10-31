//Importing Express Library.
const express = require("express")
const app = express()

//Setting the view engine
const ejsLayout = require('express-ejs-layouts')
const date = require('date-and-time');
const ba = require('binascii');
const crypto = require('crypto');


const Buffer = require('buffer').Buffer
const buffer = require('buffer');
let RSA = require('hybrid-crypto-js').RSA;
let Crypt = require('hybrid-crypto-js').Crypt;
const { hexlify, unhexlify } = require("binascii")
const now = new Date();
app.use(express.urlencoded({extended: false}))
app.set('view engine', 'ejs')
app.use(ejsLayout)
const port = process.env.PORT || 5500

//Connecting the controllers to the main page.
//const dinosaurs_controller = require("./controllers/dinosaurs")
//const cretures_controller = require("./controllers/creatures")
//app.use('/dinosaurs', dinosaurs_controller)
//app.use('/prehistoric_creatures', cretures_controller)


//setting the listening on port 3000
app.listen(port, () => {
    console.log("Ibtsam!!! What are you doing?!")
})


class Blockchain{
    constructor(){
        this.requests =  []
        this.chain = []
        //Creating the gensis block and appendding it to the chain
        let gensisBlock = {
            blockNum: 0,
            time: date.format(now, 'ddd, MMM DD YYYY'),
            Glimp: null,
            nonce: 0,
            prevHash: "00"
        }
        this.chain.push(gensisBlock)
        //console.log(this.chain)
    }
        
    createABlock(nonce, prevHash){
        papers.forEach((paper) => {
            let block = {
                blockNum: chain.length+1,
                time: date.format(now, 'ddd, MMM DD YYYY'),
                Glimp: paper,
                nonce: nonce,
                prevHash: prevHash
            }
            this.chain.push(block)
            })    
    }
    
    signature_verification(sender_public_key, data, signature){
        const algorithm = "SHA256";
        const x = Buffer.from(signature, "hex");
        const y = ba.unhexlify(sender_public_key).trim()
        //const d = JSON.stringify(data)
        console.log(y)
        //console.log(x)
        //console.log(issuerPublicKey)
        console.log(data)
        const isVerified = crypto.verify(algorithm, data.trim(), y, x);
        // Printing the result
        console.log(`Is signature verified: ${isVerified}`)
        return isVerified
    }

    submit_request(sender_public_key, recipient_public_key, signature, glimp, dict){
        
        let reqDetails = {
            author_public_key: sender_public_key,
            recipient_public_key: recipient_public_key,
            glimp: glimp
        }

        let signature_verification = this.signature_verification(sender_public_key, dict, signature)
        console.log(signature_verification)
        if (signature_verification){
            this.requests.push(reqDetails)
            return this.chain.length + 1
        }
        else{
            return false
        }
            
    }

        
}

let blockchain = new Blockchain()

// GET / - display the main page of the mining program.
// app.get('/', (req, res) => {
//     res.render('index.ejs')
// })

app.get('/request', (req, res) => {
    
    let requests = blockchain.requests
    console.log(requests)
    res.render('index.ejs', {requests: requests} )
})

app.post('/new', (req, res) => {
    let details = req.body
    let results = blockchain.submit_request(details.confirmation_sender_public_key, details.confirmation_recipient_public_key,
                              details.transaction_signature, details.confirmation_glimp, details.dict)
    if(results === false){
        console.log("Stupid!")
        res.render('success.ejs', {message: 'Invalid transaction/signature'})
    }
    else{
        console.log("Great!" + results)
        res.render('success.ejs', {message:'Transaction will be added to the Block ' + results})
    }
    console.log(blockchain.requests)
    console.log(blockchain.chain)

    
})  