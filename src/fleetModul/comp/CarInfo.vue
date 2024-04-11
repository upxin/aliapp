<script setup lang="ts">
import { VehColor, VehInfo } from '@/utils';
interface Props {
  vehicleType: number | string;
  vehicleText: string;
  checked?: boolean;
  width?: string;
}
withDefaults(defineProps<Props>(), {
  vehicleType: 1,
  vehicleText: '',
  checked: false,
  width: '',
});
</script>

<template>
  <div class="flex my-20px text-16px">
    <view class="flex justify-end" :style="{ width: width ? width : '' }">
      <span
        :style="{ background: `${VehColor[vehicleType]}` }"
        class="rounded-sm p-2px text-fff text-12px mr-4px"
      >
        {{ VehInfo[vehicleType] }}
      </span>
    </view>

    <span
      class="text-left"
      :class="{ 'flex-1': width }"
      :style="{ color: checked ? `${VehColor[vehicleType]}` : 'unset' }"
    >
      {{ vehicleText }}
    </span>
  </div>
</template>
