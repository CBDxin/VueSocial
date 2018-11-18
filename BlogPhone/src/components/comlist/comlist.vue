<template>
  <div class="comlist div-wrap">
    <myheader :title="'评论列表'">
      <i class="iconfont icon-fanhui1 left" slot="left" @click="goback"></i>
    </myheader>
    <scroll :data="com" class="scroll-wrap">
      <ul class="lists">
        <li v-for="(item,index) in com" :key="index" class="list">
          <div class="reply" @click="reply(item.pyqid,item.from,item.writer)">回复</div>
          <div class="comheader">
            <div class="avater">
              <img :src="item.headerimg"/>
            </div>
            <div class="header-right">
              <div class="username">{{item.from}}</div>
              <div class="time">{{item.addTime|fomatTime}}</div>
            </div>
          </div>
          <div class="comcontent">
            {{item.content}}
          </div>
          <div class="comfooter">
            <div class="avater">
              <img :src="item.footerimg"/>
            </div>
            <div class="footer-right">
              <div class="username">{{item.writer}}</div>
              <div class="pyq">{{item.pyq}}</div>
            </div>
          </div>
        </li>
      </ul>
    </scroll>

  </div>
</template>

<script>
  import myheader from '../../components/myheader/my-header'
  import scroll from '../../components/scroll/scroll'
  import {mapState} from 'vuex'

  export default {
    data() {
      return {
        com: []
      }
    },
    computed: {
      ...mapState([
        'userInfo'
      ])
    },
    methods: {
      goback() {
        this.$router.push({path: '/news'});
      },
      reply(id, to, writer) {
        this.$router.push({path: '/comment', query: {id, to, writer}})
      },
      getCom() {
        this.axios.get('/comment/getcom', {
          params: {
            username: this.userInfo.username
          }
        }).then((result) => {
          let {data} = result;
          if (!data.code) {
            this.com = data.com.reverse();
          }
        })
      }
    },
    created() {
      this.getCom();
    },
    components: {
      myheader,
      scroll
    }
  }
</script>

<style lang="less" scoped>
  .comlist {
    .lists {
      .list {
        position: relative;
        background-color: white;
        margin: 2px 0;
        padding: 8px;
        .reply {
          position: absolute;
          right: 10px;
          top: 8px;
          color: #4e86ff;
        }
        .comheader {
          display: flex;
          .avater {
            width: 40px;
            height: 40px;
            min-width: 40px;
            border-radius: 50%;
          }
          .header-right {
            display: flex;
            flex-direction: column;
            .username {
              height: 25px;
              line-height: 25px;
            }
            .time {
              height: 15px;
              font-size: 14px;
              line-height: 15px;
              color: grey;
            }
          }
        }
        .comfooter {
          width: 100%;
          background-color: #f8f8f8;
          display: flex;
          .footer-right {
            display: flex;
            flex-direction: column;
            overflow: hidden;
            text-overflow: ellipsis;
            .pyq {
              font-size: 14px;
              line-height: 15px;
              color: grey;
              max-height: 30px;
              word-break: break-all;
              overflow-wrap: break-word;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }
        }
      }
    }
  }
</style>
