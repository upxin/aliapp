<template>
  <swiper
    :current="current"
    :circular="true"
    class="h-300px"
    :indicator-dots="true"
  >
    <swiper-item v-for="(k, index) in p?.url?.split(',')" :key="index">
      <video :src="k" class="w-full h-full"></video>
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
</style>
