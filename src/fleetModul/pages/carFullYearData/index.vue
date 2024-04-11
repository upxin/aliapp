<template>
  <section class="flex flex-col w-full h-full">
    <CustomBar background-color="#fff" :border="false" position="unset">
      <template #title>
        <div class="flex items-center" @click="menuVisible = !menuVisible">
          <CarInfo
            :vehicle-text="currentCarPlateNum"
            :vehicle-type="carData?.vehicleType"
          ></CarInfo>
          <span
            class="iconfont icon-sanjiao text-18px"
            :class="{ trans: menuVisible, intrans: !menuVisible }"
          ></span>
        </div>
      </template>
      <template #customLeft>
        <span class="icon-rili iconfont" @click="visible = true"></span>
      </template>
    </CustomBar>
    <section class="flex-1 overflow-hidden">
      <MainScroll
        :init-loading="initLoading"
        :has-more="hasMore"
        :pt="0"
        end-text=""
        @end-pull-down="refresh"
      >
        <div class="overflow-y-auto">
          <Title title="运营效率" :vehicle-type="tabIndex"></Title>
          <Chart id="opEfficiency" class="h-300px" :opts="_efficiency"></Chart>

          <Title
            class="pt-30px"
            title="行驶里程"
            :vehicle-type="tabIndex"
          ></Title>
          <Chart id="_mileage" class="h-300px" :opts="_mileage"></Chart>

          <Title
            class="pt-30px"
            title="行驶时长"
            :vehicle-type="tabIndex"
          ></Title>
          <Chart id="_runTime" class="h-300px" :opts="_runTime"></Chart>

          <Title
            class="pt-30px"
            title="平均能耗"
            :vehicle-type="tabIndex"
          ></Title>
          <Chart
            id="_energyConsumption"
            class="h-300px"
            :opts="_energyConsumption"
          ></Chart>
        </div>
      </MainScroll>
    </section>
  </section>
  <DropMenu
    v-model:show="menuVisible"
    v-model:currentVal="currentCarPlateNum"
    v-model:full-list="fullCarList"
    v-model:car-data="carData"
    v-model:vin-code="vin"
    @success="success"
  ></DropMenu>
  <NrzAction
    v-model:show="visible"
    tips="切换时间"
    :item-list="[
      { name: '最近12个月整体', key: '1' },
      { name: '按月选择', key: '2' },
      { name: '按日期范围选择', key: '3' },
    ]"
    @choose="choose"
  >
  </NrzAction>
  <NrzDateTime
    ref="datePicker"
    v-model:model-value="currentDate"
    :type="3"
    @confirm="confirmMonth"
  ></NrzDateTime>
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
import { onBeforeMount, computed, ref } from 'vue';
import CustomBar from '@/components/customHeader/index.vue';
import CarInfo from '../../comp/CarInfo.vue';

import { getCarYearData } from '@/api/index';
import { CODE, YMD_EN, getStore, OBU_USER, useToast } from '@/utils/index';
import Title from './title.vue';
import Chart from '../../comp/Chart.vue';
import Taro, { nextTick } from '@tarojs/taro';
import dayjs from 'dayjs';
import DropMenu from '../../comp/dropMenu/index.vue';
import NrzAction from '@/components/nrz-action/index.vue';
import NrzDateTime from '@/components/nrz-datetime/index.vue';
import NrzCalendar from '@/components/nrz-calendar/index.vue';

definePageConfig({
 transparentTitle: 'auto',
  titlePenetrate: 'YES',
  defaultTitle: '',  usingComponents: {
    'ec-canvas': '../../comp/ec-canvas/ec-canvas',
  },
});
const datePicker = ref();
const calendar = ref();
const currentDate = ref('');
let date = ref<string[]>([]);
let hasMore = ref(false);
let initLoading = ref(true);
let tabIndex = ref(0);
let visible = ref(false);
let latestYear = true;
let startDate = '';
let endDate = '';
let menuVisible = ref(false);
let fullCarList = ref([]);
let vin = ref(getStore(OBU_USER)?.belongTeam?.vinCode);
let carData = ref({
  vehicleType: getStore(OBU_USER)?.belongTeam?.vehicleType,
});
let vehicleType = ref(0);
let currentCarPlateNum = ref(
  getStore(OBU_USER)?.belongTeam?.licensePlateNumber
);
const allData = ref<any>();
let grid = {
  top: '10%',
  left: '6%',
  right: '10%',
  bottom: '3%',
  containLabel: true,
};
function toolTips(data) {
  return {
    trigger: 'axis',
    formatter(p) {
      return `能耗：${data?.[p?.[0]?.dataIndex]?.value}\n环比：${
        data?.[p?.[0]?.dataIndex]?.rate || '--'
      }%`;
    },
  };
}

let _efficiency = computed(() => {
  let xD = allData.value?.efficiency?.map((item) => {
    return item?.key?.slice(5);
  });
  let yD = allData.value?.efficiency?.map((item) => {
    return item?.value;
  });
  let option = {
    grid,
    xAxis: {
      type: 'category',
      data: xD,
      name: '月',
    },
    yAxis: {
      name: '%',
      type: 'value',
    },
    series: [
      {
        itemStyle: {
          normal: {
            color: '#F0601F',
            lineStyle: {
              width: 2,
              type: 'dotted', //'dotted'虚线 'solid'实线
            },
          },
        },
        symbol: 'circle', //将小圆点改成实心 不写symbol默认空心
        symbolSize: 10,
        data: yD,
        type: 'line',
      },
    ],
  };
  console.log(option);
  return option;
});

let _mileage = computed(() => {
  let xD = allData.value?.mileage?.map((item) => {
    return item?.key?.slice(5);
  });
  let yD = allData.value?.mileage?.map((item) => {
    return item?.value;
  });
  let option = {
    grid,
    xAxis: {
      type: 'category',
      data: xD,
      name: '月',
    },
    yAxis: {
      name: 'km',
      type: 'value',
    },
    series: [
      {
        itemStyle: {
          normal: {
            color: '#1FDAF0',
            lineStyle: {
              width: 2,
              type: 'dotted', //'dotted'虚线 'solid'实线
            },
          },
        },
        symbol: 'circle', //将小圆点改成实心 不写symbol默认空心
        symbolSize: 10,
        data: yD,
        type: 'line',
      },
    ],
  };
  console.log(option);
  return option;
});

let _runTime = computed(() => {
  let xD = allData.value?.runTime?.map((item) => {
    return item?.key?.slice(5);
  });
  let yD = allData.value?.runTime?.map((item) => {
    return item?.value;
  });
  let option = {
    grid,
    xAxis: {
      type: 'category',
      data: xD,
      name: '月',
    },
    yAxis: {
      name: 'h',
      type: 'value',
    },
    series: [
      {
        itemStyle: {
          normal: {
            color: '#AE1FF0',
            lineStyle: {
              width: 2,
              type: 'dotted', //'dotted'虚线 'solid'实线
            },
          },
        },
        symbol: 'circle', //将小圆点改成实心 不写symbol默认空心
        symbolSize: 10,
        data: yD,
        type: 'line',
      },
    ],
  };
  console.log(option);
  return option;
});
let _energyConsumption = computed(() => {
  let xD = allData.value?.energyConsumption?.map((item) => {
    return item?.key?.slice(5);
  });
  let yD = allData.value?.energyConsumption?.map((item) => {
    return item?.value;
  });
  let option = {
    grid,
    xAxis: {
      type: 'category',
      data: xD,
      name: '月',
    },
    yAxis: {
      name: 'h',
      type: 'value',
    },
    series: [
      {
        itemStyle: {
          normal: {
            color: '#AE1FF0',
            lineStyle: {
              width: 2,
              type: 'dotted', //'dotted'虚线 'solid'实线
            },
          },
        },
        symbol: 'circle', //将小圆点改成实心 不写symbol默认空心
        symbolSize: 10,
        data: yD,
        type: 'line',
      },
    ],
  };
  console.log(option);
  return option;
});
function confirmMonth(res) {
  nextTick(() => {
    startDate = dayjs(res.startDate).startOf('month').format(YMD_EN);
    endDate = dayjs(res.endDate).endOf('month').format(YMD_EN);
    latestYear = false;
    _getCarYearData();
  });
}
function success() {
  _getCarYearData();
}
function chooseCalender(params) {
  startDate = params?.startDate;
  endDate = params?.endDate;
  date.value = [startDate, endDate];
  latestYear = false;
  _getCarYearData();
}
function choose(item) {
  if (item?.key === '1') {
    latestYear = true;
    Taro.showLoading();
    _getCarYearData();
  }
  if (item?.key === '2') {
    datePicker.value.show();
  }
  if (item?.key === '3') {
    calendar.value.show();
  }
}
function _getCarYearData() {
  getCarYearData({
    vinLicense: vin.value,
    latestYear,
    startDate,
    endDate,
    vehicleType: vehicleType.value,
  })
    .then((res) => {
      initLoading.value = false;
      Taro.hideLoading();
      if (res?.code != CODE) return useToast(res?.msg);
      allData.value = res?.data;
    })
    .catch(() => {
      Taro.hideLoading();
      initLoading.value = false;
    });
}
function refresh() {
  _getCarYearData();
}
onBeforeMount(() => {
  _getCarYearData();
});
// bottom
</script>
<style>
page {
  background-color: #fff;
}
</style>
