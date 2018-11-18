let express = require('express');
let router = express.Router();
let User = require('../models/User');
let Password = require('../models/Password');
const crypto = require('crypto');

let responseData;

router.use((res,req,next)=>{
    responseData = {
        code:0,
        msg:''
    };
    next();
});

router.post('/user/register',(req,res,next)=>{
    let username = req.body.username;
    let password = req.body.password;
    let repassword = req.body.repassword;
    //用户名不为空
    if(username === ''){
        responseData.code = 1;
        responseData.msg = '用户名不能为空';
        res.json(responseData);
        return;
    }
    //密码不为空
    if( password === ''){
        responseData.code = 2;
        responseData.msg = '密码不能为空';
        res.json(responseData);
        return;
    }
    //两次密码一致
    if(password !== repassword){
        responseData.code = 3;
        responseData.msg = '两次密码必须一致!';
        res.json(responseData);
        return;
    }
    //用户名是否已存在
    User.findOne({
        username:username
    }).then((userInfo)=>{
        if(userInfo){
            responseData.code = 4;
            responseData.msg = '用户名已存在';
            res.json(responseData);
            return;
        }
        password = crypto.createHmac('sha256', password)
            .update('juju')
            .digest('hex');
        let psd = new Password({
            username:username,
            password:password
        });
        let user =new User({
           username
        });
        psd.save().then(()=>{
            return user.save();
        });
    }).then((newUserInfo)=>{
        console.log(newUserInfo);
        responseData.msg = '注册成功';
        res.json(responseData);
    });
});
router.post('/user/login',(req,res,next)=>{
    let username = req.body.username;
    let password = req.body.password;
    let id;
    if(username === ''|| password === ''){
        responseData.code = 1;
        responseData.msg = '用户名或密码不能为空';
        res.json(responseData);
        return;
    }
    password = crypto.createHmac('sha256', password)
        .update('juju')
        .digest('hex');
    Password.findOne({
        username:username,
        password:password
    }).then((rs)=>{
        if(!rs){
            responseData.code = 2;
            responseData.msg = '用户名不存在或密码错误';
            res.json(responseData);
            return
        }
        responseData.msg = '登录成功';
        User.findOne({
            username:username
        }).then((userInfo)=>{
            responseData.userInfo={
                _id:userInfo._id,
                username:userInfo.username
            };
            req.session.userInfo = {
                _id:userInfo._id
            };
            res.json(responseData);
            return 0;
        })
    })
});
router.get('/user/logout',(req,res,)=>{
    req.session.userInfo = null;
    res.json(responseData);
});

module.exports = router;