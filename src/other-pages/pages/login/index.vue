<template>
  <div class="w-full h-full">
    <Login :route="params" @back="back" @success="back"></Login>
  </div>
</template>

<script lang="ts">
import { onShareAppMessage, onShareTimeline } from '@/utils/index';
export default {
  onShareAppMessage,
  onShareTimeline,
};
</script>

<script lang="ts" setup>
import Taro, { useRouter } from '@tarojs/taro';
import Login from '@/components/login/index.vue';
import { ref } from 'vue';
definePageConfig({
  transparentTitle: 'auto',
  titlePenetrate: 'YES',
  defaultTitle: '',
});
let params = ref();

function back() {
  console.log('(useRouter()?.params?.url', useRouter()?.params?.url);
  if (useRouter()?.params?.url) {
    Taro.reLaunch({
      url: `/${useRouter()?.params?.url}`,
    });
  } else {
    Taro.navigateBack();
  }
}
</script>

<style lang="scss">
.nut-checkbox__label {
  font-size: 12px;
}
button::after {
  border: none;
}
</style>
