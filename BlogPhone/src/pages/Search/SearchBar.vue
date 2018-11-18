<template>
  <div class="div-wrap">
    <div class="weui-cell search-wrap">
      <div class="weui-cell__bd">
        <i @click="getSearchRes()" class="iconfont icon-sousuo"></i>
        <i v-show="isShow" @click="clearText" class="iconfont icon-chucuo"></i>
        <span class="back" @click="$router.go(-1)">取消</span>
        <form action='' onsubmit="return false;">
        <input v-model="searchText" ref="input" class="weui-input" type="search" autofocus="autofocus"
               placeholder="搜索" rel="input">
        </form>
      </div>
    </div>
    <div class="no-res" v-show="noRes">暂时没有相关内容╮(╯▽╰)╭</div>
    <div v-if="user" class="text">用户</div>
    <div v-if="user" class="user" @click="goToPindex(user.username,user._id)">
      <div class="left">
        <div :style="'backgroundImage:url(' + user.avater +' )'" class="avater"></div>
      </div>
      <div class="content">
        <div class="username">
          {{user.username}}
        </div>
        <div class="signature">
          {{user.signature}}
        </div>
      </div>
    </div>
    <div ref="pyq" class="pyq">
      <div v-if="pyqList.length" class="text">动态</div>
      <scroll  v-if="pyqList.length" :data="pyqList" class="scroll-wrap">
        <div>
          <ul class="pyq-card">
            <li class="pyq" v-for="(list,index) in pyqList">
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
      </scroll>
    </div>
  </div>
</template>

<script>
  import {mapState,mapMutations} from 'vuex';
  import scroll from '../../components/scroll/scroll';
  import {updateSearch} from '../../common/js/localStorage'

  export default {
    components: {
      scroll
    },
    created(){
      if (this.$route.query.item){
        this.getSearchRes();
        this.isShow = true;
      }
    },
    updated() {
      this.$nextTick(() => {
        //只在当前页更新
        if (this.$route.path === '/searchbar') {
          this.initImg();
        }
      })
    },
    mounted() {
      this.$nextTick(() => {
        this.$refs.input.focus();
        this.search();
        this.initImg();
        if (this.$route.query.item){
          this.$refs.input.blur();
        }
      })
    },
    computed: {
      ...mapState([
        'userInfo'
      ])
    },
    data() {
      return {
        searchText: this.$route.query.item||'',
        isShow: false,
        pyqList: [],
        user:'',
        noRes:false
      }
    },
    methods: {
      ...mapMutations([
        'set_imgdata'
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
      goToPindex(name, id) {
        this.$router.push({path: '/pindex', query: {id, name}});
      },
      search() {
        this.$refs.input.addEventListener('keypress',(e)=>{
          let keycode = e.keyCode;
          if(keycode == '13') {
            this.getSearchRes();
          }
        });
      },
      getSearchRes(){
        updateSearch(this.searchText);
        this.axios.get(`/search?searchText=${this.searchText}`).then((res) => {
          this.user = res.data.user;
          this.pyqList = res.data.pyqList;
          if (this.user||this.pyqList.length){
            this.noRes = false;
          }else {
            this.noRes = true;
          }
        })
      },
      _isShow() {
        if (this.searchText) {
          this.isShow = true;
        } else {
          this.isShow = false;
        }
      },
      clearText() {
        this.searchText = '';
      }
    },
    watch: {
      searchText() {
        this._isShow();
      }
    }
  }
</script>

<style lang="less" scoped>
  .div-wrap {
    top: 0;
    bottom: 0;
    .search-wrap {
      box-shadow: 1px 2px 2px gainsboro;
      background-color: rgba(93, 93, 93, 0.05);
      .icon-sousuo {
        position: absolute;
        left: 12px;
      }
      .back {
        position: absolute;
        right: 5px;
        color: rgba(25, 234, 48, 0.85);
      }
      .icon-chucuo {
        position: absolute;
        right: 12%;
      }
      .weui-input {
        background-color: white;
        border-radius: 5px;
        width: 85%;
        display: block;
        padding: 0 25px 0 5px;
        margin: 0 auto;
        font-size: 12px;
        line-height: 25px;
        height: 25px;
      }
    }
    .no-res{
      text-align: center;
      font-weight: bold;
      font-size: 18px;
      margin: 200px 0;
    }
    .text {
      height: 30px;
      line-height: 30px;
      padding: 0 10px;
      font-weight: bold;
      border-bottom: gainsboro 1px solid;
      border-top: gainsboro 1px solid;
      background-color: white;
    }
    .user {
      display: flex;
      padding: 10px;
      background-color: white;
      box-shadow: 1px 2px 1px gainsboro;
      margin-bottom: 20px;
      .left {
        float: left;
        height: 55px;
        width: 20%;
        text-align: center;
        line-height: 55px;
        overflow: hidden;
        .avater {
          margin: 0 auto;
          width: 55px;
          height: 55px;
          background: no-repeat 50%;
          background-size: cover;
          border-radius: 50%;
        }
      }
      .content {
        position: relative;
        padding-left: 0.5rem;
        font-size: 18px;
        font-weight: bold;
        line-height: 55px;
        width: 80%;
        display: flex;
        flex-direction: column;
        .username {
          font-size: 18px;
          line-height: 30px;
        }
        .signature {
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
    .pyq {
      background-color: white;
      height: 100%;
      overflow: hidden;
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
  }
</style>
