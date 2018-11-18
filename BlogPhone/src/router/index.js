import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../pages/Home/Home.vue';
import News from '../pages/News/News.vue';
import Upload from '../pages/upload/upload.vue';
import Search from '../pages/Search/Search.vue';
import SearchBar from '../pages/Search/SearchBar.vue';
import Profile from '../pages/Profile/Profile.vue';
import Login from '../pages/Login/Login.vue';
import Register from '../pages/Register/Register.vue';
import Showimg from '../components/show-img/show-img';
import Updataname from '../components/updataname/updataname';
import Updatasign from '../components/updatasign/updatasign';
import Updataavater from '../components/updataavater/updataavater';
import Comment from '../components/comment/comment';
import Comlist from '../components/comlist/comlist';
import Chat from '../components/chat/chat';
import Pindex from '../components/personalIndex/pindex';

Vue.use(VueRouter);


let router = new VueRouter({
  routes: [
    {
      path: '/home',
      component: Home,
      meta: {keepAlive: true, showFooter: true, index: 1}//当前的.vue文件需要缓存
    },
    {
      path: '/search',
      component: Search,
      meta: {keepAlive: false, showFooter: true, index: 3}
    },
    {
      path: '/searchbar',
      component: SearchBar,
      meta: {keepAlive: false, showFooter: false}
    },
    {
      path: '/news',
      component: News,
      meta: {keepAlive: true, showFooter: true, index: 2}
    },
    {
      path: '/upload',
      component: Upload,
      meta: {keepAlive: false}
    },
    {
      path: '/profile',
      component: Profile,
      meta: {keepAlive: false, showFooter: true, index: 4}
    },
    {
      path: '/login',
      component: Login,
      meta: {fade: true}
    },
    {
      path: '/pindex',
      component: Pindex,
      meta: {keepAlive: false,fade: true}
    },
    {
      path: '/register',
      component: Register,
      meta: {fade: true}
    },
    {
      path: '/showimg',
      component: Showimg,
      meta: {fade: true}
    },
    {
      path: '/updataavater',
      component: Updataavater,
      meta: {fade: true}
    },
    {
      path: '/comment',
      component: Comment,
      meta: {fade: true}
    },
    {
      path: '/comlist',
      component: Comlist,
      meta: {fade: true}
    },
    {
      path: '/chat',
      component: Chat,
      meta: {fade: true}
    },
    {
      path: '/updataname',
      component: Updataname,
      meta: {fade: true}
    },
    {
      path: '/updatasign',
      component: Updatasign,
      meta: {fade: true}
    },
    {
      path: '/',
      redirect: '/profile'
    }
  ]
});




export default router;
