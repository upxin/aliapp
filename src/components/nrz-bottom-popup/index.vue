<template>
  <view @touchmove.stop.prevent>
    <view
      class="tui-popup-class tui-bottom-popup nrz-safe"
      :class="{
        'tui-popup-show': show,
        'tui-popup-radius': radius,
      }"
      :style="{
        background: backgroundColor,
        height: height ? height : 'auto',
        zIndex: zIndex + 1,
        transform: `translate3d(0, ${show ? translateY : '100%'}, 0)`,
      }"
    >
      <view
        v-if="tips"
        class="text-20px font-normal flex h-50px items-center justify-between"
      >
        <span
          class="iconfont icon-close ml-auto text-22px p-10px opacity-0"
        ></span>
        <span class="flex-1 text-center"> {{ tips }}</span>
        <span
          class="iconfont icon-close ml-auto text-22px p-10px text-second font-bold"
          @click="handleClickCancel"
        ></span>
      </view>
      <slot></slot>
      <view class="pb-20px"></view>
    </view>
    <view
      v-if="mask"
      class="tui-popup-mask"
      :class="[show ? 'tui-mask-show' : '']"
      :style="{ zIndex: zIndex }"
      :catch-move="true"
      @tap="handleClose"
    ></view>
  </view>
</template>

<script>
export default {
  name: 'TuiBottomPopup',
  props: {
    //是否需要mask
    tips: {
      type: String,
      default: '',
    },
    mask: {
      type: Boolean,
      default: true,
    },
    //控制显示
    show: {
      type: Boolean,
      default: false,
    },
    //背景颜色
    backgroundColor: {
      type: String,
      default: '#fff',
    },
    height: {
      type: String,
      default: '',
    },
    //设置圆角
    radius: {
      type: Boolean,
      default: true,
    },
    zIndex: {
      type: [Number, String],
      default: 999,
    },
    //弹层显示时，垂直方向移动的距离
    translateY: {
      type: String,
      default: '0',
    },
  },
  emits: ['close', 'update:show'],
  methods: {
    handleClose() {
      if (!this.show) {
        return;
      }
      this.$emit('close', {});
      this.$emit('update:show', false);
    },
  },
};
</script>

<style>
.tui-bottom-popup {
  width: 100%;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0;
  transform: translate3d(0, 100%, 0);
  transform-origin: center;
  transition: all 0.3s ease-in-out;
  min-height: 20rpx;
}

.tui-bp__safearea {
  padding-bottom: env(safe-area-inset-bottom);
}

.tui-popup-radius {
  border-top-left-radius: 24rpx;
  border-top-right-radius: 24rpx;
  overflow: hidden;
}

.tui-popup-show {
  opacity: 1;
  /* transform: translate3d(0, 0, 0); */
}

.tui-popup-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  transition: all 0.3s ease-in-out;
  opacity: 0;
  visibility: hidden;
}

.tui-mask-show {
  opacity: 1;
  visibility: visible;
}
</style>
