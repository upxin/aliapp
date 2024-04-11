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
            <span class="mb-6px">{{ knowledgeTitle?.split('\n')?.[0] }}</span>
            <span>{{ knowledgeTitle?.split('\n')?.[1] }}</span>
          </div>
        </div>
      </div>
      <div
        v-for="k in knowledgeList"
        :key="k?.addTime"
        class="relative w-full overflow-hidden rounded-md nr-border mt-20px"
        @click="go(k?.router, k?.image, k?.title)"
      >
        <NrImg class="w-full" mode="widthFix" :url="k?.image" only-img></NrImg>
        <div
          class="box-border absolute bottom-0 w-full text-12px py-10px bg-hex-000 bg-opacity-20 text-fff left-0px pl-10px"
        >
          {{ k?.title }}
        </div>
      </div>

      <div class="flex items-center justify-between my-20px">
        <div class="flex items-center justify-between">
          <div class="flex flex-col items-center text-16px">
            <span class="mb-6px">{{ honorTitle?.split('\n')?.[0] }}</span>
            <span>{{ honorTitle?.split('\n')?.[1] }}</span>
          </div>
        </div>
      </div>
      <section
        v-for="k in honorList"
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
          <span class="mb-8px mt-6px">{{ k?.title }}</span>
          <div class="flex text-12px opacity-30 my-4px">{{ k?.title }}</div>
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
import { CODE, useToast, nrNavigateTo } from '@/utils/index';
import NrImg from '@/components/img/img.vue';
import { honor, knowledge } from '@/api';
import { ref, onBeforeMount } from 'vue';
import MainScroll from '@/components/scroll-main/index.vue';

defineProps({
  h: { default: 0, type: Number },
});
let honorTitle = ref();
let honorList = ref<any[]>([]);
let knowledgeTitle = ref();
let knowledgeList = ref<any[]>([]);
function go(route, url, title) {
  nrNavigateTo(route, { jgId: 'jgId', shareImg: url, title });
}
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

  honor({
    ...getParams(),
  }).then((res) => {
    if (res?.code !== CODE) return useToast(res?.msg);
    honorList.value = [...honorList.value, ...res?.data?.list];
    const { total, pageNum, pageSize } = res?.data;
    hasMore.value = pageNum * pageSize < total;
  });
}
function refresh(cb?) {
  pageNum = 1;
  honor({
    ...getParams(),
  })
    .then((res) => {
      setTimeout(() => {
        initLg.value = false;
        cb && cb();
      }, 1000);
      if (res?.code !== CODE) return useToast(res?.msg);
      honorList.value = res?.data?.list;
      const { total } = res?.data;
      hasMore.value = pageNum * pageSize < total;
      honorTitle.value = res?.data?.category;
    })
    .catch(() => {
      initLg.value = false;
    });
}

onBeforeMount(() => {
  refresh();
  knowledge({}).then((res) => {
    if (res?.code !== CODE) return useToast(res?.msg);
    knowledgeList.value = res?.data?.list;
    knowledgeTitle.value = res?.data?.category;
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
