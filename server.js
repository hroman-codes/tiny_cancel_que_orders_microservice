const { response } = require('express')
const express = require('express')
const bodyParser = require('body-parser')

const app = express()
const port = 8080
const host = '0.0.0.0'
require('dotenv').config()

app.use(bodyParser.json())

app.get('/', function (req, res) {
    res.send('GET')
})

app.post('/subscription/cancelled', function (req, res) {
    const api_key = process.env.RECHARGE_TEST_API_KEY;
    const webHookURL = 'https://api.rechargeapps.com/webhooks'
    
    console.log(req.body);
 
    // set up the webhook
    // send a request 
    // log out the response

    res.send('POST')
    res.status(200).end()
})

// app.post('/subscription/cancelled', function (req, res) {
//     const api_key = process.env.RECHARGE_TEST_API_KEY;
//     let headers = {
//         "Content-Type": "application/json",
//         "X-Recharge-Access-Token": "your_api_token"
//     }
//     let url = "https://api.rechargeapps.com/webhooks";
//     let data = {
//         "address": "https://request.in/foo",
//         "topic": "subscription/cancelled"
//     }

//     res.send('POST')
// })

// app.post('https://1465-173-77-234-181.ngrok.io/subscriptions/:id/cancel', function (req, res) {
//     const api_key = process.env.RECHARGE_TEST_API_KEY;
//     const tempID = '27363808'

//     console.log('req', req)
//     console.log('res', res)

//     res.send('TEST POST WITH NGROK >>> Recharge WEBHOOK Working')
// })

app.listen(port, host);

module.exports = app;
