<template>
  <section class="flex flex-col w-full h-full">
    <CustomBar background-color="#fff" position="unset" :border="true">
      <template #title> 视频学堂 </template>
    </CustomBar>
    <view id="scroll" class="flex-1 overflow-hidden">
      <MainScroll
        :has-more="hasMore"
        :init-loading="initLoading"
        :refresher-enabled="!initLoading"
        :pt="0"
        @scroll-reach-bottom="loadMore"
        @end-pull-down="refresh"
      >
        <div class="overflow-y-auto">
          <div
            v-for="item in list"
            :key="item.router"
            class="relative w-full mt-20px h-220px"
            @click="
              () => {
                showVideio(item);
              }
            "
          >
            <NrImg class="w-full h-full" :url="item?.img"></NrImg>
            <div
              class="box-border absolute bottom-0 w-full py-8px pl-20px text-fff"
              style="background-color: rgba(16, 16, 16, 0.24)"
            >
              {{ item?.title }}
            </div>
          </div>
        </div>
      </MainScroll>
    </view>
  </section>
</template>
<script lang="ts" setup>
import MainScroll from '@/components/scroll-main/index.vue';
import { onBeforeMount, ref } from 'vue';
import CustomBar from '@/components/customHeader/index.vue';
import Taro, { useReady, useShareAppMessage } from '@tarojs/taro';
import { test, studyClass } from '@/api/index';
import { CODE, useToast, jGcustomCount, JG } from '@/utils/index';
import { useRect } from '@/hooks/index';
import NrImg from '@/components/img/img.vue';

definePageConfig({ transparentTitle: 'always',titlePenetrate: 'YES',defaultTitle: '', enableShareAppMessage: true });

useShareAppMessage(() => {
  jGcustomCount(JG.MALL_003, { name: '视频学堂' });
  return {
    title: '前晨汽车用车小课堂',
    path: `/fleetModul/pages/useCarClassroomPage/index`,
    imageUrl: 'https://nrz-app.su.bcebos.com/resources/yckt_share.jpg',
  };
});

let hasMore = ref(false);
let list = ref();
let initLoading = ref(false);
let pageSize = 3;
let pageNum = 1;
let scrollHeight = ref<number | undefined>(0);
function showVideio(item) {
  //
  let src = item?.router.split('?url=')?.[1];
  Taro.previewMedia({
    sources: [
      {
        url: src,
        type: 'video',
      },
    ],
  });
}
function _studyClass(type) {
  studyClass({ pageNum, pageSize }).then((res) => {
    setTimeout(() => {
      initLoading.value = false;
    }, 1000);
    if (res?.code !== CODE) return useToast(res?.msg);
    if (type === 2) {
      list.value = [...list.value, ...res?.data?.list];
    }
    if (type === 1) {
      list.value = res?.data?.list;
    }
    const { total, pageNum, pageSize } = res?.data;
    hasMore.value = pageNum * pageSize < total;
  });
}
function loadMore() {
  pageNum += 1;
  _studyClass(2);
}
function refresh() {
  pageNum = 1;
  _studyClass(1);
}

onBeforeMount(() => {
  initLoading.value = true;
  refresh();
});

useReady(() => {
  setTimeout(() => {
    useRect('#scroll').then((res) => {
      console.log(res);
      scrollHeight.value = res?.height;
    });
  }, 300);
});
// bottom
</script>
<style>
page {
  background-color: #fff;
}
</style>
