var express = require('express');
var router = express.Router();
const model = require('../models/model.js')

router.get('/:postId', async function(req, res, next) {
    let post = await model.getPost(req.params.postId);
    if (post) {
        res.render('post', { title: 'Post', post: post });
    } else {
        res.end('404 not found');
    }
});

module.exports = router;