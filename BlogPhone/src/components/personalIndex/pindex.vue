<template>
  <div class="pindex div-wrap">
    <myheader class="pindex-header" :title="name+'的主页'">
      <i class="iconfont icon-fanhui1 left" slot="left" @click="goback"></i>
      <span v-if="name !== userInfo.username" slot="right" class="right" @click="enterChat(name,id)">私聊</span>
    </myheader>
    <scroll :listen-scroll="true" @scrolling="scrolling" v-if="PyqList.length"
            :data="PyqList" class="scroll-wrap">
      <div>
        <div class="pindex-top">
          <div :style="'backgroundImage:url(' + tUserInfo.avater +' )'" class="avater"></div>
          <div class="username">{{name}}</div>
          <div class="signature">签名：{{tUserInfo.signature}}</div>
        </div>
        <div class="pyq-card">
          <ul>
            <li class="pyq" v-for="(list,index) in PyqList">
              <div class="del" @click="del(list._id)" v-if="list.writer.username === userInfo.username">&times;</div>
              <div class="avater">
                <img :src="list.writer.avater"/>
              </div>
              <div class="content">
                <div class="username">{{list.writer.username}}</div>
                <div class="pyq-content">{{list.content}}</div>
                <div style="width: 100%" v-if="list.pimg.length === 1" class="one-box">
                  <img class="one" :loop="false" @click="showimg(list.pimg,0)" :src="list.pimg[0]" alt="">
                </div>
                <div v-if="list.pimg.length > 1" class="pyq-img">
                  <div ref="items" @click="showimg(list.pimg,index)" :class="list.pimg.length === 4?'four':'nine'"
                       v-for="(item,index) in list.pimg" :style="'backgroundImage:url(' + item +' )'"></div>
                </div>
                <div class="footer">
                  <div class="add-time">{{list.addTime|fomatTime}}</div>
                  <div @click="comment(list._id,list.writer.username)" class="comments">
                    评论
                  </div>
                </div>
                <div v-if="list.comments.length" class="comment-lists">
                  <div class="comment">
                    <div @click="commentTo(list._id,comment.from,list.writer.username)"
                         v-for="(comment,index) in list.comments" :key="index" class="comment-content">
                      <div class="cbox" v-if="comment.to">
                        <span class="from">{{comment.from}}</span>
                        <span> 回复 </span>
                        <span class="to">{{comment.to}}</span>:
                        <span class="ccontent"> {{comment.content}}</span>
                      </div>
                      <div class="cbox" v-else>
                        <span class="from">{{comment.from}}</span>:
                        <span class="ccontent"> {{comment.content}}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </scroll>
    <div v-else class="pindex-top">
      <div v-if="tUserInfo.avater" :style="'backgroundImage:url(' + tUserInfo.avater +' )'" class="avater"></div>
      <div class="username">{{name}}</div>
      <div class="signature">签名：{{tUserInfo.signature}}</div>
      <div style="text-align: center; margin: 150px 0; font-size: 20px;font-weight: bold">他还没发送过任何动态╮(╯▽╰)╭</div>
    </div>
  </div>
</template>

<script>
  import {mapState, mapMutations} from 'vuex';
  import myheader from 'components/myheader/my-header';
  import scroll from '../../components/scroll/scroll';
  import {Toast} from 'mint-ui';

  export default {
    created() {
      this.getUserInfo();
      this.getPyqList();
    },
    updated() {
      this.$nextTick(() => {
        //只在当前页更新
        if (this.$route.path === '/pindex') {
          this.initImg();
        }
      })
    },
    data() {
      return {
        id: this.$route.query.id || '',
        name: this.$route.query.name || '',
        PyqList: [],
        tUserInfo: {}
      }
    },
    computed: {
      ...mapState([
        'userInfo'
      ])
    },
    components: {
      myheader,
      scroll
    },
    mounted(){
      this.$nextTick(()=>{
        this.initImg();
      })
    },
    methods: {
      ...mapMutations([
        'clear_chatUnread'
      ]),
      initImg() {
        let items = this.$refs.items;
        if (items) {
          items.forEach((item) => {
            item.style.height = item.clientWidth + 'px'
          })
        }
      },
      showimg(data, index) {
        this.set_imgdata({data});
        this.$router.push({path: '/showimg', query: {index}});
      },
      goback() {
        this.$router.go(-1);
      },
      scrolling(top) {
        //-150
        if (top<-150){
          window.document.querySelector('.pindex-header').style.boxShadow = "0 1px 0 gainsboro";
        }else{
          window.document.querySelector('.pindex-header').style.boxShadow = "none";
        }
        if (top < -10 &&top > -130) {
          window.document.querySelector('.pindex-header').style.color = "black";
          // window.document.querySelector('.pindex-header').style.backgroundColor = `rgb(255,255,255,${top / (-130) > 0.99 ? 0.99 : top / (-130)})`;
          window.document.querySelector('.pindex-header').style.backgroundColor = 'white';
          window.document.querySelector('.pindex-header').style.opacity = top / (-130);
        } else if (top < -130){
          window.document.querySelector('.pindex-header').style.backgroundColor = 'white';
          window.document.querySelector('.pindex-header').style.opacity = 0.99;
        }else if (top > -10){
          window.document.querySelector('.pindex-header').style.color = "white";
          window.document.querySelector('.pindex-header').style.backgroundColor = `transparent`;
          window.document.querySelector('.pindex-header').style.opacity = 1;
        }
      },
      enterChat(chatwith, chatwithid) {
        this.clear_chatUnread(chatwith);
        this.$router.push({path: '/chat', query: {chatwith, chatwithid}});
        this.axios.post('/chat/clearchatunread', {
          from: this.userInfo._id,
          to: chatwithid
        })
      },
      getUserInfo() {
        this.axios.get(`/profile/userInfo?name=${this.name}`).then(({data}) => {
          if (data) {
            this.tUserInfo = data;
          }
        })
      },
      getPyqList() {
        this.axios.get(`/pyq/tPyqList?id=${this.id}`).then(({data}) => {
          if (data) {
            this.PyqList = data;
          }
        })
      },
      ...mapMutations([
        'set_imgdata'
      ])
    }
  }
</script>

<style lang="less" scoped>
  .pindex {
    top: 0;
    bottom: 0;
    .pindex-header {
      background-color: transparent;
      box-shadow: none;
      color: white;
    }
    .pindex-top {
      width: 100%;
      height: 200px;
      background: url("https://vuesocial.oss-cn-beijing.aliyuncs.com/1542030961025_124618.png");
      background-size: cover;
      background-position: center;
      padding: 1px;
      .avater {
        width: 65px;
        height: 65px;
        border-radius: 50%;
        margin: 54px auto 5px;
        background-position: center;
        background-size: cover;
      }
      .username, .signature {
        margin: 0 auto;
        text-align: center;
        color: white;
        font-size: 20px;
      }
      .signature {
        font-size: 14px;
      }
    }
    .pyq-card {
      overflow: hidden;
      height: 100%;
      .pyq {
        .del {
          position: absolute;
          top: 0;
          right: 10px;
          float: right;
          color: black;
          opacity: 0.8;
          font-size: 20px;
        }
        min-height: 50px;
        background-color: white;
        margin-bottom: 1px;
        padding: 10px;
        display: flex;
        position: relative;
        .avater {
          background-color: black;
          min-width: 50px;
          height: 50px;
          width: 50px;
          margin-right: 10px;
          overflow: hidden;
          img {
            width: 100%;
            display: block;
            position: relative;
            top: 50%;
            transform: translateY(-50%);
          }
        }
        .content {
          display: flex;
          flex-direction: column;
          width: 85%;
          max-width: 85%;
          .username {
            color: #026CFF;
            line-height: 30px;
          }
          .footer {
            display: flex;
            justify-content: space-between;
            color: grey;
            font-size: 14px;
            .comments {
              color: #026CFF;
              padding-right: 1rem;
            }
          }
          .comment-lists {
            padding: 5px;
            margin-top: 0.5em;
            min-height: 25px;
            width: 95%;
            background-color: #f6f6f6;
            .comment-content {
              .cbox {
                word-wrap: break-word;
                .ccontent {
                  word-break: break-all;
                  word-wrap: break-word;
                }
                .from, .to {
                  color: #026CFF;
                }
              }

              /*<div class="reply-lists">
              <div class="reply-content">
              <span class="from">肉丝</span>
              <span>回复:</span>
              <span class="to">杜鑫</span>
              <span>谢谢</span>
              </div>
              </div>*/
              .reply-lists {
                margin-left: 1rem;
                .from, .to {
                  color: #026CFF;
                }
              }
            }
          }
        }
        .one {
          display: block;
          margin: 5px 0;
          width: 80%;
          height: auto;
          background: no-repeat 50%;
          background-size: cover;
        }
        .pyq-img {
          width: 80%;
          display: flex;
          flex-wrap: wrap;
          .four {
            margin-right: 3px;
            margin-bottom: 3px;
            width: 48.5%;
            height: 105px;
            background: no-repeat 50%;
            background-size: cover;
          }
          .nine {
            margin-right: 3px;
            margin-bottom: 3px;
            width: 31.5%;
            height: 79px;
            background: no-repeat 50%;
            background-size: cover;
          }
        }
      }
    }
  }
</style>
