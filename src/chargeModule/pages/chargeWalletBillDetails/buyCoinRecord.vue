<template>
  <MainScroll
    :has-more="hasMore"
    :height="scrollH"
    :pt="0"
    :init-loading="initLg"
    bg="#fff"
    @scroll-reach-bottom="loadMore"
    @end-pull-down="refresh"
  >
    <section class="overflow-y-auto nrz-safe text-12px">
      <div
        v-for="(k, i) in buyList"
        :key="k?.id"
        class="py-12px px-16px"
        :class="{ 'nr-border-b': i != buyList?.length - 1 }"
      >
        <div class="flex items-end justify-between">
          <span>{{ k?.createTime }}</span>
          <span class="font-bold text-center text-green-500 text-16px w-90px">
            {{ formatThousands(k?.payCoin) }}
          </span>
        </div>
        <div class="flex justify-between mt-14px">
          <div class="flex items-center">
            <span
              v-if="k?.payType == 1"
              class="iconfont icon-weixin text-hex-06E332"
            ></span>
            <span
              v-if="k?.payType == 2"
              class="iconfont icon-zhifubao text-18px text-hex-1F85EC"
            ></span>
            <NrzImg
              v-if="k?.payType == 3"
              only-img
              class="w-16px h-16px"
              :url="LG_COIN"
            ></NrzImg>

            <span class="mx-6px">{{ k?.payTypeText }}</span>
            <span class="text-danger"
              >￥{{ formatThousands(k?.payAmount, 2) }}</span
            >
            <template v-if="k?.points">
              <span class="mx-10px">+</span>
              <span class="text-info">{{ k?.points }}积分</span>
            </template>
          </div>
          <nut-button
            v-if="k?.billFlag"
            size="mini"
            class="text-second"
            @click="
              () => {
                toOpenBill(k);
              }
            "
            >申请开发票</nut-button
          >
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
import NrzImg from '@/components/img/img.vue';

import {
  CODE,
  useToast,
  formatThousands,
  navigateToPage,
  LG_COIN,
} from '@/utils/index';

import { store } from '@/stores/index';

definePageConfig({ navigationStyle: 'custom' });
let buyList = ref<any[]>([]);
let hasMore = ref(false);
let initLg = ref(true);
let pageNum = 1;
let pageSize = 20;
defineProps({
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

function _getWalletBuyOrBackRecord(old) {
  getWalletBuyOrBackRecord({
    pageSize,
    pageNum,
    walletOrderType: 1,
    // startDate: props.startDate,
    // endDate: props.endDate,
  })
    .then((res) => {
      initLg.value = false;

      if (res?.code !== CODE) return useToast(res?.msg);
      buyList.value = [...old, ...res?.data?.list];
      pageNum = res.data?.nextPage == 0 ? pageNum : res.data?.nextPage;
      hasMore.value =
        res.data?.pages !== 0 &&
        Number(res.data?.pages) !== Number(res.data?.pageNum);
    })
    .catch(() => {
      initLg.value = false;
    });
}

function toOpenBill(k) {
  store().setCheckedInvoice([k.orderId]);
  navigateToPage({
    route: 'applyInvoice',
    params: {
      content: '充电服务（充电币充值）',
      totalPrice: k?.payAmount,
      orderType: 4,
    },
  });
}
function loadMore() {
  if (!hasMore.value) return;
  _getWalletBuyOrBackRecord(buyList.value);
}
function refresh() {
  _getWalletBuyOrBackRecord([]);
}
onBeforeMount(() => {
  _getWalletBuyOrBackRecord([]);
});
</script>
