<template>
  <CustomHeader
    :border="opacity >= 1"
    :show-icon="false"
    :pad-x="140"
    :background-color="`rgba(255,255,255, ${opacity})`"
    :color="titleColor"
    :icon-color="titleColor"
    :custom-color="titleColor"
    :hidden-back="true"
  >
    <template #customLeft>
      <nut-popover v-model:visible="showTooltip" location="bottom-start">
        <template #reference>
          <div class="font-bolder">订单/客服</div>
        </template>
        <template #content>
          <div
            v-for="(item, index) in iconItemList"
            :key="index"
            class="flex items-center justify-between p-8px w-90px"
            @click.stop="
              () => {
                chooseTooltip(item);
              }
            "
          >
            <span
              class="iconfont font-bold"
              :class="{
                [item.name]: true,
              }"
            ></span>
            <div class="text-left w-60px">
              {{ item.desc }}
            </div>
          </div>
        </template>
      </nut-popover>
    </template>
  </CustomHeader>
  <FullLoading :loading="initLoading">
    <swiper
      :current="current"
      :circular="true"
      :autoplay="true"
      class="h-400px"
      @change="swiperChange"
    >
      <swiper-item v-for="(k, index) in homeData?.banner" :key="index">
        <BgImg
          class="flex items-center justify-center w-full bg-center bg-cover h-400px"
          :url="k?.banners?.[0]"
          @click="
            () => {
              hanlde_goods(k);
            }
          "
        >
        </BgImg>
      </swiper-item>
    </swiper>
    <div
      class="relative flex justify-center w-full -top-20px z-100 text-light-50"
    >
      <span
        v-for="(_, index) in homeData?.banner"
        :key="index"
        :class="`inline-block w-36px h-3px ml-6px rounded-10px ${
          index !== current ? 'bg-gray-500' : 'bg-hex-fff'
        }`"
      ></span>
    </div>
    <div
      class="flex items-center justify-between pb-16px px-14px pt-30px"
      @click="
        () => {
          navi_to_list(11);
        }
      "
    >
      <div class="text-size-16px text-normal nrz-thin">前晨好物</div>
      <span
        class="iconfont icon-right h-20px text-primary nrz-thin text-size-24px leading-20px"
      ></span>
    </div>
    <NrzGoods :goods="homeData?.goods"></NrzGoods>
    <div
      class="flex items-center justify-between pb-16px px-14px pt-50px"
      @click="
        () => {
          navi_to_list(12);
        }
      "
    >
      <div class="text-size-16px text-normal nrz-thin">品质生活</div>
      <span
        class="iconfont icon-right h-20px text-primary nrz-thin text-size-24px leading-20px"
      ></span>
    </div>
    <List :list="homeData?.life"></List>
    <div class="flex justify-center py-30px">
      {{ endText }}
    </div>
  </FullLoading>
</template>
<script lang="ts" setup>
import Taro, {
  usePageScroll,
  usePullDownRefresh,
  useShareAppMessage,
} from '@tarojs/taro';
import CustomHeader from '@/components/customHeader/index.vue';
import { ref, reactive } from 'vue';
import NrzGoods from './nr-goods.vue';
import List from './list.vue';
import { mallHome } from '@/api/mall';
import { useRequest } from '@/hooks/index';
import FullLoading from '@/components/full-loading/index.vue';

import BgImg from '@/components/img/img.vue';
import { nrNavigateTo, onlineKefu, getStore, USER_INFO } from '@/utils/index';

useShareAppMessage(() => {
  return {
    title: '前晨商城 好物多多',
    path: `/pages/shop/index`,
    imageUrl: 'https://nrz-app.su.bcebos.com/resources/nrz_mall_share.jpg',
  };
});

definePageConfig({
  transparentTitle: 'auto',
  titlePenetrate: 'YES',
  defaultTitle: '',
  enablePullDownRefresh: true,
  enableShareAppMessage: true,
});
let {
  data: homeData,
  run,
  initLoading,
} = useRequest(mallHome, { immediate: true });
let endText = '--> NEWRIZON <--';
let current = ref(0);
let opacity = ref(0);
let titleColor = ref('#fff');
let showTooltip = ref(false);
const iconItemList = reactive([
  {
    route: 'order',
    name: 'icon-order',
    desc: '我的订单',
  },
  {
    name: 'icon-message',
    route: 'service',
    desc: '在线客服',
  },
]);
let chooseTooltip = ({ route }) => {
  if (route === 'service') {
    onlineKefu();
  }
  if (route === 'order') {
    let user = getStore(USER_INFO);

    if (!user) {
      return nrNavigateTo('login');
    }
    nrNavigateTo('mallOrder');
  }
  showTooltip.value = false;
};
let swiperChange = (res) => {
  current.value = res.detail.current;
};
function hanlde_goods({ spuId = '' }) {
  nrNavigateTo('mallGoodsDetail', {
    spuId,
  });
}
function navi_to_list(type) {
  nrNavigateTo('mallGoodsList', {
    type,
  });
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
usePullDownRefresh(() => {
  run()
    .then(() => {
      Taro.stopPullDownRefresh();
    })
    .catch(() => {
      Taro.stopPullDownRefresh();
    });
});
</script>
