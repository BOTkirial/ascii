var express = require('express');
var http = require('http');
var path = require('path');
const cheerio = require('cheerio');
require('dotenv').config();

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

function parseData(body) {
    const $ = cheerio.load(body, null, false);
    const tds = $("td");
    const keys = Object.keys(tds);
    let results = [];
    keys.forEach((key, index) => {
        let currentTD = tds[key];
        let value = "";
        if (currentTD.type === "tag") {
            let child = currentTD.children[0];
            if (child.type === "text") {
                // # Weight chg %chg
                value = child.data;
            } else {
                // company / symbol
                if (child.name === "a")
                    value = child.children[0].data;
                // price
                if (child.name === "img")
                    value = child.next.data;
            }
        }
        results.push(value);
    })

    return results
}

// renvoie index.html lorsqu'un user vas sur la route /
app.get('/', (req, res) => {
    res.sendFile(path.resolve('./public/index.html'))
})

app.get('/data', (req, res) => {
    getData('https://www.slickcharts.com/sp500').then(value => {
        res.send(parseData(value))
    })
})

app.get('/api', (req, res) => {
    const search = req.query.search;
    getData("https://api.geoapify.com/v1/geocode/search?text=" + search + "&apiKey=" + process.env.API_KEY).then(value => {
        res.send(JSON.stringify(value));
    })
})

app.use(express.static(path.resolve('./public')));
app.use(express.static(path.resolve('./public/build')));
app.use(express.static(path.resolve('./public/fonts')));
app.use(express.static(path.resolve('./public/models')));

server.listen(process.env.PORT || 5555);