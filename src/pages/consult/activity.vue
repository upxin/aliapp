<template>
  <MainScroll
    :has-more="hasMore"
    :pt="0"
    :init-loading="initLg"
    bg="#fff"
    @scroll-reach-bottom="loadMore"
    @end-pull-down="_findActivity"
  >
    <section class="px-14px">
      <template v-if="recommendTitle && recommendList?.length">
        <div class="flex items-center justify-between pt-10px">
          <div class="flex flex-col items-center text-16px">
            <span class="mb-6px">{{ recommendTitle?.split('\n')?.[0] }}</span>
            <span>{{ recommendTitle?.split('\n')?.[1] }}</span>
          </div>
        </div>
        <section
          v-for="k in recommendList"
          :key="k?.addTime"
          class="flex bg-fff mt-20px"
          @click="go(k?.router, k?.image, k?.title)"
        >
          <NrImg
            class="wh"
            :only-img="true"
            mode="aspectFill"
            :url="k?.image"
          ></NrImg>
          <div class="flex flex-col bg-fleet flex-1 px-10px pl-14px">
            <span class="mb-8px py-6px">{{ k?.title }}</span>
            <div class="flex text-12px opacity-40 my-4px">
              <span>开始时间</span>
              <span>{{ k?.startTime }}</span>
            </div>
            <div class="flex text-12px opacity-40 my-4px">
              <span>结束时间</span>
              <span>{{ k?.endTime }}</span>
            </div>
          </div>
        </section>
        <div class="mb-10px"></div>
      </template>

      <div class="flex items-center justify-between pt-10px">
        <div class="flex flex-col items-center text-16px">
          <span class="mb-6px">{{ acTitle?.split('\n')?.[0] }}</span>
          <span>{{ acTitle?.split('\n')?.[1] }}</span>
        </div>
      </div>
      <section
        v-for="k in acList"
        :key="k?.addTime"
        class="flex bg-fff mt-20px"
        @click="
          () => {
            go(k?.router, k?.image, k?.title);
          }
        "
      >
        <NrImg
          class="wh"
          :only-img="true"
          mode="aspectFill"
          :url="k?.image"
        ></NrImg>
        <div class="flex flex-col bg-fleet flex-1 px-10px pl-14px">
          <span class="mb-8px py-6px">{{ k?.title }}</span>
          <div class="flex text-12px opacity-40 my-4px">
            <span>开始时间</span>
            <span>{{ k?.startTime }}</span>
          </div>
          <div class="flex text-12px opacity-40 my-4px">
            <span>结束时间</span>
            <span>{{ k?.endTime }}</span>
          </div>
        </div>
      </section>
    </section>
  </MainScroll>
</template>
<script lang="ts" setup>
//
import { CODE, useToast, nrNavigateTo } from '@/utils/index';
import NrImg from '@/components/img/img.vue';
import { findActivity } from '@/api';
import { onBeforeMount, ref } from 'vue';
import MainScroll from '@/components/scroll-main/index.vue';

defineProps({
  h: { default: 0, type: Number },
});
let initLg = ref(true);
let recommendList = ref<any[]>([]);
let recommendTitle = ref<any>();

let acTitle = ref();
let acList = ref<any[]>([]);
let hasMore = ref(false);
let pageNum = 1;
let pageSize = 20;
function getParams() {
  return {
    pageNum,
    pageSize,
  };
}
function go(route, url, title) {
  nrNavigateTo(route, { jgId: 'jgId', activity: true, shareImg: url, title });
}
function _findActivity(cb?) {
  pageNum = 1;

  findActivity({ type: 2, ...getParams() })
    .then((res) => {
      setTimeout(() => {
        initLg.value = false;
        cb && cb();
      }, 1000);
      if (res?.code !== CODE) return useToast(res?.msg);
      acTitle.value = res?.data?.category;
      acList.value = res?.data?.list;
      const { total, pageNum, pageSize } = res?.data;
      hasMore.value = pageNum * pageSize < total;
    })
    .catch(() => {
      initLg.value = false;
    });
}

function loadMore() {
  if (!hasMore.value) return;
  pageNum += 1;
  findActivity({ type: 2, ...getParams() }).then((res) => {
    if (res?.code !== CODE) return useToast(res?.msg);
    acTitle.value = res?.data?.category;
    acList.value = [...acList.value, ...res?.data?.list];
    const { total, pageNum, pageSize } = res?.data;
    hasMore.value = pageNum * pageSize < total;
  });
}

onBeforeMount(() => {
  _findActivity();
  findActivity({ type: 1, pageSize: -1 }).then((res) => {
    if (res?.code !== CODE) return useToast(res?.msg);
    recommendTitle.value = res?.data?.category;
    recommendList.value = res?.data?.list;
  });
});
</script>
<style>
page {
  background-color: #fff;
}
.wh {
  width: 114px;
  height: 114px;
}
.wh-news {
  width: 85px;
  height: 85px;
}

.h-energy {
  height: 150px;
}
</style>
