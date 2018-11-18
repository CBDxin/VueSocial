<template>
  <div class="un">
    <myheader :title="'设置名称'">
      <i class="iconfont icon-fanhui1 left" slot="left" @click="goback"></i>
      <span slot="right" class="right" @click="updata">确定</span>
    </myheader>
    <div class="weui-cells__title">用户名</div>
    <div class="weui-cells">
      <div class="weui-cell">
        <div class="weui-cell__bd">
          <input v-model="username" class="weui-input" type="text" placeholder="设置新的名称"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex';
  import myheader from 'components/myheader/my-header';
  import {Toast} from 'mint-ui';

  export default {
    data() {
      return {
        username: ''
      }
    },
    computed: {
      ...mapState([
        'userInfo'
      ])
    },
    components: {
      myheader
    },
    methods: {
      goback() {
        this.$router.push({path: '/profile'});
      },
      updata() {
        let newusername = this.username;
        let oldusername = this.userInfo.username;
        this.axios.post('/profile/un', {
          newusername,
          oldusername
        }).then((res) => {
          if (res.data.code) {
            Toast(res.data.msg);
            return;
          }
          Toast(res.data.msg);
          this.$router.push({path: '/profile'});
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .un {
    position: fixed;
    top: 50px;
    bottom: 60px;
    width: 100%;
    background-color: #fcfcfc;
  }
</style>
