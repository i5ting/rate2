var Redis = require('ioredis');


function deleteOne (arr, item) {
    arr.splice(
        arr.indexOf(item), 1
    )
    return arr 
}

module.exports = function(cfg) {

    var all_count = cfg.count
    var config = cfg.conn
    var key = cfg.key
    var redirect_url = cfg.redirect_url

    var redisClient = []
    
    var count = all_count / cfg.conn.length 
    for(var i in config) {
        var conn = config[i].split(':')
        console.log(conn)
    
        var redis = new Redis(conn[1], conn[0]);
        redisClient.push(redis)
    } 
    
    var n_requrest = 0;//请求总数
    var m_redis = redisClient.length;// redis个数
    

    return function(req, res, next) {
    
        n_requrest++;
        var i_redis = n_requrest%m_redis;
    
        var c_client = redisClient[i_redis] //获取第i个redis连接
        var conn = config[i_redis].split(':')
        console.log(conn)
     
    
        c_client.exists(key).then(function(isKeyExists){
            if (isKeyExists === 1) {
                // 如果存在，则blpop
                c_client.blpop(key, 100).then(function(res){
                    console.log(conn + " - " + res)
                    next()
                }).catch(function(err) {
                    next()
                })
            }else {
                // 如果key不存在，则移除redis链接
                // deleteOne(redisClient, c_client)
    
                // 重定向
                res.redirect(redirect_url)
            }
        })
    }
    
}