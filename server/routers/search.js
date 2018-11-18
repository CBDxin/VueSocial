let express = require('express');
let User = require('../models/User');
let Pyq = require('../models/Pyq');
let router = express.Router();

router.get('/', (req, res) => {
    let searchText = req.query.searchText;
    let resData = {
        code: 0,
        user: {},
        pyqList: {}
    };
    User.findOne({
        username: searchText
    }).then((userRes) => {
        if (userRes) {
        }
        resData.user = userRes;
        Pyq.find({
            content: {$regex: searchText, $options: '$i'}, //  $options: '$i' 忽略大小写
        }).populate(['writer', 'comments']).then((pyqList)=>{
            if (pyqList){
                resData.pyqList = pyqList;
            }
            res.json(resData)
        })
    })
});

module.exports = router;