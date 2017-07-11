var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {groups: [{name: "First Group"},
    {name: "Second Group"},
    {name: "Third Group"},
    {name: "Forth Group"},
    {name: "Fifth Group"}],
    students:[{name:"Joe"},
      {name: "Jon"},
      {name: "Sally"},
      {name: "Bill Bird"},
      {name: "Mr Bean"},
      {name: "D J Trump"}]});
});

module.exports = router;
