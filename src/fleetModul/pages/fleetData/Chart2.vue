<template>
  <view id="tag" class="box-border w-full h-300px bg-fff">
    <!-- <ec-canvas :id="cid" canvas-id="mileageChart-points" :ec="ec"></ec-canvas> -->
    <!-- <div class="arc"></div> -->
    <view
      v-show="show"
      style="z-index: 9999"
      class="absolute flex flex-col overflow-hidden rounded center bg-fff nr-shadow-full p-6px text-10px"
      @click="goMonth"
    >
      <span class="mb-6px">车牌：{{ licensePlateNumber }}</span>
      <span class="mb-6px">里程：{{ mile }}(km)</span>
      <span class="mb-6px">时间：{{ time }}(h)</span>
      <span class="mb-6px">速度：{{ speed }}(km/h)</span>
      <span class="text-park">点击查看</span>
    </view>
  </view>
</template>
<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
// import * as echarts from '../../comp/ec-canvas/echarts.js';
import { nrNavigateTo, VehInfo, Routes } from '@/utils';
import { usePageScroll } from '@tarojs/taro';

interface ChartIns {
  setOption: (p: any) => void;
}
let chart: any;
let ec = {
  onInit: initChart,
};

let props = withDefaults(defineProps<{ oil: any; ele: any; cid: string }>(), {
  oil: [],
  ele: [],
  cid: () => '',
});
let Y = ref();
let X = ref();

let time = ref();
let speed = ref();
let licensePlateNumber = ref();
let mile = ref();
let vinCode = ref();
let show = ref(false);
function initChart(canvas, width, height, dpr) {
  chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr, // new
  }) as ChartIns;
  return chart;
}
function updateChart() {
  let option = {
    xAxis: {
      name: '时长',
    },
    yAxis: {
      name: '里程',
    },
    legend: {
      data: ['电车', '油车'],
    },
    tooltip: {},
    grid: {
      left: '20',
      right: '13%',
      bottom: '20',
      containLabel: true,
    },
    series: [
      {
        name: '电车',
        itemStyle: {
          normal: {
            color: VehInfo?.ELE_COLOR,
          },
        },
        tooltip: {
          trigger: 'item',
          position: function (point) {
            X.value = point[0];
            Y.value = point[1];
          },
          formatter(params) {
            mile.value = params?.data?.[1]; // 里程
            speed.value = params?.data?.[2]; // 速度
            time.value = params?.data?.[0]; // 时长
            licensePlateNumber.value = params?.data?.[3]; // 车牌
            vinCode.value = params?.data?.[4];
            show.value = true;
            return '';
            // return `车牌：${params?.data?.[3]}\n时长：${params?.data?.[0]}\n里程：${params?.data?.[1]}\n速度：${params?.data?.[2]}`;
          },
        },
        symbolSize: 20,
        data: props?.ele,
        type: 'scatter',
      },
      {
        name: '油车',
        itemStyle: {
          normal: {
            color: VehInfo?.OIL_COLOR,
          },
        },
        tooltip: {
          trigger: 'item',
          position: function (point) {
            X.value = point[0];
            Y.value = point[1];
          },
          formatter(params) {
            mile.value = params?.data?.[1]; // 里程
            speed.value = params?.data?.[2]; // 速度
            time.value = params?.data?.[0]; // 时长
            licensePlateNumber.value = params?.data?.[3]; // 车牌
            vinCode.value = params?.data?.[4];
            show.value = true;
            return '';
            // return `车牌：${params?.data?.[3]}\n时长：${params?.data?.[0]}\n里程：${params?.data?.[1]}\n速度：${params?.data?.[2]}`;
          },
        },
        symbolSize: 20,
        data: props?.oil,
        type: 'scatter',
      },
    ],
  };
  if (!chart) return;

  chart.setOption(option);
}
onMounted(() => {
  setTimeout(() => {
    updateChart();
  }, 500);
});

function goMonth() {
  nrNavigateTo(Routes.carteamMonthData, {
    licensePlateNumber: licensePlateNumber.value,
    vinCode: vinCode.value,
  });
}
usePageScroll((res) => {
  show.value = false;
});

watch(
  () => props?.ele,
  (v) => {
    if (!v?.length) return;
    updateChart();
  },
  {
    deep: true,
  }
);
</script>
<style>
.arc {
  width: 80px;
  height: 80px;
  border: 1px dashed #ccc;
  border-left-width: 0px;
  border-bottom-width: 0px;
  border-radius: 0px 80px 0 0;
  position: absolute;
  bottom: 10px;
  left: 20px;
  z-index: 1000;
}
</style>
