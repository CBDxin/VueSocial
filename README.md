# VueSocial
something like QQ、weibo、weixin（仿微博、微信的聊天社交平台）
# VueSocial
something like QQ、weibo、weixin（仿微博、微信的聊天社交平台）
前后端分离的vue+express+socket.io练手项目 
---
## 预览
在线demo [VueSocial](http://47.107.66.252:3001/public/dist/#/home)（pc端按了f12后有个小问题，刷新一下就好）
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
## 待改进（要考试了，这个慢慢来）
1. 同一个用户多个设备同时登录时socket.io会出现问题，所以要限制登录？还是修改数据库结构？
2. 移动端的坑：有的浏览器会卡顿、Safari监听不到输入框按下搜索键（内心是崩溃的）
---
## 安装
  + 分别两个文件目录下安装依赖，在server文件夹下node app.js,在blogPhone下npm run dev，然后打开localhost：8080就可以了
---
## 项目部分图片
1. 首页
2. 登录
3. 消息
4. 聊天
5. 个人信息
6. 个人主页
7. 分享动态
8. 更改头像
9. 搜索页面
