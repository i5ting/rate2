var Redis = require('ioredis');
var debug = require('debug')('rate2')

module.exports = function (cfg) {
    var all_count = cfg.count
    var config = cfg.conn
    var key = cfg.rate_key
    var enable_key = cfg.enable_key
    var disable_redirect_url_key = enable_key + '_url'
    var redirect_url = cfg.redirect_url
    var count = all_count / cfg.conn.length

    var redisClient = []

    for (var i in config) {
        var conn = config[i]
        console.log(conn)

        var redis = new Redis(conn);
        redisClient.push(redis)
    }

    var n_requrest = 0 // 请求总数
    var m_redis = redisClient.length // redis个数

    return {
        disable: function (url) {
            var all_count = cfg.count
            var connections = cfg.conn
            var count = all_count / connections.length

            console.log(count)

            for (var i in connections) {
                var conn = connections[i]
                debug(conn)

                var redis = new Redis(conn);

                redis.mset(enable_key, 0, disable_redirect_url_key, url)
            }
            // 断开redis连接
        },
        enable: function () {
            var all_count = cfg.count
            var connections = cfg.conn
            var count = all_count / connections.length

            // console.log(count)

            for (var i in connections) {
                var conn = connections[i]
                debug(conn)

                var redis = new Redis(conn);

                redis.mset(enable_key, 1, disable_redirect_url_key, '')
            }

            // 断开redis连接
        },
        makeData: function () {
            var all_count = cfg.count
            var connections = cfg.conn
            var count = all_count / connections.length

            for (var i in connections) {
                var conn = connections[i]
                debug(conn)

                var redis = new Redis(conn);

                var arr = []
                for (var j = 1; j <= count; j++) {
                    arr.push(j)
                }

                redis.lpush(key, arr).then(function (result) {
                    console.log('done = ' + result)
                    // 断开redis连接
                })
            }

        },
        express: function (req, res, next) {
            n_requrest++;

            var i_redis = n_requrest % m_redis;

            var c_client = redisClient[i_redis] //获取第i个redis连接
            var conn = config[i_redis]
            console.log(conn)

            c_client.mget(enable_key, disable_redirect_url_key).then(function (result) {
                console.log('check if enable ' + result)
                if (parseInt(result[0]) == 1) {
                    console.log('rate now')
                    rate()
                } else {
                    redirect_url = result[1]
                    // res.redirect(result[1])
                    // 重定向
                    res.redirect(redirect_url)
                }
            })

            function rate() {
                c_client.exists(key).then(function (isKeyExists) {
                    console.log("isKeyExists = " + isKeyExists)
                    if (isKeyExists === 1) {
                        // 如果存在，则blpop
                        c_client.blpop(key, 100).then(function (res) {
                            console.log(conn + " - " + res)
                            next()
                        }).catch(function (err) {
                            console.log(err)
                            next()
                        })
                    } else {
                        // 重定向
                        res.redirect(redirect_url)
                    }
                })
            }
        },
        koa: function (ctx, next) {
            n_requrest++;

            var i_redis = n_requrest % m_redis;

            var c_client = redisClient[i_redis] //获取第i个redis连接
            var conn = config[i_redis]
            console.log(conn)

            return new Promise(function(resolve, reject) {
                return c_client.mget(enable_key, disable_redirect_url_key).then(function (result) {
                    console.log('check if enable ' + result)
                    if (parseInt(result[0]) == 1) {
                        console.log('rate now')
                        rate()
                    } else {
                        // ctx.redirect(result[1])v
                        var err = new Error("some error")
                        err.url = result[1]
                        reject(err)
                    }
                })
    
                function rate() {
                    return c_client.exists(key).then(function (isKeyExists) {
                        console.log("isKeyExists = " + isKeyExists)
                        if (isKeyExists === 1) {
                            // 如果存在，则blpop
                            c_client.blpop(key, 100).then(function (res) {
                                console.log(conn + " - " + res)
                                return resolve()
                            }).catch(function (err) {
                                console.log(err)
                                return resolve()
                            })
                        } else {
                            // 重定向
                            var err = new Error("some error")
                            err.url = redirect_url
                            reject(err)
                        }
                    })
                }
            }).then(function() {
                return next()
            }).catch(function(err){
                ctx.redirect(err.url)
            })
            
        }

    }

}
