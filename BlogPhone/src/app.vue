<template>
  <div class="app">
    <mytab v-if="$route.meta.showFooter"></mytab>
    <transition :name="transitionName">
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
    </transition>
    <transition :name="transitionName">
      <router-view v-if="!$route.meta.keepAlive"></router-view>
    </transition>
  </div>
</template>

<script>
  import mytab from 'components/FooterGuide/FooterGuide';
  import {mapState, mapMutations} from 'vuex'

  export default {
    computed: {
      ...mapState([
        'cunread'
      ])
    },
    components: {
      mytab
    },
    created() {
      this.$router.currentRoute.path != '/' && this.$router.push('/home');
      this.updateBySocket();
      this._set_resize();
    },
    methods: {
      ...mapMutations([
        'update_cunread',
        'update_chatList',
        'set_resize',
      ]),
      _set_resize(){
        window.addEventListener('resize',()=>{
          this.set_resize();
        })
      },
      updateBySocket() {
        socket.removeAllListeners();
        socket.on('receiveComment', () => {
          this.update_cunread();
        });
        socket.on('receiveMsg', (data) => {
          let from_user = data.from_user;
          //如果当前页面为与from_user的对话框，则交由对话框页面处理
          if (this.$route.query.chatwith == from_user) {
            return;
          }
          this.update_chatList(data)
        })
      }
    },
    data() {
      return {
        transitionName: ''
      }
    },
    watch: {//使用watch 监听$router的变化
      $route(to, from) {
        //如果to索引大于from索引,判断为前进状态,反之则为后退状态
        /*if (to.meta.index > from.meta.index) {
          //设置动画名称
          this.transitionName = 'slide-left';
        } else {
          this.transitionName = 'slide-right';
        }*/
        /*if (to.meta.fade) {
          this.transitionName = 'fade'
        }*/
      }
    }
  }
</script>

<style lang="less">
  /*.slide-right-enter-active,
  .slide-right-leave-active,
  .slide-left-enter-active,
  .slide-left-leave-active {
    !* will-change: transform;*!
    transition: all 500ms;
  }
  .slide-right-enter {
    opacity: 0;
    transform: translateX(-100%);
  }
  .slide-right-enter-to {
    transform: translateX(0);
  }
  .slide-right-leave-to {
    transform: translateX(100%);
  }
  .slide-left-enter {
    transform: translateX(100%);
  }
  .slide-left-leave-to {
    transform: translateX(-100%);
  }*/
  .v-enter-active, .v-leave-active {
    transition: all 0.5s;
  }

  .v-enter, .v-leave-active {
    opacity: 0;
  }
  .avater {
    background-color: black;
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

  .scroll-wrap {
    height: 100%;
    overflow: hidden;
  }
//页面定位
  .div-wrap {
    position: fixed;
    top: 50px;
    bottom: 60px;
    width: 100%;
    background-color: #fcfcfc;
  }
</style>
