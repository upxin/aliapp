<template>
  <div v-if="waiting">{{ waiting }}{{ waiting2 }}</div>
  <div v-else>test</div>
</template>

<script setup>
import { ref } from 'vue';
import { useDidShow } from '@tarojs/taro';
let url =
  'https://mp.weixin.qq.com/s?__biz=Mzg4OTUzOTQ0NQ==&platform=weapp&memberId=7012456875753082880';
let waiting = ref(60);
let waiting2 = ref(70);

let timer3;
let timer2;

useDidShow(() => {
  timer3 = setInterval(() => {
    if (waiting.value === 0) {
      clearInterval(timer3);
      timer3 = null;
      return;
    }
    waiting.value = waiting.value - 1;
  }, 1000);
  timer2 = setInterval(() => {
    if (waiting2.value === 0) {
      clearInterval(timer2);
      timer3 = null;
      return;
    }
    waiting2.value = waiting2.value - 1;
  }, 1000);
});
</script>
