<template>
  <view
    class="flex justify-center items-center relative"
    :style="{
      width: w,
      height: h,
      backgroundColor: !isLoad ? backgroundColor : 'transparent',
    }"
    @click="handleImg"
  >
    <img
      :src="getImg"
      class="w-full h-full"
      :mode="mode"
      @load="load"
      @error="err"
    />
    <slot></slot>
  </view>
</template>
<script setup lang="ts">
import Taro from '@tarojs/taro';
import { computed, ref } from 'vue';
import DImg from '@/assets/imgs/d.png';
import { watch } from 'vue';

// scaleToFill 缩放模式，不保持纵横比缩放图片，使图片的宽高完全拉伸至填满 image 元素
// aspectFit	缩放模式，保持纵横比缩放图片，使图片的长边能完全显示出来。也就是说，可以完整地将图片显示出来。
// aspectFill	缩放模式，保持纵横比缩放图片，只保证图片的短边能完全显示出来。也就是说，图片通常只在水平或垂直方向是完整的，另一个方向将会发生截取。
// widthFix	缩放模式，宽度不变，高度自动变化，保持原图宽高比不变

interface Props {
  src: string;
  width?: string | number;
  height?: string | number;
  mode?: 'scaleToFill' | 'aspectFit' | 'aspectFill' | 'widthFix';
  backgroundColor?: string;
}
const isLoad = ref(false);
const props = withDefaults(defineProps<Props>(), {
  src: '',
  mode: 'widthFix',
  width: '100%',
  height: '100%',
  backgroundColor: '#f5f5f5',
});
const emits = defineEmits(['click']);
const isErr = ref(false);

const h = computed(() => {
  if (typeof props.height === 'string') return props.height;
  return Taro.pxTransform(props.height);
});
const w = computed(() => {
  if (typeof props.width === 'string') return props.width;
  return Taro.pxTransform(props.width);
});

const getImg = computed(() => {
  return isErr.value ? DImg : props.src;
});
function handleImg(e) {
  emits('click', e);
}
watch(
  () => props.src,
  (v) => {
    if (v) {
      isErr.value = false;
    } else {
      isErr.value = true;
    }
  },
  {
    immediate: true,
    deep: true,
  }
);

function load() {
  isLoad.value = true;
}
function err() {
  isErr.value = true;
}
</script>
