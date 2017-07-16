/**
 * Created by bbenetti on 2017-07-15.
 */
let express = require('express');
let router = express.Router();

router.get('/', function (req, res, next ){
  res.render('project_creation_page');
});


module.exports = router;