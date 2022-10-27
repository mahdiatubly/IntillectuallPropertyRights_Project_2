//Importing Express Library.
const express = require("express")
const app = express()

//Setting the view engine
const ejsLayout = require('express-ejs-layouts')
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

let papers =  []
let chain = []

//Creating the gensis block and appendding it to the chain
let gensisBlock = {
    blockNum: 0,
    paper: null,
    nonce: 0,
    prevHash: 00
}
chain.push(gensisBlock)
console.log(chain)

function createABlock(nonce, prevHash){
    papers.forEach((paper) => {
        let block = {
            blockNum: chain.length+1,
            paper: paper,
            nonce: nonce,
            prevHash: prevHash
        }
        chain.push(block)
        })    
}

// GET / - display the main page of the mining program.
app.get('/', (req, res) => {
    res.render('index.ejs')
})

app.post('/new', (req, res) => {
    res.redirect('/')
})  