import * as types from './mutation-types'

const mutations = {
  [types.SET_USERINFO](state, userInfo) {
    state.userInfo = userInfo;
  },
  [types.SET_IMGDATA](state, imgdata) {
    state.imgdata = imgdata;
  },
  [types.SET_CMESSAGE](state, data) {
    state.cmessage = data;
  },
  [types.UPDATE_CUNREAD](state) {
    state.cunread = state.cunread + 1;
    state.unread = state.unread + 1;
  },
  [types.CLEAR_CUNREAD](state) {
    state.unread = state.unread - state.cunread;
    state.cunread = 0;
  },
  [types.SET_CUNREAD](state) {
    state.cunread = state.cmessage.length
    state.unread = state.unread + state.cunread
  },
  [types.SET_RESIZE](state) {
    state.isResize = true;
  },
  [types.RESET_RESIZE](state) {
    state.isResize = false;
  },
  [types.CLEAR_CHATUNREAD](state, data) {
    for (let i = 0; i < state.chatList.length; i++) {
      if (state.chatList[i].chatWith.username === data) {
        state.unread -= state.chatList[i].unread;
        state.chatList[i].unread = 0;
      }
    }
  },
  [types.UPDATE_CHATLIST](state, data) {
    let flag = 0;//判断新的聊天是否存在于当前的列表中
    state.chatList.forEach((item)=>{
      if (item.chatWith.username == data.from_user) {
        flag = 1;
        if (!data.me) {//判断当前是否在对话框页面中
          item.unread++;
          state.unread++;
        }
        //更新
        item.content = data.message;
        item.addTime = data.time;
        //按添加时间排序
        state.chatList.sort((a, b) => {
          return new Date(b.addTime) - new Date(a.addTime)
        });
        //跳出循环
        return false;
      }
    });
    //是新的并且不在对话框页面
    if (!flag&&!data.me) {
      //添加到第一条
      state.chatList.unshift({
        chatWith: {
          avater: data.avater,
          username: data.from_user,
          _id: data._id
        },
        addTime: data.time,
        content: data.message,
        unread: 1
      });
        state.unread++;
    }else if (!flag&&data.me){//新的并且在对话框页面，不需要增加unread
      state.chatList.unshift({
        chatWith: {
          avater: data.avater,
          username: data.from_user,
          _id: data._id
        },
        addTime: data.time,
        content: data.message,
      });
    }
  },
  [types.SET_CHATLIST](state, data) {
    state.chatList = data;
    data.forEach((item) => {
      state.unread += item.unread
    })
  }
};

export default mutations;
