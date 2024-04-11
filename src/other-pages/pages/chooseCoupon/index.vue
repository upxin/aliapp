<template>
  <section class="flex flex-col w-full h-full">
    <section class="flex-1 overflow-hidden">
      <CouponList :available="true" :type="1"></CouponList>
    </section>
  </section>
</template>
<script lang="ts" setup>
import { useShareAppMessage } from '@tarojs/taro';
import { BTN_SHARE } from '@/utils/index';
import CouponList from '../coupon/list.vue';

definePageConfig({ navigationBarTitleText: '选择优惠券' });

useShareAppMessage(() => {
  return {
    title: '前晨汽车 智能网联商用车引领者',
    path: `/pages/index/index`,
    imageUrl: BTN_SHARE,
  };
});
// bottom
</script>
