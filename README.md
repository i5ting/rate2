


## 准备

```
redis-server --port 6378
redis-server --port 6379
```

## test

```
// redis.lpush('list', [1,2,3,4,5,6])

// redis.lrange('list', 0 , 100)

// redis.blpop('list', 100).then(function(a){
//     console.log(a)
// })

```