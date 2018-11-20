import * as types from './mutation-types'

const mutations = {
  [types.SET_USERINFO](state, userInfo) {
    state.userInfo = userInfo;
  },
  [types.SET_RESIZE](state) {
    state.isResize = true;
  },
  [types.RESET_RESIZE](state) {
    state.isResize = false;
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
  [types.CLEAR_CHATUNREAD](state, data) {
    for (let i = 0; i < state.chatList.length; i++) {
      if (state.chatList[i].chatWith.username === data) {
        state.unread -= state.chatList[i].unread;
        state.chatList[i].unread = 0;
      }
    }
  },
  [types.UPDATE_CHATLIST](state, data) {
    let flag = 0;
    for (let i = 0; i < state.chatList.length; i++) {
      if (state.chatList[i].chatWith.username == data.from_user) {
        flag = 1;
        if (!data.me) {
          state.chatList[i].unread++;
          state.unread++;
        }
        state.chatList[i].content = data.message;
        state.chatList[i].addTime = data.time;
        state.chatList.sort((a, b) => {
          return new Date(b.addTime) - new Date(a.addTime)
        });
        break;
      }
    }
    if (!flag&&!data.me) {
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
    }else if (!flag&&data.me){
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
