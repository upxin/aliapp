<template>
  <div class="box-border w-full px-30px pt-20px">
    <NrzImg :url="params.url" class="m-auto h-408px" :download="true" />
    <div class="text-16px my-10px">使用规则:</div>
    <section class="leading-normal text-second text-10px">
      <div>1. 回到家收到货集卡活动集卡活动撒和大数据；</div>
      <div>2. 爱德华就撒后点击爱神的箭爱神的箭卡死；</div>
      <div>3. 哈三等奖卡仕达集卡活动加哈手动滑稽卡手动滑；</div>
    </section>
    <!-- <div @click="openApp">跳转app</div> -->
  </div>
</template>
<script lang="ts">
export default {
  onShareAppMessage(res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target);
    }
    return {
      title: '前晨汽车 智能网联商用车引领者',
      path: `/pages/index/index`,
      imageUrl: '',
    };
  },
};
</script>
<script lang="ts" setup>
import { useRouter } from '@tarojs/taro';
import NrzImg from '@/components/img/img.vue';
import { LOGIN_BG } from '@/utils/imgs';
import { nrNavigateTo } from '@/utils';
let params = useRouter().params;
function openApp() {
  nrNavigateTo(
    'url=https://a.app.qq.com/o/simple.jsp?pkgname=com.qianchen&fromcase=40003'
  );
}
</script>
