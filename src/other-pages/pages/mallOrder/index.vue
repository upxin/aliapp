<template>
  <section class="flex flex-col h-full w-full">
    <CustomBar background-color="#fff" :border="false" position="unset">
      <template #title>商品订单</template>
    </CustomBar>
    <van-tabs
      :active="tabIndex"
      :sticky="true"
      :offet-top="headerHeight"
      @change="swiperChange"
    >
      <van-tab title="全部"> </van-tab>
      <van-tab title="待发货"> </van-tab>
      <van-tab title="已发货"> </van-tab>
      <van-tab title="已完成"> </van-tab>
    </van-tabs>
    <div class="flex-1 overflow-hidden">
      <List :height="'100%'" :type="getType"></List>
    </div>
  </section>
</template>
<script lang="ts">
import { onShareAppMessage, onShareTimeline } from '@/utils/index';
export default {
  onShareAppMessage,
  onShareTimeline,
};
</script>
<script lang="ts" setup>
import { ref, watch, computed } from 'vue';
import CustomBar from '@/components/customHeader/index.vue';
import { systemInfo } from '@/stores/index';
import Taro from '@tarojs/taro';
import { useHeaderHeight } from '@/hooks/index';
import List from './list.vue';

definePageConfig({ transparentTitle: 'auto',titlePenetrate: 'YES',defaultTitle: '', });

let tabIndex = ref(0);
let scrollH = computed(() => {
  return Taro.pxTransform(systemInfo().app.screenHeight);
});
let types = {
  0: 9,
  1: 1,
  2: 2,
  3: 3,
};
let getType = computed(() => {
  return types[tabIndex.value];
});
watch(
  () => getType.value,
  (v) => {
    console.log(333, v);
  }
);
watch(
  () => tabIndex.value,
  (v) => {
    console.log(444, v);
  }
);

function swiperChange(res) {
  tabIndex.value = res.detail.index;
}

const { headerHeight } = useHeaderHeight();

// bottom
</script>
<style>
.van-tabs--line .van-tabs__wrap {
  border-bottom: 1px solid #f5f5f5;
}
</style>
