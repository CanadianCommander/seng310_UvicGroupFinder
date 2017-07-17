

function close_db(){
  module.exports.database.close();
}

let sqlite3 = require('sqlite3');
module.exports.database = new sqlite3.Database(':memory:');
module.exports.close_database= close_db;


// remove random append string from text
function remove_random(text){
  return text.replace(/_+[\d.]+$/, "");
}
module.exports.remove_random = remove_random;


// fill DB with fake data for testing
function populate_database(){
  let file_system = require('fs');
  file_system.readFile( __dirname + "/fake_data.json", function(error, data) {
    if(!error){
      module.exports.database.serialize( () => {
        module.exports.database.run("CREATE TABLE IF NOT EXISTS student_info (first_name VARCHAR(100), last_name VARCHAR(100)" +
          ", about VARCHAR(10000), program VARCHAR(100), year INTEGER,  gender VARCHAR(10));");
        let js_data = JSON.parse(data);
        for(let i =0; i < js_data.students.length; i ++) {
          let student = js_data.students[i];
          module.exports.database.run("INSERT INTO student_info VALUES ((?), (?), (?), (?), (?), (?) )",
            student.first_name, student.last_name, student.about, student.program, student.year, student.gender);
        }
      });
    }
    else{
      throw error;
    }
  });
}
populate_database();