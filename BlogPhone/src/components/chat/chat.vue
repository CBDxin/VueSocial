<template>
  <div class="chat div-wrap">
    <myheader :title="chatWith">
      <i class="iconfont icon-fanhui1 left" slot="left" @click="goback"></i>
    </myheader>
    <scroll ref="scroll" :toBottom="true" v-if="dataList" class="scroll-wrap" :data="dataList">
      <ul>
        <li v-for="(item,index) in dataList" :key="index"
            :class="{'chat-right':item.chatWith._id == chatWithId,
              'chat-left':item.chatWith._id !== chatWithId,
              'chat-box':true}">
          <div class="add-time"
               v-if="index == 0||dataList[index-1]&&new Date(item.addTime)-new Date(dataList[index-1].addTime)>1000*180">
            <span>{{new Date(item.addTime)|chatTime}}</span>
          </div>
          <div :class="{'toright':item.chatWith._id == chatWithId,'flex':true}">
              <span v-if="item.chatWith._id !== chatWithId" class="avater">
                <img :src="item.user_id.avater"/>
              </span>
            <span class="content">{{item.content}}</span>
            <span v-if="item.chatWith._id == chatWithId" class="avater">
                <img :src="item.user_id.avater"/>
              </span>
          </div>
        </li>
      </ul>
    </scroll>
    <div class="chat-footer">
      <textarea class="chat-textarea weui-textarea" v-model="content" rows="1"></textarea>
      <div class="send" @click="sendMessage">{{sendInfo}}</div>
    </div>
  </div>
</template>

<script>
  import {mapState, mapMutations} from 'vuex';
  import myheader from 'components/myheader/my-header';
  import scroll from '../../components/scroll/scroll';
  import unlogin from '../../components/unlogin/unlogin'
  import {Toast} from 'mint-ui'

  export default {
    created() {
      this.getDataList();
      this.updateBySocket();
      this.getUserInfo();
    },
    mounted(){
      this.$refs.scroll._toBottom(1);
      this.clearUnread();
    },
    data() {
      return {
        chatWithId: this.$route.query.chatwithid,
        chatWith: this.$route.query.chatwith,
        content: '',
        sendInfo: "发送",
        dataList: [],
        tUserInfo:''
      }
    },
    computed: {
      ...mapState([
        'userInfo'
      ])
    },
    components: {
      myheader,
      scroll,
      unlogin
    },
    methods: {
      ...mapMutations([
        'update_chatList'
      ]),
      //获取聊天对象信息
      getUserInfo() {
        this.axios.get(`/profile/userInfo?name=${this.chatWith}`).then(({data}) => {
          if (data) {
            this.tUserInfo = data;
          }
        })
      },
      clearUnread(){
        this.axios.post('/chat/clearchatunread', {
          from: this.userInfo._id,
          to: this.tUserInfo._id
        })
      },
      getDataList() {
        this.axios.get('/chat/chatwith', {
          params: {
            chatWith: this.chatWithId,
            user_id: this.userInfo._id,
          }
        }).then((result) => {
          if (result.data.chatList) {
            this.dataList = result.data.chatList.reverse()
          }
        })
      },
      goback() {
        this.$router.go(-1);
        this.clearUnread();
      },
      sendMessage() {
        if (!this.userInfo._id){
          Toast("请先登录！");
          return;
        }
        if (this.content == '') {
          return;
        }
        this.sendInfo = '发送中..';
        this.axios.post('/chat/chatwith', {
          chatWithId: this.tUserInfo._id,
          user_id: this.userInfo._id,
          content: this.content
        }).then((result) => {
          this.sendInfo = '发送';
          //把自己发送的内容更新到dataList中
          this.dataList.push({
            user_id: {//这个有点乱了，这个是自己的信息
              avater: this.userInfo.avater
            },
            chatWith: {
              _id: this.chatWithId
            },
            addTime: Date.now(),
            content: this.content
          });
          //更新聊天用户的列表
          this.update_chatList({
            _id: this.tUserInfo._id,
            from_user: this.chatWith,//与你聊天的用户
            message: this.content,//消息内容
            time: Date.now(),//时间);
            me: true,//判别是不是自己发送的
            avater:this.tUserInfo.avater
          });
          //要发送给对方的数据
          let data = {
            from_user: this.userInfo.username,//发送方
            to_user: this.chatWith,//接收方
            message: this.content,//消息内容
            time: Date.now(), //时间);
            avater: this.userInfo.avater,
            _id: this.userInfo._id
          };
          socket.emit('chat', data);
          this.content = '';
        })
      },
      updateBySocket() {
        socket.on('receiveMsg', (data) => {
          //判断一下是不是当前的对话框
          if (data.from_user == this.chatWith) {
            //把收到的消息保存到聊天记录中
            this.dataList.push({
              chatWith: {
                _id: this.userInfo._id
              },
              user_id: {//自己的信息
                avater: data.avater
              },
              addTime: data.addTime,
              content: data.message
            });
            this.update_chatList({
              _id: this.tUserInfo._id,
              from_user: this.chatWith,//与你聊天的用户
              message: data.message,//消息内容
              time: data.addTime,//时间);
              me: true,//判别是不是自己当前页面
              avater:this.tUserInfo.avater
            });
          }
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .chat {
    bottom: 68px;
    .scroll-wrap {
      background-color: white;
      padding: 5px;
    }
    .chat-box {
      width: 100%;
      margin-bottom: 10px;
      .add-time {
        margin: 0 auto;
        text-align: center;
        font-size: 14px;
        line-height: 1.5rem;
        height: 1.5rem;
        span {
          background-color: rgba(172, 172, 177, 0.29);
          color: white;
          border-radius: 5px;
          padding: 2px 5px;
        }
      }
      .flex {
        display: flex;
      }
      .avater {
        margin: 0 10px;
        width: 40px;
        height: 40px;
        img {
          width: 40px;
        }
      }
      .content {
        max-width: 220px;
        background-color: greenyellow;
        line-height: 25px;
        padding: 7px 1rem;
        overflow-wrap: break-word;
        word-break: break-all;
        border-radius: 10px;
      }
    }
    .chat-right {
      .flex {
        align-items: center;
        justify-content: flex-end
      }
      .toright {
        span {
        }
      }
      .content {
        background-color: orange;
        color: white;
      }
    }
    .chat-footer {
      background-color: #f8f8f8;
      position: fixed;
      bottom: 0;
      box-shadow: 0 0 5px #e0e0e0;
      width: 100%;
      height: 40px;
      padding: 8px 5px 5px;
      display: flex;
      justify-content: center;
      .chat-textarea {
        padding: 2px 5px;
        display: block;
        width: 70%;
        margin: 3px 0;
        border: gainsboro 1px solid;
        border-radius: 5px;
      }
      .send {
        text-align: center;
        width: 20%;
        line-height: 34px;
        background-color: orange;
        color: white;
        margin: 3px;
        border-radius: 5px;
      }
      .send:active {
        background-color: #e8a205;
      }
    }
  }
</style>
