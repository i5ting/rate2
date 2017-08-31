var Redis = require('ioredis');

var all_count = require('./config').count

// redis.lpush('list', [1,2,3,4,5,6])

// redis.lrange('list', 0 , 100)

// redis.blpop('list', 100).then(function(a){
//     console.log(a)
// })

var config = require('./config').conn

var count = all_count / config.length 
for(var i in config) {
    var conn = config[i].split(':')
    console.log(conn)

    var redis = new Redis(conn[1], conn[0]);

    var arr = []
    for (var j = 1 ; i <= count; i++) {
        arr.push(i)
    }

    redis.lpush('list', arr)
} 