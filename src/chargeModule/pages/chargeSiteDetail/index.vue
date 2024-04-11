<template>
  <CustomBar
    :icon-color="gradualColorIcon"
    :border="hasBorder"
    :background-color="gradualColor"
  ></CustomBar>
  <FullLoading :loading="fullLoading">
    <swiper
      v-if="detailData?.pictureList?.length"
      :current="current"
      class="h-200px"
    >
      <swiper-item v-for="(k, index) in detailData?.pictureList" :key="index">
        <NrzImg
          class="w-full h-200px"
          mode="aspectFill"
          only-img
          :url="k.trim()"
          @tap="tapList"
        ></NrzImg>
      </swiper-item>
    </swiper>
    <NrzImg
      v-else
      class="w-full h-200px"
      mode="scaleToFill"
      only-img
      :url="CHARGE_DETAIL_BANNER"
    ></NrzImg>

    <section class="-mt-20px">
      <SiteInfo class="relative" :detail-data="detailData"></SiteInfo>
    </section>

    <van-tabs
      :active="tabIndex"
      :sticky="true"
      :swipeable="true"
      :offset-top="headerHeight"
    >
      <van-tab title="电站详情">
        <div :style="{ minHeight: `${minHeight}px` }">
          <SiteDetail :detail-data="detailData"></SiteDetail>
        </div>
      </van-tab>
      <van-tab :title="chargTitle">
        <div :style="{ minHeight: `${minHeight}px` }">
          <Charge v-model:charge-nums="chargeNums"></Charge>
        </div>
      </van-tab>
      <van-tab title="评论">
        <div :style="{ minHeight: `${minHeight}px` }" class="bg-fff">
          <Comment :station-id="detailData?.stationId"></Comment>
        </div>
      </van-tab>
    </van-tabs>

    <div class="h-60px"></div>

    <div
      class="fixed bottom-0 flex items-center w-full h-60px nrz-safe bg-fff z-999 charge-site-shadow"
    >
      <section class="flex items-center flex-1">
        <div
          class="flex flex-col items-center w-50px"
          @click.stop="
            () => {
              _collect(1, detailData?.stationId);
            }
          "
        >
          <span class="text-30px iconfont icon-xingxing"> </span>
          <span>收藏</span>
        </div>
        <div class="flex flex-col items-center w-50px" @click="call">
          <span class="text-30px iconfont icon-phone"> </span>
          <span>客服</span>
        </div>
      </section>
      <nut-button
        shape="square"
        color="#11264d"
        class="border-0 px-20px rounded-4px mr-10px"
        @click="scan"
      >
        扫码充电
      </nut-button>
    </div>
  </FullLoading>
</template>
<script lang="ts">
import { onShareAppMessage, onShareTimeline } from '@/utils/index';
export default {
  onShareAppMessage,
  onShareTimeline,
};
</script>
<script lang="ts" setup>
import { computed, onBeforeMount, ref } from 'vue';
import CustomBar from '@/components/customHeader/index.vue';
import FullLoading from '@/components/full-loading/index.vue';
import SiteInfo from './SiteInfo.vue';
import SiteDetail from './SiteDetail.vue';
import Charge from './Charge.vue';
import Comment from './Comment.vue';
import NrzImg from '@/components/img/img.vue';
import { systemInfo, store } from '@/stores/index';
import { getStationDetail, collectStation, getCharging } from '@/api/index';
import {
  CODE,
  makePhoneCall,
  useToast,
  CHARGE_DETAIL_BANNER,
  NRZ_TEL,
} from '@/utils/index';
import { useRouter, usePageScroll } from '@tarojs/taro';
import { useScrollAbout } from './useScroll';
import { useHeaderHeight } from '@/hooks/index';
import Taro from '@tarojs/taro';

definePageConfig({
 transparentTitle: 'always',
  titlePenetrate: 'YES',
  defaultTitle: '',});

let tabIndex = ref(0);
let fullLoading = ref(true);
let detailData = ref<{ [propKey: string]: any }>();
let chargeNums = ref();
let chargTitle = computed(() => {
  if (chargeNums.value) {
    return `充电枪(${chargeNums.value})`;
  }
  return '充电枪';
});
const current = ref(0);
const { headerHeight } = useHeaderHeight();
const { gradualColor, gradualColorIcon, hasBorder, changeHeaderBg } =
  useScrollAbout();
let minHeight = computed(() => {
  return systemInfo().app.windowHeight - 110;
});
function _collect(submitOrCancel, stationId) {
  collectStation({
    submitOrCancel,
    stationId,
  }).then((res) => {
    useToast(res?.data);
  });
}
function _getStationDetail() {
  getStationDetail({
    longitude: store().cityInfo?.longitude,
    latitude: store().cityInfo?.latitude,
    id: useRouter().params?.id,
  })
    .then((res) => {
      fullLoading.value = false;
      if (res?.code !== CODE) return useToast(res?.msg);
      detailData.value = res.data;
    })
    .catch(() => {
      fullLoading.value = false;
    });
}

function call() {
  makePhoneCall(
    detailData.value?.stationTel || detailData.value?.serviceTel || NRZ_TEL
  );
}
function tapList() {
  Taro.previewImage({
    urls: detailData.value.pictureList?.map((t) => {
      return t.trim();
    }),
    showmenu: true,
  });
}
function scan() {
  getCharging();
}

usePageScroll((res) => {
  changeHeaderBg(res.scrollTop);
});
onBeforeMount(() => {
  _getStationDetail();
});

const scrollTop = ref(0);

usePageScroll((res) => {
  scrollTop.value = res.scrollTop;
});

// bottom
</script>
<style>
.charge-site-shadow {
  box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.4);
}
.van-tabs__wrap {
  box-shadow: 0px 2px 3px -1px rgba(0, 0, 0, 0.2);
}
</style>
