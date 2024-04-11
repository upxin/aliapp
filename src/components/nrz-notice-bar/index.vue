<template>
  <view
    class="tui-notice__bar"
    :class="{ 'tui-notice__fixed': isFixed }"
    :style="{
      backgroundColor: backgroundColor,
      paddingTop: padding[0] || 0,
      paddingRight: padding[1] || 0,
      paddingBottom: padding[2] || padding[0] || 0,
      paddingLeft: padding[3] || padding[1] || 0,
      height: scrollable || single ? height + 'rpx' : 'auto',
      top: isFixed ? top : 'auto',
    }"
    @click="onClick"
  >
    <view v-if="$slots.left" class="tui-notice__shrink" @tap.stop="leftClick">
      <slot name="left"></slot>
    </view>
    <view
      ref="tui_notice_box"
      class="tui-notice__wrap"
      :class="{ 'tui-notice__wrap-scroll': scrollable }"
      :style="{ height: scrollable ? size + 'rpx' : 'auto' }"
    >
      <view
        :id="elId_box"
        :class="{
          'tui-notice__content': scrollable,
          'tui-notice__content-single': !scrollable && single,
        }"
      >
        <view
          :id="elId"
          ref="animationEle"
          class="tui-notice__text"
          :style="{
            color: getColor,
            fontSize: size + 'rpx',
            lineHeight: scrollable ? size + 'rpx' : 'normal',
            fontWeight: bold ? 'bold' : '',
            width: wrapWidth + 'px',
            animationDuration: animationDuration,
            '-webkit-animationDuration': animationDuration,
            animationPlayState: webviewHide ? 'paused' : animationPlayState,
            '-webkit-animationPlayState': webviewHide
              ? 'paused'
              : animationPlayState,
            animationDelay: animationDelay,
            '-webkit-animationDelay': animationDelay,
          }"
          :class="{
            'tui-notice__single': !scrollable && single,
            'tui-notice__scrollable': scrollable,
          }"
        >
          <view v-if="$slots.default">
            <slot name="default"></slot>
          </view>
          <view v-else>{{ content }}</view>
        </view>
      </view>
    </view>
    <view v-if="$slots.right" class="tui-notice__shrink" @tap.stop="rightClick">
      <slot name="right"></slot>
    </view>
  </view>
</template>

<script>
export default {
  name: 'TuiNoticeBar',
  props: {
    //通告栏高度
    height: {
      type: [Number, String],
      default: 72,
    },
    content: {
      type: String,
      default: '',
    },
    //字体大小 rpx
    size: {
      type: [Number, String],
      default: 28,
    },
    color: {
      type: String,
      default: '',
    },
    bold: {
      type: Boolean,
      default: false,
    },
    backgroundColor: {
      type: String,
      default: '#fff8d5',
    },
    //scrollable为false时使用,['20rpx','30rpx','20rpx','30rpx']=>[上，右，下，左],为了兼容nvue
    padding: {
      type: Array,
      default() {
        return ['20rpx', '30rpx', '20rpx', '30rpx'];
      },
    },
    //是否单行
    single: {
      type: Boolean,
      default: false,
    },
    //是否滚动，添加后控制单行效果取消
    scrollable: {
      type: Boolean,
      default: false,
    },
    speed: {
      type: Number,
      default: 100,
    },
    activeMode: {
      type: String,
      default: 'backwards',
    },
    //是否固定在顶部
    isFixed: {
      type: Boolean,
      default: false,
    },
    top: {
      type: String,
      default: '0',
    },
    //自定义参数
    params: {
      type: [Number, String],
      default: 0,
    },
  },
  emits: ['click', 'leftClick', 'rightClick'],
  data() {
    const elId = `tui_${Math.ceil(Math.random() * 10e5).toString(36)}`;
    const elId_box = `tui_${Math.ceil(Math.random() * 10e5).toString(36)}`;
    return {
      elId: elId,
      elId_box: elId_box,
      noticeWidth: 0,
      boxWidth: 0,
      wrapWidth: '',
      webviewHide: false,
      animationDuration: 'none',
      animationPlayState: 'paused',
      animationDelay: '0s',
    };
  },
  computed: {
    getColor() {
      return this.color || '#ff7900';
    },
  },
  watch: {
    scrollable(val) {
      if (val) {
        this.$nextTick(() => {
          this.initAnimation();
        });
      }
    },
    content(val) {
      this.$nextTick(() => {
        setTimeout(() => {
          this.initAnimation();
        }, 50);
      });
    },
  },
  mounted() {
    this.$nextTick(() => {
      setTimeout(() => {
        this.initAnimation();
      }, 50);
    });
  },
  beforeUnmount() {
    this.stopAnimation = true;
  },
  methods: {
    initAnimation() {
      if (this.scrollable) {
        console.log('scrol=====');

        let query = [];
        let noticeQuery = new Promise((resolve, reject) => {
          my.createSelectorQuery()
            .select(`#${this.elId}`)
            .boundingClientRect()
            .exec((ret) => {
              console.log(ret, 'scroll');
              this.noticeWidth = ret[0].width;
              resolve();
            });
        });
        if (this.activeMode === 'forwards') {
          let boxQuery = new Promise((resolve, reject) => {
            my.createSelectorQuery()
              .select(`#${this.elId_box}`)
              .boundingClientRect()
              .exec((ret) => {
                this.boxWidth = ret[0].width;
                resolve();
              });
          });
          query.push(boxQuery);
        }
        query.push(noticeQuery);
        Promise.all(query).then(() => {
          this.animationDuration = `${this.noticeWidth / this.speed}s`;
          if (this.activeMode === 'forwards') {
            this.animationDelay = `-${this.boxWidth / this.speed}s`;
          }
          setTimeout(() => {
            this.animationPlayState = 'running';
          }, 1000);
        });
      }
    },
    loopAnimation() {},
    onClick() {
      this.$emit('click', {
        params: this.params,
      });
    },
    leftClick() {
      this.$emit('leftClick', {
        params: this.params,
      });
    },
    rightClick() {
      this.$emit('rightClick', {
        params: this.params,
      });
    },
  },
};
</script>

<style>
.tui-notice__bar {
  display: flex;
  width: 100%;
  box-sizing: border-box;
  flex-direction: row;
  align-items: center;
}

.tui-notice__fixed {
  position: fixed;
  left: 0;
  z-index: 100;
}

.tui-notice__shrink {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tui-notice__wrap {
  flex: 1;
  flex-direction: column;
  overflow: hidden;
}

.tui-notice__wrap-scroll {
  flex-direction: row;
}

.tui-notice__wrap-scroll {
  position: relative;
}

.tui-notice__content {
  flex: 1;
  display: block;
  overflow: hidden;
}

.tui-notice__text {
  word-break: break-all;
}

.tui-notice__content-single {
  display: flex;
  flex: none;
  width: 100%;
  justify-content: center;
}

.tui-notice__single {
  display: block;
  width: 100%;
  white-space: nowrap;
  flex-direction: row;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tui-notice__scrollable {
  position: absolute;
  display: block;
  white-space: nowrap;
  padding-left: 101%;
  animation: notice 10s 0s linear infinite both;
  animation-play-state: paused;
  -webkit-backface-visibility: hidden;
  -webkit-perspective: 1000;
}

@keyframes notice {
  100% {
    transform: translate3d(-100%, 0, 0);
  }
}
</style>
