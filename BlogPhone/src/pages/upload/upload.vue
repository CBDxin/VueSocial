<template>
  <div>
    <myheader :title="'发布动态'">
      <i class="iconfont icon-fanhui1 left" slot="left" @click="goback"></i>
    </myheader>
    <div class="upload">
      <div v-if="userInfo._id">
        <!--图片上传-->
        <div class="weui-gallery" id="gallery">
          <span class="weui-gallery__img" id="galleryImg"></span>
          <div class="weui-gallery__opr">
            <a href="javascript:" class="weui-gallery__del">
              <i class="weui-icon-delete weui-icon_gallery-delete"></i>
            </a>
          </div>
        </div>
        <div class="weui-cells weui-cells_form">
          <div class="weui-cell">
            <div class="weui-cell__bd">
              <textarea class="weui-textarea" v-model="content" placeholder="你想说啥" rows="3"></textarea>
            </div>
          </div>
          <div class="weui-cell">
            <div class="weui-cell__bd">
              <div class="weui-uploader">
                <div class="weui-uploader__bd">
                  <ul class="weui-uploader__files" id="uploaderFiles">
                    <li ref="files" class="weui-uploader__file" v-for="(image,index) in images" :key="index"
                        :style="'backgroundImage:url(' + image +' )'"><span @click="deleteimg(index)" class="x">&times;</span></li>
                  </ul>
                  <div v-show="images.length < maxCount" class="weui-uploader__input-box">
                    <input @change="change" id="uploaderInput" class="weui-uploader__input zjxfjs_file" type="file"
                           accept="image/*">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <a class="weui-btn weui-btn_primary btn-put" style="margin: 20px " @click.prevent.once="put">发送</a>
      </div>
      <unlogin v-else> </unlogin>
    </div>
  </div>
</template>

<script>
  import {Toast, Indicator} from 'mint-ui';
  import myheader from '../../components/myheader/my-header.vue';
  import unlogin from '../../components/unlogin/unlogin'
  import {mapState} from 'vuex';

  export default {
    computed: {
      ...mapState([
        'userInfo'
      ])
    },
    components: {
      myheader,
      unlogin
    },
    data() {
      return {
        content: '',
        msg: 'Hello World!',
        maxSize: 10240000 / 2,
        maxCount: 8,
        filesArr: [],
        images: []
      }
    },
    methods: {
      goback() {
        this.$router.go(-1);
      },
      deleteimg(index) {
        this.filesArr.splice(index, 1);
        this.images.splice(index, 1);
      },
      change(e) {
        let files = e.target.files;
        // 如果没有选中文件，直接返回
        if (files.length === 0) {
          return;
        }
        if (this.images.length + files.length > this.maxCount) {
          Toast('最多只能上传' + this.maxCount + '张图片！');
          return;
        }
        let reader;
        let file;
        let images = this.images;
        for (let i = 0; i < files.length; i++) {
          file = files[i];
          this.filesArr.push(file);
          reader = new FileReader();
          if (file.size > self.maxSize) {
            Toast('图片太大，不允许上传！');
            continue;
          }
          reader.onload = (e) => {
            let img = new Image();
            img.onload = function () {
              let canvas = document.createElement('canvas');
              let ctx = canvas.getContext('2d');
              let w = img.width;
              let h = img.height;
              // 设置 canvas 的宽度和高度
              canvas.width = w;
              canvas.height = h;
              ctx.drawImage(img, 0, 0, w, h);
              let base64 = canvas.toDataURL('image/png');
              images.push(base64);
            };
            img.src = e.target.result;
          };
          reader.readAsDataURL(file);
        }
      },
      put() {
        if (!this.content&&!this.filesArr.length){
          Toast('内容不能为空！');
          return;
        }
        Indicator.open('发布中...');
        let self = this;
        let content = this.content;
        let param = new FormData();
        param.append('content', content);
        param.append('username', this.userInfo._id);
        this.filesArr.forEach((file) => {
          param.append('file2', file);
        });
        self.axios.post('/upload/uploadFile', param, {
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
  .upload {
    position: fixed;
    top: 50px;
    bottom: 60px;
    width: 100%;
    background-color: #fcfcfc;
    .weui-cells {
      margin-top: 0;
    }
    .weui-uploader__file {
      position: relative;
      margin-top: 6px;
      .x {
        text-align: center;
        background-color: black;
        font-size: 20px;
        line-height: 23px;
        color: white;
        position: absolute;
        right: -0.3rem;
        top: -0.3rem;
        width: 25px;
        height: 25px;
        border-radius: 50%;
        opacity: 0.8;
      }
    }
    .weui-uploader__input-box {
      margin-top: 6px;
    }
    .p-tip {
      margin: 20px 0 10px 0;
      .p-tipimg {
        width: 100%;
        padding-bottom: 20px;
      }
      .text {
        color: grey;
        font-size: 16px;
        line-height: 25px;
        text-align: center;
      }
    }

  }
</style>
