let User = require('../models/User');
let Comment = require('../models/Comment');
let Pyq = require('../models/Pyq');
let express = require('express');
let router = express.Router();

router.post('/', (req, res) => {
    let content = req.body.content;
    let from = req.body.from;
    let to = req.body.to || '';
    let pyqId = req.body.pyq;
    let writer = req.body.writer;
    new Comment({
        content: content,
        from: from,
        to: to,
        pyq: pyqId,
        writer: writer
    }).save().then((rs) => {
        Pyq.findOne({
            _id: pyqId
        }).then((result) => {
            let comments = result.comments;
            comments.push(rs._id);
            Pyq.update({
                _id: pyqId
            }, {
                comments: comments
            }).then(() => {
                res.json({
                    code: 0,
                    msg: '评论成功'
                })
            })
        })
    })
});
router.get('/getcom', (req, res) => {
    function sorttime(a, b) {
        return new Date(a.addTime) - new Date(b.addTime);
    }
    let username = req.query.username;
    Comment.find({
        $or: [{
                from: {$ne: username},
                to: username
            },
            {
                from: {$ne: username},
                writer: username
            }]
    }).populate(['pyq']).sort({_id: -1}).then((com) => {
        let i = 0;
        let rs = [];
        com.forEach((item) => {
            let temp = {
                addTime: item.addTime,
                from: item.from,
                content: item.content,
                writer: item.writer,
                to: item.toString,
                pyq: '',
                footerimg: '',
                headerimg: '',
                pyqid: item.pyq
            };
            Pyq.findOne({
                _id: item.pyq
            }).populate(['writer']).then((pyq) => {
                temp.pyq = pyq.content;
                if (pyq.pimg.length) {
                    temp.footerimg = pyq.pimg[0]
                } else {
                    temp.footerimg = pyq.writer.avater
                }
                User.findOne({
                    username: item.from
                }).then((user) => {
                    temp.headerimg = user.avater;
                    rs.push(temp);
                    i++;
                    if (i === com.length) {
                        rs = rs.sort(sorttime);
                        res.json({
                            code: 0,
                            com: rs
                        })
                    }
                })
            })
        })
    })
});
router.get('/clearcomunread', (req, res) => {
    let username = req.query.username;
    Comment.update(
        {to: username},
        {toisn: false},
        {multi: true}
    ).then(() => {
        Comment.update(
            {writer: username},
            {isn: false},
            {multi: true}
        ).then(() => {
            res.json({
                code: 0
            })
        })
    })
});
router.get('/getmsg', (req, res) => {
    let username = req.query.username;
    Comment.find({
        $or: [{
            from: {$ne: username},
            to: username,
            toisn: true
        },
            {
                from: {$ne: username},
                writer: username,
                isn: true,
            }]
    }).then((rs) => {
        res.json({
            code: 0,
            result: rs
        })
    })
});

module.exports = router;