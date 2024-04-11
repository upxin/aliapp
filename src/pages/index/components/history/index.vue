<script setup lang="ts">
import { homeStore } from '@/stores';

const HomeStore = homeStore();
</script>
<template>
  <section class="flex-1 text-12px">
    <section class="flex justify-between mb-10px">
      <view
        class="py-20px flex-1 bg-fff rounded-1px flex flex-col justify-between items-center w-120px box-border mr-14px shadow-sm"
      >
        <view>{{ HomeStore.state.carBehavior?.totalTime ?? '--' }}h</view>
        <view class="nrz-thin mt-10px">已安全行驶</view>
      </view>
      <view
        class="py-20px flex-1 bg-fff rounded-1px flex flex-col justify-between items-center w-120px box-border shadow-sm"
      >
        <view>{{ HomeStore.state.carBehavior?.todayMileage ?? '--' }}km</view>
        <view class="nrz-thin mt-10px">总行驶里程</view>
      </view>
    </section>

    <section class="flex justify-between">
      <view
        class="py-20px bg-fff flex-1 rounded-1px flex flex-col justify-between items-center w-120px box-border mr-14px shadow-sm"
      >
        <view>{{ HomeStore.state.carBehavior?.energySaving }}吨</view>
        <view class="nrz-thin mt-10px">共节能减排</view>
      </view>
      <view
        class="py-20px bg-fff flex-1 rounded-1px flex flex-col justify-between items-center w-120px box-border shadow-sm"
      >
        <view>{{ HomeStore.state.carBehavior?.days }}天</view>
        <view class="nrz-thin mt-10px">前晨已陪伴</view>
      </view>
    </section>
  </section>
</template>
