<template>
  <CustomBar background-color="#fff">
    <template #title>发票</template>
  </CustomBar>
  <div class="box-border fixed w-full center px-14px">
    <NrzImg
      class="w-full h-234px"
      :url="useRouter().params?.url || ''"
      mode="scaleToFill"
      @click="hanldeImg"
    ></NrzImg>
    <div class="w-full text-center mt-20px text-second">
      *点击分享或保存图片
    </div>
  </div>
</template>
<script lang="ts">
import { onShareAppMessage, onShareTimeline, useToast } from '@/utils/index';
export default {
  onShareAppMessage,
  onShareTimeline,
};
</script>
<script lang="ts" setup>
import CustomBar from '@/components/customHeader/index.vue';
import Taro, { useRouter } from '@tarojs/taro';
import NrzImg from '@/components/img/img.vue';
import { useHeaderHeight } from '@/hooks/index';
definePageConfig({ navigationStyle: 'custom' });
const { headerHeight } = useHeaderHeight();
function hanldeImg() {
  Taro.showLoading({
    title: '下载中...',
  });
  Taro.downloadFile({
    url: useRouter().params?.url || '',
    success: (res) => {
      Taro.hideLoading();
      Taro.showShareImageMenu({
        path: res.tempFilePath,
      });
    },
    fail: () => {
      Taro.hideLoading();
      useToast('下载失败');
    },
  });
}
// bottom
</script>
