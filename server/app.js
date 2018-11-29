//第三方插件
let express = require('express');
let mongoose = require('mongoose');
let bodyParser = require('body-parser');
let path = require('path');
let session = require('express-session');
let socketio = require('socket.io');
let socketHandler = require('./socket'); //socket要实现的具体逻

let User = require('./models/User');
let Idtoid =require('./models/Idtoid');


let app = express();

app.use(bodyParser.json({limit: '50mb'}));//限制文件大小
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(session({
    secret: 'secret', // 对session id 相关的cookie 进行签名
    resave: true,
    saveUninitialized: false, // 是否保存未初始化的会话
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 设置 session 的有效时间，单位毫秒
    }
}));
app.use('/public', express.static(__dirname + '/public'));//设置静态资源

//设置登录用户的session
app.use((req, res, next) => {
    if (req.session.userInfo) {
        try {
            req.userInfo = req.session.userInfo;
            User.findOne({
                _id:req.userInfo._id
            }).then((userInfo) => {
                req.userInfo.isAdmin = Boolean(userInfo.isAdmin);
                req.userInfo.username = userInfo.username;
                req.userInfo.avater = userInfo.avater;
                req.userInfo.signature = userInfo.signature;
                next();
            })
        } catch (e) { }
    } else {
        next();
    }
});

//划分模块
app.use('/chat', require('./routers/chat'));
app.use('/comment', require('./routers/comment'));
app.use('/profile', require('./routers/profile'));
app.use('/pyq', require('./routers/pyq'));
app.use('/search',require('./routers/search'));
app.use('/upload', require('./routers/upload'));
app.use('/', require('./routers/main'));

mongoose.connect('mongodb://127.0.0.1:27017/social', {useNewUrlParser:true},(err) => {
    let serve;
    if (err) {
        console.log("数据库连接失败。");
    } else {
        console.log("数据库连接成功！");
        serve = app.listen(3001);
        const io = socketio(serve);
        io.on('connection', socket => {
            const socketId = socket.id;
            socket.on('login', (username) => {
                socketHandler.saveUserSocketId(username, socketId)
            });
            socket.on('comment',(toUserName) => {
                Idtoid.findOne({
                    username: toUserName
                }).then((rs) => {
                    io.to(rs.socketid).emit('receiveComment')
                })
            });
            socket.on('chat',(data) => {
                Idtoid.findOne({
                    username: data.to_user
                }).then((rs) => {
                    io.to(rs.socketid).emit('receiveMsg',{
                        from_user:data.from_user,
                        message:data.message,
                        time:data.time,
                        avater:data.avater,
                        _id:data._id
                    })
                })
            })
        })
    }
});


