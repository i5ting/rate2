
# rate2

express 限流器

![](flow.png)

## Install

```
$ npm i -S rate2
```

## Usages

```
const express = require('express')
const app = express();

var rate = require('rate2')(require('./config'))

var i = 0

app.get('/', rate, function (req, res) {
    i++
    res.json({ count: i });
});

app.listen(3000)
```

## 配置项

```
{
    "key": "rate_list7",
    "count": 10,
    "conn": [
      {
        "port": 6379,
        "host": "127.0.0.1",
        "family": 4,
        "password": "",
        "db": 0
      },
      {
        "port": 6378,
        "host": "127.0.0.1",
        "family": 4,
        "password": "",
        "db": 0
      }
    ],
    "redirect_url": "https://www.baidu.com/"
  }
```

## 测试

1）准备

```
redis-server --port 6378
redis-server --port 6379
```

2）增加redis里的数据

默认按照当前目录的config.js，向2台redis服务器里增加10条数据，每个服务器5条

```
$ npm run bin
```

3）启动express服务器

```
$ node app
```

此时访问 http://127.0.0.1:3000 地址，头10次是正常访问，之后的都会被重定向。

## redis基础操作

```
// redis.lpush('list', [1,2,3,4,5,6])

// redis.lrange('list', 0 , 100)

// redis.blpop('list', 100).then(function(a){
//     console.log(a)
// })

```


## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request

## 版本历史

- v1.0.0 初始化版本cli

## 欢迎fork和反馈

- write by `i5ting` i5ting@126.com

如有建议或意见，请在issue提问或邮件

## License

this repo is released under the [MIT
License](http://www.opensource.org/licenses/MIT).
