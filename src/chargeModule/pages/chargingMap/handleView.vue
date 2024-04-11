<template>
  <section
    class="box-border fixed w-full z-1000 px-14px"
    :style="{ top: headerHeight + 'px' }"
  >
    <div class="w-full bg-fff rounded-8px pt-10px pb-12px">
      <section class="box-border flex items-center w-full px-12px">
        <span
          class="text-center iconfont nz-rot180 icon-arrow-right-bold w-40px text-14px"
          @click="back"
        ></span>
        <aside class="flex items-center flex-1 bg-main rounded-3px">
          <div class="flex items-center" @click="cityVisible = true">
            <span class="text-black text-12px mx-4px text-opacity-65">
              {{ cityName }}
            </span>
            <span class="iconfont icon-sanjiao"></span>
          </div>
          <div class="h-14px bg-hex-555 w-1px mx-8px"></div>
          <div
            class="box-border flex items-center flex-1 border-0 ml-4px nr-border h-36px"
            @click="toSearch"
          >
            <span
              class="mr-8px opacity-60 iconfont icon-search text-16px text-normal"
            ></span>
            <input type="text" class="flex-1" :disabled="true" />
          </div>
        </aside>
      </section>
      <section class="flex justify-between mt-10px px-12px">
        <div
          v-for="k in list"
          :key="k.text"
          class="flex flex-col items-center"
          @click="
            () => {
              navigationTo(k);
            }
          "
        >
          <image :src="k.url" class="w-40px h-40px" />
          <span class="text-12px nrz-thin mt-6px">{{ k.text }}</span>
        </div>
      </section>
    </div>
  </section>

  <section
    :style="{
      transform: `translateY(${-footerOffset}px)`,
      transition: 'all 0.3s',
      'box-shadow': '0px 2px 6px 0px rgba(0, 0, 0, 0.4)',
    }"
    :class="{
      'mb-16px': footerOffset != 0,
      'mb-36px': footerOffset == 0,
    }"
    class="fixed bottom-0 flex items-center justify-center text-center rounded-full left-10px bg-hex-04C3F6 w-60px h-60px"
    @click="toFindSite"
  >
    <span class="iconfont icon-a-28Cdianji text-30px text-fff"></span>
  </section>
  <section
    :style="{
      transform: `translateY(${-footerOffset}px)`,
      transition: 'all 0.3s',
    }"
    :class="{
      'mb-16px': footerOffset != 0,
      'mb-36px': footerOffset == 0,
    }"
    class="fixed bottom-0 flex flex-col items-center justify-center right-10px"
  >
    <section
      class="flex items-center justify-center text-center rounded-full bg-hex-fff w-30px h-30px"
      @click="backPos"
    >
      <span class="iconfont icon-dingwei text-18px"></span>
    </section>
    <section
      class="flex items-center justify-center text-center rounded-full my-16px bg-hex-fff w-30px h-30px"
      @click="collectSite"
    >
      <span class="iconfont icon-xingxing text-15px text-normal"></span>
    </section>
    <section
      :style="{
        'box-shadow': '0px 2px 6px 0px rgba(0, 0, 0, 0.4)',
      }"
      class="flex items-center justify-center text-center rounded-full bg-info w-60px h-60px"
      @click="scanCharge"
    >
      <span class="iconfont icon-scan text-30px text-fff"></span>
    </section>
  </section>

  <section
    id="footerRef"
    class="box-border fixed bottom-0 w-full px-10px pb-36px min-h-180px"
    :style="{ transform: `translateY(${offsetY})`, transition: 'all 0.3s' }"
  >
    <ChargeListItem :list="[currentMarkerDetail]"></ChargeListItem>
  </section>
  <NrzBtmPop v-model:show="showMore" z-index="2003" height="60vh">
    <ChooseMore @handle-ok="handleOk"></ChooseMore>
  </NrzBtmPop>
  <NrzAddr
    v-model:show="cityVisible"
    :layer="2"
    z-index="999999"
    @change="getPath"
  ></NrzAddr>
</template>
<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import ChargeListItem from '../../components/chargeListItem/ChargeListItem.vue';
import NrzBtmPop from '@/components/nrz-bottom-popup/index.vue';
import NrzAddr from '@/components/nrz-addr/index.vue';

import Taro from '@tarojs/taro';
import {
  CHARGE_MAP_ORDER,
  CHARGE_MAP_WALLET,
  needToLogin,
  navigateToPage,
  CHARGE_SITE_FILTER,
} from '@/utils/index';
import { usePosition, useHeaderHeight } from '@/hooks/index';
import { getCharging } from '@/api/index';
import ChooseMore from '../chargeMapStationList/ChooseMore.vue';
import { store } from '@/stores';
definePageConfig({
 transparentTitle: 'always',
  titlePenetrate: 'YES',
  defaultTitle: '',});

interface Props {
  showDetail: boolean;
  currentMarkerDetail: any;
}
const { currentCityName } = usePosition();

withDefaults(defineProps<Props>(), {
  showDetail: false,
  currentMarkerDetail: {},
});
const cityVisible = ref(false);
let showMore = ref(false);
let emits = defineEmits(['filterMarker']);
let list = ref<any[]>([
  { text: '电站列表', url: CHARGE_MAP_WALLET, route: 'chargeMapStationList' },
  { text: '条件筛选', url: CHARGE_SITE_FILTER, route: '' },
  { text: '充电钱包', url: CHARGE_MAP_WALLET, route: 'chargeWalletHome' },
  { text: '充电订单', url: CHARGE_MAP_ORDER, route: 'chargeOrderList' },
]);
let mpCtx;

const { headerHeight } = useHeaderHeight();
const offsetY = ref('100%');
const cityName = ref(currentCityName.value);
const footerOffset = ref(0);
function back() {
  Taro.navigateBack();
}

function backPos() {
  moveToLoacation({});
  cityName.value = store().cityInfo.currentCityName;
}
function handleOk({ tagIds, type, km }) {
  showMore.value = false;
  emits('filterMarker', { tagIds, type, km });
}
function collectSite() {
  if (needToLogin()) return;
  navigateToPage({
    route: 'collectOftenStationList',
  });
}
function navigationTo(info) {
  if (info.route == 'chargeWalletHome' || info.route == 'chargeOrderList') {
    if (needToLogin()) return;
  }
  if (!info.route) {
    showMore.value = true;
    return;
  }
  navigateToPage({
    route: info.route,
  });
}
function toSearch() {
  navigateToPage({
    route: 'chargeSearch',
  });
}

function getFooterHeight() {
  const query = Taro.createSelectorQuery();
  query
    .select('#footerRef')
    .boundingClientRect((rec) => {
      if (rec.height) {
        footerOffset.value = rec.height;
        offsetY.value = '0%';
      }
    })
    .exec();
}
function moveToLoacation(point) {
  console.log(point, mpCtx);
  mpCtx.moveToLocation({
    latitude: point?.lat,
    longitude: point?.lon,
  });
}
function runAnimate() {
  getFooterHeight();
}
function scanCharge() {
  getCharging();
}
function toFindSite() {
  navigateToPage({
    route: 'chargeFindPileActionPage',
  });
}
function changeCity({ lon, lat }) {
  moveToLoacation({ lon, lat });
}

onMounted(() => {
  setTimeout(() => {
    mpCtx = Taro.createMapContext('chargeMap');
  }, 50);
});

function getPath(e) {
  console.log(e);
  cityName.value = e.text?.[1];
  const [lon, lat] = e.center?.[1].split(',');
  changeCity({ lon, lat });
}

watch(
  () => currentCityName.value,
  (v) => {
    cityName.value = v;
  }
);
defineExpose({
  runAnimate,
});
// bottom
</script>
<style>
.nut-rate-item {
  margin-right: 4px !important;
}
</style>
