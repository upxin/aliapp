<template>
  <div class="box-border flex items-center text-10px">
    <view
      class="flex items-baseline pb-6px mr-6px relative"
      :style="{
        color: 'rgba(242, 3, 23, 0.76)',
      }"
    >
      <view class="font-bold text-18px">{{ nullText(detailData?.price) }}</view>
      <view>元/度</view>
      <view
        v-if="detailData?.discount * 1 != 1"
        :style="{
          background: 'rgba(242, 3, 23, 0.76)',
        }"
        class="absolute bottom-12px h-1px w-full"
      ></view>
    </view>
    <span
      v-if="detailData?.discount * 1 !== 1"
      class="mr-8px text-16px font-bold"
      style="color: #eecb1d"
    >
      {{ detailData?.discountText }}
    </span>
    <div
      class="flex text-hex-555 bg-main text-opacity-44 py-4px px-6px rounded-3px"
    >
      <span>电费：{{ detailData?.elecPrice }}元/度</span>
      <span class="mx-6px"></span>
      <span>服务费：{{ detailData?.sevicePrice }}元/度</span>
    </div>
  </div>
</template>
<script lang="ts" setup>
//
import { nullText } from '@/utils';
withDefaults(defineProps<{ detailData: any }>(), {});
</script>
