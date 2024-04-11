<template>
  <view :catch-move="true">
    <view
      class="nrz-top-dropdown nrz-dropdown-box"
      :class="[show ? 'nrz-dropdown-show' : '']"
      :style="{
        z: zIndex + 1,
        height: height ? height : 'auto',
        backgroundColor: backgroundColor,
        paddingBottom: px(paddingbtm),
        transform:
          'translateZ(0) translateY(' +
          (show ? translatey + 'px' : '-100%') +
          ')',
      }"
    >
      <slot></slot>
    </view>
    <view
      :style="{
        zIndex,
      }"
      class="nrz-dropdown-mask"
      :class="[mask && show ? 'nrz-dropdown-show' : '']"
      @tap="handleClose"
    ></view>
  </view>
</template>

<script setup>
import Taro from '@tarojs/taro';
const emits = defineEmits(['close']);

const props = defineProps({
  //是否需要mask
  zIndex: {
    type: Number,
    default: 999,
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
  //padding-bottom  rpx
  paddingbtm: {
    type: Number,
    default: 0,
  },
  //高度 rpx
  height: {
    type: Number,
    default: 0,
  },
  //移动距离 需要计算
  translatey: {
    type: Number,
    default: 0,
  },
});
function handleClose() {
  if (!props.show) {
    return;
  }
  emits('close', {});
}
function px(num) {
  return Taro.pxTransform(num);
}
</script>

<style>
.nrz-dropdown-box {
  width: 100%;
  position: fixed;
  box-sizing: border-box;
  border-bottom-right-radius: 24rpx;
  border-bottom-left-radius: 24rpx;
  transform: translateZ(0);
  overflow: hidden;
  visibility: hidden;
  transition: all 0.3s ease-in-out;
  z-index: 1000;
  top: 0;
}

.nrz-dropdown-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 999;
  transition: all 0.3s ease-in-out;
  opacity: 0;
  visibility: hidden;
}

.nrz-dropdown-show {
  opacity: 1;
  visibility: visible;
}
</style>
