var express = require('express');
var router = express.Router();
const model = require('../models/model.js')

router.post('/insert', async function(req, res, next) {
    let author = req.body.author;
    let content = req.body.content;
    let level = req.body.level;
    let parentId = req.body.parentId;

    if (level == 0) {
        model.insertPost(author, content);
    } else if (level == 1) {
        model.insertComment(author, content, parentId);
    } else {
        model.insertReply(author, content, parentId, level)
    }
    res.end('ok');
});

router.post('/delete', async function(req, res, next) {
    let level = req.body.level;
    let id = req.body.id;

    if (level == 0) {
        model.deletePost(id);
    } else if (level == 1) {
        model.deleteComment(id);
    } else {
        model.deleteReply(id, level);
    }
    res.end('ok');
});

router.post('/edit', async function(req, res, next) {
    let level = req.body.level;
    let id = req.body.id;
    let content = req.body.content;

    if (level == 0) {
        model.editPost(id, content);
    } else if (level == 1) {
        model.editComment(id, content);
    } else {
        model.editReply(id, level, content);
    }
    res.end('ok');
});

module.exports = router;