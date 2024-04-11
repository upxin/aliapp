<template>
  <CustomBar background-color="#fff" :pad-x="144" :z="1000">
    <template #title> 驾驶评分 </template>
    <template #customLeft>
      <span @click="state.visible = true">
        {{ state.currentDate ? state.currentDate : '选择日期' }}
      </span>
    </template>
  </CustomBar>
  <MainScroll
    :has-more="hasMore"
    :has-data="!!list"
    bg="#fff"
    @scroll-reach-bottom="loadMore"
    @end-pull-down="refresh"
  >
    <div class="overflow-y-auto">
      <section
        v-for="(k, i) in list"
        :key="k?.vin"
        :class="{ 'nr-border-b': i < list?.length - 1 }"
        class="box-border flex items-center justify-between px-14px py-10px"
        @click="
          () => {
            toDetail(k);
          }
        "
      >
        <aside>
          <CarInfo
            class="mb-10px pl-6px"
            :vehicle-text="k?.licensePlateNumber"
            :vehicle-type="k?.vehicleType"
          ></CarInfo>
          <section class="flex mb-2px">
            <div class="flex items-center justify-center w-30px">
              <span
                class="flex items-center justify-center font-bold rounded text-8px bg-hex-bfbfbf opacity-72 text-fff px-2px h-16px"
              >
                VIN
              </span>
            </div>
            <span class="opacity-54"> {{ k?.vin || '--' }} </span>
          </section>
          <section class="flex items-center">
            <div class="flex justify-center w-30px">
              <span class="iconfont icon-siji- text-hex-bfbfbf"></span>
            </div>
            <span class="opacity-54">{{ k?.driver || '--' }}</span>
            <span class="mx-10px opacity-54">
              {{ k?.driverMobile || '--' }}
            </span>
          </section>
        </aside>
        <aside class="flex flex-col items-end justify-between h-full">
          <div class="flex items-end pt-10px">
            <span class="font-bold text-18px">{{ k?.score || '--' }}</span>
            <span class="text-12px pb-2px">分</span>
          </div>
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
                nrNavigateTo(Routes.carRecord, { vin: k?.vin });
              }
            "
            >点击添加司机</nut-button
          >
        </aside>
      </section>
    </div>
  </MainScroll>
  <van-popup
    :show="state.visible"
    position="bottom"
    :round="true"
    @close="state.visible = false"
  >
    <van-datetime-picker
      type="date"
      visible-item-count="5"
      :min-date="dayjs().subtract(1, 'year').valueOf()"
      :show-toolbar="true"
      :max-date="dayjs().valueOf()"
      @confirm="vanConfirm"
      @cancel="state.visible = false"
    />
  </van-popup>
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
import CustomBar from '@/components/customHeader/index.vue';
import CarInfo from '../../comp/CarInfo.vue';
import { driveScore } from '@/api/index';
import {
  CODE,
  YMD_EN,
  makePhoneCall,
  Routes,
  nrNavigateTo,
  jGcustomCount,
  JG,
} from '@/utils/index';
import dayjs from 'dayjs';

definePageConfig({
 transparentTitle: 'auto',
  titlePenetrate: 'YES',
  defaultTitle: '',});

const state = reactive({
  currentDate: '',
  visible: false,
  minDate: dayjs().subtract(1, 'year').valueOf(),
  startDate: '',
  endDate: '',
});
let list = ref<any[]>([]);
let hasMore = ref(false);

let pageNum = 1;
let pageSize = 20;

function getParams() {
  return {
    pageNum,
    pageSize,
  };
}
function toDetail(item) {
  let { vin, licensePlateNumber, vehicleType } = item;
  nrNavigateTo(Routes.drivingScoreDetail, {
    vinCode: vin,
    licensePlateNumber,
    vehicleType: vehicleType,
  });
}
function vanConfirm(v) {
  state.currentDate = dayjs(v.detail).format('YYYY-MM').slice(0, 7);
  state.startDate = dayjs(v?.detail).startOf('month').format(YMD_EN);
  state.endDate = dayjs(v?.detail).endOf('month').format(YMD_EN);
  state.visible = false;

  pageNum = 1;
  let p = {
    startDate: state.startDate,
    endDate: state.endDate,
    ...getParams(),
  };
  driveScore(p).then((res) => {
    if (res?.code !== CODE) return;
    list.value = [...res?.data?.records];

    const { total, size, current } = res?.data;
    hasMore.value = current * size < total;
  });
}
function loadMore() {
  if (!hasMore.value) return;

  pageNum += 1;

  let p: any = {
    ...getParams(),
  };
  if (state.startDate) {
    p.startDate = state.startDate;
    p.endDate = state.endDate;
  } else {
    p.date = dayjs().subtract(1, 'day').format(YMD_EN);
  }
  driveScore(p).then((res) => {
    if (res?.code !== CODE) return;
    list.value = [...list.value, ...res?.data?.records];

    const { total, size, current } = res?.data;
    hasMore.value = current * size < total;
  });
}
function refresh(cb?) {
  state.endDate = '';
  state.startDate = '';
  state.currentDate = '';
  pageNum = 1;

  driveScore({
    date: dayjs().subtract(1, 'day').format(YMD_EN),
    ...getParams(),
  }).then((res) => {
    if (res?.code !== CODE) return;
    list.value = res?.data?.records;
    const { total, size, current } = res?.data;
    hasMore.value = current * size < total;
    cb && cb();
  });
}
onBeforeMount(() => {
  jGcustomCount(JG.CV_013);
  refresh();
});
// bottom
</script>
<style>
page {
  background-color: #fff;
}
</style>
