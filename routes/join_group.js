/**
 * Created by bbenetti on 2017-07-16.
 */
let express = require('express');
let router = express.Router();

router.get("", (req, res, next) => {
  res.status(200).render('join_group',
    {groups:[{name: "Team 5", students:["Jill","Jack","Mr Bean"]},
      {name: "Frying Plan", students:["Grumpy Cat", "Boomerang Cat", "Piano Cat"]}]});
});

module.exports = router;