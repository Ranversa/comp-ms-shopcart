var request = require("request");
const express = require('express')
const app = express()
const fs = require('fs')
var  bodyParser  = require ('body-parser') 
const port = process.env.PORT || 4040

const pkg = require('./package.json')
const orderline = require('./orderline.json')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())


app.get('/', function (req, res) {
    res.send("entrou")
})

app.get('/line/:oid',function(req,res){
    const oid = req.params.oid
    let order = orderline.find(order => order.oid == oid)
    res.status(200).json(order)
})


function verifyToken(req, res, next) {
    let auth = req.headers.authorization
    if (auth) {
        auth = auth.split(' ')[1]
        let options = {
            method: 'POST',
            url: 'http://comp-ms-auth.herokuapp.com:80/api/verify',
            headers:
                { Authorization: 'Bearer ' + auth }
        }
        request(options, function (error, response, body) {
            if (error) throw new Error(error);
            body = JSON.parse(body)
            if (body.loged) {
                req.payload = body
            }
            next()
        })
    } else {
        next()
    }
}

app.post('/line', verifyToken, function (req, res) {
    let payload = req.payload
    if (payload) {
        let orid = req.body.oid
        let itid = req.body.lid
        let qtd = req.body.qtd

        let i =0;
        let l =0;
        orderline.forEach(ordem =>{
            if(ordem.oid == orid){
                ordem.forEach(item=>{
                    if(item.lines.lid == itid){
                        return
                    }
                    l++
                })
                i++
            }
        })
        orderline[i].lines[l].amount = qtd
        fs.writeFile('./orderline.json',JSON.stringify(orderline))

        res.status(200).send("update realizado")
    } else {
        res.set('WWW-Authenticate', 'Bearer realm="401"')
        res.status(401).json({ loged: false, message: "Voce precisa de um token para acessar esse serviço" })
    }
})

app.listen(port, function () {
    console.log("Rodando na porta:", port)
})