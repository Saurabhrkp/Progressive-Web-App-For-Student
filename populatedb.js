#! /usr/bin/env node

console.log(
  'This script populates required types to your database. Specified database as argument - e.g.: populatedb mongodb+srv://user:password@cluster0-mbdj7.mongodb.net/studentPWA?retryWrites=true'
);

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async');
var Type = require('./models/type');

var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var types = [];

function typeCreate(_id, name, cb) {
  var type = new Type({ _id: _id, name: name });
  type.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Type: ' + type);
    types.push(type);
    cb(null, type);
  });
}

function createTypes(cb) {
  async.series(
    [
      function (callback) {
        typeCreate('5cb2db77ef58e46ad681be94', 'Document', callback);
      },
      function (callback) {
        typeCreate('5cb2db55ef58e46ad681be7e', 'Notices', callback);
      },
    ],
    // optional callback
    cb
  );
}

async.series(
  [createTypes],
  // Optional callback
  function (err, results) {
    if (err) {
      console.log('FINAL ERR: ' + err);
    } else {
      console.log('Created Records:\n' + types);
    }
    // All done, disconnect from database
    mongoose.connection.close();
  }
);
