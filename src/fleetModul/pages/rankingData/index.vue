<template>
  <CustomHeader background-color="#fff" :pad-x="134" :border="false">
    <template #title> 数据排行 </template>
  </CustomHeader>
  <div
    :style="{ top: `${headerHeight}px` }"
    style="position: fixed; z-index: 1000"
    class="fixed w-full flex nrz-thin z-999 nr-border-b h-50px box-border bg-fff"
  >
    <div
      class="flex-1 flex items-center justify-center min-w-0"
      @click="dropShow = true"
    >
      <span class="overflow-ellipsis">{{ keyword }}</span>
      <span class="iconfont icon-sanjiao"></span>
    </div>
    <div
      class="flex-1 flex justify-center items-center box-border pr-10px"
      @click="handleCalendar"
    >
      <span>{{ date[0] }}</span>
      <span v-if="date[0] != date[1]">至</span>
      <span v-if="date[0] != date[1]">{{ date[1] }}</span>
      <div class="arcm"></div>
    </div>
  </div>
  <DownList
    :show="dropShow"
    :paddingbtm="16"
    :translatey="headerHeight + 50"
    @close="dropShow = false"
  >
    <DownListItem
      v-model:text="keyword"
      v-model:value="value"
      :list="opt1"
      @change-item="changeKey"
    ></DownListItem>
  </DownList>

  <MainScroll
    :has-more="hasMore"
    refresh-bg="#f9f9f9"
    :pt="headerHeight + noticeBar"
    :has-data="!!list?.length"
    bg="#fff"
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
  YMD_EN,
  Routes,
  nrNavigateTo,
  makePhoneCall,
  nullText,
  jGcustomCount,
  JG,
} from '@/utils/index';
import { useHeaderHeight } from '@/hooks/index';
import CustomHeader from '@/components/customHeader/index.vue';
import dayjs from 'dayjs';
import Item from '../allData/Item.vue';
import Taro from '@tarojs/taro';
import DownList from '@/components/nrz-down-list/index.vue';
import DownListItem from '@/components/nrz-down-list-item/index.vue';
import NrzCalendar from '@/components/nrz-calendar/index.vue';

definePageConfig({
 transparentTitle: 'always',
  titlePenetrate: 'YES',
  defaultTitle: '',  navigationBarTitleText: '邀请好友记录',
});
const calendar = ref();
let dropShow = ref(false);
let startDate = '';
let endDate = '';
let date = ref<string[]>(['', '']);
let noticeBar = ref(50);
let list = ref<any[]>([]);
let hasMore = ref(false);
const { headerHeight } = useHeaderHeight();
let keyword = ref('行驶里程');
let opt1 = ref([
  { text: '行驶里程', value: '行驶里程' },
  { text: '行驶时长', value: '行驶时长' },
  { text: '平均速度', value: '平均速度' },
  { text: '耗电量 - 仅电车', value: '耗电量' },
  { text: '充电量 - 仅电车', value: '充电量' },
  { text: '平均能耗 - 仅电车', value: '平均能耗' },
  { text: '耗油量 - 仅油车', value: '耗油量' },
  { text: '加油量 - 仅油车', value: '加油量' },
  { text: '平均油耗 - 仅油车', value: '平均油耗' },
]);
let value = ref('行驶里程');
function handleCalendar() {
  calendar.value.show();
}
function chooseCalender(params) {
  startDate = params?.startDate;
  endDate = params?.endDate;
  date.value = [startDate, endDate];
  refresh();
}
function changeKey(v) {
  dropShow.value = false;
  keyword.value = v?.text;
  refresh();
}
let pageNum = 1;
let pageSize = 20;
function getParams() {
  return {
    pageNum,
    pageSize,
    startDate,
    endDate,
    sort: {
      sortProp: keyword.value,
      sortType: 'asc',
    },
  };
}
function loadMore() {
  if (!hasMore.value) return;
  pageNum += 1;

  getAllData({
    ...getParams(),
  }).then((res) => {
    if (res?.code !== CODE) return;
    list.value = [...list.value, ...res?.data?.records];
    const { total, size, current } = res?.data;
    hasMore.value = current * size < total;
  });
}
function refresh(cb?) {
  Taro.showLoading();
  pageNum = 1;
  getAllData({
    ...getParams(),
  }).then((res) => {
    Taro.hideLoading();
    if (res?.code !== CODE) return;
    list.value = res?.data?.records;
    const { total, size, current } = res?.data;
    hasMore.value = current * size < total;
    cb && cb();
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
.arcm {
  border-color: transparent transparent currentcolor currentcolor;
  border-style: solid;
  border-width: 3px;
  content: '';
  margin-top: -5px;
  opacity: 0.8;
  top: 50%;
  transform: rotate(-45deg);
  margin-left: 4px;
}
</style>
