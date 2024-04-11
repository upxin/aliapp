<template>
  <scroll-view
    class="h-40px"
    :scroll-x="true"
    :scroll-left="left"
    :scroll-with-animation="true"
    style="width: 100%; white-space: nowrap"
  >
    <view id="demo1" class="inline-block w-300px">demo1</view>
    <view id="demo1" class="inline-block w-300px">demo4</view>
    <view id="demo2" class="inline-block w-300px">demo2</view>
    <view id="demo3" class="inline-block w-300px">demo3</view>
  </scroll-view>
  <button @click="left += 100">滚动</button>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const left = ref(20);
</script>
