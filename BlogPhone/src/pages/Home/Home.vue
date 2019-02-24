<template>
  <div id="msite">
    <myheader :title="'首页'">
      <i @click="$router.push('/searchbar')" class="iconfont icon-sousuo left" slot="left"></i>
      <router-link v-if="userInfo.username" to="/profile" tag="span" class="right" slot="right">我的</router-link>
      <router-link v-else to="/login" tag="span" class="right" slot="right">登录</router-link>
    </myheader>
    <div class="pyq-lists">
      <div v-if="!showupload" class="upload-tip">下拉刷新</div>
      <loading v-else title="" class="upload"></loading>
      <scroll @change="showupload=true" @refresh="getPyqLists(1)"
              :stop="55" :threshold="70" ref="scroll" class="scroll-wrap pyq-card" :data="PyqList">
        <ul>
          <li class="pyq" :key="Math.random()" v-for="(list,index) in PyqList">
            <div class="del" @click="del(list._id)" v-if="list.writer.username === userInfo.username">&times;</div>
            <div class="avater" @click="goToPindex(list.writer.username,list.writer._id)">
              <img :src="list.writer.avater"/>
            </div>
            <div class="content">
              <div class="username" @click="goToPindex(list.writer.username,list.writer._id)">{{list.writer.username}}
              </div>
              <div class="pyq-content">{{list.content}}</div>
              <div style="width: 100%" v-if="list.pimg.length === 1" class="one-box">
                <div class="one" @click="showimg(list.pimg,0)"
                     :style="'backgroundImage:url(' + list.pimg[0] +' )'">
                </div>
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
      </scroll>
    </div>
  </div>
</template>

<script>
  import myheader from '../../components/myheader/my-header.vue';
  import scroll from 'components/scroll/scroll.vue';
  import loading from '../../components/loading/loading'
  import imgdisply from '../../components/img-display/img-display.vue';
  import showimg from '../../components/show-img/show-img';
  import {mapState, mapMutations} from 'vuex';
  import {MessageBox, Toast} from 'mint-ui';

  export default {
    computed: {
      ...mapState([
        'userInfo',
        'cunread',
        'isResize'
      ])
    },
    mounted() {
      this.$nextTick(() => {
        this.initImg();
      })
    },
    updated() {
      this.$nextTick(() => {
        //只在当前页更新
        if (this.$route.path === '/home') {
          this.initImg();
        }
      })
    },
    created() {
      this.getPyqLists();
      this.getAllData();//
    },
    activated() {
      this.$nextTick(() => {
        if (this.isResize){
          this.initImg();
          this.reset_resize();
        }
        if (this._getList) {
          if (this.goTop) {
            this.goTop = false;
            this.$refs.scroll.toTop();
          }
          if (this._getAllData) {
            this._getAllData = false;
            this.getAllData();
          }
          this._getList = false;
          this.getPyqLists();
        }
        this.$refs.scroll.refresh();
      })
    },
    data() {
      return {
        PyqList: [],
        _getList: false,
        goTop: false,
        _getAllData: false,
        showupload: false
      }
    },
    methods: {
      goToPindex(name, id) {
        this.$router.push({path: '/pindex', query: {id, name}});
      },
      del(id) {
        MessageBox.confirm('确定删除这条朋友圈?').then(action => {
          this.axios.post('/pyq/delpyq', {
            id: id
          }).then((rs) => {
            this.$router.push({path: '/comment'});
            this.$router.go(-1);
            Toast(rs.data.msg)
          })
        }).catch(err => {
        })
      },
      comment(id, writer) {
        this.$router.push({path: '/comment', query: {id, writer}})
      },
      commentTo(id, to, writer) {
        this.$router.push({path: '/comment', query: {id, to, writer}})
      },
      showimg(data, index) {
        this.set_imgdata({data});
        this.$router.push({path: '/showimg', query: {index}});
      },
      toTop() {
        this.$refs.scroll.toTop();
      },
      ...mapMutations([
        'set_imgdata',
        'set_userInfo',
        'set_cmessage',
        'set_cunread',
        'set_chatList',
        'reset_resize'
      ]),
      initImg() {
        let items = this.$refs.items;
        if (items) {
          items.forEach((item) => {
            item.style.height = item.clientWidth + 'px'
          })
        }
      },
      /*showimg(data,index){
        set_imgdata({data, index})
        this.$router.push({path:'/showimg'});
      },*/
      getCMessage() {
        this.axios.get('/comment/getmsg', {
          params: {
            username: this.userInfo.username
          }
        }).then((rs) => {
          if (!rs.data.code) {
            let data = rs.data.result;
            this.set_cmessage(data);
            this.set_cunread();
          }
        })
      },
      getAllData() {
        this.axios.get('/profile').then(({data}) => {
          if (!data.code) {
            if (data.userInfo) {
              this.set_userInfo(data.userInfo);
              this.getCMessage();
              this.getChatList();
              socket.emit('login', data.userInfo.username);
            }
          }
        })
      },
      getChatList() {
        this.axios.get('/chat/chatlist', {
          params: {
            user_id: this.userInfo._id
          }
        }).then(({data}) => {
          this.set_chatList(data.chatList);
        })
      },
      getPyqLists(refresh = 0) {
        this.axios.get('/pyq').then(({data}) => {
          if (!data.code && this.$router.currentRoute.path === '/home') {
            /*if(data.userInfo){
              this.set_userInfo(data.userInfo);
              this.getMessage();
            }*/
            this.PyqList = data.data;
            if (refresh) {
              this.showupload = false
            }
          }
        })
      }
    },
    components: {
      myheader,
      scroll,
      imgdisply,
      showimg,
      loading
    },
    watch: {
      $route(to, from) {
        if (from.path == '/comment' && to.path == '/home') {
          /*this.$router.go(0)*/
          /*this.getPyqLists()*/
        }
      },
      cunread() {
        this.getPyqLists();
      }
    },
    beforeRouteEnter(to, from, next) {
      if (from.path == '/upload' || from.path == '/login' || from.path == '/comment') {
        next(vm => {
          if (from.path == '/upload') {
            vm.goTop = true
          }
          if (from.path == '/login') {
            vm._getAllData = true
          }
          vm._getList = true
        })
      } else {
        next()
      }
    }
    /*beforeRouteLeave(to, from, next){
      /!*console.log(3,from)*!/
      next()
    }*/
  }
</script>

<style lang="less" scoped>
  #msite {
    height: 100%;
    .pyq-lists {
      position: absolute;
      top: 50px;
      bottom: 60px;
      width: 100%;
      background-color: #f4f4f4;
      .upload-tip {
        text-align: center;
        height: 50px;
        font-size: 14px;
        line-height: 50px;
        position: fixed;
        width: 100%;
      }
      .upload {
        position: fixed;
        padding: 5px;
      }
      .s-img {
        z-index: 999;
        top: 0;
        position: fixed;
        width: 100%;
        height: 100%;
        background-color: black;
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
              max-width: 75px;
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
            width: 250px;
            height: 250px;
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
  }
</style>
