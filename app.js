const express = require('express')
const app = express();

var rate = require('.')(require('./config'))

var i = 0

app.get('/', rate.express, function (req, res) {
    i++
    res.json({ count: i });
});

app.listen(3000)