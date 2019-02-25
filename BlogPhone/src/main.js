import Vue from 'vue';
import App from './app';
import router from 'src/router'
import fastclick from 'fastclick';
import VueLazyload from 'vue-lazyload';
import axios from 'axios';
import store from 'src/store'

Vue.prototype.axios = axios;

fastclick.attach(document.body);

import 'common/css/reset.css';
import 'weui/dist/style/weui.min.css';
import 'mint-ui/lib/style.css';
//时间转换
Vue.filter('chatTime', function (valueTime) {
  if (valueTime) {
    valueTime = new Date(valueTime);
    let newData = Date.parse(new Date());
    let diffTime = Math.abs(newData - valueTime);
    let date = new Date(valueTime);
    let y = date.getFullYear();
    let m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    let d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    let h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    let minute = date.getMinutes();
    let second = date.getSeconds();
    minute = minute < 10 ? ('1' + minute) : minute;
    second = second < 10 ? ('0' + second) : second;
    if (diffTime > 24 * 3600 * 1000) {
      return m + '-' + d + ' ' + h + ':' + minute;
    } else {
      return h + ':' + minute;
    }
  }
});

Vue.filter('fomatTime', function (valueTime) {
  if (valueTime) {
    valueTime = new Date(valueTime);
    let newData = Date.parse(new Date());
    let diffTime = Math.abs(newData - valueTime);
    if (diffTime > 7 * 24 * 3600 * 1000) {
      let date = new Date(valueTime);
      let y = date.getFullYear();
      let m = date.getMonth() + 1;
      m = m < 10 ? ('0' + m) : m;
      let d = date.getDate();
      d = d < 10 ? ('0' + d) : d;
      let h = date.getHours();
      h = h < 10 ? ('0' + h) : h;
      let minute = date.getMinutes();
      let second = date.getSeconds();
      minute = minute < 10 ? ('1' + minute) : minute;
      second = second < 10 ? ('0' + second) : second;
      return m + '-' + d + ' ' + h + ':' + minute;

    } else if (diffTime < 7 * 24 * 3600 * 1000 && diffTime > 24 * 3600 * 1000) {
      // //注释("一周之内");

      // let time = newData - diffTime;
      let dayNum = Math.floor(diffTime / (24 * 60 * 60 * 1000));
      return dayNum + "天前";

    } else if (diffTime < 24 * 3600 * 1000 && diffTime > 3600 * 1000) {
      // //注释("一天之内");
      // let time = newData - diffTime;
      let dayNum = Math.floor(diffTime / (60 * 60 * 1000));
      return dayNum + "小时前";

    } else if (diffTime < 3600 * 1000 && diffTime > 0) {
      // //注释("一小时之内");
      // let time = newData - diffTime;
      let dayNum = Math.floor(diffTime / (60 * 1000));
      return dayNum + "分钟前";

    }
  }
});

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
});

