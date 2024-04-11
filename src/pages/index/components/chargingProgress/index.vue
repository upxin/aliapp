<template>
  <section class="pb-30px">
    <div class="flex justify-center py-6px">
      <view class="text-20px mr-6px">{{ mile }}</view>
      <view>km</view>
    </div>
    <div class="w-160px m-auto text-primary">
      <NrzProgress :percent="percent" :width="16" radius="16rpx"></NrzProgress>
    </div>
    <section class="px-80px flex justify-center items-center py-10px">
      <span>{{ chargeStatus }}</span>
      <span class="w-10px h-10px bg-primary rounded-full mx-4px"></span>
      <span>最后更新：{{ homeStore().state.carBehavior?.updateTime }}</span>
      <span>电量：{{ percent }}%</span>
    </section>
  </section>
</template>
<script setup lang="ts">
import { computed, watch } from 'vue';
import { homeStore } from '@/stores/index';
import NrzProgress from '@/components/nrz-progress/index.vue';

const percent = computed(() => {
  return homeStore().state.carBehavior?.remainingBattery || 0;
});

const chargeStatus = computed(() => {
  return homeStore().state.charginCar?.chargeStatus || '--';
});

const mile = computed(() => {
  return homeStore().state.carBehavior?.remainMileage || '180';
});

watch(
  () => homeStore().state.charginCar,
  (v) => {
    console.log(' homeStore().state.charginCar===', v);
  },
  {
    immediate: true,
    deep: true,
  }
);
</script>
