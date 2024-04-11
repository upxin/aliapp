<template>
  <div class="relative flex flex-1 h-80px nr-border--dashed">
    <div
      :style="{ background: bg, color }"
      :class="{ 'order-2': end }"
      class="box-border flex flex-col justify-center h-full w-34px px-10px text-12px"
    >
      <span v-for="item in title.split('')" :key="item" class="">
        {{ item }}
      </span>
    </div>
    <div
      :class="{ 'order-1': end }"
      class="box-border flex flex-col items-center justify-center flex-1 h-full bg-fff"
    >
      <div class="flex flex-col items-center justify-center" :style="{ color }">
        <span class="text-16px">{{ nullText(formatThousands(val, 2)) }}</span>
        <span class="opacity-50 text-10px">{{ unit }}</span>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { formatThousands, nullText } from '@/utils';
interface Props {
  color?: string;
  title?: string;
  bg?: string;
  val?: string | number;
  unit?: string;
  end?: boolean;
}
withDefaults(defineProps<Props>(), {
  color: '',
  bg: '#f9f9f9',
  title: '总里程',
  val: '123123',
  unit: 'km',
  end: false,
});
</script>
