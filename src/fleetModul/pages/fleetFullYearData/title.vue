<template>
  <div class="flex items-center justify-center mt-20px text-16px">
    <span
      v-if="vehicleType"
      :style="{ background: `${VehColor[vehicleType]}` }"
      class="rounded-sm p-2px text-fff text-12px mr-4px"
    >
      {{ VehInfo[vehicleType] }}
    </span>
    <span class="text-left"> {{ title }} </span>
  </div>
</template>
<script setup lang="ts">
import { VehColor, VehInfo } from '@/utils/index';

interface Props {
  title: string;
  vehicleType: number | string;
}
withDefaults(defineProps<Props>(), {
  title: '',
  vehicleType: '',
});
</script>
