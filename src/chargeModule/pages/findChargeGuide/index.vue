<template>
  <CustomBar background-color="#fff">
    <template #title>找桩路书</template>
  </CustomBar>
  <FullLoading :loading="fullLoading">
    <section :style="{ paddingTop: `${headerHeight + 26}px` }" class="px-20px">
      <div class="flex">
        <span>1、</span>
        <span>沿着这里走你直接走就对了哪有那么多为什么</span>
      </div>
      <div class="mt-10px">
        <NrzImage
          mode="scaleToFill"
          class="w-full h-180px"
          :url="''"
        ></NrzImage>
      </div>
    </section>
  </FullLoading>
</template>
<script lang="ts">
import { onShareAppMessage, onShareTimeline } from '@/utils/index';
import NrzImage from '@/components/img/img.vue';
export default {
  onShareAppMessage,
  onShareTimeline,
};
</script>
<script lang="ts" setup>
import { onBeforeMount, ref } from 'vue';
import CustomBar from '@/components/customHeader/index.vue';
import FullLoading from '@/components/full-loading/index.vue';
import { systemInfo } from '@/stores/index';
import Taro from '@tarojs/taro';
import { test } from '@/api/index';
import { CODE } from '@/utils/index';
import { useHeaderHeight } from '@/hooks/index';

definePageConfig({
 transparentTitle: 'auto',
  titlePenetrate: 'YES',
  defaultTitle: '',});

let fullLoading = ref(false);
let list = ref<any[]>([]);
let hasMore = ref(false);
const { headerHeight } = useHeaderHeight();

function regColor(type, opacity = 0.28) {
  if (type === '谷') {
    return `rgba(3, 149, 41, ${opacity})`;
  }
  if (type === '平') {
    return `rgba(3, 149, 41, ${opacity})`;
  }
  if (type === '峰') {
    return `rgba(3, 149, 41, ${opacity})`;
  }
  return '';
}

function loadMore() {}
function refresh() {}
onBeforeMount(() => {
  //
});
// bottom
</script>
<style lang="scss">
page {
  background-color: #fff;
}
</style>
