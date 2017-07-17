/**
 * Created by bbenetti on 2017-07-15.
 */
let express = require('express');
let router = express.Router();

router.get('/create', function (req, res, next ){
  res.render('project_creation_page');
});
router.get('/select', function (req, res, next ){
  res.render('project_select_page',
    {projects: [
      {name: "SENG 310 Main Project"},
      {name: "Friday Slides Project"},
      {name: "Lab Mini Project"}
    ]}
  );
});

module.exports = router;