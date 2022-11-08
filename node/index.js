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
const db = require('./models')
const { hexlify, unhexlify } = require("binascii");
const { BlockList } = require("net");
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
        this.nodeID = crypto.generateKeyPairSync("rsa", {
            modulusLength: 1024,
            publicKeyEncoding: { type: "spki", format: "pem" },
            privateKeyEncoding: { type: "pkcs8", format: "pem" },
          }).publicKey.toString('hex')
        this.stake = 0
        
        //Creating the gensis block and appendding it to the chain
        let gensisBlock = {
            senderPK: "00",
            recipientPK: "00",
            blockNum: 1,
            time: date.format(now, 'ddd, MMM DD YYYY'),
            glimp: "",
            prevHash: "00",
            miner: "00"
        }
        this.chain.push(gensisBlock)
        //console.log(this.chain)
    }
     
        async createABlock(prevHash){
        
        this.requests.forEach(async(paper, index) => {
            let count  = await db.blocks.count()
            let block = {
                senderPK: paper.author_public_key,
                recipientPK: paper.recipient_public_key,
                blockNum: count + 1 + index,
                time: date.format(now, 'ddd, MMM DD YYYY'),
                glimp: paper.glimp,
                prevHash: prevHash,
                miner: this.nodeID
            }
            this.chain.push(block)
            this.stake += 10
            })
        this.requests = []   
    }

    hash(block){
       let algorithm = crypto.createHash('sha256')
       let hash = algorithm.update(JSON.stringify(block)).digest('hex')
       return hash
    }
    
    signature_verification(sender_public_key, data, signature){
        try{
            const algorithm = "SHA256";
            const x = Buffer.from(signature, "hex");
            const y = ba.unhexlify(sender_public_key).trim()
            const isVerified = crypto.verify(algorithm, data.trim(), y, x);
            // Printing the result
            // console.log(`Is signature verified: ${isVerified}`)
            return isVerified
        }
        catch(err){

        }
        
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

//GET / - display the main page of the mining program.
app.get('/', (req, res) => {
    let requests = blockchain.requests
    //console.log(requests)
    db.blocks.findAll({order: [["block_num", "ASC"]]}).then(blocks=>{
        //console.log(blocks);
        // users will be an array of all User instances
        res.render('index.ejs', {requests: requests, chain: blocks} )
    })
    
})

app.get('/request', (req, res) => {
    
    let requests = blockchain.requests
    //console.log(requests)
    res.render('index.ejs', {requests: requests, chain: blockchain.chain} )
})

app.get('/configure', (req, res) => {
    res.render('configure.ejs')
})

app.get('/mine', async(req, res) => {
    for(let i = 0; i < blockchain.chain.length; i++){
        await db.blocks.findOrCreate({
            where: {
                sender_public_key: blockchain.chain[i].senderPK,
                recipient_public_key: blockchain.chain[i].recipientPK,
                block_num: blockchain.chain[i].blockNum,
                glimp: blockchain.chain[i].glimp,
                prev_hash: blockchain.chain[i].prevHash,
                miner: blockchain.chain[i].miner
            },defaults: { time: blockchain.chain[i].time }
          }).then(([block, wasCreated])=>{
            //console.log(block); // returns info about the user
            //console.log(wasCreated);
            //process.exit()
          });
    }

    db.blocks.findAll().then(blocks=>{
        console.log(blocks);
        let lastBlock = blocks[blocks.length - 1]
        let prevHash = blockchain.hash(lastBlock) 
        blockchain.createABlock(prevHash)
      })


    db.blocks.findAll({order: [["block_num", "ASC"]]}).then(blocks=>{
        console.log(blocks);
        // users will be an array of all User instances
        res.render('minedBlocks.ejs', {blocks: blocks})
      })
})

app.post('/new', (req, res) => {
        let details = req.body
        let results = blockchain.submit_request(details.confirmation_sender_public_key, details.confirmation_recipient_public_key,
                                  details.transaction_signature, details.confirmation_glimp, details.dict)
        if(results === false){
            console.log("Stupid!")
            res.redirect('http://127.0.0.1:6500/error')
        }
        else{
            console.log('Transaction will be added to the Block ' + results)
    
            res.redirect('http://127.0.0.1:6500/success')
        }
    
})









// ,
//   "test": {
//     "username": "root",
//     "password": null,
//     "database": "database_test",
//     "host": "127.0.0.1",
//     "dialect": "mysql"
//   },
//   "production": {
//     "username": "root",
//     "password": null,
//     "database": "database_production",
//     "host": "127.0.0.1",
//     "dialect": "mysql"
//   }