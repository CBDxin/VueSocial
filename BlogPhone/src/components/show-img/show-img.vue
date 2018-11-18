<template>
  <div class="show-img" @click="goback" ref="box">
    <div class="times" @click.stop="goback">&times;</div>
    <div class="slider" ref="slider">
      <div class="slider-group" ref="sliderGroup">
        <div v-for="(imgsrc,index) in img" :key="index">
          <div class="img-box">
            <img :src="imgsrc"/>
          </div>
        </div>
      </div>
      <div class="dots" v-if="img.length>1">
      <span class="dot" :key="index" :class="{active: currentPageIndex === index }"
            v-for="(item, index) in dots"></span>
      </div>
    </div>
  </div>
</template>

<script>
  import {addClass} from 'common/js/dom';
  import BScroll from 'better-scroll';
  import {mapState} from 'vuex'

  export default {
    name: 'slider',
    computed: {
      ...mapState([
        'imgdata'
      ]),
      img() {
        return this.imgdata.data
      }

    },
    props: {
      loop: {
        type: Boolean,
        default: true
      },
      autoPlay: {
        type: Boolean,
        default: false
      },
      interval: {
        type: Number,
        default: 4000
      }
    },
    data() {
      return {
        dots: [],
        currentPageIndex: this.$route.query.index
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.$refs.box.style.height = window.innerHeight + 'px'
        this._setSliderWidth();
        this._initDots();
        if (this.img.length > 1) {
          this._initSlider()
        }

        if (this.autoPlay) {
          this._play()
        }
      });

      window.addEventListener('resize', () => {

        if (!this.slider) {
          return
        }
        this._setSliderWidth(true)
        this.slider.refresh()
      })
    },
    beforeDestroy() {
      clearTimeout(this.timer)
    },
    methods: {
      goback() {
        this.$router.go(-1);
      },
      _setSliderWidth(isResize) {
        this.children = this.$refs.sliderGroup.children

        let width = 0
        let sliderWidth = this.$refs.slider.clientWidth
        for (let i = 0; i < this.children.length; i++) {
          let child = this.children[i]
          addClass(child, 'slider-item')

          child.style.width = sliderWidth + 'px'
          width += sliderWidth
        }
        if (this.loop && !isResize) {
          width += 2 * sliderWidth
        }
        if (this.img.length > 1) {
          this.$refs.sliderGroup.style.width = width + 'px'
        }

      },
      _initSlider() {
        this.slider = new BScroll(this.$refs.slider, {
          scrollX: true,
          scrollY: false,
          momentum: false,
          snap: {
            loop: this.loop,
            threshold: 0.3,
            speed: 400
          }
        });

        this.slider.goToPage(this.currentPageIndex, 0, 0);


        this.slider.on('scrollEnd', () => {
          let pageIndex = this.slider.getCurrentPage().pageX;
          this.currentPageIndex = pageIndex;

          if (this.autoPlay) {
            this._play()
          }
        });

        this.slider.on('beforeScrollStart', () => {
          if (this.autoPlay) {
            clearTimeout(this.timer)
          }
        })
      },
      _initDots() {
        this.dots = new Array(this.children.length)
      },
      _play() {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.slider.next();
        }, this.interval);
      }
    },
    watch: {
      data() {
        this.slider.refresh()
      },

    }
  }
</script>

<style lang="less" scoped>
  .show-img {
    position: relative;
    height: 700px;
    background-color: black;
    .times {
      position: fixed;
      top: 0;
      right: 10px;
      float: right;
      color: ghostwhite;
      opacity: 0.8;
      font-size: 30px;
    }
    .slider {
      min-height: 1px;
      position: relative;
      top: 50%;
      transform: translateY(-50%);
      .slider-group {
        position: relative;
        overflow: hidden;
        white-space: nowrap;
        align-items: center;
        .slider-item {
          height: 600px;
          float: left;
          box-sizing: border-box;
          overflow: hidden;
          text-align: center;
          .img-box {
            height: 100%;
            img {
              width: 100%;
              display: block;
              position: relative;
              top: 50%;
              transform: translateY(-50%);
            }
          }

        }
      }
    }

    .dots {
      position: fixed;
      right: 0;
      left: 0;
      bottom: 70px;
      text-align: center;
      font-size: 0;
      .dot {
        transition: all 0.3s;
        display: inline-block;
        margin: 0 4px;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: white;
        opacity: 0.5;
      }
      .active {
        width: 20px;
        border-radius: 5px;
        opacity: 0.8;
      }
    }
  }


</style>
