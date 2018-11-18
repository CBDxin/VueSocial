<template>
  <div class="ua">
    <myheader :title="'更改头像'">
      <i class="iconfont icon-fanhui1 left" slot="left" @click="goback"></i>
      <span slot="right" class="right" @click="updata">确定</span>
    </myheader>
    <div class="ua-box">
      <img :src="avater?avater:userInfo.avater" class="avater" alt="">
    </div>
    <input id="cp" type="file" style="display: none" @change="change" accept="image/*">
    <a style="margin: 20px; position: relative;bottom: -40px" class="weui-btn weui-btn_primary btn-login"
       @click.prevent="clickinput">选择头像</a>
  </div>
</template>

<script>
  import {mapState} from 'vuex';
  import myheader from 'components/myheader/my-header';
  import {Toast, Indicator} from 'mint-ui';

  export default {
    data() {
      return {
        file: '',
        avater: ''
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
      change(e) {
        let files = e.target.files;
        // 如果没有选中文件，直接返回
        if (files.length === 0) {
          return;
        }
        let reader;
        for (let i = 0; i < files.length; i++) {
          this.file = files[i];
          reader = new FileReader();
          if (this.file.size > self.maxSize) {
            Toast('图片太大，不允许上传！');
            return;
          }
        }
        reader.onload = (e) => {
          let img = new Image();
          img.onload = () => {
            let canvas = document.createElement('canvas');
            let ctx = canvas.getContext('2d');
            let w = img.width;
            let h = img.height;
            // 设置 canvas 的宽度和高度
            canvas.width = w;
            canvas.height = h;
            ctx.drawImage(img, 0, 0, w, h);
            let base64 = canvas.toDataURL('image/png');
            this.avater = base64;
          };
          img.src = e.target.result;
        };
        reader.readAsDataURL(this.file);
      },
      clickinput() {
        //我不知道为什么一次click不行。。。。。
        let cp = document.getElementById('cp');
        cp.click();
        cp.click();
      },
      goback() {
        this.$router.push({path: '/profile'});
      },
      updata() {
        if (!this.file) {
          Toast('请选择新的头像')
          return;
        }
        Indicator.open('更换中...');
        let self = this;
        let param = new FormData();
        param.append('username', this.userInfo._id);
        param.append('avater', this.file);
        if (this.userInfo.avater != 'http://localhost:3000/public/img/avater.jpg') {
          param.append('oldVal', this.userInfo.avater);
        }
        self.axios.post('/upload/uploadAvater', param, {
          headers: {
            /*'Content-Type': 'multipart/form-data'*/
            "Content-Type": "application/x-www-form-urlencoded"
          }
          /*"Content-Type":"application/x-www-form-urlencoded"*/
        }).then(function (result) {
          console.log(result.data);
          self.$router.push({path: '/home'});
          Indicator.close();
          Toast(result.data.msg)
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .ua {
    position: fixed;
    top: 50px;
    bottom: 60px;
    width: 100%;
    background-color: #fcfcfc;
    .ua-box {
      background-color: black;
      width: 200px;
      height: 200px;
      margin: 50px auto;
      position: relative;
      overflow: hidden;
      .avater {
        display: block;
        margin: 0 auto;
        width: 100%;
        height: auto;
        position: relative;
        top: 50%;
        transform: translateY(-50%);
      }
    }
  }
</style>
