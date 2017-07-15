/**
 * Created by bbenetti on 2017-07-14.
 */
let express = require('express');
let router = express.Router();
let database = require('../util').database;


router.get("/1", function (req, res, next){
    res.status(200).render("pop_overs/pop_over_1", {target: req.query.target});
});


module.exports = router;