<template>
  <view class="flex items-center">
    <view
      class="flex items-center justify-center bg-hex-f20317 mr-8px font-800 w-14px h-14px text-8px text-fff"
    >
      <view>￥</view>
    </view>
    <view class="text-14px">价格信息</view>
  </view>
  <section class="pl-20px mt-15px">
    <view class="flex items-center justify-between mb-10px nrz-thin text-12px">
      <view>当前时段：{{ station.startTime }}-{{ station.endTime }}</view>
      <view class="flex items-center" @tap.stop="goPriceDetail">
        <view class="text-hex-04C3F6">各时段价格</view>
        <view
          class="iconfont ml-6px icon-arrow-right-bold text-hex-04C3F6 text-12px"
        ></view>
      </view>
    </view>

    <PriceSite :detailData="station"></PriceSite>

    <view class="mt-14px text-hex-555 opacity-60 text-12px">
      * 展示价格为当前策略，实际价格以充电扫码时为准
    </view>
  </section>
</template>
<script lang="ts" setup>
import PriceSite from '../../components/Price/index.vue';
import { store } from '@/stores';
import { nrNavigateTo } from '@/utils';
interface P {
  connector: any;
  station?: any;
}

let props = withDefaults(defineProps<P>(), {
  connector: () => ({}),
  station: () => ({}),
});
function goPriceDetail() {
  store().setPriceList(props?.station?.priceList);
  nrNavigateTo('chargePriceTimeRangeList');
}
</script>
