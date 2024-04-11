<template>
  <MainScroll
    :has-more="hasMore"
    :pt="0"
    :init-loading="initLg"
    :has-data="!!list?.length"
    bg="#fff"
    @scroll-reach-bottom="loadMore"
    @end-pull-down="refresh"
  >
    <div class="overflow-y-auto">
      <section
        v-for="(k, i) in list"
        :key="k?.time"
        class="flex items-center justify-between px-14px py-10px"
        :class="{ ' nr-border-b': i < list?.length - 1 }"
      >
        <div
          class="bg-center bg-no-repeat bg-cover rounded-full w-57px h-57px mr-10px"
          :style="{ backgroundImage: `url(${k?.avatar})` }"
        ></div>
        <div class="flex-1">
          <div class="flex mb-8px">
            <span>{{ k?.nickname }}</span>
          </div>
          <span class="opacity-50 text-12px">13766637728</span>
        </div>
        <div class="text-12px">
          <div class="flex mb-8px">
            <span> 奖励积分：</span>
            <span class="text-danger">{{ k?.points }}</span>
          </div>
          <span class="opacity-50">{{ k?.time }}</span>
        </div>
      </section>
    </div>
  </MainScroll>
</template>
<script lang="ts">
import { onShareAppMessage, onShareTimeline } from '@/utils/index';
export default {
  onShareAppMessage,
  onShareTimeline,
};
</script>
<script lang="ts" setup>
import MainScroll from '@/components/scroll-main/index.vue';
import { onBeforeMount, ref } from 'vue';
import { inviteRecord } from '@/api/index';
import { CODE, useToast } from '@/utils/index';
definePageConfig({
  navigationStyle: 'default',
  navigationBarTitleText: '邀请好友记录',
});
let list = ref<any[]>([]);
let hasMore = ref(false);
let initLg = ref(true);

let pageNum = 1;
let pageSize = 20;

function getParams() {
  return {
    pageNum,
    pageSize,
  };
}
function loadMore() {
  if (!hasMore.value) return;
  pageNum = pageNum + 1;
  inviteRecord(getParams()).then((res) => {
    list.value = [...list.value, ...res?.data?.list];

    const { total } = res?.data;
    hasMore.value = total >= res?.data?.list?.length;
  });
}
function refresh(cb?) {
  pageNum = 1;
  inviteRecord(getParams()).then((res) => {
    setTimeout(() => {
      cb?.();
      initLg.value = false;
    }, 1000);
    if (res?.code !== CODE) return useToast(res?.msg);
    list.value = res?.data?.list;
    const { total } = res?.data;
    hasMore.value = total >= res?.data?.list?.length;
  });
}

onBeforeMount(() => {
  refresh();
});
// bottom
</script>
<style>
page {
  background-color: #fff;
}
</style>
