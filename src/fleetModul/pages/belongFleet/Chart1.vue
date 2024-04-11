<template>
  <view class="box-border relative w-full h-200px bg-fff">
    <!-- <ec-canvas id="fleetHome" canvas-id="fleetHome-bar" :ec="ec"></ec-canvas> -->
    <div v-if="show" class="absolute center">
      <div class="flex items-end opacity-70">
        <span>共计</span>
        <span class="text-20px">
          {{
            cars?.eleOffline +
            cars?.eleOnline +
            cars?.oilOffline +
            cars?.oilOnline
          }}
        </span>
        <span>辆</span>
      </div>
      <div class="flex items-end">
        <span>在线</span>
        <span class="text-20px">{{ cars?.eleOnline + cars?.oilOnline }}</span>
        <span>辆</span>
      </div>
    </div>
  </view>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
// import * as echarts from '../../comp/ec-canvas/echarts.js';
import { CODE, useToast } from '@/utils';
import { onlineCars } from '@/api';

interface ChartIns {
  setOption: (p: any) => void;
}
let chart: any;
let ec = ref({
  onInit: initChart,
});
let cars = ref();
let props = withDefaults(defineProps<{ isLeader: boolean }>(), {
  isLeader: true,
});
function initChart(canvas, width, height, dpr) {
  chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr, // new
  }) as ChartIns;
  return chart;
}
let show = ref(false);
function updateChart(res) {
  let option;
  option = {
    tooltip: {
      trigger: 'item',
    },
    series: [
      {
        type: 'pie',
        radius: ['50%', '70%'],
        width: '90%',
        left: 'center',
        itemStyle: {
          borderRadius: 4,
          borderColor: '#fff',
          borderWidth: 1,
        },
        label: {
          formatter: (p) => {
            if (p?.name === '电车') {
              return `电车${p?.value}辆\n在线${res?.data?.eleOnline}辆`;
            }
            if (p?.name === '油车') {
              return `油车${p?.value}辆\n在线${res?.data?.oilOnline}辆`;
            }
          },
          minMargin: 20,
          edgeDistance: 4,
        },
        data: [
          {
            name: '电车',
            value: res?.data?.eleOffline + res?.data?.eleOnline,
          },
          {
            name: '油车',
            value: res?.data?.oilOffline + res?.data?.oilOnline,
          },
        ],
      },
    ],
  };
  chart.setOption(option);
  show.value = true;
}

onMounted(() => {
  onlineCars({ isLeader: props.isLeader }).then((res) => {
    if (res?.code !== CODE) return useToast(res?.msg || '接口异常');
    cars.value = res?.data;
    setTimeout(() => {
      updateChart(res);
    }, 500);
  });
});
</script>
