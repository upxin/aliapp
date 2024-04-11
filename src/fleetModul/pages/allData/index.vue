<template>
  <CustomHeader background-color="#fff" :pad-x="144">
    <template #title> 所有数据 </template>
    <template #customLeft>
      <div
        @click="
          () => {
            calendar.show();
          }
        "
      >
        <span>{{ date[0] }}</span>
        <span v-if="date[0] != date[1]">{{ date[1] }}</span>
      </div>
    </template>
  </CustomHeader>
  <MainScroll
    :has-more="hasMore"
    refresh-bg="#f9f9f9"
    :has-data="!!list?.length"
    bg="#fff"
    :init-loading="loading"
    @scroll-reach-bottom="loadMore"
    @end-pull-down="refresh"
  >
    <div class="overflow-y-auto">
      <section
        v-for="(k, i) in list"
        :key="k?.vinCode"
        class="box-border px-14px py-10px"
        :class="{ 'nr-border-b': i < list?.length - 1 }"
      >
        <span class="mb-10px pl-6px">
          {{ nullText(k?.licensePlateNumber) }}
        </span>
        <section class="flex mb-2px">
          <div class="flex items-center justify-center w-30px">
            <span
              class="flex items-center justify-center font-bold rounded text-8px bg-hex-bfbfbf opacity-72 text-fff px-2px h-16px"
            >
              VIN
            </span>
          </div>
          <span class="opacity-54"> {{ nullText(k?.vinCode) }} </span>
        </section>
        <div class="flex justify-between">
          <aside class="flex items-center">
            <div class="flex justify-center w-30px">
              <span class="iconfont icon-siji- text-hex-bfbfbf"></span>
            </div>
            <span class="opacity-54">{{ nullText(k?.driver) }}</span>
            <span class="mx-10px opacity-54">
              {{ nullText(k?.driverMobile) }}
            </span>
          </aside>
          <nut-button
            v-if="k?.driverMobile"
            class="px-16px"
            size="mini"
            type="primary"
            style="color: rgba(16, 16, 16, 0.67)"
            color="rgba(187, 187, 187, .27)"
            @click.stop="
              () => {
                makePhoneCall(k?.driverMobile);
                jGcustomCount(JG.CV_017);
              }
            "
            >快速联系司机</nut-button
          >
          <nut-button
            v-else
            class="px-16px"
            size="mini"
            type="primary"
            style="color: red"
            color="rgba(245, 68, 39, .15)"
            @click.stop="
              () => {
                nrNavigateTo(Routes.carRecord, { vin: k?.vinCode || k?.vin });
              }
            "
            >点击添加司机</nut-button
          >
        </div>
        <Item :data="k"></Item>
      </section>
    </div>
  </MainScroll>
  <NrzCalendar
    ref="calendar"
    is-fixed
    :type="2"
    title="选择单个日期或范围"
    lunar
    @change="chooseCalender"
  ></NrzCalendar>
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
import { onBeforeMount, reactive, ref } from 'vue';
import { getAllData } from '@/api/index';
import {
  CODE,
  nullText,
  YMD_EN,
  makePhoneCall,
  nrNavigateTo,
  Routes,
  jGcustomCount,
  JG,
} from '@/utils/index';
import CustomHeader from '@/components/customHeader/index.vue';
import dayjs from 'dayjs';
import Item from './Item.vue';
import Taro from '@tarojs/taro';
import NrzCalendar from '@/components/nrz-calendar/index.vue';

definePageConfig({
 transparentTitle: 'auto',
  titlePenetrate: 'YES',
  defaultTitle: '',  navigationBarTitleText: '邀请好友记录',
});
const calendar = ref();
let loading = ref(true);
let list = ref<any[]>([]);
let hasMore = ref(false);
let startDate = '';
let endDate = '';
let date = ref<string[]>(['', '']);
let pageNum = 1;
let pageSize = 20;
function getParams() {
  return {
    pageNum,
    pageSize,
    startDate,
    endDate,
  };
}
function loadMore() {
  if (!hasMore.value) return;
  pageNum += 1;

  getAllData({
    ...getParams(),
  })
    .then((res) => {
      loading.value = false;

      if (res?.code !== CODE) return;
      list.value = [...list.value, ...res?.data?.records];
      const { total, size, current } = res?.data;
      hasMore.value = current * size < total;
    })
    .catch(() => {
      loading.value = false;
    });
}

function chooseCalender(params) {
  startDate = params?.startDate;
  endDate = params?.endDate;
  date.value = [startDate, endDate];
  refresh();
}
function refresh(cb?) {
  Taro.showLoading();
  pageNum = 1;
  getAllData({
    ...getParams(),
  })
    .then((res) => {
      loading.value = false;
      Taro.hideLoading();
      if (res?.code !== CODE) return;
      list.value = res?.data?.records;
      const { total, size, current } = res?.data;
      hasMore.value = current * size < total;
      cb && cb();
    })
    .catch(() => {
      loading.value = false;
    });
}
onBeforeMount(() => {
  startDate = dayjs().subtract(1, 'day').format(YMD_EN);
  endDate = dayjs().subtract(1, 'day').format(YMD_EN);
  date.value = [startDate, endDate];

  refresh();
});

// bottom
</script>
<style>
.nut-noticebar-page {
  padding: 0 10px;
}
page {
  background-color: #fff;
}
</style>
