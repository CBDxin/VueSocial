<template>
  <div class="profile">
    <myheader :title="'我的'"></myheader>
    <div class="p-box">
      <div v-show="this.userInfo.username" class="p-content">
        <div class="weui-cells">
          <router-link tag="div" to="/updataavater" class="weui-cell weui-cell_access">
            <div class="weui-cell__bd">
              <p>头像</p>
            </div>
            <div class="weui-cell__ft">
              <div class="avater">
                <img :src="userInfo.avater"/>
              </div>
            </div>
          </router-link>
          <div class="weui-cell weui-cell_access">
            <div class="weui-cell__bd">
              <p>名字</p>
            </div>
            <div class="weui-cell__ft">{{userInfo.username}}</div>
          </div>
          <router-link tag="div" to="/updatasign" class="weui-cell weui-cell_access">
            <div class="weui-cell__bd">
              <p>签名</p>
            </div>
            <div class="weui-cell__ft">{{userInfo.signature}}</div>
          </router-link>
        </div>
        <a style="margin: 20px" class="weui-btn weui-btn_warn btn-login" @click.prevent="logout">退出登录</a>
      </div>
      <unlogin v-show="!this.userInfo.username"></unlogin>
    </div>
  </div>
</template>

<script>
  import myheader from '../../components/myheader/my-header.vue';
  import {mapState, mapMutations} from 'vuex';
  import {MessageBox, Toast} from 'mint-ui';
  import unlogin from '../../components/unlogin/unlogin';

  export default {
    computed: {
      ...mapState([
        'userInfo'
      ])
    },
    created() {
      this.getUserInfo();
    },
    methods: {
      ...mapMutations([
        'set_userInfo',
        'set_cmessage'
      ]),
      logout() {
        MessageBox.confirm('确定退出登录?').then(action => {
          this.axios.get("/user/logout").then(() => {
            this.set_userInfo({});
            this.set_cmessage({});
            Toast("下次再见╮(╯▽╰)╭")
          })
        }).catch(err => {

        })
      },
      getUserInfo() {
        this.axios.get('/profile').then(({data}) => {
          if (!data.code) {
            if (data.userInfo) {
              this.set_userInfo(data.userInfo);
            }
          }
        })
      }
    },
    components: {
      myheader,
      unlogin
    }
  }
</script>

<style lang="less" scoped>
  .p-box {
    position: absolute;
    top: 50px;
    bottom: 60px;
    width: 100%;
    background-color: #fcfcfc;
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
  }
</style>
