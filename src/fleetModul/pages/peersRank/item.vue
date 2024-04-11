<template>
  <div
    class="box-border relative flex flex-col items-center justify-between flex-1 text-center text-10px py-8px nr-border--dashed"
  >
    <span class="text-16px">{{ formatThousands(val, 2) || '--' }}</span>
    <span class="opacity-60 pb-20px pt-6px">{{ unit }}</span>
    <div class="w-full nrz-thin">
      {{ title }}
    </div>
  </div>
</template>
<script lang="ts" setup>
//
import { formatThousands } from '@/utils';
interface Props {
  color?: string;
  title?: string;
  val?: string | number;
  extra?: any;
  unit?: string;
}
withDefaults(defineProps<Props>(), {
  color: 'rgba(7, 237, 237, 1)',
  title: '总里程',
  val: '123123',
  extra: false,
  unit: 'km',
});
</script>
<style>
.customBorder {
  border-top: 60px solid #fff;
  border-left: 60px solid rgba(0, 0, 0, 0);
}
</style>
