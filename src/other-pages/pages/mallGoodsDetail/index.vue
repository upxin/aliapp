<template>
  <CustomBar
    :pad-x="30"
    :border="opacity >= 1"
    :z="888"
    :background-color="`rgba(255,255,255, ${opacity})`"
    :color="titleColor"
    :icon-color="titleColor"
  >
  </CustomBar>
  <FullLoading :loading="fullLoading">
    <swiper
      :current="current"
      class="h-400px"
      :circular="true"
      @change="swiperChange"
    >
      <swiper-item v-for="(k, index) in spu_data?.banners" :key="index">
        <BgImg
          class="flex items-center justify-center w-full bg-center bg-cover h-400px"
          only-img
          :url="k"
          @click="handleBanner"
        >
        </BgImg>
      </swiper-item>
    </swiper>
    <div
      class="relative flex justify-center w-full -top-20px z-100 text-light-50"
    >
      <span
        v-for="(_, index) in spu_data?.banners"
        :key="index"
        :class="`inline-block w-36px h-3px ml-6px rounded-10px ${
          index !== current ? 'bg-gray-500' : 'bg-hex-fff'
        }`"
      ></span>
    </div>

    <section class="px-15px pt-20px pb-30px">
      <div class="font-bold pb-8px text-16px">{{ spu_data?.title }}</div>
      <div class="opacity-40 text-12px">{{ spu_data?.summary }}</div>
      <section class="flex pt-20px">
        <div class="flex items-center mr-30px">
          <span class="mr-6px">￥{{ spu_data?.price }}</span>
        </div>
        <div class="flex items-center">
          <span
            class="icon-jinbi iconfont text-14px mr-6px nrz-thin text-normal"
          ></span>
          <span>{{ spu_data?.price * 100 }}</span>
        </div>
      </section>
    </section>

    <div
      v-if="spu_data?.goodsType != 2"
      class="flex justify-between px-15px nr-border-b py-10px"
      @click="showPop = true"
    >
      <span class="text-g">全国部分地区包邮</span>
      <span class="iconfont icon-arrow-right-bold text-hex-aaa"></span>
    </div>
    <div
      class="flex justify-between px-15px nr-border-b py-10px"
      @click="naviToCommentList"
    >
      <span class="text-g">
        商品评价（{{ spu_data?.commentNum ?? 0 }}）条
      </span>
      <span class="iconfont icon-arrow-right-bold text-hex-aaa"></span>
    </div>
    <div class="px-15px my-30px">规格参数</div>
    <section class="px-15px">
      <Specification :list="spu_data?.spuSpecs"></Specification>
    </section>
    <div class="px-15px my-30px">商品介绍</div>
    <!-- eslint-disable-next-line vue/no-v-html  -->
    <div id="nz-rich" class="px-15px" v-html="nodes"></div>
    <div
      v-for="(item, i) in spu_data?.changeDeclaration?.split('\\n')"
      :key="i"
      class="text-left my-10px px-15px"
    >
      {{ item }}
    </div>

    <!-- 站位防止底部遮挡 -->
    <div class="nrz-safe">
      <div class="h-60px"></div>
    </div>

    <div class="box-border fixed bottom-0 w-full bg-fff px-15px nr-shadow">
      <div class="flex items-center justify-between h-50px">
        <div class="flex items-center" @click="_onlineKefu">
          <span class="iconfont icon-message"></span>
          <span class="ml-6px">在线客服</span>
        </div>
        <button
          class="rounded-none bg-primary text-fff py-10px px-10px"
          @click="show_short_buy"
        >
          即刻拥有
        </button>
      </div>
      <div class="nrz-safe"></div>
    </div>
  </FullLoading>
  <ChooseGoods v-model="show" :spu-id="params.spuId"></ChooseGoods>
  <NrzBottomPopup v-model:show="showPop" tips="包邮地区">
    <template v-if="spu_data?.freight?.filter((k) => k?.money == '0')?.length">
      <div
        v-for="item in spu_data?.freight?.filter((k) => k?.money == '0')"
        :key="item?.adcode"
        class="px-15px pb-20px"
      >
        <div class="text-16px">{{ item?.name }}</div>
        <div class="leading-normal text-12px pt-8px text-second">
          所有地区包邮
        </div>
      </div>
    </template>
    <div v-else class="text-center py-40px">暂无包邮地区</div>
  </NrzBottomPopup>
</template>
<script lang="ts" setup>
import { computed, onBeforeMount, onMounted, ref } from 'vue';
import CustomBar from '@/components/customHeader/index.vue';
import FullLoading from '@/components/full-loading/index.vue';
import Taro, {
  usePageScroll,
  useRouter,
  useShareAppMessage,
} from '@tarojs/taro';
import NrzBottomPopup from '@/components/nrz-bottom-popup/index.vue';
import Specification from './specification.vue';
import { get_spu } from '@/api/mall';
import { useRequest } from '@/hooks/index';
import BgImg from '@/components/bg-img/bg-img.vue';
import ChooseGoods from '../../comp/choose-goods/index.vue';
import { JG, jGcustomCount, onlineKefu, nrNavigateTo } from '@/utils/index';
let shareTitle = ref();

useShareAppMessage(() => {
  jGcustomCount(JG.MALL_003, { name: shareTitle });
  return {
    title: shareTitle.value,
    path: `/other-pages/pages/mallGoodsDetail/index?spuId=${params?.spuId}`,
    imageUrl: spu_data?.banners?.[0],
  };
});
definePageConfig({ transparentTitle: 'auto',titlePenetrate: 'YES',defaultTitle: '', enableShareAppMessage: true });

let show = ref(false);
let params = useRouter().params;
let {
  data: spu_data,
  run: _get_spu,
  initLoading: fullLoading,
} = useRequest(get_spu, {
  immediate: false,
  onSuccess(rep) {
    jGcustomCount(JG.MALL_001, { name: rep?.title });
    shareTitle.value = rep?.title;
  },
});
let choosed_img = ref('');
let showPop = ref(false);
let titleColor = ref('#fff');
let current = ref(0);
let swiperChange = (res) => {
  current.value = res.detail.current;
};
let opacity = ref(0);
let nodes = computed(() => {
  return spu_data.value?.detail?.replaceAll('&nbsp;', ' ');
});
function _onlineKefu() {
  onlineKefu();
}
function handleBanner() {
  Taro.previewMedia({
    sources: spu_data.value.banners.map((item) => ({ url: item })),
  });
}
function show_short_buy() {
  show.value = true;
  choosed_img.value = spu_data?.value?.banners?.[0];
}
function naviToCommentList() {
  nrNavigateTo('mallOrderComment', { spuId: params?.spuId });
}
usePageScroll((res) => {
  const cur = +(Math.abs(Math.round(res.scrollTop)) / 200).toFixed(1);
  if (res.scrollTop <= 2) {
    titleColor.value = '#fff';
  } else {
    titleColor.value = `rgba(0,0,0, ${cur})`;
  }
  opacity.value = cur;
});
onMounted(() => {
  Taro.options.html.transformElement = (el) => {
    if (el.nodeName === 'image') {
      // 官方文档写的 el.nodeName === 'img'，实际是 el.nodeName === 'image'
      el.setAttribute('mode', 'widthFix');
      el.parentNode.setAttribute(
        'style',
        'display: flex;justify-content: center;align-items: center;flex-direction: column;'
      );
    }
    return el;
  };
});
onBeforeMount(() => {
  _get_spu({
    spuId: params?.spuId,
  });
});
// bottom
</script>
<style>
#nz-rich view {
  padding-bottom: 10px;
}
page {
  background-color: #fff;
}
.nr-shadow {
  box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.4);
}

.nr-bottom-enter-active,
.nr-bottom-leave-active {
  transition: all 0.3s;
}
.nr-bottom-enter-from,
.nr-bottom-leave-to {
  transform: translateY(118%);
}

.nr-fade-enter-from {
  opacity: 0;
}
.nr-fade-enter-active {
  transition: opacity 0.3s;
}
.nr-fade-enter-to {
  opacity: 1;
}

.nr-fade-leave-from {
  opacity: 1;
}
.nr-fade-leave-active {
  transition: opacity 0.3s;
}
.nr-fade-leave-to {
  opacity: 0;
}
.ani {
  transition: all 0.3s;
}
.slide_down {
  transform: translateY(118%);
}
.slide_up {
  transform: translateY(0%);
}
</style>
