<template>
  <section class="flex flex-col overflow-hidden h-screen">
    <NrzTabs
      :tabs="[' 推荐', '活动', '科普', '品牌']"
      :current="tabIndex"
      sliderBgColor="#11264d"
      selectedColor="#11264d"
      :sliderHeight="4"
      :unlined="true"
      @change="changeTab"
    ></NrzTabs>
    <div class="flex-1">
      <swiper
        class="h-full"
        :indicator-dots="false"
        :duration="150"
        :current="tabIndex"
        @change="changeSwiper"
      >
        <swiper-item class="h-full">
          <Recommend></Recommend>
        </swiper-item>
        <swiper-item class="h-full">
          <Activity></Activity>
        </swiper-item>
        <swiper-item class="h-full">
          <Popularization></Popularization>
        </swiper-item>
        <swiper-item class="h-full">
          <Brand></Brand>
        </swiper-item>
      </swiper>
    </div>
  </section>
</template>
<script lang="ts" setup>
import { JG, jGcustomCount, BTN_SHARE } from '@/utils/index';
import { ref } from 'vue';
import Recommend from './recommend.vue';
import Activity from './activity.vue';
import Popularization from './popularization.vue';
import Brand from './brand.vue';
import NrzTabs from '@/components/nrz-tabs/index.vue';

import {
  useReady,
  useDidShow,
  useRouter,
  useShareAppMessage,
} from '@tarojs/taro';

definePageConfig({
  navigationBarTitleText: '发现',
  navigationStyle: 'default',
  enableShareAppMessage: true,
});
let tabIndex = ref(1);
let titleMap = {
  0: '推荐',
  1: '活动',
  2: '科普',
  3: '品牌',
};
useDidShow(() => {
  if (!useRouter()?.params?.newsIndex) return;
  tabIndex.value = Number(useRouter()?.params?.newsIndex);
});

function changeTab(v) {
  tabIndex.value = v?.index;
  jGcustomCount(JG.NEWS_001, {
    title: titleMap[v?.index],
  });
}
function changeSwiper(res) {
  tabIndex.value = res?.detail?.current;
}

useReady(() => {
  jGcustomCount(JG.NEWS_001, {
    title: titleMap[0],
  });
});
useShareAppMessage(() => {
  return {
    title: '前晨汽车 智能网联商用车引领者',
    path: `/pages/consult/index`,
    imageUrl: BTN_SHARE,
  };
});
</script>
<style>
page {
  background-color: #fff;
  width: 100%;
  height: 100%;
}
</style>
