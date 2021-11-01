const express = require('express')
const app = express()

const { response } = require('express')
const Axios = require('axios')
const { default: axios } = require('axios')

const port = process.env.PORT || 8080
const host = '0.0.0.0'

require('dotenv').config()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

if(process.env.NODE_ENV === 'production') {

    app.get('/', function (req, res) {
        const rechargeClient = Axios.create({
            baseURL: 'https://api.rechargeapps.com/',
            timeout: 29000,
            headers: {
            'Accept': 'application/json; charset=utf-8;',
            'Content-Type': 'application/json',
            'X-Recharge-Access-Token': process.env.RECHARGE_API_KEY
            }
        });

        rechargeClient.post('https://api.rechargeapps.com/webhooks', {
                "address": process.env.WEBHOOK_RESPONSE_URL,
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
    
    app.post('/subscription/webhook', function (req, res) {
        // grab cusomer ID
        let customerID = req.body.subscription.customer_id;
        // fetch the subscription object
        axios.get(`https://api.rechargeapps.com/subscriptions?customer_id=${customerID}&status=ACTIVE`, {
            headers: {
                'Accept': 'application/json; charset=utf-8;',
                'Content-Type': 'application/json',
                'X-Recharge-Access-Token': process.env.RECHARGE_API_KEY 
            }
        })
        .then((response) => {
            let activeSubscription = response.data.subscriptions;            
            // if customer doesnt have active subs
            if (activeSubscription.length === 0) {
                // proceed to check for queued orders ✅
                axios.get(`https://api.rechargeapps.com/orders?customer_id=${customerID}&status=QUEUED`, {
                        headers: {
                        'Accept': 'application/json; charset=utf-8;',
                        'Content-Type': 'application/json',
                        'X-Recharge-Access-Token': process.env.RECHARGE_API_KEY
                        }
                    })
                    .then((response) => {
                        let queuedOrders = response.data.orders
                        // if queued orders exist 
                        if (queuedOrders.length > 0) {
                            // iterate through the list of orders
                            for (let i = 0; i < queuedOrders.length; i++) {
                                let orderID = queuedOrders[i].id;
                                // delete the order
                                axios.delete(`https://api.rechargeapps.com/queuedOrders/${orderID}`, {
                                    headers: {
                                        'X-Recharge-Access-Token': process.env.RECHARGE_API_KEY,
                                        }
                                })
                            }
                        }
                    })
                    .catch((err) => {
                        console.log(err)
                    })
            }
        })
        .catch((err) => {
            console.log(err)
        })
        res.status(200).end()
    })

    app.use(function (req, res, next) {
        res.status(404).send('404 Unable to find the requested resource!')
    })

    app.listen(port, host, function() {
        console.log(`Listening on ${ port }`)
    });
    
    module.exports = app;
} else {    
    const BASE_WEBHOOK_URI = process.env.BASE_WEBHOOK_URI
    const JSON_SERVER_URI = process.env.JSON_SERVER_URI 

    // listen for root http call 
    app.get('/', function (req, res) {
        // instantiate a recharge session (include the api token)
        const rechargeClient = Axios.create({
            baseURL: 'https://api.rechargeapps.com/',
            timeout: 29000,
            headers: {
            'Accept': 'application/json; charset=utf-8;',
            'Content-Type': 'application/json',
            'X-Recharge-Access-Token': process.env.RECHARGE_API_KEY
            }
        });

        // create a webhook
        rechargeClient.post('https://api.rechargeapps.com/webhooks', {
                "address": `${BASE_WEBHOOK_URI}/subscription/webhook`,
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

    // listen for webhook response
    app.post('/subscription/webhook', function (req, res) {
        // fetch the subscription that are active
        axios.get(`${JSON_SERVER_URI}/subscriptions`, {
            headers: {
                'Accept': 'application/json; charset=utf-8;',
                'Content-Type': 'application/json',
                'X-Recharge-Access-Token': process.env.RECHARGE_API_KEY
            }
        })
        .then((response) => {
            let activeSubscription = response.data;
            console.log('activeSubscription >>>', activeSubscription)
            // if customer doesnt have active subs
            if (activeSubscription.length === 0) {
                // proceed to check for queued orders ✅
                console.log('Customer doesnt have active subs go ahead check for queued orders ✅')

                axios.get(`${JSON_SERVER_URI}/queuedOrders`, {
                        headers: {
                        'Accept': 'application/json; charset=utf-8;',
                        'Content-Type': 'application/json',
                        'X-Recharge-Access-Token': process.env.RECHARGE_API_KEY
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
                                // delete the order
                                axios.delete(`${JSON_SERVER_URI}/queuedOrders/${orderID}`, {
                                    headers: {
                                        'X-Recharge-Access-Token': process.env.RECHARGE_API_KEY,
                                        }
                                })
                            }
                        } 
                    })
                    .catch((err) => {
                        console.log(err)
                    })
            } 
        })
        .catch((err) => {
            console.log(err)
        })
        res.status(200).end()
    })

    app.use(function (req, res, next) {
        res.status(404).send('404 Unable to find the requested resource!')
    })

    // middleware that responds to 404
    app.listen(port, host, function() {
        console.log(`Listening on ${ port }`)
    });

    module.exports = app;
}

console.log(`We are running in ${process.env.NODE_ENV} mode 🏃‍♂️`)
 