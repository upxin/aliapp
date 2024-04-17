<template>
  <section class="w-full flex justify-center">
    <TuiChart
      ref="tui_line_1"
      tooltip
      :xAxis="options1.xAxis"
      :dataset="options1.dataset"
      :max="options1.max"
      :splitNumber="options1.splitNumber"
    ></TuiChart>
  </section>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import TuiChart from '@/components/tui-charts-line/tui-charts-line.vue';

let tui_line_1 = ref();
let options1 = {
  xAxis: ['一月', '二月', '三月', '四月', '五月', '六月'],
  dataset: [
    {
      name: '营业额',
      color: '#5677fc',
      source: [380, 210, 320, 160, 300, 200],
    },
  ],
  max: 600,
  splitNumber: 100,
};
onMounted(() => {
  tui_line_1.value.draw(options1.dataset);
});
</script>
