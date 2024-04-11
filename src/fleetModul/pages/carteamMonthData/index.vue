<template>
  <CustomHeader background-color="#fff" :pad-x="80">
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
  </CustomHeader>
  <FullLoading :loading="fl">
    <div :style="{ paddingTop: `${headerHeight}px` }">
      <Chart v-if="mileageData" id="mile" title="行驶里程" :opts="mile"></Chart>
      <div class="bg-fff h-30px"></div>
      <Chart
        v-if="runTimeData"
        id="mile"
        title="行驶时长"
        :opts="runTime"
      ></Chart>
      <div class="bg-fff h-30px"></div>
      <Chart
        v-if="energyConsumptionData"
        id="mile"
        title="平均能耗"
        :opts="energyConsumption"
      ></Chart>
      <div class="bg-fff h-30px"></div>
      <Chart
        v-if="costEenergyData"
        id="mile"
        :title="vehicleTypeTitle"
        :opts="costEenergy"
      ></Chart>
      <div class="bg-fff h-30px nrz-safe"></div>
    </div>
  </FullLoading>
  <DropMenu
    v-model:show="menuVisible"
    v-model:currentVal="currentCarPlateNum"
    v-model:full-list="fullCarList"
    v-model:car-data="carData"
    @success="success"
  ></DropMenu>
</template>
<script lang="ts">
import {
  CODE,
  onShareAppMessage,
  onShareTimeline,
  useToast,
} from '@/utils/index';
export default {
  onShareAppMessage,
  onShareTimeline,
};
</script>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useRouter } from '@tarojs/taro';
import CarInfo from '../../comp/CarInfo.vue';
import Chart from '../carData/Chart.vue';
import { monthData } from '@/api/index';
import * as echarts from '../../comp/ec-canvas/echarts.js';
import { useHeaderHeight } from '@/hooks';
import CustomHeader from '@/components/customHeader/index.vue';
import DropMenu from '../../comp/dropMenu/index.vue';
import FullLoading from '@/components/full-loading/index.vue';

definePageConfig({
  transparentTitle: 'auto',
  titlePenetrate: 'YES',
  defaultTitle: '',
  usingComponents: {
    // 'ec-canvas': '../../comp/ec-canvas/ec-canvas',
  },
});

let params = useRouter().params;
let { headerHeight } = useHeaderHeight();
let fl = ref(true);
let menuVisible = ref();
let fullCarList = ref();
let currentCarPlateNum = ref(params?.licensePlateNumber);
let mileageData = ref();
let runTimeData = ref();
let costEenergyData = ref();
let energyConsumptionData = ref();
let carData = ref();
let mile = computed(() => {
  let xD = mileageData.value?.map((item) => {
    return item?.key?.slice(5);
  });
  let yD = mileageData.value?.map((item) => {
    return item?.value;
  });
  let option = {
    tooltip: {
      trigger: 'axis',
      formatter(p) {
        console.log(
          mileageData.value,
          mileageData.value?.[p?.[0]?.dataIndex],

          p?.[0]?.dataIndex
        );
        return `里程：${mileageData.value?.[p?.[0]?.dataIndex]?.value}\n环比：${
          mileageData.value?.[p?.[0]?.dataIndex]?.rate || '--'
        }%`;
      },
    },
    grid: {
      top: '10%',
      left: '6%',
      right: '10%',
      bottom: '3%',
      containLabel: true,
    },
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

let energyConsumption = computed(() => {
  let xD = energyConsumptionData.value?.map((item) => {
    return item?.key?.slice(5);
  });
  let yD = energyConsumptionData.value?.map((item) => {
    return item?.value;
  });
  let option = {
    tooltip: {
      trigger: 'axis',
      formatter(p) {
        return `能耗：${
          energyConsumptionData.value?.[p?.[0]?.dataIndex]?.value
        }\n环比：${
          energyConsumptionData.value?.[p?.[0]?.dataIndex]?.rate || '--'
        }%`;
      },
    },
    grid: {
      top: '10%',
      left: '6%',
      right: '10%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: xD,
      name: '月',
    },
    yAxis: {
      name: 'kW·h/100km',
      type: 'value',
    },
    series: [
      {
        itemStyle: {
          normal: {
            color: '#04AB16',
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
  return option;
});
let costEenergy = computed(() => {
  let xD = costEenergyData.value?.map((item) => {
    return item?.key?.slice(5);
  });
  let yD = costEenergyData.value?.map((item) => {
    return item?.value;
  });
  let option = {
    tooltip: {
      trigger: 'axis',
      formatter(p) {
        return `能耗：${
          costEenergyData.value?.[p?.[0]?.dataIndex]?.value
        }\n环比：${costEenergyData.value?.[p?.[0]?.dataIndex]?.rate || '--'}%`;
      },
    },
    grid: {
      top: '10%',
      left: '6%',
      right: '10%',
      bottom: '3%',
      containLabel: true,
    },
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
let runTime = computed(() => {
  let xD = runTimeData.value?.map((item) => {
    return item?.key?.slice(5);
  });
  let yD = runTimeData.value?.map((item) => {
    return item?.value;
  });
  let option = {
    tooltip: {
      trigger: 'axis',
      formatter(p) {
        return `时长：${runTimeData.value?.[p?.[0]?.dataIndex]?.value}\n环比：${
          runTimeData.value?.[p?.[0]?.dataIndex]?.rate || '--'
        }%`;
      },
    },
    grid: {
      top: '10%',
      left: '6%',
      right: '10%',
      bottom: '3%',
      containLabel: true,
    },
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
  return option;
});
let vehicleTypeTitle = ref();

function _getMonthData(v) {
  monthData({ vinLicense: v }).then((res) => {
    setTimeout(() => {
      fl.value = false;
    }, 100);
    if (res?.code !== CODE) return useToast(res?.msg);
    mileageData.value = res?.data?.mileage;
    runTimeData.value = res?.data?.runTime;
    costEenergyData.value = res?.data?.costEnergy;
    energyConsumptionData.value = res?.data?.energyConsumption;
    vehicleTypeTitle.value =
      res?.data?.vehicleType == 1 ? '平均耗电量' : '平均耗油量';
  });
}
function success({ vin, licensePlateNumber }) {
  if (!params?.noVin) return;
  currentCarPlateNum.value = licensePlateNumber;
  _getMonthData(vin);
}
onMounted(() => {
  if (params?.noVin) return;
  _getMonthData(params?.vinCode);
});

watch(
  () => carData.value,
  (v) => {
    if (v) {
      _getMonthData(v?.vinCode || v?.licensePlateNumber);
    }
  }
);
</script>
<style>
page {
  background-color: #fff;
}
</style>
