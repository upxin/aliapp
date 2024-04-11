<template>
  <section
    class="overflow-hidden text-14px text-normal bg-hex-fff py-16px px-15px mb-10px"
  >
    <div
      class="border-0 border-solid flex border-primary leading-17px h-17px pl-10px border-l-3px mb-20px"
    >
      <span class="font-bold">核销使用</span>
      <div class="flex-1 flex justify-end text-12px">
        <div class="flex">
          <span class="opacity-50">共</span>
          <span class="mx-4px">{{ goodsVerifies?.length }}</span>
          <span class="opacity-50">张</span>
        </div>
        <div class="flex mx-10px">
          <span class="opacity-50">已使用</span>
          <span class="mx-4px">{{ used }}</span>
          <span class="opacity-50">张</span>
        </div>
        <div class="flex">
          <span class="opacity-50">剩余可用</span>
          <span class="mx-4px">{{ goodsVerifies?.length - used }}</span>
          <span class="opacity-50">张</span>
        </div>
      </div>
    </div>
    <swiper class="h" :indicator-dots="true">
      <swiper-item
        v-for="(item, index) in goodsVerifies"
        :key="item.code"
        class="h-full py-10px box-border"
      >
        <div class="font-bold flex justify-center pb-4px">
          {{ index + 1 }}/{{ goodsVerifies?.length }}
        </div>
        <div
          v-if="item.verifyStatus == 1"
          class="flex flex-col justify-center items-center"
        >
          <div class="p-10px">
            <!-- <Qr v-if="item.code" :id="item.code" :code="item.code"></Qr> -->
          </div>
          <div class="flex items-center">
            <span class="opacity-50">商品编码</span>
            <span class="mx-6px">{{ item.code }}</span>
            <span
              class="iconfont icon-copy opacity-50"
              @click="copy(item.code)"
            ></span>
          </div>
        </div>
        <section
          v-else
          class="flex flex-col justify-center items-center flex-1 py-40px pl-70px box-border"
        >
          <div class="flex items-center w-full">
            <span class="opacity-50 w-56px">商品编码</span>
            <span class="mx-6px">{{ item.code }}</span>
            <span
              class="iconfont icon-copy opacity-50"
              @click="copy(item.code)"
            ></span>
          </div>
          <div class="flex items-center py-20px w-full">
            <span class="opacity-50 w-56px">使用门店</span>
            <span class="mx-6px">{{ item.code }}</span>
          </div>
          <div class="flex items-center w-full">
            <span class="opacity-50 w-56px">使用时间</span>
            <span class="mx-6px">{{ item.code }}</span>
          </div>
        </section>
      </swiper-item>
    </swiper>
  </section>
</template>
<script lang="ts" setup>
// import Qr from '@/components/qr/kk.vue';

import { copyText } from '@/utils';
import { computed } from 'vue';
let props = withDefaults(defineProps<{ goodsVerifies: any[] }>(), {
  goodsVerifies: () => [],
});

const used = computed(() => {
  return props.goodsVerifies?.filter((item) => item?.verifyStatus === 2)
    ?.length;
});
function copy(code) {
  copyText(code);
}
</script>
<style>
.h {
  height: 218px;
}
</style>
