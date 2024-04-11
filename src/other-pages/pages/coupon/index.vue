<template>
  <section class="flex flex-col h-full bg-fff">
    <CustomBar
      background-color="#fff"
      :pad-x="100"
      :border="false"
      position="relative"
    >
      <template #title>
        <div
          class="flex items-center justify-between border border-solid rounded text-12px leading-28px h-28px border-primary"
        >
          <div
            class="flex-1 h-full text-center px-10px"
            :class="{
              'bg-primary': type === 1,
              'text-light-50': type === 1,
            }"
            @click="
              () => {
                changeType(1);
              }
            "
          >
            充电
          </div>
          <div
            class="flex-1 h-full text-center px-10px"
            :class="{
              'bg-primary': type === 2,
              'text-light-50': type === 2,
            }"
            @click="
              () => {
                changeType(2);
              }
            "
          >
            商品
          </div>
        </div>
      </template>
    </CustomBar>
    <van-tabs wrap-class="w-240px" :active="tabIndex" @change="changeTab">
      <van-tab title="可用" :name="0"> </van-tab>
      <van-tab title="已用" :name="1"> </van-tab>
      <van-tab title="失效" :name="2"> </van-tab>
    </van-tabs>
    <view id="getH" class="flex-1 overflow-hidden">
      <swiper
        class="h-full"
        :indicator-dots="false"
        :duration="150"
        :current="tabIndex"
        @change="changeSwiper"
      >
        <swiper-item class="h-full">
          <CouponList :couponStatus="1" :type="type"></CouponList>
        </swiper-item>
        <swiper-item class="h-full">
          <CouponList :couponStatus="3" :type="type"></CouponList>
        </swiper-item>
        <swiper-item class="h-full">
          <CouponList :couponStatus="4" :type="type"></CouponList>
        </swiper-item>
      </swiper>
    </view>
  </section>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import CustomBar from '@/components/customHeader/index.vue';
import CouponList from './list.vue';

definePageConfig({ transparentTitle: 'always',titlePenetrate: 'YES',defaultTitle: '', });
let type = ref(1);
let tabIndex = ref(0);

function changeSwiper(res) {
  tabIndex.value = res?.detail?.current;
}
function changeType(v) {
  type.value = v;
}
function changeTab(res) {
  tabIndex.value = res.detail.index;
}
// bottom
</script>
<style></style>
