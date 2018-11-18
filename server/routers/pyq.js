let Pyq = require('../models/Pyq');
let express = require('express');
let router = express.Router();

router.post('/delpyq', (req, res) => {
    let id = req.body.id;
    Pyq.findOne({
        _id: id
    }).then((pyq) => {
        if (pyq.comments.length == 0) {
            Pyq.remove({
                _id: id
            }).then(() => {
                res.json({
                    code: 0,
                    msg: '删除成功'
                });
                return;
            })
        } else {
            let i = 0;
            pyq.comments.forEach((item) => {
                Comment.remove({
                    _id: item
                }).then(() => {
                    i++;
                    if (i == pyq.comments.length) {
                        Pyq.remove({
                            _id: id
                        }).then(() => {
                            res.json({
                                code: 0,
                                msg: '删除成功'
                            });
                            return 0;
                        })
                    }
                })
            })
        }
    })
});
router.get('/', (req, res) => {
    let userInfo = req.userInfo;
    Pyq.find().sort({_id: -1}).populate(['writer', 'comments']).then((data) => {
        res.json({
            code:0,
            userInfo,
            data
        });
        return 0;
    })
});
router.get('/tPyqList',(req,res)=>{
   let writer = req.query.id;
    Pyq.find({
            writer
        }).sort({_id: -1}).populate(['writer', 'comments']).then((data) => {
            res.json(data);
            return 0;
    })
});

module.exports = router;