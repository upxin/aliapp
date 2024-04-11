<template>
  <MainScroll
    :has-more="hasMore"
    :pt="0"
    :init-loading="initLg"
    bg="#fff"
    @scroll-reach-bottom="loadMore"
    @end-pull-down="refresh"
  >
    <section class="px-14px">
      <div class="flex items-center justify-between mt-20px">
        <div class="flex items-center justify-between">
          <div class="flex flex-col items-center text-16px">
            <span class="mb-6px">{{ scienceTitle?.split('\n')?.[0] }}</span>
            <span>{{ scienceTitle?.split('\n')?.[1] }}</span>
          </div>
        </div>
      </div>

      <div
        v-for="k in list"
        :key="k?.addTime"
        class="w-full overflow-hidden rounded-md nr-border mt-20px"
        @click="go(k?.router, k?.image, k?.title)"
      >
        <NrImg class="w-full" mode="widthFix" :url="k?.image" only-img></NrImg>
        <div class="text-12px my-10px px-14px">{{ k?.title }}</div>
        <div class="opacity-50 text-12px my-10px px-14px">
          {{ k?.startTime }}
        </div>
      </div>
    </section>
  </MainScroll>
</template>
<script lang="ts" setup>
//
import { CODE, useToast, nrNavigateTo } from '@/utils/index';
import NrImg from '@/components/img/img.vue';
import { scienceList } from '@/api';
import { ref, onBeforeMount } from 'vue';

import MainScroll from '@/components/scroll-main/index.vue';

defineProps({
  h: { default: 0, type: Number },
});
let scienceTitle = ref();
function go(route, url, title) {
  nrNavigateTo(route, { jgId: 'jgId', shareImg: url, title });
}
let list = ref<any[]>([]);
let hasMore = ref(false);
let pageNum = 1;
let pageSize = 20;
let initLg = ref(true);

function getParams() {
  return {
    pageNum,
    pageSize,
  };
}
function loadMore() {
  if (!hasMore.value) return;
  pageNum += 1;

  scienceList({
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
  scienceList({
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
      scienceTitle.value = res?.data?.category;
    })
    .catch(() => {
      initLg.value = false;
    });
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
