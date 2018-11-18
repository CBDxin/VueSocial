<template>
  <div id="msite">
    <myheader :title="'首页'">
      <i class="iconfont icon-sousuo left" slot="left"></i>
      <router-link v-if="userInfo.username" to="/profile" tag="span" class="right" slot="right">我的</router-link>
      <router-link v-else to="/login" tag="span" class="right" slot="right">登录</router-link>
    </myheader>
    <div class="pyq-lists">
      <scroll class="pyq-card" :data="PyqList">
        <ul>
          <li class="pyq" v-for="(list,index) in PyqList">
            <div class="avater">
              <img :src="list.writer.avater"/>
            </div>
            <div class="content">
              <div class="username">{{list.writer.username}}</div>
              <div class="pyq-content">{{list.content}}</div>
              <div class="pyq-img">
                <imgdisply v-if="list.pimg.length" :data="list.pimg"></imgdisply>
              </div>
              <div class="footer">
                <div class="add-time">{{list.addTime|fomatTime}}</div>
                <div class="comment">
                  评论
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
  import imgdisply from '../../components/img-display/img-display.vue';
  import showimg from '../../components/show-img/show-img';
  import {mapState, mapMutations} from 'vuex'

  export default {
    computed: {
      ...mapState([
        'userInfo'
      ])
    },
    created() {
      this.getPyqLists();
    },
    activated() {
      this.$nextTick(() => {
        if (this._getList) {
          this._getList = false;
          this.getPyqLists();
        }
      })

    },
    data() {
      return {
        PyqList: [],
        _getList: false
      }

    },
    methods: {
      ...mapMutations([
        'set_userInfo'
      ]),
      /*showimg(data,index){
        set_imgdata({data, index})
        this.$router.push({path:'/showimg'});
      },*/
      getPyqLists() {
        this.axios.get('/cross/phone').then(({data}) => {
          if (!data.code) {
            if (data.userInfo) {
              this.set_userInfo(data.userInfo);
            }
            this.PyqList = data.data
          }
        })
      }
    },
    components: {
      myheader,
      scroll,
      imgdisply,
      showimg
    },
    watch: {
      $route(to, from) {
        if (from.path == '/upload' && to.path == '/home') {
          /*this.$router.go(0)*/
          /*this.getPyqLists()*/
        }
      }
    },
    beforeRouteEnter(to, from, next) {
      if (from.path == '/upload' || from.path == '/login') {
        next(vm => {
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
    position: relative;
    height: 100%;
    .pyq-lists {
      position: fixed;
      top: 50px;
      bottom: 60px;
      width: 100%;
      background-color: #f4f4f4;
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
          min-height: 50px;
          background-color: white;
          margin-bottom: 1px;
          padding: 10px;
          display: flex;
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
            width: 100%;
            .username {
              color: #026CFF;
              line-height: 30px;
            }
            .footer {
              display: flex;
              justify-content: space-between;
              color: grey;
              font-size: 14px;
              .comment {
                color: blue;
                padding-right: 1rem;
              }
            }
          }
          .pyq-img {
            width: 80%;
          }
        }
      }

    }
  }

</style>
