const express = require('express')
const app = express()
const path = require('path')
const bodyParser = require("body-parser")

server = app.listen(80, () => {
    console.log('Server started at http://localhost')
})

app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, '/_static')));
app.get('/:page', (req, res, next) => {
    res.sendFile(path.join(__dirname, '/_static/' + req.params.page + '.html'))
})
app.get('/*', (req, res, next) => {
    res.sendFile(path.join(__dirname, '/_static/index.html'))
})