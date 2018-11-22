<template>
  <div class="comment div-wrap">
    <myheader :title="to?'回复':'评论'">
      <i class="iconfont icon-fanhui1 left" slot="left" @click="goback"></i>
      <span slot="right" class="right" @click="comment">发送</span>
    </myheader>
    <div class="weui-cells weui-cells_form" v-if="userInfo._id">
      <div class="weui-cell">
        <div class="weui-cell__bd">
          <textarea class="weui-textarea" v-model="content" :placeholder="to?'回复'+to:'评论...'" rows="3"></textarea>
        </div>
      </div>
    </div>
    <unlogin v-else></unlogin>
  </div>
</template>

<script>
  import {mapState} from 'vuex';
  import myheader from 'components/myheader/my-header';
  import unlogin from '../../components/unlogin/unlogin';
  import {Toast} from 'mint-ui';

  export default {
    data() {
      return {
        to: this.$route.query.to || '',
        id: this.$route.query.id || '',
        writer: this.$route.query.writer || '',
        content: ''
      }
    },
    computed: {
      ...mapState([
        'userInfo'
      ])
    },
    components: {
      myheader,
      unlogin
    },
    methods: {
      goback() {
        this.$router.go(-1);
      },
      comment() {
        if (!this.content){
          Toast('内容不能为空！');
          return;
        }
        this.axios.post('/comment', {
          writer: this.writer,
          from: this.userInfo.username,
          to: this.to,
          pyq: this.id,
          content: this.content
        }).then((rs) => {
          if (this.writer === this.userInfo.username && this.to === this.userInfo.username) {
            this.$router.go(-1);
            Toast(rs.data.msg);
            return
          }
          if (this.to) {
            if (this.to === this.writer || this.writer === this.userInfo.username) {
              socket.emit('comment', this.to);
            } else {
              socket.emit('comment', this.writer);
              socket.emit('comment', this.to);
            }
          } else if (this.writer !== this.userInfo.username) {
            socket.emit('comment', this.writer)
          }
          this.$router.go(-1);
          Toast(rs.data.msg)
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .comment {

  }
</style>
