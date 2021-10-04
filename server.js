const express = require('express')
const app = express()
const port = 8080
const host = '0.0.0.0'

app.get('/', function (req, res) {
    res.send('GET')
})

app.post('/subscription/webhook', function (req, res) {
    res.send('POST')
})

app.listen(port, host);

module.exports = app;
