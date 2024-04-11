<template>
  <div
    :class="classes"
    :style="{
      height: `${titleHeight}px`,
      paddingTop: `${statusHeight}px`,
      backgroundColor: backgroundColor,
      zIndex: props.z,
      position,
    }"
    class="box-content top-0 flex items-center justify-between w-full text-16px"
  >
    <template v-if="!!$slots?.default">
      <slot name="default"></slot>
    </template>
    <template v-else>
      <div
        v-if="$slots?.customLeft"
        class="box-border flex items-center justify-start pl-10px"
        :style="{ width: padX + 'px', fontWeight: 'bold' }"
      >
        <div
          :style="{ borderColor: customColor }"
          class="flex items-center border border-solid rounded-3xl text-normal h-26px px-8px"
        >
          <div class="text-normal text-12px ml-18px" :style="{ color: customColor }">
            <slot name="customLeft"></slot>
          </div>
        </div>
      </div>
      <div
        v-if="!$slots?.customLeft"
        class="box-border flex items-center w-100px pl-100px"
        :style="{ width: padX + 'px' }"
      ></div>

      <div
        :style="{ color }"
        class="flex items-center justify-center flex-1 text-center"
      >
        <slot name="title">{{ title }}</slot>
      </div>

      <div class="h-20px" :style="{ width: padX + 'px' }">
        <slot name="right"></slot>
      </div>
    </template>
    <div
      v-if="border"
      :style="{
        height: '1px',
      }"
      class="absolute bottom-0 left-0 w-full bg-hex-f5f5f5"
    ></div>
  </div>
</template>
<script lang="ts" setup>
import Taro, { useLoad } from '@tarojs/taro';
import { computed, useAttrs, ref } from 'vue';

interface Props {
  backgroundColor?: string;
  shadow?: boolean;
  iconColor?: string;
  iconSize?: number;
  showIcon?: boolean;
  color?: string;
  z?: number;
  bindBack?: boolean;
  border?: boolean;
  title?: string;
  leftText?: string;
  padX?: number;
  customColor?: string;
  position?: string;
  hiddenBack?: boolean;
}
const emits = defineEmits(['back']);
let attr = useAttrs();
const props = withDefaults(defineProps<Props>(), {
  backgroundColor: 'transparent',
  shadow: false,
  iconColor: '#101010',
  iconSize: 14,
  showIcon: true,
  color: '#101010',
  z: 1000,
  border: true,
  title: '',
  leftText: '',
  padX: 120,
  customColor: '#101010',
  position: 'fixed',
  hiddenBack: false,
});
function _back() {
  console.log(attr);
  if (attr.onCusBack) {
    attr?.onCusBack();
    return;
  }
  if (props.bindBack) {
    emits('back');
    return;
  }
  Taro.navigateBack();
}
const classes = computed(() => {
  return {
    'shadow-gray-300': props.shadow,
    shadow: props.shadow,
  };
});
let statusHeight = ref();
let titleHeight = ref('');
useLoad(() => {
  const { titleBarHeight, statusBarHeight } = my.getSystemInfoSync();
  statusHeight.value = statusBarHeight;
  titleHeight.value = titleBarHeight;
});
</script>
