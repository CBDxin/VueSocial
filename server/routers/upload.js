let Pyq = require('../models/Pyq');
let User = require('../models/User');
let express = require('express');
let router = express.Router();
let fs = require('fs');
let multer = require('multer');
let OSS = require('ali-oss');
//阿里云oss配置自己去官网瞧
let client = new OSS({
    region: 'oss-cn-shanghai',
    accessKeyId: '****',
    accessKeySecret: '******'
});
client.useBucket('******');
async function put (fileName,filePath,cb) {
    try {
        let result = await client.put(fileName, filePath);
        fs.unlinkSync('public/img/' + result.name);
        cb(result)
    } catch (err) {
        console.log(err);
    }
}


let filePath;
let fileName;

let Storage = multer.diskStorage({
    destination: function (req, file, cb) {//计算图片存放地址
        cb(null, './public/img');
    },
    filename: function (req, file, cb) {//图片文件名
        fileName = Date.now() + '_' + parseInt(Math.random() * 1000000) + '.png';
        filePath = './public/img/' + fileName;
        cb(null, fileName)
    }
});
let upload = multer({storage: Storage}).any();//file2表示图片上传文件的key
let avater = multer({storage: Storage}).single('avater');
router.post('/uploadAvater', function (req, res, next) {
    avater(req, res, function (err) {
        let username = req.body.username;
        let imgs;
        let oldVal = req.body.oldVal || '';
        if (oldVal) {
            oldVal = oldVal.replace('http://pfr020xzs.bkt.clouddn.com/', '');
            client.delete(oldVal, function (err) {
                if (err) {
                    console.log(err)
                }
            })
        }
        if (err) {
            return res.end(err);
        }
        let i = 0;
        let item = req.file;
        let filePath = `./public/img/${item.filename}`;
        put(fileName,filePath,(result)=>{
            imgs = result.url;
            User.update({
                _id: username
            }, {
                avater: imgs
            }).then(() => {
                res.json({
                    code: '0',
                    msg: '上传成功'
                });
            })
        });
    })
});

router.post('/uploadFile', function (req, res, next) {
    upload(req, res, function (err) {
        let content = req.body.content || '';
        let username = req.body.username;
        let imgs = [];
        if (err) {
            return res.end(err);
        }
        if (req.files.length === 0) {
            new Pyq({
                writer: username,
                content: content
            }).save().then((result) => {
                res.json({
                    result: result,
                    code: '0',
                    msg: '上传成功'
                });
            })
        }
        /*client.delete('public/img/1.png', function (err) {
            console.log(err)
        });*/
        let i = 0;
        req.files.forEach((item, index) => {
            let filePath = `./public/img/${item.filename}`;
            put(item.filename,filePath,(result)=>{
                imgs.push(result.url);
                i++;
                if (i === req.files.length) {
                    new Pyq({
                        content: content,
                        writer: username,
                        pimg: imgs
                    }).save().then(() => {
                        res.json({
                            code: '0',
                            msg: '发布成功'
                        });
                    })
                }
            })
        })
    })
});
module.exports = router;