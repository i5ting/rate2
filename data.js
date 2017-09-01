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

var rate = require('.')(cfg)

rate.makeData()