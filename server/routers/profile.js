let User = require('../models/User');
let Password = require('../models/Password');
let express = require('express');
let router = express.Router();

router.get('/', (req, res) => {
    let userInfo = req.userInfo;
    res.json({
        code:0,
        userInfo
    });
    return 0;
});
router.post('/un', (req, res) => {
    let newusername = req.body.newusername;
    let oldusername = req.body.oldusername;
    if (newusername === '') {
        res.json({
            code: 2,
            msg:'用户名不能为空'
        });
        return;
    }
    if (newusername === oldusername) {
        res.json({
            code:0,
            msg:'修改成功'
        });
        return;
    }
    User.findOne({
        username: oldusername
    }).then((rs) => {
        if (!rs) {
            res.json({
                code:1,
                msg:'你揍凯'
            });
            return 0;
        } else {
            User.findOne({
                username: newusername
            }).then((rs) => {
                if (rs) {
                    res.json({
                        code:2,
                        msg:'已经有人用了，换一个吧╮(╯▽╰)╭'
                    });
                    return 0;
                } else {
                    User.update({
                        username: oldusername
                    }, {
                        username: newusername
                    }).then(() => {
                        Password.update({
                            username: oldusername
                        }, {
                            username: newusername
                        }).then(()=>{
                            res.json({
                                code:0,
                                msg:'修改成功！'
                            });
                        });
                        return 0;
                    })
                }
            })
        }
    })
});
router.post('/us', (req, res) => {
    let newval = req.body.newval;
    let username = req.body.username;
    User.findOne({
        username: username
    }).then((rs) => {
        if (!rs) {
            res.json({
                code:1,
                msg:"你周凯！"
            });
            return 0;
        } else {
            User.update({
                username: username
            }, {
                signature: newval
            }).then(() => {
                res.json({
                    code:0,
                    msg: '修改成功'
                });
                return 0;
            })
        }
    })
});
router.get('/userInfo',(req,res)=>{
   let username = req.query.name;
   User.findOne({
       username
   }).then((userInfo)=>{
       if (userInfo){
           res.json(userInfo)
       }
   })
});

module.exports = router;