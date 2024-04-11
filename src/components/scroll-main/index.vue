<template>
  <scroll-view
    id="scrollview"
    :style="{
      paddingTop: `${pt}px`,
      height: height,
      paddingBottom: `${pb}px`,
      backgroundColor: bg,
    }"
    class="box-border relative w-full"
    :scroll-y="true"
    :scroll-top="scrollTop"
    :refresher-enabled="refresherEnabled"
    :fast-deceleration="true"
    :enhanced="true"
    :lower-threshold="lowerThreshold"
    refresher-default-style="black"
    :refresher-background="refreshBg"
    :refresher-triggered="refresherTriggered"
    @refresherpulling="startPullDown"
    @refresherrefresh="endPullDown"
    @scrolltolower="scrollReachBottom"
    @scroll="scroll"
  >
    <div
      v-if="initLoading"
      class="absolute top-0 left-0 flex items-center justify-center w-full h-full z-999 bg-fff"
    >
      <div
        :style="{
          marginBottom: `${
            systemInfo().RightBtnRect.h + systemInfo().RightBtnRect.t + 10
          }px`,
        }"
        class="flex flex-col items-center justify-center rounded bg-fff w-100px h-100px nr-shadow-full"
      >
        <img :src="LOADING" alt="" class="rotate-img rotate" />
        <div class="text-second text-14px mt-14px">加载中...</div>
      </div>
    </div>
    <template v-else>
      <template v-if="hasData">
        <section
          :style="{
            backgroundColor: bg,
            position: 'relative',
          }"
        >
          <slot name="default"></slot>
          <div v-if="hasMore" class="flex justify-center py-16px">
            <span
              class="icon-loading iconfont text-26px rotate text-second"
            ></span>
          </div>
          <template v-else>
            <div class="nrz-safe">
              <section class="py-30px">
                <NrImg
                  v-if="endImg"
                  :url="endImg"
                  class="m-auto bg-center bg-no-repeat bg-contain w-100px h-32px"
                ></NrImg>
                <div
                  v-else
                  class="flex items-center justify-center text-primary opacity-80 text-14px"
                >
                  <span>{{ endText }}</span>
                </div>
              </section>
            </div>
          </template>
        </section>
      </template>
      <NoData
        v-else
        :style="{ paddingBottom: `${pt}px`, backgroundColor: bg }"
        class="h-full"
      ></NoData>
    </template>
  </scroll-view>
</template>
<script lang="ts" setup>
import { ref, watch } from 'vue';
import { systemInfo } from '@/stores/index';
import { useDidHide } from '@tarojs/taro';
import { LOGO_IMG_BOTTOM } from '@/utils/index';
import NoData from '../noData/index.vue';
import LOADING from '@/assets/imgs/loading.png';
import NrImg from '@/components/img/img.vue';

interface Props {
  pt?: number;
  refreshBg?: string;
  height?: string | number;
  hasMore?: boolean;
  bg?: string;
  refreshEnd?: boolean;
  refresherEnabled?: boolean;
  hasData?: boolean;
  pullDistance?: number;
  lowerThreshold?: number;
  placeholderEmptyText?: string;
  placeholderEmptyImg?: string;
  safeTop?: boolean;
  pb?: number | string;
  loading?: boolean;
  endText?: string;
  initLoading?: boolean;
  endImg?: string;
}
let props = withDefaults(defineProps<Props>(), {
  pt: systemInfo().RightBtnRect.h + systemInfo().RightBtnRect.t + 10,
  refreshBg: '#f5f5f5',
  height: '100%',
  hasMore: false,
  bg: '#fff',
  refreshEnd: false,
  modelValue: false,
  hasData: true,
  refresherEnabled: true,
  pullDistance: 50,
  lowerThreshold: 60,
  placeholderEmptyText: '',
  placeholderEmptyImg: LOGO_IMG_BOTTOM,
  safeTop: false,
  pb: 0,
  initLoading: false,
  loading: false, // 下拉是否结束
  endImg: '',
  endText: '--> NEWRIZON <--',
});
watch(
  () => props.loading,
  (v) => {
    if (!v) {
      endRefresh();
    }
  }
);
let emits = defineEmits([
  'endPullDown',
  'scrollReachBottom',
  'scrollToInit',
  'scroll',
  'update:loading',
]);

let scrollTop = ref(0);
const refresherTriggered = ref(false);

function scrollToTop() {
  if (scrollTop.value === 1) {
    scrollTop.value = 0;
  } else {
    scrollTop.value = 1;
  }

  setTimeout(() => {
    startRefresh();
  }, 100);
}
function scroll(res) {
  emits('scroll', res);
}

function scrollReachBottom(res) {
  // 滚动到底
  if (!props.hasMore) return;
  emits('scrollReachBottom', res);
}

function startPullDown() {
  if (refresherTriggered.value === false) {
    startRefresh();
  }
  emits('update:loading', true);
}
function startRefresh() {
  refresherTriggered.value = true;
}
function endRefresh() {
  if (refresherTriggered.value == true) {
    refresherTriggered.value = false;
  }
}

function endPullDown() {
  // 松开下拉
  emits('endPullDown', endRefresh);
  setTimeout(() => {
    // 兜底防止外部不调用done
    endRefresh();
  }, 3000);
}

defineExpose({
  scrollToTop,
});

useDidHide(() => {
  scrollTop.value = 20;
});

// bottom
</script>
<style>
.rotate-img {
  width: 40px !important;
  height: 40px !important;
}
</style>
