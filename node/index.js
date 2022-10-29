//Importing Express Library.
const express = require("express")
const app = express()

//Setting the view engine
const ejsLayout = require('express-ejs-layouts')
const date = require('date-and-time');
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
        gensisBlock = {
            blockNum: 0,
            time: date.format(now, 'ddd, MMM DD YYYY'),
            Glimp: null,
            nonce: 0,
            prevHash: "00"
        }
        chain.push(gensisBlock)
        console.log(chain)
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
            chain.push(block)
            })    
    }
    submit_request(sender_public_key, recipient_public_key, signature, amount){
        let reqDetails = {
            sender_public_key: sender_public_key,
            recipient_public_key: recipient_public_key,
            signature: signature,
            glimp: glimp
        }
        signature_verification = True
        if (signature_verification){
            this.requests.push(reqDetails)
            return this.chain.length + 1
        }
        else{
            return False
        }
            
    }

        
}


// GET / - display the main page of the mining program.
app.get('/', (req, res) => {
    res.render('index.ejs')
})

app.post('/new', (req, res) => {
    let details = req.body
    console.log(details)
    res.redirect('/')
})  