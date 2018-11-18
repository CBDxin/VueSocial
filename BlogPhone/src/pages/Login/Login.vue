<template>
  <div class="login">
    <myheader :title="'登录'">
      <i class="iconfont icon-fanhui1 left" slot="left" @click="goback"></i>
    </myheader>
    <div class="login-container">
      <div class="weui-cells__title">登录</div>
      <div class="weui-cells weui-cells_form">
        <div class="weui-cell">
          <div class="weui-cell__hd"><label class="weui-label">用户名</label></div>
          <div class="weui-cell__bd">
            <input  class="weui-input" placeholder="请输入用户名" v-model="username"/>
          </div>
        </div>
        <div class="weui-cell">
          <div class="weui-cell__hd"><label class="weui-label">密码</label></div>
          <div class="weui-cell__bd">
            <input @click.stop class="weui-input" type="password" placeholder="请输入密码" v-model="password"/>
          </div>
        </div>
      </div>
      <a class="weui-btn weui-btn_primary btn-login" @click.prevent="login">登录</a>
      <div class="register-box">还没账号？立即去
        <router-link tag="span" to="register">注册</router-link>
      </div>
    </div>
  </div>
</template>

<script>
  import myheader from 'components/myheader/my-header';
  import {Toast} from 'mint-ui';
  import {mapMutations, mapState} from 'vuex'

  export default {
    computed: {
      ...mapState([
        'userInfo'
      ])
    },
    components: {
      myheader
    },
    data() {
      return {
        username: '',
        password: ''
      }
    },
    methods: {
      ...mapMutations([
        'set_userInfo',
      ]),
      goback() {
        this.$router.push({path: '/home'});
      },
      login() {
        let username = this.username;
        let password = this.password;
        this.axios.post('/user/login', {
          username,
          password
        }).then((res) => {
          if (res.data.code === 2) {
            Toast(res.data.msg);
            return;
          }
          if (res.data.code === 1) {
            Toast(res.data.msg);
            return;
          }
          if (!res.data.code) {
            Toast(res.data.msg);
            let username = res.data.userInfo.username;
            this.$router.push({path: '/home'});
            socket.emit('login', username);
          }
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .login {
    .login-container {
      position: fixed;
      width: 100%;
      top: 88px;
      bottom: 0;
      .btn-login {
        width: 90%;
        margin-top: 30px;
      }
    }
    .register-box {
      color: grey;
      margin: 10px 30px;
      span {
        color: blue;
      }
    }
  }
</style>
