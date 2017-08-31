const express = require('express')
const app = express();

var rate = require('.')(require('./config'))

var i = 0

app.get('/', rate, function (req, res) {
    i++
    res.status(200).json({ count: i });
});

app.listen(3000)