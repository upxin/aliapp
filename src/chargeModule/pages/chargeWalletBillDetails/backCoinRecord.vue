<template>
  <MainScroll
    :has-more="hasMore"
    :pt="0"
    bg="#fff"
    :init-loading="initLg"
    v-model:loading="loading"
    :height="scrollH"
    @scroll-reach-bottom="loadMore"
    @end-pull-down="refresh"
  >
    <section class="overflow-y-auto nrz-safe text-12px">
      <div
        v-for="(k, i) in backList"
        :key="k?.id"
        class="flex items-center justify-between px-16px py-12px"
        :class="{ 'nr-border-b': i != backList?.length - 1 }"
      >
        <div class="flex flex-col opacity-50">
          <span class="flex items-center mb-10px">
            <span>申请退币数量：</span>
            <span class="text-14px">{{ formatThousands(k?.coin) }}</span>
          </span>
          <span class="flex items-center mb-10px">
            <span>申请时间：</span>
            <span class="text-14px">{{ k?.createTime }}</span>
          </span>
          <span class="flex items-center">
            <span>退币时间：</span>
            <span class="text-14px">{{ k?.updateTime }}</span>
          </span>
        </div>
        <div class="flex items-center">
          <span class="opacity-50">到账积分：</span>
          <span class="text-16px text-danger">
            {{ formatThousands(k?.points) }}
          </span>
        </div>
      </div>
    </section>
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
import { getWalletBuyOrBackRecord } from '@/api/index';
import { CODE, useToast, formatThousands } from '@/utils/index';
definePageConfig({
  transparentTitle: 'always',
  titlePenetrate: 'YES',
  defaultTitle: '',
});
let backList = ref<any[]>([]);
let hasMore = ref(false);
let initLg = ref(true);
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
const loading = ref(false);
function _getWalletBuyOrBackRecord(old) {
  getWalletBuyOrBackRecord({
    pageSize,
    pageNum,
    walletOrderType: 2,
    startDate: props.startDate,
    endDate: props.endDate,
  })
    .then((res) => {
      if (res?.code !== CODE) return useToast(res?.msg);
      initLg.value = false;
      loading.value = false;
      backList.value = [...old, ...res?.data?.list];
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
  _getWalletBuyOrBackRecord(backList.value);
}
function refresh() {
  _getWalletBuyOrBackRecord([]);
}
onBeforeMount(() => {
  _getWalletBuyOrBackRecord([]);
});
</script>
