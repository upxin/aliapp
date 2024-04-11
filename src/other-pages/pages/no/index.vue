<template>
  <section class="w-full h-full flex flex-col items-center box-border p-14px">
    <div class="w-full h-200px relative">
      <section class="bg-fleet flex items-center h-200px nr-border-b--dashed">
        <div class="break-words text-30px w-30px text-center mx-20px">
          呜呜呜
        </div>
        <div class="break-words text-30px w-30px">页面走丢了</div>
      </section>
      <div class="arc absolute top-0 right-0">
        <NrImg
          class="w-140px h-140px absolute top-0px right-10px"
          url="https://nrz-app.su.bcebos.com/resources/no_router.png"
          only-img
        ></NrImg>
      </div>
    </div>
    <div
      class="w-full text-12px pt-40px bg-fleet box-border pl-30px leading-normal pb-20px"
    >
      <div class="text-14px mb-10px">大致原因：</div>
      <div>1.版本还未更新至最新版本</div>
      <div>2.页面暂未上线，敬请期待</div>
      <div>2.页面已下架，请使用其他功能</div>
    </div>
    <button
      class="bg-primary rounded-none py-10px px-30px mt-20px text-fff"
      @click="back"
    >
      <span class="">点击返回</span>
    </button>
    <div class="nrz-safe mt-auto">
      <NrImg :url="LOGO_IMG_BOTTOM" class="w-100px h-40px" only-img></NrImg>
    </div>
  </section>
</template>
<script setup>
import NrImg from '@/components/img/img.vue';
import { LOGO_IMG_BOTTOM } from '@/utils/index';
import Taro from '@tarojs/taro';
const back = () => {
  Taro.navigateBack();
};
</script>
<style>
page {
  background: #fff;
}
.arc {
  width: 200px;
  height: 200px;
  background: #fff;
  border-radius: 0 0 0 200px;
}
</style>
