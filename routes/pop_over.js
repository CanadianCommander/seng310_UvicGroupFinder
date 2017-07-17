/**
 * Created by bbenetti on 2017-07-14.
 */
let express = require('express');
let router = express.Router();
let database = require('../util').database;


router.get("/1", function (req, res, next){
    // get data for target from db
    database.get("SELECT * FROM student_info WHERE first_name = (?);",req.query.target, (err, row) => {
      if(err || !row){
        console.error("TABLE: student_info does not contain an entry for: " + req.query.target);
        res.status(200).render("pop_overs/pop_over_1",{first_name: req.query.target});
        return;
      }

      res.status(200).render("pop_overs/pop_over_1", {first_name: req.query.target,
                                                      last_name: row.last_name,
                                                      about: row.about,
                                                      program: row.program,
                                                      year: row.year,
                                                      gender: row.gender});
    });
});


module.exports = router;