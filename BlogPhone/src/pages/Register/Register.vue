<template>
    <div class="register">
      <myheader :title="'注册'">
        <i class="iconfont icon-fanhui1 left" slot="left" @click="goback"></i>
      </myheader>
      <div class="register-container">
        <div class="weui-cells__title">注册</div>
        <div class="weui-cells weui-cells_form">
          <div class="weui-cell">
            <div class="weui-cell__hd"><label class="weui-label">用户名</label></div>
            <div class="weui-cell__bd">
              <input class="weui-input" placeholder="请输入用户名" v-model="username"/>
            </div>
          </div>
          <div class="weui-cell">
            <div class="weui-cell__hd"><label class="weui-label">密码</label></div>
            <div class="weui-cell__bd">
              <input class="weui-input" type="password" placeholder="请输入密码" v-model="password"/>
            </div>
          </div>
          <div class="weui-cell">
            <div class="weui-cell__hd"><label class="weui-label">确认密码</label></div>
            <div class="weui-cell__bd">
              <input class="weui-input" type="password" placeholder="请再次输入密码" v-model="repassword"/>
            </div>
          </div>
        </div>
        <a class="weui-btn weui-btn_primary btn-register" @click.prevent="register">注册</a>
        <div class="login-box">已有账号？立即去<router-link tag="span" to="login">登录</router-link></div>
      </div>

    </div>
</template>

<script>
  import myheader from 'components/myheader/my-header';
  import { Toast } from 'mint-ui';
    export default {
      data(){
        return{
          username:'',
          password:'',
          repassword:''
        }
      },
      components:{
        myheader
      },
      methods:{
        goback(){
          this.$router.go(-1);
        },
        register(){

          let username = this.username;
          let password = this.password;
          let repassword = this.repassword;
          this.axios.post('/user/register',{
            username,
            password,
            repassword
          }).then((res)=>{
            if(res.data.code){
              Toast(res.data.msg);
              return;
            }
            if(!res.data.code){
              Toast(res.data.msg);
              this.$router.push({path:'/login'});
            }
          })
        }
      }
    }
</script>

<style lang="less" scoped>
.register{
  .register-container{
    position: fixed;
    width: 100%;
    top: 88px;
    bottom: 0;
    .btn-register{
      width: 90%;
      margin-top: 30px;
    }
  }
  .login-box {
    color: grey;
    margin: 10px 30px;
    span {
      color: blue;
    }
  }
}
</style>
