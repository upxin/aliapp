<template>
  <custom-bar background-color="#fff" class="fixed" :show-icon="true">
    <template #title>订单列表</template>
  </custom-bar>
  <MainScroll
    :init-loading="initLg"
    @scroll-reach-bottom="loadMore"
    @end-pull-down="refresh"
  >
    <section class="overflow-y-auto px-14px min-h-200px">
      <section
        v-for="(order, i) in list"
        :key="i"
        class="flex items-center justify-between px-18px h-114px rounded-xl bg-hex-fff my-15px"
        @click="
          () => {
            toCarOrderList(order?.description);
          }
        "
      >
        <NrImg :url="regImg(order?.description)" class="w-74px h-55px"></NrImg>
        <div class="flex items-center">
          <span>{{ order.description }}（{{ order.count }}）</span>
          <span
            class="iconfont text-normal icon-arrow-right-bold text-14px"
          ></span>
        </div>
      </section>
    </section>
  </MainScroll>
</template>

<script lang="ts">
import { onShareAppMessage, onShareTimeline } from '@/utils/index';
export default {
  onShareAppMessage,
  onShareTimeline,
};
</script>

<script lang="ts" setup>
import CustomBar from '@/components/customHeader/index.vue';
import { onBeforeMount, ref } from 'vue';
import { allOrder } from '@/api/index';
import {
  getStore,
  USER_INFO,
  CODE,
  nrNavigateTo,
  OLIST_CAR,
  OLIST_GOODS,
  OLIST_S,
  NEWRIZON_DOMAIN,
} from '@/utils/index';
import MainScroll from '@/components/scroll-main/index.vue';
import NrImg from '@/components/img/img.vue';
definePageConfig({
  transparentTitle: 'always',
  titlePenetrate: 'YES',
  defaultTitle: '',
  backgroundTextStyle: 'dark', // 有默认值也得设置 否则不显示
});
let list = ref<any[]>([]);
// let nt = ref<any>(null);
// let pt = ref<any>(null);
let initLg = ref(true);
function toCarOrderList(desc: string) {
  if (desc.includes('车辆')) {
    nrNavigateTo('carOrderList');
  }
  if (desc.includes('服务')) {
    nrNavigateTo('servicesOrderList');
  }
  if (desc.includes('商品')) {
    let { member_id, token } = getStore(USER_INFO) ?? {};
    let url = `nrz://com.qianchen/app/webview?url=${NEWRIZON_DOMAIN}/pages/user_order/user_order?MEMBER_ID=${member_id}&TOKEN=${token}&PLATFORM=weapp&t=${new Date().getTime()}`;
    nrNavigateTo(url);
  }
}
function regImg(desc) {
  if (desc.includes('车辆')) {
    return OLIST_CAR;
  }
  if (desc.includes('服务')) {
    return OLIST_S;
  }
  if (desc.includes('商品')) {
    return OLIST_GOODS;
  }
}
function _allOrder() {
  let { member_id } = getStore(USER_INFO);
  allOrder({ member_id })
    .then((res) => {
      initLg.value = false;
      if (res.code !== CODE) return;
      list.value = res.data;
    })
    .catch(() => {
      initLg.value = false;
    });
}
onBeforeMount(() => {
  _allOrder();
});

function loadMore() {
  console.log('haseMore');
}
// 这个接口暂时没有分页
function refresh() {
  _allOrder();
}
</script>
