<template>
  <view class="relative bg-blue-200 no-car">
    <swiper
      class="h-680px w-full"
      :duration="300"
      :circular="true"
      :autoplay="true"
      @change="swiperChange"
    >
      <swiper-item
        v-for="item in homeStore().state.books"
        :key="item?.type"
        class="h-full w-full"
      >
        <NrzImg :src="item?.imgUrl" mode="scaleToFill"></NrzImg>
        <view
          class="absolute z-10 w-full h-full top-0 left-0 text-fff text-center flex flex-col bg-transparent"
        >
          <!-- <view
            class="text-12px flex justify-center mt-160px absolute bottom-80px x-center"
          >
            <view class="mr-40px mb-50px">了解更多</view>
            <view>参数配置</view>
          </view> -->

          <section class="flex justify-center absolute bottom-60px x-center">
            <template v-if="store().openPrepay">
              <view
                class="flex w-200px h-40px items-center justify-around nr-border rounded-full box-border border-fff"
              >
                <template v-for="(btn, i) in item.more" :key="btn.router">
                  <span
                    class="flex-1 h-40px leading-40px"
                    @click="
                      () => {
                        nrNavigateTo(btn.router);
                      }
                    "
                  >
                    {{ btn?.title }}
                  </span>
                  <span v-if="i < item.more.length - 1" class="line"></span>
                </template>
              </view>
            </template>
          </section>
        </view>
      </swiper-item>
    </swiper>
    <view
      class="flex justify-center w-full z-100 text-light-50 absolute z-999 bottom-20px"
    >
      <span
        v-for="(_, index) in state.imgList"
        :key="index"
        class="inline-block w-40px h-4px ml-4px rounded-full"
        :class="`${index == state.current ? 'bg-gray-500' : 'bg-fff'}`"
      ></span>
    </view>
  </view>
  <section class="px-20px bg-fff">
    <ChargeService class="py-40px"></ChargeService>
    <NStore class="mb-40px"></NStore>
    <Atlas class="mb-40px"></Atlas>
    <Financial class="mb-40px"></Financial>
    <CarService></CarService>
  </section>
</template>
<script lang="ts" setup>
import { nrNavigateTo } from '@/utils/index';
import { store, loveCarStore, homeStore } from '@/stores/index';
import { reactive } from 'vue';
import NrzImg from '@/components/nrz-img/index.vue';
import ChargeService from './components/charge-service/index.vue';
import NStore from './components/nearby-stores/index.vue';
import Atlas from './components/video-atlas/index.vue';
import Financial from './components/financial/index.vue';
import CarService from './components/car-service/index.vue';

interface State {
  imgList: any[];
  current: number;
}

const state = reactive<State>({
  imgList: [{ url: null }, { url: undefined }],
  current: 0,
});

const LoveCarStore = loveCarStore();

const swiperChange = (res) => {
  state.current = res?.detail?.current;
};

function changeVr(v) {
  // 1 进入虚拟体验 2退出
  if (v === true) {
    LoveCarStore.setIsVr(true);
  } else {
    LoveCarStore.setIsVr(false);
  }
}
function goChargeList() {
  nrNavigateTo('chargeMapStationList');
}
</script>
<style lang="scss">
.line {
  height: 60px;
  width: 1px;
  transform: rotateZ(30deg);
  background-color: rgba(255, 255, 255, 100);
}
.no-car .a-swiper {
  height: 680px !important;
}
</style>
