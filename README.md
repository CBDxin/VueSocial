# VueSocial
something like QQ、weibo、weixin（仿微博、微信的聊天社交平台）前后端分离的vue+express+socket.io练手项目 

---
## 内容
1. [预览](#预览)
2. [技术栈](#技术栈)
3. [已实现功能](#已实现功能)
4. [待改进](#待改进)
5. [安装](#安装)
6. [项目部分图片](#项目部分图片)
7. [分析总结](#分析总结)

## 预览
在线demo [VueSocial](http://47.107.66.252:3001/public/dist/#/home)（pc端按了f12后有个小问题，刷新一下就好,resize触发的问题，待改进）

---
## 技术栈
1. vue：前端框架
2. express：后端框架
3. socket.io：实现实时消息推送
4. axios：一个基于 Promise 的 HTTP 库，发送ajax请求
5. localStorage：浏览器本地存储
6. Webpack：模块打包工具，前端项目构建工具
7. mongoose：mongodb的框架
8. better-scroll:一款重点解决移动端(已支持 PC)各种滚动场景需求的插件

---
## 已实现功能
1. 登录注册
2. 图片分享：上传本地图片到云服务器（我用的是阿里云的oss，可以根据自己的情况修改router/upload.js的代码）
3. 头像修改
4. 评论：socket.io
5. 实时消息推送
6. 查看个人主页
7. 实时聊天：socket.io
8. 首页下拉刷新：better-scroll
9. 搜索：搜索用户与动态、使用localStorage保存历史搜索记录

---
## 待改进
1. 同一个用户多个设备同时登录时socket.io会出现问题，所以要限制登录？还是修改数据库结构？
2. 移动端的坑：有的浏览器会卡顿、Safari监听不到输入框按下搜索键（内心是崩溃的）
3. resize时better-scroll的小bug
4.没做分页请求，都是一次性请求全部数据

---
## 安装
分别两个文件目录下安装依赖npm install，在server文件夹下node app.js,在blogPhone下npm run dev，然后打开localhost：8081就可以了
  
---
## 项目部分图片
### 首页
  <img width="350" src="https://github.com/CBDxin/img/blob/master/img/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20181118231148.jpg"/>
  
### 登录
  <img width="350" src="https://github.com/CBDxin/img/blob/master/img/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20181118231159.jpg"/>
  
### 消息
  <img width="350" src="https://github.com/CBDxin/img/blob/master/img/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20181118231142.jpg"/>
  
### 聊天
  <img width="350" src="https://github.com/CBDxin/img/blob/master/img/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20181118231154.jpg"/>
  
### 个人信息
  <img width="350" src="https://github.com/CBDxin/img/blob/master/img/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20181118231120.jpg"/>
  
### 个人主页
  <img width="350" src="https://github.com/CBDxin/img/blob/master/img/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20181118231131.jpg"/>
  
### 分享动态
  <img width="350" src="https://github.com/CBDxin/img/blob/master/img/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20181118231054.jpg"/>
  
### 更改头像
  <img width="350" src="https://github.com/CBDxin/img/blob/master/img/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20181118231115.jpg"/>
  
### 搜索页面
  <img width="350" src="https://github.com/CBDxin/img/blob/master/img/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20181118231126.jpg"/>
  <img width="350" src="https://github.com/CBDxin/img/blob/master/img/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20181118231137.jpg"/>

---
## 分析总结
### socket.io
**服务端:**
```
  let serve = app.listen(3001);
  const io = socketio(serve);
  io.on('connection', socket => {
    socket.on('login', (username) => {
                console.log(username+'上线了！');
            });
  }
```
**客户端:**
在index中引入
```
    <script src="http://47.107.66.252:3001/socket.io/socket.io.js"></script>
    <script type="text/javascript">
      const socket = io.connect('http://47.107.66.252:3001');
    </script>
```
这部分的数据库写得有点乱（很乱。。。），但是socket.io的使用其实很方便，无非就是on和emit
+ `socket.emit()`：向建立该连接的客户端发送消息
+ `socket.on()`：监听客户端发送信息
+ `io.to(socketid).emit()`：向指定客户端发送消息
+ `socket.broadcast.emit()`：向除去建立该连接的客户端的所有客户端广播
+ `io.sockets.emit()`：向所有客户端广播

### vue
总结一些项目遇到的难点
1. ajax在生命周期函数created发起，dom操作在生命周期函数mounted中操作，如果需要dom元素完全挂起后在操作则还需要在$nextTick中操作，例如：
```
mounted() {
      this.$nextTick(() => {
        this.initImg();
      })
    }
```
2. 动态生成（例如通过v-for）的dom元素在mounted中通过ref是获取不到的，需要在生命周期函数updated中获取
3. keepalive后的组件如果需要在跳转进入时进行操作可通过路由守卫和生命周期函数actived配合使用，如：
```
beforeRouteEnter(to, from, next) {
      if (from.path == '/upload' ) {
        next(vm => {
          vm._getList = true
        })
      } else {
        next()
      }
    }
```
```
activated() {
      this.$nextTick(() => {
        if (this._getList) {
          this.getPyqLists();
        }
      })
    }
```

## 图片上传及预览部分
html部分主要是借助了weui的样式
```
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
                    <input @change="change" id="uploaderInput" class="weui-uploader__input " type="file"
                          multiple accept="image/*">
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

```
重点部分在于
```
<ul class="weui-uploader__files" id="uploaderFiles">
  <li ref="files" class="weui-uploader__file" v-for="(image,index) in images" :key="index"
      :style="'backgroundImage:url(' + image +' )'"><span @click="deleteimg(index)" class="x">&times;</span></li>
</ul>
<div v-show="!this.$refs.files||this.$refs.files.length < maxCount" class="weui-uploader__input-box">
  <input @change="change" id="uploaderInput" class="weui-uploader__input" type="file"
         multiple accept="image/*">
</div>
```
通过` @change="change"`监听图片的上传，把图片转成base64后（后面会讲怎么转base64）将base64的地址加入到images数组，通过` v-for="(image,index) in images"`把要上传的图片在页面中显示出来，即达到了预览的效果

js部分
data部分
```
data() {
      return {
        content: '',//分享动态的文字内容
        maxSize: 10240000 / 2,//图片的最大大小
        maxCount: 8,//最大数量
        filesArr: [],//保存要上传图片的数组
        images: []//转成base64后的图片的数组
      }
    }
```
delete方法
```
deleteimg(index) {
        this.filesArr.splice(index, 1);
        this.images.splice(index, 1);
      }
```
change方法
```
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
      }
```
put方法把filesArr中保存的图片通过axios发送到后端,注意要设置headers信息
```
put() {
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
            "Content-Type": "application/x-www-form-urlencoded"
          }
        }).then(function (result) {
          console.log(result.data);
          self.$router.push({path: '/home'});
          Indicator.close();
          Toast(result.data.msg)
        })
      }
```

后端通过multer模块保存传输的图片，再把保存下来的图片发送到阿里云oss（这个可以根据自己的使用情况变化）
```
let filePath;
let fileName;

let Storage = multer.diskStorage({
    destination: function (req, file, cb) {//计算图片存放地址
        cb(null, './public/img');
    },
    filename: function (req, file, cb) {//图片文件名
        fileName = Date.now() + '_' + parseInt(Math.random() * 1000000) + '.png';
        filePath = './public/img/' + fileName;
        cb(null, fileName)
    }
});
let upload = multer({storage: Storage}).any();//file2表示图片上传文件的key

router.post('/uploadFile', function (req, res, next) {
    upload(req, res, function (err) {
        let content = req.body.content || '';
        let username = req.body.username;
        let imgs = [];//要保存到数据库的图片地址数组
        if (err) {
            return res.end(err);
        }
        if (req.files.length === 0) {
            new Pyq({
                writer: username,
                content: content
            }).save().then((result) => {
                res.json({
                    result: result,
                    code: '0',
                    msg: '上传成功'
                });
            })
        }
        /*client.delete('public/img/1.png', function (err) {
            console.log(err)
        });*/
        let i = 0;
        req.files.forEach((item, index) => {
            let filePath = `./public/img/${item.filename}`;
            put(item.filename,filePath,(result)=>{
                imgs.push(result.url);
                i++;
                if (i === req.files.length) {
                //forEach循环是同步的，但上传图片是异步的，所以用一个i去标记图片是否全部上传成功
                //这时才把数据保存到数据库
                    new Pyq({
                        content: content,
                        writer: username,
                        pimg: imgs
                    }).save().then(() => {
                        res.json({
                            code: '0',
                            msg: '发布成功'
                        });
                    })
                }
            })
        })
    })
});
```

---
更新中...

# 如果觉得这个项目对你有帮助，请留下你的star，谢谢(＾－＾)
