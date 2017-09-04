const Koa = require('koa');
const app = new Koa();

var rate = require('.')(require('./config'))
var i = 0
app.use(rate.koa)

app.use(function (ctx, next) {
    i++
    console.log({ count: i })
    return ctx.body = { count: i };
});

app.listen(3000)