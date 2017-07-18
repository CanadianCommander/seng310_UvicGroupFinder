var express = require('express');
var router = express.Router();
let database = require('../util').database;
let remove_random = require('../util').remove_random;

/* GET home page. */
router.get('/', function(req, res, next) {

  if(req.cookies.user_id !== undefined){
    // we should have DB data about groups
    database.serialize(() => {
      database.run("CREATE TABLE IF NOT EXISTS group_table (user_id VARCHAR(20), group_name VARCHAR(200), student_name VARCHAR(200))");
      database.all("SELECT * FROM group_table WHERE user_id = (?)", req.cookies.user_id,
        (err, rows) => {
          if (rows.length === 0){
            console.log("failed to find save state for id: " + req.cookies.user_id + " in DataBase");
            default_render(res, req);
          }
          else {
            group_lists = {};
            unassigned_list = [];
            for (let i =0; i < rows.length; i++){
              if (rows[i]['group_name'] === "xy_unassigned_42"){
                // in student list
                unassigned_list.push({name: rows[i]['student_name']});
              }
              else{
                // in group
                let group_name = rows[i]['group_name'];
                if (group_name in group_lists) {
                  group_lists[group_name].students.push(rows[i]['student_name']);
                }
                else{
                  group_lists[group_name] = {name: remove_random(group_name), students: [rows[i]['student_name']]};
                }
              }
            }
          database_render(res, req, group_lists,unassigned_list)
          }
        });
    });
  }
  else {
    // no db data just send back default
    default_render(res,req);
  }
});


function database_render(res, req, group_lst, unassigned_lst){

  //remove any null student names (this happens when group is empty)
  for (let key in group_lst){
    if(group_lst.hasOwnProperty(key)) {
      group_lst[key].students = group_lst[key].students.filter((x) => x !== null);
    }
  }
  unassigned_lst = unassigned_lst.filter((x) => x.name !== null);

  res.render('index', {
    groups: group_lst,
    students: unassigned_lst,
    project: req.query.name
  });
}


function default_render(res, req){
  res.render('index', {
    groups: [{name: "First Group", students: []},
      {name: "Second Group",       students: []},
      {name: "Third Group",        students: []},
      {name: "Forth Group",        students: []},
      {name: "Fifth Group",        students: []}],
    students: [{name: "Joe"},
      {name: "Benjamin"},
      {name: "Saja"},
      {name: "Kyle"},
      {name: "Andrew"},
      {name: "D J Trump"}],
    project: req.query.name
  });
}

module.exports = router;
