<template>
  <view class="box-border w-full h-300px bg-fff">
    <ec-canvas :id="id" :canvas-id="`${id}_chart`" :ec="ec"></ec-canvas>
  </view>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue';
import * as echarts from '../ec-canvas/echarts.js';
interface ChartIns {
  setOption: (p: any) => void;
}
interface Props {
  opts: any;
  id: string;
}
let props = withDefaults(defineProps<Props>(), { opts: {}, id: '' });
let chart: any;
let hasInit = ref(false);
let ec = ref({
  onInit: initChart,
});
function initChart(canvas, width, height, dpr) {
  chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr, // new
  }) as ChartIns;
  console.log(1234);
  hasInit.value = true;
  return chart;
}

watch(
  () => hasInit.value,
  (v) => {
    console.log(v);
    if (v) {
      chart.setOption(props.opts);
    }
  },
  {
    immediate: true,
  }
);
</script>
