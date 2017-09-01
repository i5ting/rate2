var Redis = require('ioredis');

var redis = new Redis();

// redis.lpush('list', [1,2,3,4,5,6])

// redis.lrange('list', 0 , 100)

// redis.blpop('list', 100).then(function(a){
//     console.log(a)
// })

redis.mset('enable',1, 'url','https://cnodejs.org/')


redis.mget('enable','url').then(function(a) {
    console.log(a)
})
