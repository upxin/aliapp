<template>
  <MainScroll
    :has-more="hasMore"
    :init-loading="initLg"
    :has-data="!!list?.length || !!acList?.length"
    :pt="0"
    bg="#fff"
    @scroll-reach-bottom="loadMore"
    @end-pull-down="refresh"
  >
    <NrSwiper></NrSwiper>
    <section class="px-14px">
      <template v-if="acTitle && acList?.length">
        <div class="flex items-center justify-between my-40px">
          <div class="flex flex-col items-center text-16px">
            <span class="mb-6px">{{ acTitle?.split('\n')?.[0] }}</span>
            <span>{{ acTitle?.split('\n')?.[1] }}</span>
          </div>
        </div>
        <section
          v-for="k in acList"
          :key="k?.addTime"
          class="flex bg-fff mb-10px"
          @click="go(k?.router, k?.image)"
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
      </template>

      <div class="flex items-center justify-between my-30px">
        <div class="flex flex-col items-center text-16px">
          <span class="mb-6px">{{ mapData?.category?.split('\n')?.[0] }}</span>
          <span>{{ mapData?.category?.split('\n')?.[1] }}</span>
        </div>
      </div>
      <section
        class="flex w-full bg-center bg-no-repeat bg-cover bg-fff mt-10px h-energy"
        :style="{ backgroundImage: `url(${mapData?.list?.[0]?.image})` }"
        @click="
          go(
            mapData?.list?.[0]?.router,
            mapData?.list?.[0]?.image,
            mapData?.list?.[0]?.title
          )
        "
      ></section>

      <div class="flex items-center justify-between my-30px">
        <div class="flex flex-col items-center text-16px">
          <span class="mb-6px">{{ consultTitle?.split('\n')?.[0] }}</span>
          <span>{{ consultTitle?.split('\n')?.[1] }}</span>
        </div>
      </div>
      <section
        v-for="k in list"
        :key="k?.addTime"
        class="flex bg-fff mt-10px"
        @click="go(k?.router, k?.image, k?.title)"
      >
        <NrImg
          class="wh-news"
          :only-img="true"
          mode="aspectFill"
          :url="k?.image"
        ></NrImg>
        <div class="flex flex-col flex-1 px-14px">
          <span class="mb-8px">{{ k?.title }}</span>
          <div class="flex text-12px opacity-30 my-4px">{{ k?.addTime }}</div>
          <div class="self-end mt-auto text-10px nrz-thin text-info pb-8px">
            {{ k?.source }}
          </div>
        </div>
      </section>
    </section>
  </MainScroll>
</template>
<script lang="ts" setup>
//
import { nrNavigateTo } from '@/utils/index';
import NrImg from '@/components/img/img.vue';
import { findMap, findConsult, findActivity } from '@/api';
import { onBeforeMount, ref } from 'vue';
import { CODE, useToast } from '@/utils';
import MainScroll from '@/components/scroll-main/index.vue';
import NrSwiper from './nrSwiper.vue';

defineProps({
  h: { default: 0, type: Number },
});
let mapData = ref();
let consultTitle = ref();
let acTitle = ref();
let acList = ref<any[]>();
let initLg = ref(true);
function go(route, url, title) {
  nrNavigateTo(route, { jgId: 'jgId', shareImg: url, title });
}

function _findActivity() {
  findActivity({ type: 0, pageSize: -1 }).then((res) => {
    if (res?.code !== CODE) return useToast(res?.msg);
    acTitle.value = res?.data?.category;
    acList.value = res?.data?.list;
  });
}

let list = ref<any[]>([]);
let hasMore = ref(false);
let pageNum = 1;
let pageSize = 15;
function getParams() {
  return {
    pageNum,
    pageSize,
  };
}
function loadMore() {
  if (!hasMore.value) return;
  pageNum += 1;

  findConsult({
    ...getParams(),
  }).then((res) => {
    if (res?.code !== CODE) return useToast(res?.msg);
    list.value = [...list.value, ...res?.data?.list];
    const { total, pageNum, pageSize } = res?.data;
    hasMore.value = pageNum * pageSize < total;
  });
}
function refresh(cb?) {
  pageNum = 1;
  findConsult({
    ...getParams(),
  })
    .then((res) => {
      setTimeout(() => {
        initLg.value = false;
        cb && cb();
      }, 1000);
      if (res?.code !== CODE) return useToast(res?.msg);
      list.value = res?.data?.list;
      const { total } = res?.data;
      hasMore.value = pageNum * pageSize < total;
      consultTitle.value = res?.data?.category;
    })
    .catch(() => {
      initLg.value = false;
    });
  findMap().then((res) => {
    if (res?.code !== CODE) return useToast(res?.msg);
    console.log(res?.data?.category);
    mapData.value = res?.data;
  });
  _findActivity();
}
onBeforeMount(() => {
  refresh();
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
