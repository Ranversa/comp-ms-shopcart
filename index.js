var request = require("request");
var  bodyParser  = require ( ' body-parser ' ) 
const express = require('express')
const app = express()
const port = process.env.PORT || 4040

const pkg = require('./package.json')
const orderline = require('./orderline.json')

app.get('/', function (req, res) {
    res.send("entrou")
})

app.get('/line/:oid',function(req,res){
    const oid = req.params.oid
    let order = orderline.find(order => order.oid == oid)
    res.status(200).json(order)
})




app.listen(port, function () {
    console.log("Rodando na porta:", port)
})