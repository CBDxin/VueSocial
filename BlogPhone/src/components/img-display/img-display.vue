<template>
  <div ref="wrapper" class="image">
    <div v-if="data.length" class="wrapper" :class="classname">
      <div class="flex-img" ref="fleximg" :key="index" v-for="(img,index) in data">
        <img class="item" @click="showimg(data,index)" ref="item" :src="img">
      </div>
    </div>
  </div>

</template>

<script>

  import {mapMutations} from 'vuex'

  export default {
    data() {
      return {}
    },
    computed: {
      classname() {
        return {
          one: this.data.length == 1,
          four: this.data.length == 4,
          nine: this.data.length != 1 && this.data.length != 4
        }
      }
    },
    mounted() {
      this.$nextTick(() => {
        setTimeout(() => {
          window.addEventListener('resize', () => {
            this.$router.push({path: '/home'});
            this.$router.go(0);
          })
        }, 1)
        this.initimg()
      })

    },
    /*      watch: {
            $route(to, from) {
              if (from.path == '/news' && to.path == '/home') {
                this.initimg()
              }
            }
          },*/
    methods: {
      showimg(data, index) {
        this.set_imgdata({data})
        this.$router.push({path: '/showimg', query: {index}});
      },
      ...mapMutations([
        'set_imgdata'
      ]),
      initimg() {
        this.$nextTick(() => {
          if (this.data.length != 1) {
            /*this.$refs.flex-img.style.width  =  this.$refs.item[0].clientWidth*/
            this.$refs.item.forEach((item, index) => {
              this.$refs.fleximg[index].style.height = item.clientWidth + 'px';
              this.$refs.fleximg[index].style.width = item.clientWidth + 'px';
              if (item.clientWidth > item.clientHeight) {
                item.style.height = item.clientWidth + 'px';
                item.style.width = 'auto';
              } else {
                item.style.top = '50%';
                item.style.transform = 'translateY(-50%)';
                item.style.left = '0';
              }
            })
          }
        })

      }
    },
    props: {
      data: {
        type: Array,
        default: []
      }
    },
    watch: {
      data() {
        this.initimg()
      }
    }
  }
</script>

<style lang="less" scoped>
  .image {
    .one {
      text-align: center;
      .flex-img {
        margin: 0 auto;
        padding: 1px;
        width: 80%;
        img {
          width: 100%;
        }
      }
    }
    .nine {
      display: flex;
      flex-wrap: wrap;
      .flex-img {
        margin: 2px;
        width: 30%;
        overflow: hidden;

        img {
          width: 100%;
          position: relative;
          display: block;
          left: 50%;
          transform: translateX(-50%);
        }
      }
    }
    .four {
      display: flex;
      flex-wrap: wrap;
      .flex-img {
        margin: 2px;
        width: 48%;
        overflow: hidden;
        box-sizing: content-box;

        img {
          width: 100%;
          position: relative;
          display: block;
          left: 50%;
          transform: translateX(-50%);
        }
      }
    }
  }
</style>
