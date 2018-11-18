<template>
  <div class="p-tip">
    <img class="p-tipimg" src="../../common/image/p-tip.jpg" alt="">
    <div class="text">你还没有登录</div>
    <div class="text">请先
      <router-link to="/login" style="color: blue">登录</router-link>
    </div>
  </div>
</template>

<script>
  export default {}
</script>

<style lang="less" scoped>
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
</style>
