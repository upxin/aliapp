<template>
  <MainScroll
    :has-more="hasMore"
    :has-data="!!orderList?.length"
    :init-loading="initLg"
    :pt="0"
    bg="#fff"
    :height="scrollH"
    @scroll-reach-bottom="loadMore"
    @end-pull-down="refresh"
  >
    <section class="overflow-y-auto nrz-safe text-12px">
      <div
        v-for="(k, i) in orderList"
        :key="k?.id"
        class="px-16px py-12px"
        :class="{ 'nr-border-b': i != orderList?.length - 1 }"
      >
        <div class="flex items-center mb-16px">
          <div class="text-14px">订单编号：{{ k?.orderId }}</div>
          <span
            class="text-primary icon iconfont icon-copy ml-8px"
            @click="
              () => {
                copyText(k?.orderId);
              }
            "
          ></span>
        </div>
        <span class="opacity-48 mb-10px">{{}}</span>
        <span class="mb-10px opacity-48">{{ k?.createTime }}</span>
        <div class="flex justify-between">
          <span class="flex items-center">
            <span class="mr-6px">充电量</span>
            <span class="text-14px text-show">{{ k?.totalPower }}kw*h</span>
          </span>
          <span class="flex items-center">
            <span>消耗充电币：</span>
            <span class="text-14px text-danger">-{{ k?.payCoin }}</span>
          </span>
        </div>
      </div>
    </section>
  </MainScroll>
</template>
<script lang="ts" setup>
import MainScroll from '@/components/scroll-main/index.vue';
import { onBeforeMount, ref } from 'vue';
import { getWalletOrderRecord } from '@/api/index';
import { CODE, copyText, useToast } from '@/utils/index';
definePageConfig({ navigationStyle: 'custom' });
let orderList = ref<any[]>([]);
let hasMore = ref(false);

let pageNum = 1;
let pageSize = 20;
let props = defineProps({
  scrollH: {
    type: String || Number,
    default: '',
  },
  startDate: {
    type: String,
    default: '',
  },
  endDate: {
    type: String,
    default: '',
  },
});
let initLg = ref(true);
function _getWalletOrderRecord(old) {
  getWalletOrderRecord({
    pageSize,
    pageNum,
    startDate: props.startDate,
    endDate: props.endDate,
  })
    .then((res) => {
      initLg.value = false;
      if (res?.code !== CODE) return useToast(res?.msg);
      orderList.value = [...old, ...res?.data?.list];
      pageNum = res.data?.nextPage == 0 ? pageNum : res.data?.nextPage;
      hasMore.value =
        res.data?.pages !== 0 &&
        Number(res.data?.pages) !== Number(res.data?.pageNum);
    })
    .catch(() => {
      initLg.value = false;
    });
}

function loadMore() {
  if (!hasMore.value) return;
  _getWalletOrderRecord(orderList.value);
}
function refresh() {
  _getWalletOrderRecord([]);
}
onBeforeMount(() => {
  _getWalletOrderRecord([]);
});
// bottom
</script>
