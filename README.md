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
`socket.emit()`：向建立该连接的客户端发送消息
`socket.on()`：监听客户端发送信息
`io.to(socketid).emit()`：向指定客户端发送消息
`socket.broadcast.emit()`：向除去建立该连接的客户端的所有客户端广播
`io.sockets.emit()`：向所有客户端广播

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

---
更新中...

# 如果觉得这个项目对你有帮助，请留下你的star，谢谢(＾－＾)V
