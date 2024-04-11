<template>
  <CustomBar background-color="#fff" :border="false" class="fixed top-0 left-0">
    <template #title>
      <div
        class="flex items-center justify-between border border-solid rounded w-92px leading-28px h-28px border-primary"
      >
        <div
          class="flex-1 h-full text-center"
          :class="{
            'bg-primary': carType === 2,
            'text-light-50': carType === 2,
          }"
          @click="
            () => {
              handelCarType(2);
            }
          "
        >
          iC1
        </div>
        <div
          class="flex-1 h-full text-center"
          :class="{
            'bg-primary': carType === 1,
            'text-light-50': carType === 1,
          }"
          @click="
            () => {
              handelCarType(1);
            }
          "
        >
          EC1
        </div>
      </div>
    </template>
  </CustomBar>
  <div :style="{ paddingTop: `${CalcPt}px` }" class="box-border">
    <header class="bg-hex-fff">
      <section class="flex items-center justify-between h-34px">
        <div class="flex items-center justify-center flex-1">
          <span
            :class="{
              'border-solid': type == 1,
              'text-primary': type == 1,
            }"
            class="border-0 text-hex-aaa nut-tabs__titles-item__text border-b-2px border-primary pb-6px"
            @click="type = 1"
            >图片</span
          >
        </div>
        <div class="flex items-center justify-center flex-1">
          <span
            :class="{
              'border-solid': type == 0,
              'text-primary': type == 0,
            }"
            class="border-0 text-hex-aaa nut-tabs__titles-item__text border-b-2px border-primary pb-6px"
            @click="type = 0"
            >视频
          </span>
        </div>
      </section>
      <section
        v-if="type == 1"
        class="flex items-center justify-between h-34px px-20px"
      >
        <div class="nut-tabs__titles-item" @click="imgKey = 0">
          <span
            :style="{ color: imgKey == 0 ? '#11264d' : '' }"
            class="text-hex-aaa nut-tabs__titles-item__text"
            >外观</span
          >
        </div>
        <div class="nut-tabs__titles-item" @click="imgKey = 1">
          <span
            class="text-hex-aaa nut-tabs__titles-item__text"
            :style="{ color: imgKey == 1 ? '#11264d' : '' }"
            >货箱</span
          >
        </div>
        <div class="nut-tabs__titles-item" @click="imgKey = 2">
          <span
            :style="{ color: imgKey == 2 ? '#11264d' : '' }"
            class="text-hex-aaa nut-tabs__titles-item__text"
            >中控</span
          >
        </div>
        <div class="nut-tabs__titles-item" @click="imgKey = 3">
          <span
            :style="{ color: imgKey == 3 ? '#11264d' : '' }"
            class="text-hex-aaa nut-tabs__titles-item__text"
            >细节</span
          >
        </div>
      </section>
    </header>
    <section v-if="type == 1">
      <ScrollImg
        v-if="imgKey == 0"
        :car-type="carType"
        :scroll-h="`${scrollH}px`"
        :img-type="0"
        :is-video="1"
        @handleImg="handleImg"
      ></ScrollImg>
      <ScrollImg
        v-if="imgKey == 1"
        :car-type="carType"
        :scroll-h="`${scrollH}px`"
        :img-type="1"
        :is-video="1"
        @handleImg="handleImg"
      ></ScrollImg>
      <ScrollImg
        v-if="imgKey == 2"
        :car-type="carType"
        :scroll-h="`${scrollH}px`"
        :img-type="2"
        :is-video="1"
        @handleImg="handleImg"
      ></ScrollImg>
      <ScrollImg
        v-if="imgKey == 3"
        :car-type="carType"
        :scroll-h="`${scrollH}px`"
        :img-type="3"
        :is-video="1"
        @handleImg="handleImg"
      ></ScrollImg>
    </section>
    <section v-else>
      <ScrollVideo
        :car-type="carType"
        :scroll-h="`${videoH}px`"
        :img-type="3"
        @handleVideo="handleVideo"
      ></ScrollVideo>
    </section>
  </div>

  <NrzOverlay v-model:show="showVp" :z-index="2000">
    <div class="flex items-center justify-center w-full h-full">
      <video
        id="video"
        class="w-full h-300px"
        :src="previewVideo || ''"
        initial-time="0"
        :controls="true"
        :autoplay="true"
        :loop="false"
        :muted="false"
        :pageGesture="true"
        :showMuteBtn="true"
        @click.stop="() => {}"
      />
    </div>
  </NrzOverlay>
</template>

<script lang="ts" setup>
import CustomBar from '@/components/customHeader/index.vue';
import { computed, ref } from 'vue';
import { systemInfo } from '@/stores/systemInfo';
import ScrollImg from './componets/scroll-imgs.vue';
import ScrollVideo from './componets/scrolll-video.vue';
import Taro, { useShareAppMessage } from '@tarojs/taro';
import { jGcustomCount, JG } from '@/utils';
import NrzOverlay from '@/components/nrz-overlay/index.vue';

definePageConfig({
  transparentTitle: 'auto',
  titlePenetrate: 'YES',
  defaultTitle: '',
  enableShareAppMessage: true,
});

useShareAppMessage(() => {
  jGcustomCount(JG.MALL_003, { name: '视频图集' });
  return {
    title: '线上预定前晨汽车',
    path: `/other-pages/pages/carVideoAtlas/index`,
    imageUrl: 'https://nrz-app.su.bcebos.com/resources/img_video_share.jpg',
  };
});
let CalcPt = computed(
  () => systemInfo().RightBtnRect.h + systemInfo().RightBtnRect.t + 10
);
const carType = ref(2);
const imgKey = ref(0); // 0：外观，1：货箱，2：中控，3：细节
const type = ref(1); // 0代表视频，1代表图片
const showVp = ref(false);
const previewVideo = ref();
const scrollH = computed(
  () =>
    systemInfo().app.screenHeight -
    systemInfo().RightBtnRect.h -
    systemInfo().RightBtnRect.t -
    10 -
    68
);
const videoH = computed(
  () =>
    systemInfo().app.screenHeight -
    systemInfo().RightBtnRect.h -
    systemInfo().RightBtnRect.t -
    10 -
    34
);
function handleVideo(item) {
  showVp.value = true;
  previewVideo.value = item.video_url;
}
function handleImg(src) {
  Taro.previewImage({
    urls: [src], // 需要预览的图片http链接列表
  });
}
function handelCarType(val) {
  carType.value = val;
}

// bottom
</script>

<style lang="scss">
.nr-shadow {
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.2);
}
.div {
  padding: 0;
}
.h5-img {
  height: 100%;
}
.div {
  background-color: #f5f5f5;
}
page {
  background-color: #fff;
  overflow: hidden;
}
</style>
