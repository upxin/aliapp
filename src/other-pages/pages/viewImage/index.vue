<template>
  <swiper
    :current="current"
    :indicator-dots="true"
    :circular="true"
    class="w-full h-300px"
  >
    <swiper-item
      v-for="(k, index) in p?.url?.split(',')"
      :key="index"
      class="w-full h-300px"
    >
      <img :src="k" class="w-full h-full" mode="widthFix" />
    </swiper-item>
  </swiper>
</template>
<script lang="ts" setup>
import { useRouter } from '@tarojs/taro';
import { ref } from 'vue';

let current = ref(0);
let p = useRouter()?.params;
</script>
<style>
page {
  background-color: #000;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
swiper-item {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>
