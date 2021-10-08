const express = require('express')
const app = express()

const { response } = require('express')
const Axios = require('axios');

const port = 8080
const host = '0.0.0.0'
require('dotenv').config()

app.use(express.json())
app.use(express.urlencoded({ extended: true })) 

app.get('/', function (req, res) {
    // instantiate a recharge session (include the api token)
    const rechargeClient = Axios.create({
        baseURL: 'https://api.rechargeapps.com/',
        timeout: 29000,
        headers: {
          'Accept': 'application/json; charset=utf-8;',
          'Content-Type': 'application/json',
          'X-Recharge-Access-Token': process.env.RECHARGE_TEST_API_KEY,
          'secrete': process.env.APP_SECRETE,
        }
      });

    // // create a webhook
    rechargeClient.post('https://api.rechargeapps.com/webhooks', {
            "address": "https://a035-173-77-234-181.ngrok.io/subscription/cancelled",
            "topic": "subscription/cancelled"
        }
    )
    .then((promiseRes) => {
        res.send(promiseRes.data)
    })
    .catch((err) => {
        console.log(err)
    });
})

app.post('/subscription/webhook', function (req, res) {
    res.send('POST')
    res.status(200).end()
})

app.listen(port, host);

module.exports = app;
