var Redis = require('ioredis');


var all_count = require('./config').count
var config = require('./config').conn
var key = require('./config').key
var redirect_url = require('./config').redirect_url

var redisClient = []

var count = all_count / config.length 
for(var i in config) {
    var conn = config[i].split(':')
    console.log(conn)

    var redis = new Redis(conn[1], conn[0]);
    redisClient.push(redis)
} 

var n_requrest = 0;//请求总数
var m_redis = redisClient.length;// redis个数

function deleteOne (arr, item) {
    arr.splice(
        arr.indexOf(item), 1
    )
    return arr 
}

module.exports = function(req, res, next) {
    var i_redis = n_requrest%m_redis;

    var c_client = redisClient[i_redis] //获取第i个redis连接

    c_client.exists(key).then(function(isKeyExists){
        if (isKeyExists === 1) {
            // 如果存在，则blpop
            c_client.blpop(key, 100).then(function(res){
                console.log(res)
                next()
            }).catch(function(err) {
                next()
            })
        }else {
            // 如果key不存在，则移除redis链接
            deleteOne(redisClient, c_client)

            // 重定向
            res.redirect(redirect_url)
        }
    })
}
