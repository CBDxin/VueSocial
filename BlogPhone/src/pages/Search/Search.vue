<template>
  <div class="div-wrap search">
    <myheader :title="'搜索'"> </myheader>
    <div class="weui-cell search-wrap">
      <div class="weui-cell__bd">
        <i class="iconfont icon-sousuo"></i>
        <input @click="$router.push('/searchbar')" ref="input" class="weui-input" type="text" placeholder="搜索"/>
      </div>
    </div>
    <div v-if="searchList.length>0" class="history">
      <ul class="list">
        <li @click="$router.push({path:'/searchbar',query: {item}})" v-for="(item,index) in searchList" :key="index" class="list-item">
          {{item}}
          <i @click.stop="_deleteOne(index)" class="iconfont icon-chucuo"></i>
        </li>
      </ul>
      <div @click="_clear" class="clear">清除所有记录</div>
    </div>
  </div>
</template>

<script>
  import myheader from '../../components/myheader/my-header.vue';
  import {deleteOne,clear} from '../../common/js/localStorage'

  export default {
    created(){
      this.getList();
    },
    components: {
      myheader,
    },
    data(){
      return {
        searchList:[]
      }
    },
    methods:{
      getList(){
        if (window.localStorage.search){
          this.searchList = JSON.parse(window.localStorage.search);
        }
      },
      _deleteOne(index){
        deleteOne(index);
        this.getList();
      },
      _clear(){
        clear();
        this.getList();
      }
    }
  }
</script>

<style lang="less" scoped>
.search{
  .search-wrap{
    background-color: rgba(93, 93, 93, 0.05);
    box-shadow: 1px 2px 2px gainsboro;
    .icon-sousuo{
      position: absolute;
      left: 8px;
    }
    .weui-input{
      background-color: white;
      border-radius: 5px;
      width: 90%;
      display: block;
      padding: 0 5px;
      margin-left: 5%;
    }
  }
  .history{
    margin: 10px 0;
    .list{
      .list-item{
        background-color: white;
        padding: 5px 50px 5px 25px;
        font-size: 16px;
        border-bottom: 1px gainsboro solid;
        position: relative;
        overflow: hidden;
        text-overflow: ellipsis;
        height: 30px;
        line-height: 30px;
        i{
          position: absolute;
          right: 15px;
          top:5px;
        }
      }
    }
    .clear{
      text-align: center;
      color: gray;
      background-color: white;
      height: 45px;
      line-height: 45px;
      box-shadow: 1px 2px 2px gainsboro;
    }
  }
}
</style>
