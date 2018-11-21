<template>
  <div class="wrapper" ref="wrapper">
    <slot></slot>
  </div>
</template>

<script>
  import BScroll from 'better-scroll';

  export default {
    props: {
      probeType: {
        type: Number,
        default: 1
      },
      click: {
        type: Boolean,
        default: true
      },
      listenScroll: {
        type: Boolean,
        default: false
      },
      data: {
        type: Array,
        default: null
      },
      pullup: {
        type: Boolean,
        default: false
      },
      beforeScroll: {
        type: Boolean,
        default: false
      },
      refreshDelay: {
        type: Number,
        default: 20
      },
      threshold: {
        type: Number,
        default: 10000000000
      },
      stop: {
        type: Number,
        default: 45
      },
      toBottom: {
        type: Boolean,
        default: false
      }
    },
    mounted() {
      this.$nextTick(() => {
        this._initScroll();
      })
    },
    methods: {
      _initScroll() {
        if (!this.$refs.wrapper) {
          return
        }
        this.scroll = new BScroll(this.$refs.wrapper, {
          probeType: this.probeType,
          click: this.click,
          observeDOM:true,
          bounce: {
            top: true,
            bottom: true,
            left: true,
            right: true
          },
          pullDownRefresh: {
            threshold: this.threshold,
            stop: this.stop
          }
        });
        if (this.listenScroll) {
          this.scroll.on('scroll', (pos) => {
            this.$emit('scrolling', pos.y);
          })
        }
        if (this.threshold < 10000000000) {
          let me = this;
          let flag = false;
          this.scroll.on('scroll', (pos) => {
            if (pos.y > this.threshold) {
              flag = true;
            }
            if (flag && pos.y == this.stop) {
              this.$emit('change');
              this.$emit('refresh');
              flag = false
            }
          })
        }
      },
      toTop() {
        this.scroll.scrollTo(0, 0, 500)
      },
      _toBottom(t) {
        if (this.scroll){
          if (!t){
            this.scroll.scrollTo(0, this.scroll.maxScrollY, 500)
          }else {
            this.scroll.scrollTo(0, this.scroll.maxScrollY, 0)
          }
        }
      },
      disable() {
        this.scroll && this.scroll.disable()
      },
      enable() {
        this.scroll && this.scroll.enable()
      },
      refresh() {
        let y = this.scroll.y;
        this.scroll && this.scroll.refresh();
        if (y<0){
          this.scroll.scrollTo(0, y, 0);
        }
        this.toBottom && this._toBottom();
      }
    },
    watch: {
      data() {
        let _this = this;
        this.$nextTick(() => {
          _this.refresh()
        });
        setTimeout(()=>{
          this.refresh();
        },21)

      }
    }
  }
</script>

<style lang="less" scoped>

</style>
