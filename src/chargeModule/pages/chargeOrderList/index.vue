<template>
  <CustomBar class="fixed" background-color="#fff">
    <template #title>充电订单</template>
    <template #customLeft>
      <nut-popover
        v-model:visible="visible"
        :list="iconItemList"
        @choose="chooseIcon"
      >
        <template #reference>
          <span class="text-center w-40px"> 筛选</span>
        </template>
      </nut-popover>
    </template>
  </CustomBar>
  <section
    class="fixed w-full h-24px bg-hex-F18A30 bg-opacity-14 text-10px leading-24px pl-16px text-normal text-opacity-46"
    :style="{ top: `${headerHeight}px` }"
  >
    近3个月以内的非充电币充电订单可选择单个或多个开电子发票。
  </section>
  <FullLoading :loading="fullLoading">
    <MainScroll
      v-model:loading="loading"
      :has-more="hasMore"
      :has-data="!!list?.length"
      bg="#fff"
      :pt="headerHeight + 24"
      @scroll-reach-bottom="loadMore"
      @end-pull-down="refresh"
    >
      <div class="overflow-y-auto nrz-safe">
        <main
          v-for="k in list"
          :key="k?.orderId"
          class="overflow-y-auto nrz-safe text-12px"
        >
          <section
            class="p-16px"
            @click="
              () => {
                toDetail(k);
              }
            "
          >
            <div class="flex justify-between text-16px mb-16px">
              <span>{{ k?.plateNum }}</span>
              <span class="text-info">{{ k?.orderStatusText }}</span>
            </div>

            <div class="flex flex-col justify-between my-16px">
              <section class="flex items-center">
                <div class="text-right opacity-48 text-14px w-70px">
                  订单编号：
                </div>
                <span class="">{{ k?.orderId }}</span>
                <span
                  class="text-primary icon iconfont icon-copy ml-8px"
                  @click.stop="
                    () => {
                      copyText(k?.orderId);
                    }
                  "
                ></span>
              </section>
              <section class="flex items-center mt-6px">
                <div class="text-right opacity-48 text-14px w-70px">
                  充电城市：
                </div>
                <span class="">{{ k?.city }}</span>
              </section>
              <section
                v-if="k?.activity?.activityName"
                class="flex items-center mt-6px"
              >
                <div class="text-right opacity-48 text-14px w-70px">
                  活动名称：
                </div>
                <span class="">{{ k?.activity?.activityName }}</span>
              </section>
              <section class="flex items-center mt-6px">
                <div class="text-right opacity-48 text-14px w-70px">
                  电站名称：
                </div>
                <span class="">{{ k?.stationName }}</span>
              </section>
              <section class="flex items-center mt-6px">
                <div class="text-right opacity-48 text-14px w-70px">
                  支付时间：
                </div>
                <span class="">{{ k?.endTime }}</span>
              </section>
              <section class="flex items-center mt-6px">
                <div class="text-right opacity-48 text-14px w-70px">
                  支付类型：
                </div>
                <span class="">{{ k?.payTypeText }}</span>
              </section>
              <section class="flex items-center mt-6px">
                <div class="flex justify-between opacity-48 text-14px w-70px">
                  <span>充</span>
                  <span>电</span>
                  <span>量：</span>
                </div>
                <span class="">{{ k?.totalPower }}度</span>
              </section>
              <section class="flex items-center mt-6px">
                <div class="text-right opacity-48 text-14px w-70px">
                  实际支付：
                </div>
                <span :style="{ color: k?.payType == 1 ? 'red' : 'green' }">{{
                  k?.payType == 1
                    ? `${k?.payAmount}元${
                        k?.discountText ? '(' + k?.discountText + ')' : ''
                      }`
                    : `${k?.payCoin}币${
                        k?.discountText ? '(' + k?.discountText + ')' : ''
                      }`
                }}</span>
              </section>
              <section class="flex items-center mt-6px">
                <div class="flex justify-between opacity-48 text-14px w-70px">
                  <span>优</span>
                  <span>惠</span>
                  <span>券：</span>
                </div>
                <span style="color: rgba(8, 190, 226, 1)">{{
                  k?.couponData?.useFlag ? k?.couponData?.couponName : '--'
                }}</span>
              </section>
            </div>

            <span class="flex items-center justify-between w-full">
              <section class="flex items-center">
                <span
                  v-if="k?.discount * 1 >= 0 && k?.discount * 1 < 1"
                  style="color: rgba(8, 190, 226, 1)"
                  class="flex text-18px items-center mr-6px"
                >
                  {{ k.discountText }}
                </span>
                <span
                  v-else
                  class="flex items-center mr-6px"
                  style="color: #5cb85e"
                >
                  <span class="text-16px">
                    {{
                      k?.payType == 4
                        ? formatThousands(k?.payCoin, 2)
                        : formatThousands(k?.payAmount, 2)
                    }}
                  </span>
                  <span class="text-12px">{{
                    k?.payType == 4 ? '币' : '元'
                  }}</span>
                </span>
                <span class="">
                  <div class="flex bg-main rounded-4px p-6px">
                    <span class="mr-6px opacity-40">
                      电费：{{ formatThousands(k?.totalElecMoney, 2) }}
                    </span>
                    <span class="opacity-40"
                      >服务费：{{
                        formatThousands(k?.totalSeviceMoney, 2)
                      }}</span
                    >
                  </div>
                </span>
              </section>
            </span>
          </section>
        </main>
      </div>
    </MainScroll>
  </FullLoading>
  <NrzAction
    v-model:show="showPop"
    tips="筛选"
    :item-list="filterList"
    @choose="choose"
  >
  </NrzAction>
  <NrzCalendar
    ref="calendar"
    is-fixed
    :type="2"
    title="选择单个日期或范围"
    lunar
    :max-year="dayjs().year()"
    @change="chooseDate"
  ></NrzCalendar>
</template>
<script lang="ts" setup>
import MainScroll from '@/components/scroll-main/index.vue';
import { onBeforeMount, ref } from 'vue';
import CustomBar from '@/components/customHeader/index.vue';
import FullLoading from '@/components/full-loading/index.vue';
import NrzAction from '@/components/nrz-action/index.vue';
import { chargeOrder } from '@/api/index';
import {
  CODE,
  copyText,
  formatThousands,
  navigateToPage,
  YMD_EN,
} from '@/utils/index';
import dayjs from 'dayjs';
import NrzCalendar from '@/components/nrz-calendar/index.vue';

import { useHeaderHeight } from '@/hooks/index';
import { usePullDownRefresh } from '@tarojs/taro';
definePageConfig({ navigationStyle: 'custom', enablePullDownRefresh: true });
let startDate = ref(dayjs(new Date()).subtract(1, 'year').format(YMD_EN));
let endDate = ref(dayjs(new Date()).format(YMD_EN));
let loading = ref(false);
let fullLoading = ref(true);
let hasMore = ref(false);
let showPop = ref(false);
let pageNum = 1;
let pageSize = 20;
let visible = ref(false);
let list = ref<any[]>([]);
let filterId = ref<number>(0);
let iconItemList = ref([
  { key: 3, name: '状态筛选' },
  { key: 2, name: '时间选择' },
  { key: 1, name: '开发票' },
]);
let filterList = ref([
  {
    key: 1,
    name: ' 微信支付',
  },
  {
    key: 2,
    name: '支付宝支付',
  },
  {
    key: 4,
    name: '充电钱包支付',
  },
  {
    key: 0,
    name: '全部',
  },
]);
const { headerHeight } = useHeaderHeight();
function choose(res) {
  filterId.value = res.key;
  setTimeout(() => {
    _chargeOrder();
  }, 0);
}

function chooseDate({ startDate: start, endDate: end }) {
  startDate.value = start;
  endDate.value = end;
  setTimeout(() => {
    _chargeOrder();
  }, 0);
}
let calendar = ref();

function chooseIcon(res) {
  visible.value = false;
  if (res.key == 1) {
    navigateToPage({
      route: 'receiptPhotoDetail',
    });
    return;
  }
  if (res.key == 2) {
    calendar.value.show();
    return;
  }
  if (res.key == 3) {
    showPop.value = true;
  }
}

function toDetail(item) {
  navigateToPage({
    route: 'chargeOrderDetail',
    params: {
      orderId: item?.orderId,
    },
  });
}
function _chargeOrder() {
  pageNum = 1;
  chargeOrder({
    pageNum,
    pageSize,
    startDate: startDate.value,
    endDate: endDate.value,
    payType: filterId.value == 0 ? '' : filterId.value,
  })
    .then((res) => {
      fullLoading.value = false;
      loading.value = false;

      if (res.code !== CODE) return;
      list.value = res?.data?.list;
      pageNum = res.data?.nextPage == 0 ? pageNum : res.data?.nextPage;
      hasMore.value = Number(res.data?.pages) !== Number(res.data?.pageNum);
    })
    .catch(() => {
      fullLoading.value = false;
    });
}
function _chargeOrderMore() {
  chargeOrder({
    pageNum,
    pageSize,
    startDate: startDate.value,
    endDate: endDate.value,
    payType: filterId.value == 0 ? '' : filterId.value,
  }).then((res) => {
    if (res.code !== CODE) return;
    list.value = [...list.value, ...res?.data?.list];
    pageNum = res.data?.nextPage == 0 ? pageNum : res.data?.nextPage;
    hasMore.value = Number(res.data?.pages) !== Number(res.data?.pageNum);
  });
}
function loadMore() {
  if (hasMore.value) {
    _chargeOrderMore();
  }
}
function refresh() {
  pageNum = 1;
  _chargeOrder();
}
onBeforeMount(() => {
  _chargeOrder();
});
usePullDownRefresh(() => {
  refresh();
});
// bottom
</script>
<style lang="scss">
page {
  background-color: #fff;
}
.nut-popover-taro .popover-content {
  min-width: 94px;
}
</style>
