<template>
  <section>
    <div v-if="title" class="flex flex-col items-center justify-center py-10px">
      <div class="pb-4px nrz-thin">{{ title }}</div>
      <div class="bar"></div>
    </div>
    <view class="box-border w-full h-full flex justify-center">
      <TuiLineChart
        ref="chartRef"
        tooltip
        :xAxis="opts.xAxis"
        :dataset="opts.dataset"
        :max="opts.max"
        :splitNumber="opts.splitNumber"
      ></TuiLineChart>
    </view>
  </section>
</template>
<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import TuiLineChart from '@/components/tui-charts-line/tui-charts-line.vue';

interface Props {
  opts: any;
  title?: string;
  id: string;
}

let chartRef = ref();

// let opts = {
//   xAxis: ['一月', '二月', '三月', '四月', '五月', '六月'],
//   dataset: [
//     {
//       name: '营业额',
//       color: '#5677fc',
//       source: [380, 210, 320, 160, 300, 200],
//     },
//   ],
//   max: 600,
//   splitNumber: 100,
// };

let props = withDefaults(defineProps<Props>(), { opts: {}, title: '' });
let chart: any;
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
onMounted(() => {
  chartRef.value.draw(opts.dataset);
});
</script>
