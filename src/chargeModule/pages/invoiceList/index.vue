<template>
  <section class="w-full h-full flex flex-col">
    <CustomBar background-color="#fff" :border="false" position="unset">
      <template #title>已开发票</template>
      <template #customLeft>
        <nut-popover
          v-model:visible="visible"
          :list="iconItemList"
          @choose="chooseIcon"
        >
          <template #reference>
            <span class="text-center w-40px overflow-ellipsis">
              {{ title }}</span
            >
          </template>
        </nut-popover>
      </template>
    </CustomBar>
    <NrzTabs v-model:current="current" :tabs="titles"></NrzTabs>
    <template v-if="current == 3">
      <section class="flex justify-center py-10px bg-fff">
        <nut-button
          size="small"
          class="rounded-4px mr-30px nrz-thin text-12px w-100px"
          :class="{
            'bg-normal': orderType == 3,
            'text-fff': orderType == 3,
            'border-0': orderType == 3,
          }"
          @click="orderType = 3"
          >充电发票</nut-button
        >
        <nut-button
          size="small"
          :class="{
            'bg-normal': orderType == 4,
            'text-fff': orderType == 4,
            'border-0': orderType == 4,
          }"
          class="rounded-4px border-norma text-12px nrz-thin w-100px"
          @click="orderType = 4"
          >购买充电币</nut-button
        >
      </section>
    </template>
    <div class="flex-1 overflow-hidden">
      <MainScroll
        :initLoading="fullLoading"
        :pt="0"
        :has-more="hasMore"
        :has-data="!!list?.length"
        :placeholder-empty="placeholderEmpty"
        @scroll-reach-bottom="loadMore"
        @end-pull-down="refresh"
      >
        <div class="overflow-y-auto">
          <div
            v-for="k in list"
            :key="k?.billId"
            class="relative overflow-hidden nr-border-b p-16px bg-fff"
            @click="
              () => {
                lookBill(k?.billUrl);
              }
            "
          >
            <section
              class="box-border absolute top-0 right-0"
              :class="{
                triangleEnd: k?.billStatus == 2,
                triangling: k?.billStatus != 2,
              }"
            >
              <span
                class="absolute text-center transform text-fff -top-30px -right-1px text-8px w-30px rotate-z-45"
              >
                {{ k?.billStatusText }}
              </span>
            </section>
            <div class="flex items-center my-16px text-14px">
              <div class="opacity-48">发票类型：</div>
              <span>{{ k?.titleTypeText }}</span>
            </div>
            <div class="flex items-center my-16px text-14px">
              <div class="opacity-48">发票抬头：</div>
              <span>{{ k?.invoiceTitle }}</span>
            </div>
            <div class="flex items-center my-16px text-14px">
              <div class="opacity-48">税号：</div>
              <span>{{ k?.taxCode }}</span>
            </div>
            <div class="flex items-center my-16px text-14px">
              <div class="opacity-48">发票内容：</div>
              <span>{{ k?.orderTypeText }}</span>
            </div>
            <div class="flex items-center my-16px text-14px">
              <div class="opacity-48">申请时间：</div>
              <span>{{ k?.createTime }}</span>
            </div>
            <div class="flex items-center my-16px text-14px">
              <div class="opacity-48">开票金额：</div>
              <span
                :class="{
                  'text-red-500': true,
                }"
                >{{ k?.billAmount }}元</span
              >
            </div>
          </div>
        </div>
      </MainScroll>
    </div>
  </section>
  <NrzCalendar
    ref="calendar"
    is-fixed
    :type="2"
    title="选择单个日期或范围"
    lunar
    @change="setChooseValue"
  ></NrzCalendar>
</template>
<script lang="ts" setup>
import MainScroll from '@/components/scroll-main/index.vue';
import { onBeforeMount, ref, watch, computed } from 'vue';
import CustomBar from '@/components/customHeader/index.vue';
import NrzTabs from '@/components/nrz-tabs/index.vue';
import dayjs from 'dayjs';

import { getInvoiceRecorde } from '@/api/index';
import { CODE, YMD_EN, navigateToPage } from '@/utils/index';
import Taro from '@tarojs/taro';
import NrzCalendar from '@/components/nrz-calendar/index.vue';

definePageConfig({ transparentTitle: 'always',titlePenetrate: 'YES',defaultTitle: '', });
let list = ref<any[]>([]);
let hasMore = ref(false);
let pageNum = 1;
let pageSize = 20;
const calendar = ref();
let date = ref([
  dayjs(new Date()).subtract(20, 'day').format(YMD_EN),
  dayjs(new Date()).format(YMD_EN),
]);

const searchKey = ref('');
const fullLoading = ref(true);
let current = ref(3);
const orderType = ref(3);
let visible = ref(false);
let billStatus = ref(0);
let iconItemList = ref([
  { key: 0, name: '全部' },
  { key: 2, name: '已开' },
  { key: 1, name: '申请中' },
  { key: 3, name: '失败' },

  { key: 4, name: '日期筛选' },
]);
const titles = [' 整车', '商品', '充电', '服务'];

const placeholderEmpty = computed(() => !searchKey.value);
const setChooseValue = (res) => {
  date.value = [res.startDate, res.endDate];
  setTimeout(() => {
    _getInvoiceRecorde();
  }, 0);
};
let title = computed(() => {
  return iconItemList.value?.find((k) => k.key === billStatus.value)?.name;
});

function lookBill(url) {
  if (/(.pdf)$/.test(url)) {
    openPdf(url);
    return;
  }
  if (/(.png)$/.test(url)) {
    navigateToPage({
      route: 'invoiceDetail',
      params: {
        url,
      },
    });
  }
}
function openPdf(url) {
  Taro.downloadFile({
    // 示例 url，并非真实存在
    url,
    success: function (res) {
      const filePath = res.tempFilePath;
      Taro.openDocument({
        filePath: filePath,
        showMenu: true,
        success: function (res) {
          console.log('打开文档成功');
        },
      });
    },
  });
}
function chooseIcon(res) {
  visible.value = false;
  if (res.key == 4) {
    calendar.value.show();
    return;
  }
  billStatus.value = res.key;

  Taro.showLoading();
  setTimeout(() => {
    _getInvoiceRecorde();
  }, 0);
}
function _getInvoiceRecorde() {
  getInvoiceRecorde({
    pageNum,
    pageSize,
    orderType: orderType.value,
    billStatus: billStatus.value == 0 ? null : billStatus.value,
    startDate: date.value[0],
    endDate: date.value[1],
  })
    .then((res) => {
      Taro.hideLoading();
      fullLoading.value = false;

      if (res?.code !== CODE) return;
      list.value = [...res?.data?.list];
      pageNum = res.data?.nextPage == 0 ? pageNum : res.data?.nextPage;
      hasMore.value = res.data?.hasNextPage;
    })
    .catch(() => {
      fullLoading.value = false;
      Taro.hideLoading();
    });
}

function _getInvoiceRecordeMore() {
  getInvoiceRecorde({
    pageNum,
    pageSize,
    orderType: orderType.value,
    billStatus: billStatus.value == 0 ? null : billStatus.value,
    startDate: date.value[0],
    endDate: date.value[1],
  }).then((res) => {
    if (res?.code !== CODE) return;
    list.value = [...list.value, ...res?.data?.list];
    pageNum = res.data?.nextPage == 0 ? pageNum : res.data?.nextPage;
    hasMore.value = res.data?.hasNextPage;
  });
}
function loadMore() {
  if (!hasMore.value) return;
  _getInvoiceRecordeMore();
}
function refresh() {
  pageNum = 1;
  _getInvoiceRecorde();
}
onBeforeMount(() => {
  _getInvoiceRecorde();
});

watch(
  () => current.value,
  (v) => {
    orderType.value = v;
  }
);
watch(
  () => orderType.value,
  (v) => {
    orderType.value = v;
    Taro.showLoading();
    _getInvoiceRecorde();
  }
);
// bottom
</script>
<style>
.triangleEnd {
  border-top: 40px solid var(--nr-show);
  border-left: 40px solid transparent;
}
.triangling {
  border-top: 40px solid var(--nr-second);
  border-left: 40px solid transparent;
}
.nut-popover-taro .popover-content {
  min-width: 94px;
}
</style>
