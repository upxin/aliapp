<script lang="ts" setup>
import LOADING from '@/assets/imgs/loading.png';
import { useHeaderHeight } from '@/hooks/index';
import NoData from '@/components/noData/index.vue';

defineProps({
  noData: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: true,
  },
  err: {
    default: false,
    type: Boolean,
  },
});
let emits = defineEmits(['reLoad']);
const { headerHeight } = useHeaderHeight();
// 定位是为了让 defaul渲染  如果有echarts  canvcas这些异步获取节点的  不优先渲染节点会出bug
</script>
<template>
  <view
    v-if="loading"
    :style="{
      padding: `${headerHeight}px 0`,
      zIndex: 100000,
    }"
    :catch-move="true"
    class="box-border fixed top-0 left-0 flex items-center justify-center w-full h-full overflow-hidden bg-fff"
  >
    <div
      class="flex flex-col items-center justify-center rounded bg-fff w-100px h-100px nr-shadow-full"
    >
      <img :src="LOADING" alt="" class="w-40px h-40px rotate" />
      <div class="text-second text-14px mt-14px">加载中...</div>
    </div>
  </view>
  <view
    v-if="err"
    :catch-move="true"
    :style="{
      padding: `${headerHeight}px 0`,
    }"
    class="fixed top-0 left-0 flex items-center justify-center w-full h-full z-999 bg-main"
  >
    <view class="flex flex-col items-center overflow-hidden pb-40px">
      <view class="text-center text-16px opacity-40 mb-20px"> 糟糕出错了 </view>
      <nut-button
        class="border-0 px-18px text-hex-fff h-34px"
        color="#ef8a3c"
        @click="
          () => {
            emits('reLoad');
          }
        "
      >
        重新加载
      </nut-button>
    </view>
  </view>
  <view
    v-if="noData"
    :style="{
      padding: `${headerHeight}px 0`,
    }"
    :catch-move="true"
    class="box-border fixed top-0 left-0 flex items-center justify-center w-full h-full overflow-hidden z-998 bg-fff"
  >
    <NoData class="fixed h-full z-999 top-0 left-0"></NoData>
  </view>
  <slot></slot>
</template>
