<template>
  <section>
    <div v-if="title" class="flex flex-col items-center justify-center py-10px">
      <div class="pb-4px nrz-thin">{{ title }}</div>
      <div class="bar"></div>
    </div>
    <view class="box-border w-full h-300px">
      <ec-canvas :id="id" :canvas-id="`${id}_chart`" :ec="ec"></ec-canvas>
    </view>
  </section>
</template>
<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import * as echarts from '../../comp/ec-canvas/echarts.js';
interface ChartIns {
  setOption: (p: any) => void;
}
interface Props {
  opts: any;
  title?: string;
  id: string;
}
let props = withDefaults(defineProps<Props>(), { opts: {}, title: '' });
let chart: any;
let ec = ref({
  onInit: initChart,
});
function initChart(canvas, width, height, dpr) {
  chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr, // new
  }) as ChartIns;
  console.log(99999999, props.opts);

  chart.setOption(props.opts);
  return chart;
}
watch(
  () => props.opts,
  (v) => {
    if (v && chart) {
      chart.setOption(v);
    }
  },
  {
    immediate: true,
  }
);

onMounted(() => {
  console.log('mounted');
});
</script>
