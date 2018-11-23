<template>
  <div>
    <myheader :title="'消息'"></myheader>
    <div class="news">
      <scroll ref="scroll" class="scroll-wrap" v-if="userInfo.username">
        <ul>
          <li>
            <div class="news-box" @click="enterComList">
              <div class="left">
                <div style="background-color: rgba(48,210,4,0.93)" class="tubiao">
                  <i class="iconfont icon-comments" slot="left"></i>
                </div>
              </div>
              <div class="content">
                评论 <span v-if="cunread" class="cnews">{{cunread}}</span>
              </div>
            </div>
          </li>
          <li v-if="chatList" v-for="(item,index) in chatList" :key="index">
            <div @click="enterChat(item.chatWith.username,item.chatWith._id)" class="news-box">
              <div class="left">
                <div :style="'backgroundImage:url(' + item.chatWith.avater +' )'" class="avater"></div>
              </div>
              <div class="content">
                <div class="username">
                  {{item.chatWith.username}}
                  <span class="time" v-if="item.addTime">{{item.addTime|chatTime}}</span>
                </div>
                <span class="unread" v-if="item.unread">{{item.unread}}</span>
                <div class="tnew">
                  {{item.content}}
                </div>
              </div>
            </div>
          </li>
        </ul>
      </scroll>
      <unlogin v-else></unlogin>
    </div>
  </div>

</template>

<script>
  import {Toast} from 'mint-ui';
  import myheader from '../../components/myheader/my-header.vue';
  import scroll from '../../components/scroll/scroll';
  import {mapState, mapMutations} from 'vuex';
  import unlogin from '../../components/unlogin/unlogin';

  export default {
    computed: {
      ...mapState([
        'userInfo',
        'cmessage',
        'cunread',
        'chatList'
      ])
    },
    activated(){
      this.$nextTick(()=>{
        this.$refs.scroll&&this.$refs.scroll.refresh();
      })
    },
    methods: {
      ...mapMutations([
        'clear_cunread',
        'set_chatList',
        'clear_chatUnread'
      ]),
      enterComList() {
        let username = this.userInfo.username;
        this.axios.get('/comment/clearcomunread', {
          params: {
            username: username
          }
        }).then(() => {
          this.$router.push({path: '/comlist'});
          this.clear_cunread();
        })
      },
      enterChat(chatwith, chatwithid) {
        this.clear_chatUnread(chatwith);
        this.$router.push({path: '/chat', query: {chatwith, chatwithid}});
      }
    },
    data() {
      return {}
    },
    components: {
      myheader,
      scroll,
      unlogin
    }
  }
</script>

<style lang="less" scoped>
  .news {
    position: absolute;
    top: 50px;
    bottom: 60px;
    width: 100%;
    background-color: #fdfdfd;
    .news-box {
      display: flex;
      margin: 5px 0;
      .left {
        float: left;
        height: 55px;
        width: 20%;
        text-align: center;
        line-height: 55px;
        overflow: hidden;
        .tubiao {
          margin: 0 auto;
          width: 55px;
          height: 55px;
          border-radius: 50%;
          i {
            color: white;
          }
        }
        .avater {
          margin: 0 auto;
          width: 55px;
          height: 55px;
          background: no-repeat 50%;
          background-size: cover;
          border-radius: 50%;
        }
        i {
          font-size: 28px;
        }
      }
      .content {
        position: relative;
        padding-left: 0.5rem;
        font-size: 18px;
        font-weight: bold;
        line-height: 55px;
        border-bottom: gainsboro 1px solid;
        width: 80%;
        display: flex;
        flex-direction: column;
        .cnews {
          position: absolute;
          right: 8px;
          top: 17px;
          text-align: center;
          width: 20px;
          height: 20px;
          font-size: 14px;
          color: white;
          font-weight: normal;
          line-height: 20px;
          border-radius: 50%;
          background-color: red;
        }
        .username {
          font-size: 18px;
          line-height: 30px;
          .time {
            float: right;
            color: grey;
            font-size: 14px;
            padding-right: 8px;
            font-weight: normal;
          }
        }
        .unread {
          position: absolute;
          right: 8px;
          bottom: 5px;
          text-align: center;
          width: 18px;
          height: 18px;
          font-size: 12px;
          color: white;
          font-weight: normal;
          line-height: 18px;
          border-radius: 50%;
          background-color: red;
        }
        .tnew {
          font-weight: normal;
          font-size: 16px;
          line-height: 25px;
          color: grey;
          position: relative;
          overflow: hidden;
          width: 80%;
          text-overflow: ellipsis;
        }
      }
    }
  }

</style>
