var express = require('express');
var router = express.Router();
const model = require('../models/model.js')

router.get('/:page', async function(req, res, next) {
    let page = req.params.page || 1;
    let numOfPage = await model.getNumOfPage();
    if (page < 0 || page > numOfPage) {
        res.end('404 not found');
    } else {
        res.render('index', { title: 'Home', page: page, postArr: await model.getPostsOfPage(page), numOfPage: numOfPage });
    }
});

router.get('/', function(req, res, next) {
    res.redirect('/1');
});

module.exports = router;