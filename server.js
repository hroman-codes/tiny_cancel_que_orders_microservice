const express = require('express')
const app = express()

const { response } = require('express')
const Axios = require('axios');
const bodyParser = require('body-parser');
const { default: axios } = require('axios');

const port = 8080
const host = '0.0.0.0'
require('dotenv').config()

app.use(express.json())
app.use(express.urlencoded({ extended: true })) 

app.use(express.json())
app.use(express.urlencoded({ extended: true })) 
app.use(bodyParser.urlencoded({ extended: false}))
app.use(bodyParser.json())

let urlencodedParser = bodyParser.urlencoded({ extended: false })

// listen for root http call 
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

    // create a webhook
    rechargeClient.post('https://api.rechargeapps.com/webhooks', {
            "address": "https://68d7-173-77-234-181.ngrok.io/subscription/webhook",
            "topic": "subscription/cancelled"
        }
    )
    .then((promiseRes) => {
        console.log(promiseRes.data)
        res.send(promiseRes.data)
    })
    .catch((err) => {
        console.log(err)
    });
})


app.post('/subscription/webhook', urlencodedParser, function (req, res) {
    // grab cusomer ID 
    // let customerID = req.body.subscription.customer_id;

    // fetch the subscription object
    // `https://api.rechargeapps.com/subscriptions?customer_id=${customerID}&status=ACTIVE` <<< Real recharge end point
    // https://73cd-173-77-234-181.ngrok.io/subscriptions <<< NGROK fake API for customer with no active subscriptions
    axios.get(`https://73cd-173-77-234-181.ngrok.io/subscriptions`, {
        headers: {
            'Accept': 'application/json; charset=utf-8;',
            'Content-Type': 'application/json',
            'X-Recharge-Access-Token': process.env.RECHARGE_TEST_API_KEY,
            'secrete': process.env.APP_SECRETE, 
        }
    })
    .then((response) => {
        let activeSubscription = response.data;
        console.log('activeSubscription >>>', activeSubscription)
        // if customer doesnt have active subs
        if (activeSubscription.length === 0) {
            // proceed to check for queued orders ✅
            console.log('Customer doesnt have active subs go ahead check for queued orders ✅')
            // `https://73cd-173-77-234-181.ngrok.io/orders` <<< fake api json server
            // `https://api.rechargeapps.com/orders?customer_id=${customerID}&status=QUEUED` <<< Real recharge end point
            axios.get(`https://73cd-173-77-234-181.ngrok.io/orders`, {
                    headers: {
                    'Accept': 'application/json; charset=utf-8;',
                    'Content-Type': 'application/json',
                    'X-Recharge-Access-Token': process.env.RECHARGE_TEST_API_KEY,
                    'secrete': process.env.APP_SECRETE,
                    }
                })
                .then((response) => {
                    let queuedOrders = response.data
                    console.log('queuedOrders >>>', queuedOrders);
                    // if queued orders exist 
                    if (queuedOrders.length > 0) {
                        // iterate through the list of orders
                        for (let i = 0; i < queuedOrders.length; i++) {
                            let orderID = queuedOrders[i].id;
                            console.log('orderID >>', orderID);
                            console.log(`delete this order ${queuedOrders[i]} ❌`);
                            // `https://api.rechargeapps.com/orders/${orderID}` << Real recharge end point
                            // `https://73cd-173-77-234-181.ngrok.io/orders/${orderID}` << fake api json server
                            // delete the order
                            axios.delete(`https://73cd-173-77-234-181.ngrok.io/orders/${orderID}`, {
                                headers: {
                                    'X-Recharge-Access-Token': process.env.RECHARGE_TEST_API_KEY,
                                    }
                            })
                        }
                    } else {
                        // if no queued orders exist then do nothing / return out this promise
                        console.log('Customer has no queued orders ❌')
                        return
                    }
                })
                .catch((err) => {
                    console.log(err)
                })
        } else {
            console.log('Customer has active subs do nothing ❌')
            return
        }
    })
    .catch((err) => {
        console.log(err)
    })

    res.status(200).end()
})

app.listen(port, host);

module.exports = app;
