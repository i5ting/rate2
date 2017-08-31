#!/usr/bin/env node

var debug = require('debug')('rate')
var argv = process.argv;
argv.shift();

var file_path = __dirname;
var current_path = process.cwd();

var cfg_file = argv[1] || current_path + "/config.json"
console.log(cfg_file)

var cfg = require(cfg_file)

console.log(cfg)

var Redis = require('ioredis');

var all_count = cfg.count
var connections = cfg.conn
var count = all_count / connections.length 

for(var i in connections) {
    var conn = connections[i].split(':')
    console.log(conn)

    var redis = new Redis(conn[1], conn[0]);

    var arr = []
    for (var j = 1 ; i <= count; i++) {
        arr.push(i)
    }

    redis.lpush('list', arr).then(function(result){
        console.log('done = ' + result)
    })
} 