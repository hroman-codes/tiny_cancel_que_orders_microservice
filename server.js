const express = require('express')
const app = express()
const port = 3000

app.get('/', function (req, res) {
    res.send('GET')
})

app.post('/', function (req, res) {
    res.send('POST')
})

app.put('/user', function (req, res) {
    res.send('PUT')
})

app.delete('/user', function (req, res) {
    res.send('DELETE')
})

app.listen(port, () => {
    console.log(`Listen to port${port}`)
})

module.exports = app;
