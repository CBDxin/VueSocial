let ChatContent = require('../models/ChatContent');
let ChatRelation = require('../models/ChatRelation');
let express = require('express');
let router = express.Router();

router.post('/chatwith', (req, res) => {
    let chatWith = req.body.chatWithId;
    let user_id = req.body.user_id;
    let content = req.body.content;
    if (chatWith == user_id){
        new ChatContent({
            chatWith: chatWith,
            user_id: user_id,
            content: content,
            unread:false
        }).save().then((newContent) => {
            ChatRelation.findOne({
                $or:[{
                    userA:user_id,
                    userB:chatWith
                },{
                    userB:user_id,
                    userA:chatWith
                }]
            }).then((rs)=>{
                if (rs){
                    let chatContent = rs.chatContent;
                    chatContent.unshift(newContent._id);
                    ChatRelation.update({
                        _id:rs.id
                    },{
                        chatContent:chatContent
                    }).then(()=>{
                        res.json({
                            code:0,
                            data:newContent
                        })
                    })
                }else {
                    new ChatRelation({
                        userA:user_id,
                        userB:chatWith,
                        chatContent:[{newContent}]
                    }).then(()=>{
                        res.json({
                            code:0,
                            data:newContent
                        })
                    })
                }
            })

        })
    }
    new ChatContent({
        chatWith: chatWith,
        user_id: user_id,
        content: content
    }).save().then((newContent) => {
        ChatRelation.findOne({
            $or:[{
                userA:user_id,
                userB:chatWith
            },{
                userB:user_id,
                userA:chatWith
            }]
        }).then((rs)=>{
            if (rs){
                let chatContent = rs.chatContent;
                chatContent.unshift(newContent._id);
                ChatRelation.update({
                    _id:rs.id
                },{
                    chatContent:chatContent
                }).then(()=>{
                    res.json({
                        code:0,
                        data:newContent
                    })
                })
            }else {
                new ChatRelation({
                    userA:user_id,
                    userB:chatWith,
                    chatContent:[newContent._id]
                }).save().then(()=>{
                    res.json({
                        code:0,
                        data:newContent
                    })
                })
            }
        })
    })

});
router.post('/clearchatunread', (req, res) => {
    let from = req.body.from;
    let to = req.body.to;
    ChatContent.update({
        user_id: to,
        chatWith: from,
        unread: true
    },{
        unread: false
    }, {multi: true}).then((rs) => {
        res.json();
    })
});
router.get('/chatwith', (req, res) => {
    let user_id = req.query.user_id;
    let chatWith = req.query.chatWith;
    ChatRelation.findOne({
        $or: [{
            userA: user_id,
            userB: chatWith
        }, {
            userB: user_id,
            userA: chatWith
        }]
    }).populate(['chatContent',
        {
            path: 'chatContent',
            populate: {path: 'chatWith'}
        }, {
            path: 'chatContent',
            populate: {path: 'user_id'}
        }]).then((rs) => {
        if (rs) {
            res.json({
                code: 0,
                chatList: rs.chatContent
            })
        } else {
            res.json({
                code: 1,
                msg: '暂无聊天记录'
            })
        }
    })
});
router.get('/chatlist', (req, res) => {
    let user_id = req.query.user_id;
    ChatRelation.find({
        $or: [{
            userA: user_id,
        }, {
            userB: user_id,
        }]
    }).populate(['chatContent',
        {
            path: 'chatContent',
            populate: {path: 'chatWith'}
        }, {
            path: 'chatContent',
            populate: {path: 'user_id'}
        }]).then((chatList) => {
        let list = [];
        chatList.forEach(item => {
            let data = {
                chatWith: '',
                addTime: '',
                content: '',
                unread: 0
            };
            if (item.chatContent[0].chatWith._id == user_id) {
                data.chatWith = item.chatContent[0].user_id
            } else {
                data.chatWith = item.chatContent[0].chatWith
            }
            data.addTime = item.chatContent[0].addTime;
            data.content = item.chatContent[0].content;
            item.chatContent.forEach(item => {
                if (item.unread && item.chatWith._id == user_id) {
                    data.unread++;
                }
            });
            list.push(data)
        });
        list.sort((a, b) => {
            return b.addTime - a.addTime
        });
        res.json({
            code: 0,
            chatList: list
        })
    })
});

module.exports = router;