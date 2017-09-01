#!/usr/bin/env node

var debug = require('debug')('rate')
var argv = process.argv;
argv.shift();

var file_path = __dirname;
var current_path = process.cwd();

var cfg_file = argv[1] || current_path + "/config.json"
debug(cfg_file)

var cfg = require(cfg_file)

debug(cfg)

var Redis = require('ioredis');
var key = cfg.key
var all_count = cfg.count
var connections = cfg.conn
var count = all_count / connections.length 

console.log(count)

for(var i in connections) {
    var conn = connections[i]
    debug(conn)

    var redis = new Redis(conn);

    redis.mset('enable',1, 'url','https://cnodejs.org/')
}
