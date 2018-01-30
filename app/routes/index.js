let express = require('express');
let router = express.Router();
let util = require('../modules/util');
let steem = require('../modules/steemconnect')

/* GET home page. */
router.get('/login', (req, res, next) =>  {
  if(req.session.steemconnect){
    res.redirect(`/`)
  } else {
    res.render('index', { title: 'SteemConnect Comments' });
  }
});

router.get('/thread/:tag/:author/:permlink?', (req, res, next) => {
      let tag = req.params.tag
      let author = req.params.author
      let permlink = req.params.permlink
      let url = `${tag}/${author}/${permlink}`
      console.log('')
      res.render('thread', {
        thread: url
      });
});
router.post('/vote/:author/:permlink/:weight', (req, res, next) => {
    if(util.isAuthenticated) {
      let voter;
      steem.me((err, steemResponse) => {
        voter =  steemResponse.account.name;
        console.log(voter)
        let author = req.params.author
        let permlink = req.params.permlink
        let weight = parseInt(req.params.weight) * 100
        steem.vote(voter, author, permlink, weight, function (err, steemResponse) {
          if (err) {
            console.log(err)
            res.json({ error: err.error_description })
          } else {
            res.json({ status: 'success' })
          }
        })
      });
  } else {
    res.json({
      status: 'fail',
      message: 'Please Log In'
   })
  }

});

// router.post('/vote/:author/:permlink/:weight', util.isAuthenticated, (req, res) => {
//     // let postId = req.body.postId
//     let voter = req.session.steemconnect.name
//     let author = req.params.author
//     let permlink = req.params.permlink
//     let weight = req.params.weight
//     console.log(voter, author, permlink, weight)
//     steem.vote(voter, author, permlink, weight, function (err, steemResponse) {
//       if (err) {
//         console.log(err)
//           res.json({ error: err.error_description })
//       } else {
//         console.log('success')
//           res.json({ id: '1' })
//       }
//     });
// })

module.exports = router;
