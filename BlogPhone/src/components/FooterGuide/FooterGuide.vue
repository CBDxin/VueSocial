<template>
    <div id="app-footer">
      <ul>
        <router-link tag="li" to="/home">
          <span>
            <i class="iconfont icon-home"></i>
          </span>
          <span>首页</span>
        </router-link>
        <router-link tag="li" to="/news">
          <span>
            <i class="iconfont icon-xiaoxi"></i>
          </span>
          <span>消息</span>
          <span v-if="unread" class="newsnum">
            {{unread}}
          </span>
        </router-link>
        <router-link tag="li" to="/upload">
          <span>
            <i class="iconfont icon-jia"></i>
          </span>
          <span></span>
        </router-link>
        <router-link tag="li" to="/search">
          <span>
            <i class="iconfont icon-sousuo"></i>
          </span>
          <span>搜索</span>
        </router-link>
        <router-link tag="li" to="/profile">
          <span>
            <i class="iconfont icon-wo"></i>
          </span>
          <span>我的</span>
        </router-link>
      </ul>
    </div>
</template>

<script>
  import { mapState } from 'vuex';
    export default {
      computed:{
        ...mapState([
          'unread'
        ])
      }
    }
</script>

<style lang="less" scoped>

  #app-footer{
    box-shadow: 0 0 5px #e0e0e0;
    width: 100%;
    height: 40px;
    font-size: 13px;
    line-height: 20px;
    position: fixed;
    bottom: 0;
    padding: 8px 5px 5px;
    background-color: #fafafa;
    ul{
      display: flex;
      justify-content: space-around;
      .router-link-active{
        color: #42b983;
      }
      li{
        flex: 1;
        text-align: center;
        display: flex;
        flex-direction: column;
        position: relative;
        .newsnum{
          position: absolute;
          top: -9px;
          right: 15px;
          text-align: center;
          width: 20px;
          height: 20px;
          background-color: red;
          border-radius: 50%;
          color: white;
          line-height: 20px;
        }
        span{
          flex: 1;
          i{
            font-size: 25px;
          }
          .icon-jia{
            color: white;
            padding: 6px;
            background-color: #FFCD1A;
            border-radius: 50%;
          }
        }
      }

    }
  }
</style>
