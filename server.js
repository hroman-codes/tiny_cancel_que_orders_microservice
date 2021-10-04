const express = require('express')
const app = express()
const port = 3000

app.get('/', function (req, res) {
    res.send('GET')
})

app.post('/subscription/webhook', function (req, res) {
    res.send('POST')
})

app.listen(port, () => {
    console.log(`Listen to port${port}`)
})

module.exports = app;
