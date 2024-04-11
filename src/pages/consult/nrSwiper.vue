<template>
  <swiper
    class="w-full h-200px"
    :circular="true"
    next-margin="50px"
    previous-margin="50px"
    :current="currentIndex"
    :autoplay="autoplay"
    :interval="interval"
    @change="handleChange"
  >
    <swiper-item v-for="(item, index) in list" :key="index" class="h-200px">
      <div
        class="box-border flex items-center justify-center w-full h-200px py-20px"
      >
        <div
          class="relative w-full h-full bg-no-repeat bg-cover item"
          :class="{ active: currentIndex === index }"
          :style="{ backgroundImage: `url(${item?.image})` }"
          @click="go(item?.router)"
        >
          <div class="absolute bottom-10px left-10px text-fff">
            {{ item?.title }}
          </div>
        </div>
      </div>
    </swiper-item>
  </swiper>
</template>
<script lang="ts" setup>
import { ref, onBeforeMount } from 'vue';
import { findRecBanner } from '@/api';
import { CODE, nrNavigateTo, useToast } from '@/utils';
let list = ref<any[]>([]);
let autoplay = ref(true);
let currentIndex = ref(1);
let interval = ref(5000);
const handleChange = (e?) => {
  //  hack: if swiper props circular is true. prev will be delay show
  currentIndex.value = e?.detail?.current ?? e;
};

function go(route) {
  nrNavigateTo(route);
}
onBeforeMount(() => {
  findRecBanner().then((res) => {
    if (res?.code !== CODE) return useToast(res?.msg);
    list.value = res?.data;
  });
});
</script>
<style>
/* carousel/index.wxss */
page {
  background: #f7f7f7f7;
}
.item {
  transform: scale(0.85);
}
.active {
  transition: all 0.3s ease-in 0s;
  transform: scale(1);
}
</style>
