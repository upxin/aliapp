<template>
  <CustomHeader background-color="#fff" :pad-x="140">
    <template #customLeft>
      <span @click="state.visible = true">
        {{ state.currentDate ? state.currentDate : '选择日期' }}
      </span>
    </template>
    <template #title>
      <div
        v-if="isOwner"
        class="flex items-center"
        @click="menuVisible = !menuVisible"
      >
        <CarInfo
          :vehicle-text="state.currentCarPlateNum"
          :vehicle-type="(params?.vehicleType as string)"
        ></CarInfo>
        <span
          class="iconfont icon-sanjiao text-18px"
          :class="{ trans: menuVisible, intrans: !menuVisible }"
        ></span>
      </div>
      <div v-else class="flex items-center">
        <span class="mr-4px">{{ state.currentCarPlateNum }}</span>
      </div>
    </template>
  </CustomHeader>
  <div :style="{ height: `${headerHeight}px` }"></div>
  <FullLoading :loading="loading" :no-data="!state.data">
    <div v-if="state?.data" class="flex items-end justify-center pt-20px">
      <span class="font-bold text-38px">{{ state?.score }}</span>
      <span class="text-20px pb-6px nrz-thin">分</span>
    </div>
    <view
      v-if="state?.data"
      class="box-border w-full overflow-hidden"
      :class="{ 'h-0px': !state.data, 'h-400px': state.data }"
    >
      <Chart id="mile" :opts="mileData"></Chart>
    </view>

    <div v-if="state?.data" class="px-14px">
      <div class="pb-20px">各项扣分明细</div>
      <nut-table :columns="state?.columns" :data="state?.data"></nut-table>
    </div>

    <section class="pb-60px text-12px opacity-70 px-20px pt-20px">
      <div>备注：</div>
      <div class="flex items-start nrz-thin my-6px">
        <span>1.</span>
        <span
          >驾驶评分有助于优化司机的驾驶习惯，提供综合车况。评分仅供参考，具体以车辆实际情况为准。</span
        >
      </div>
      <div class="flex items-start nrz-thin">
        <span>2.</span>
        <span> 单项扣分规则设置请登录www.fms-admin.newrizon.com操作。 </span>
      </div>
    </section>
  </FullLoading>
  <van-popup
    :show="state.visible"
    position="bottom"
    :round="true"
    :z-index="999"
    @close="state.visible = false"
  >
    <van-datetime-picker
      type="year-month"
      visible-item-count="5"
      :min-date="dayjs().subtract(1, 'year').valueOf()"
      :show-toolbar="true"
      :max-date="dayjs().valueOf()"
      @confirm="vanConfirm"
    />
  </van-popup>
  <DropMenu
    v-model:show="menuVisible"
    v-model:currentVal="state.currentCarPlateNum"
    v-model:full-list="state.fullCarList"
    v-model:vin-code="state.vinCode"
  ></DropMenu>
</template>
<script lang="ts">
import { onShareAppMessage, onShareTimeline } from '@/utils/index';
import { useRouter } from '@tarojs/taro';
export default {
  onShareAppMessage,
  onShareTimeline,
};
</script>
<script setup lang="ts">
import { computed, onMounted, ref, reactive, watch } from 'vue';
import CustomHeader from '@/components/customHeader/index.vue';
import FullLoading from '@/components/full-loading/index.vue';
// import * as echarts from '../../comp/ec-canvas/echarts.js';
import { navigateToPage, YMD_CH, YMD_EN } from '@/utils/index';

import { Routes, CODE } from '@/utils';
import DropMenu from '../../comp/dropMenu/index.vue';
import { driveScore } from '@/api/index';
import { useHeaderHeight } from '@/hooks/index';
import dayjs from 'dayjs';
import CarInfo from '../../comp/CarInfo.vue';
import Chart from '../carData/Chart.vue';
import Taro from '@tarojs/taro';
definePageConfig({
  usingComponents: {
    // 'ec-canvas': '../../comp/ec-canvas/ec-canvas',
  },
  transparentTitle: 'always',
  titlePenetrate: 'YES',
  defaultTitle: '',
});
const { headerHeight } = useHeaderHeight();
let params = useRouter()?.params;
let menuVisible = ref(false);
let loading = ref(true);
const state = reactive({
  currentCarPlateNum: '',
  vinCode: '',
  fullCarList: [],
  currentDate: '',
  score: '',
  visible: false,
  minDate: dayjs().subtract(1, 'year').valueOf(),
  startDate: dayjs().subtract(1, 'day').format(YMD_EN),
  endDate: dayjs().subtract(1, 'day').format(YMD_EN),
  columns: [
    {
      title: '子项',
      key: 'name',
      stylehead: 'background:#f9f9f9;font-size:12px;',
      stylecolumn: 'font-size:12px;',
    },
    {
      title: '单项扣分（分）',
      key: 'value',
      stylehead: 'background:#f9f9f9;font-size:12px;',
      stylecolumn: 'font-size:12px;',
    },
    {
      title: '触发次数',
      key: 'times',
      stylehead: 'background:#f9f9f9;font-size:12px;',
      stylecolumn: 'font-size:12px;',
    },
    {
      title: '单项得分（分）',
      key: 'score',
      stylehead: 'background:#f9f9f9;font-size:12px;',
      stylecolumn: 'font-size:12px;',
    },
  ],
  data: [],
});
let chartData = ref();

let mileData = computed(() => {
  let indicator = chartData.value?.map((item) => {
    return {
      name: item.name,
      max: 100,
    };
  });
  let yD = chartData.value?.map((item) => {
    return item.score;
  });
  let option = {
    radar: {
      indicator,
      center: ['50%', '50%'],
      radius: 100,
    },
    series: [
      {
        type: 'radar',
        data: [
          {
            value: yD,
          },
        ],
      },
    ],
  };
  return option;
});

function vanConfirm(v) {
  state.currentDate = dayjs(v.detail).format('YYYY-MM');
  state.startDate = dayjs(v?.detail).startOf('month').format(YMD_EN);
  state.endDate = dayjs(v?.detail).endOf('month').format(YMD_EN);
  state.visible = false;
  Taro.showLoading();
  getData();
}

function getData() {
  let p = {
    vinLicense: state.vinCode,
    startDate: state.startDate,
    endDate: state.endDate,
  };
  driveScore(p).then((res) => {
    loading.value = false;
    Taro.hideLoading();
    if (res?.code !== CODE) return;
    state.score = res?.data?.records?.[0]?.score;
    chartData.value = res?.data?.records?.[0]?.detailData;
    state.data = res?.data?.records?.[0]?.detailData;
    loading.value = false;
  });
}
let isOwner = computed(() => {
  return state.fullCarList?.some(
    (item: any) => item?.licensePlateNumber === state.currentCarPlateNum
  );
});

watch(
  () => state.currentCarPlateNum,
  () => {
    getData();
  }
);
onMounted(() => {
  state.currentCarPlateNum = useRouter().params?.licensePlateNumber as string;
  state.vinCode = useRouter().params?.vinCode as string;

  getData();
});
</script>
<style>
page {
  background-color: #fff;
}
.nz-shadow {
  box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.19);
  border: 0;
}

.nut-table__main__head__tr .nut-table__main__head__tr--border {
  border: 01px solid #f9f9f9;
}
.nut-table__main__head__tr--border,
.nut-table__main__body__tr--border {
  border: 1px dashed #ececec;
  box-sizing: border-box;
}
</style>
