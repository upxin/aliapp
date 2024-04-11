<template>
  <CustomHeader :border="true" background-color="#fff">
    <template #title>
      {{ params?.type == '11' ? '前晨好物' : '品质生活' }}
    </template>
  </CustomHeader>
  <MainScroll
    bg="#fff"
    :has-more="has_more"
    :has-data="!!list?.length"
    :init-loading="initLg"
    @end-pull-down="refresh"
    @scroll-reach-bottom="loadMore"
  >
    <div class="h-16px"></div>
    <div class="box-border flex flex-wrap w-full px-10px">
      <div
        v-for="item in list"
        :key="item"
        class="box-border w-1_2 px-4px pb-30px"
        @click="
          () => {
            hanlde_goods(item);
          }
        "
      >
        <BgImg
          class="w-full bg-center bg-cover h-172px"
          :url="item?.thumbnails?.[0]"
        ></BgImg>
        <div class="pb-4px pt-10px overflow-ellipsis">{{ item?.title }}</div>
        <div class="opacity-40 text-12px">{{ item?.summary }}</div>
        <div class="pt-10px">￥{{ item?.price }}</div>
      </div>
    </div>
  </MainScroll>
</template>
<script lang="ts" setup>
//
import CustomHeader from '@/components/customHeader/index.vue';
import BgImg from '@/components/bg-img/bg-img.vue';
import MainScroll from '@/components/scroll-main/index.vue';
import { useRouter } from '@tarojs/taro';
import { goods_page } from '@/api/index';
import { onBeforeMount, ref } from 'vue';
import { nrNavigateTo } from '@/utils/index';

definePageConfig({
  transparentTitle: 'always',
  titlePenetrate: 'YES',
  defaultTitle: '',
});
let pageNum = 1;
let pageSize = 10;
let list = ref<any[]>([]);
let has_more = ref(true);
let params = useRouter().params;
let initLg = ref(true);
function hanlde_goods({ spuId = '' }) {
  nrNavigateTo('mallGoodsDetail', {
    spuId,
  });
}
function _goods_page(more?) {
  goods_page({ categoryInfo: params?.type, pageSize, pageNum })
    .then((res) => {
      initLg.value = false;
      if (res.code !== 200) return;
      if (more) {
        list.value = [...list.value, ...res?.data?.list];
      } else {
        list.value = res?.data?.list;
      }
      has_more.value = res?.data?.total > pageNum * pageSize;
      pageNum = pageNum + 1;
    })
    .catch(() => {
      initLg.value = false;
    });
}
async function refresh(finished?) {
  pageNum = 1;
  await _goods_page();
  finished && finished();
}
function loadMore() {
  if (has_more.value) {
    _goods_page(true);
  }
}
onBeforeMount(() => {
  refresh();
});
</script>
<style>
page {
  background-color: #fff;
}
</style>
