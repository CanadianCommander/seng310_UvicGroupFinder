/**
 * Created by bbenetti on 2017-07-11.
 */
let express = require('express');
let router = express.Router();
let database = require('../util').database;

router.post('/save_groups', function(req, res, next)
{// save groups (formatted as JSON) to DB
  database.serialize(function () {
    const u_id = req.body['user_id'];
    database.run("CREATE TABLE IF NOT EXISTS group_table (user_id VARCHAR(20), group_name VARCHAR(200), student_name VARCHAR(200))");
    database.run("DELETE FROM group_table WHERE user_id = (?)", u_id);
    for (let key in req.body){
      if (req.body.hasOwnProperty(key)) {
        if (key.indexOf("user_id") === -1) {
          if (req.body[key].length !== 0) {
            for (let z = 0; z < req.body[key].length; z++) {
              database.run("INSERT INTO group_table VALUES ((?), (?), (?))", u_id, key, req.body[key][z]);
            }
          }
          else {
            database.run("INSERT INTO group_table VALUES ((?), (?), NULL)", u_id, key);
          }
        }
      }
    }
  });
  res.status(200).send();

});

router.post('/*', function(req, res, next)
{
  console.log(req.body);
  res.status(404).send();
});

module.exports = router;