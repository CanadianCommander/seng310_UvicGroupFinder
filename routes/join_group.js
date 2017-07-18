/**
 * Created by bbenetti on 2017-07-16.
 */
let express = require('express');
let router = express.Router();

router.get("", (req, res, next) => {

  if (req.query.foo) {
    res.status(200).render('join_group',
      {
        groups: [{name: "Team 5", students: ["Jill", "Jack", "Mr Bean", "Genny","User:0.21578932"], high_lite: true},
          {name: "Frying Plan", students: ["Grumpy Cat", "Boomerang Cat", "Piano Cat"]}],
        project: req.query.name,
        remove_plus: true
      });
  }
  else{
    res.status(200).render('join_group',
      {
        groups: [{name: "Team 5", students: ["Jill", "Jack", "Mr Bean", "Genny","User:0.21578932"]},
          {name: "Frying Plan", students: ["Grumpy Cat", "Boomerang Cat", "Piano Cat"]}],
        project: req.query.name,
        remove_plus: false
      });
  }
});

module.exports = router;