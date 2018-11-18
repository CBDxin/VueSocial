let Idtoid = require('../models/Idtoid')

module.exports = class socketHandler {
    static async saveUserSocketId(username, socketId) {
        //保存用户的id和socketid
        await Idtoid.findOne({
            username: username
        }).then((rs) => {
            if (!rs) {
                new Idtoid({
                    username: username,
                    socketid: socketId
                }).save().then(() => {
                })
            } else {
                Idtoid.update({
                    username: username
                }, {
                    socketid: socketId
                }).then(() => {
                })
            }
        })
    }
};