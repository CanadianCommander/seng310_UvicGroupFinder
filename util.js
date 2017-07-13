

function close_db(){
  module.exports.database.close();
}

let sqlite3 = require('sqlite3');
module.exports.database = new sqlite3.Database(':memory:');
module.exports.close_database= close_db;
