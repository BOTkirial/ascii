var express = require('express');
var http = require('http');
var path = require('path');

// crée l'application
var app = express()
// crée le server
var server = http.createServer(app)

async function getData(url) {
    var nodeFetch = await import('node-fetch');
    var fetch = nodeFetch.default;
    var request = await fetch(url);
    var body = await request.text();
    return body
}

// renvoie index.html lorsqu'un user vas sur la route /
app.get('/', (req, res) => {
    res.sendFile(path.resolve('./public/index.html'))
})

app.get('/data', (req, res) => {
    getData('https://www.slickcharts.com/sp500').then(value => res.send(value))
})

app.use(express.static(path.resolve('./public')));
app.use(express.static(path.resolve('./public/build')));
app.use(express.static(path.resolve('./public/fonts')));
app.use(express.static(path.resolve('./public/models')));

server.listen(process.env.PORT || 5555);