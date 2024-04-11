<template>
  <div class="box-border flex flex-wrap w-full px-10px">
    <div
      v-for="item in list"
      :key="item?.spuId"
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
      <div class="pb-4px pt-10px">{{ item?.summary }}</div>
      <div class="leading-normal opacity-40 text-12px">{{ item?.title }}</div>
      <div class="pt-10px">￥{{ formatThousands(item?.price, 2) }}</div>
    </div>
  </div>
</template>
<script lang="ts" setup>
//
import BgImg from '@/components/bg-img/bg-img.vue';
import { formatThousands, nrNavigateTo } from '@/utils/index';
interface Props {
  list: any[];
}
withDefaults(defineProps<Props>(), { list: () => [] });
function hanlde_goods({ spuId = '' }) {
  nrNavigateTo('mallGoodsDetail', {
    spuId,
  });
}
</script>
<style>
page {
  background-color: #fff;
}
</style>
