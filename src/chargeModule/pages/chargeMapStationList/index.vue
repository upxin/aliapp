<template>
  <view :catch-move="true">
    <van-sticky :offset-top="0" :z-index="70000">
      <section
        id="header"
        class="flex items-center w-full bg-fff px-12px box-border pb-10px"
        :style="{
          paddingTop: `${RightBtnRectT}px`,
        }"
      >
        <span
          class="text-right iconfont nz-rot180 icon-arrow-right-bold w-20px text-14px"
          @click="back"
        ></span>

        <div class="flex items-center mr-6px w-60px" @click="chooseCity">
          <span
            class="flex-1 text-black overflow-ellipsis text-12px text-opacity-65"
          >
            {{ cityName }}
          </span>
          <span class="iconfont icon-sanjiao"></span>
        </div>

        <NrzSearch
          v-model="searchKey"
          :style="{ height: `${RightBtnRectH}px` }"
          class="flex-1"
          disabled
          @click="handleSearch"
        ></NrzSearch>
        <div class="w-120px"></div>
      </section>
    </van-sticky>
  </view>

  <FullLoading :loading="fl">
    <section id="box" class="box-border overflow-auto">
      <section class="bg-fff">
        <div
          class="box-border w-full min-h-160px px-20px"
          :style="{
            height: `${swiperHeight}px`,
          }"
        >
          <swiper class="h-full w-full" :duration="300" :circular="true">
            <swiper-item
              v-for="item in bannerList"
              :key="item?.id"
              class="h-full"
            >
              <image
                class="w-full h-160px"
                :src="item?.img"
                @tap="tapToPage(item)"
              ></image>
            </swiper-item>
          </swiper>
        </div>

        <section class="flex justify-between mt-10px px-18px">
          <div
            v-for="k in navList"
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
      </section>
      <div
        id="nRef"
        class="flex text-16px pt-40px pb-20px font-600 px-18px bg-fff"
      >
        附近电站
      </div>
      <view :catch-move="true">
        <van-sticky :offset-top="headerHeight" :z-index="10000">
          <section
            id="tabs"
            class="flex justify-between items-center bg-fff px-14px text-16px h-50px"
          >
            <div
              class="flex-1 flex items-center justify-center min-w-0"
              @click="handleMenu(1)"
            >
              <span class="overflow-ellipsis">{{ sortText }}</span>
              <span class="iconfont icon-sanjiao"></span>
            </div>

            <div
              class="flex-1 flex items-center justify-center min-w-0"
              @click="handleMenu(2)"
            >
              <span class="overflow-ellipsis">
                {{ chargeTypeText }}
              </span>
              <span class="iconfont icon-sanjiao"></span>
            </div>

            <div
              class="flex-1 flex items-center justify-center min-w-0"
              @click="handleMenu(3)"
            >
              <span class="overflow-ellipsis">{{ parkingText }}</span>
              <span class="iconfont icon-sanjiao"></span>
            </div>

            <div
              class="flex-1 flex items-center justify-center min-w-0"
              @click="menuItemClick4"
            >
              <span>筛选</span>
              <span class="icon-shaixuan iconfont"></span>
            </div>
          </section>
        </van-sticky>
      </view>
      <DownList
        :show="dropShow"
        :paddingbtm="20"
        :translatey="transY"
        @close="dropShow = false"
      >
        <div v-show="state.currentMenuType === 1">
          <div
            v-for="item in state.sort"
            :key="item.value"
            class="flex justify-between px-20px py-10px text-14px"
            @click="sortTypeChange(item.value)"
          >
            <span :class="{ 'text-danger': item.value === state.sortType }">
              {{ item.text }}
            </span>
            <span
              class="iconfont icon-a-gou2x"
              :class="{
                'text-danger': item.value === state.sortType,
                'text-transparent': item.value !== state.sortType,
              }"
            ></span>
          </div>
        </div>
        <div v-show="state.currentMenuType === 2">
          <div
            v-for="item in state.chargeType"
            :key="item.value"
            class="flex justify-between px-20px py-10px text-14px"
            @click="chargeTypeChange(item.value)"
          >
            <span
              :class="{
                'text-danger': item.value === state.chargeTypeVal,
              }"
            >
              {{ item.text }}
            </span>
            <span
              class="iconfont icon-a-gou2x"
              :class="{
                'text-danger': item.value === state.chargeTypeVal,
                'text-transparent': item.value !== state.chargeTypeVal,
              }"
            ></span>
          </div>
        </div>
        <div v-show="state.currentMenuType === 3">
          <div
            v-for="item in state.parking"
            :key="item.value"
            class="flex justify-between px-20px py-10px text-14px"
            @click="parkingTypeChange(item.value)"
          >
            <span :class="{ 'text-danger': item.value === state.parkingVal }">
              {{ item.text }}
            </span>
            <span
              class="iconfont icon-a-gou2x"
              :class="{
                'text-danger': item.value === state.parkingVal,
                'text-transparent': item.value !== state.parkingVal,
              }"
            ></span>
          </div>
        </div>
      </DownList>
      <section class="bg-fff min-h-600px">
        <NoData v-if="!list?.length" class="h-full"></NoData>
        <ChargeListItem v-else :list="list" :border="true"> </ChargeListItem>
        <template v-if="list?.length">
          <div class="text-center text-second pb-40px pt-20px">
            {{ hasMore ? '加载中...' : '已加载全部~' }}
          </div>
        </template>
      </section>
    </section>
  </FullLoading>
  <NrzBtmPop v-model:show="state.showMore" z-index="200003" height="60vh">
    <ChooseMore @handle-ok="handleOk"></ChooseMore>
  </NrzBtmPop>
  <NrzAddr
    v-model:show="cityVisible"
    :layer="2"
    :showCurrent="true"
    @change="getPath"
  ></NrzAddr>
</template>

<script lang="ts" setup>
import { computed, onBeforeMount, onMounted, reactive, ref, watch } from 'vue';
import ChooseMore from './ChooseMore.vue';
import ChargeListItem from '../../components/chargeListItem/ChargeListItem.vue';
import NrzSearch from '@/chargeModule/components/search/index.vue';
import NrzBtmPop from '@/components/nrz-bottom-popup/index.vue';
import NrzAddr from '@/components/nrz-addr/index.vue';

import Taro, {
  useReachBottom,
  usePullDownRefresh,
  useDidShow,
  usePageScroll,
} from '@tarojs/taro';
import FullLoading from '@/components/full-loading/index.vue';
import {
  getMarkerStation,
  getAllEnum,
  getChargingInSite,
  getSiteBanner,
} from '@/api/index';
import { regDataList } from './siteListHooks';
import { systemInfo } from '@/stores/index';
import NoData from '@/components/noData/index.vue';
import {
  CODE,
  useToast,
  CHARGE_MAP_ORDER,
  CHARGE_MAP_WALLET,
  navigateToPage,
  chargeExplain,
  needToLogin,
  mapModel,
  jGcustomCount,
  WEBVIEW_PREFIX,
  JG,
  nrNavigateTo,
  useLocation,
} from '@/utils/index';
import { usePosition, useRect } from '@/hooks/index';
import { store } from '@/stores/index';
import DownList from '@/components/nrz-down-list/index.vue';

const { currentCityName } = usePosition();

definePageConfig({
 transparentTitle: 'auto',
  titlePenetrate: 'YES',
  defaultTitle: '',  enablePullDownRefresh: true,
});
let RightBtnRectH = computed(() => systemInfo().RightBtnRect.h);
let RightBtnRectT = computed(() => systemInfo().RightBtnRect.t);
let swiperHeight = computed(() => {
  return systemInfo().app.windowWidth / 2;
});

const dropShow = ref(false);
const headerHeight = ref(0);
let fl = ref(true);
const hasOverlay = ref(false);
const tabsHeight = ref(0);
const cityVisible = ref(false);
const transY = computed(() => {
  return headerHeight.value + tabsHeight.value;
});

let navList = ref<any[]>([
  { text: '地图模式', url: mapModel, route: 'chargingMap' },
  { text: '充电钱包', url: CHARGE_MAP_WALLET, route: 'chargeWalletHome' },
  { text: '充电订单', url: CHARGE_MAP_ORDER, route: 'chargeOrderList' },
  {
    text: '充电说明',
    url: chargeExplain,
    route: `${WEBVIEW_PREFIX}url=https://h5.newrizon.cloud/chargingInstructions`,
  },
]);

interface Sat {
  sort: any[];
  chargeTypeVal: number;
  parkingVal: number;
  [propsKey: string]: any;
}
const state = reactive<Sat>({
  showMore: false,
  chargeType: [],
  parking: [],
  sort: [],
  sortType: 0,
  currentMenuType: 1,
  chargeTypeVal: 0, // string[] number[]
  parkingVal: -1, // string[] number[]
});

const sortText = computed(() => {
  return state.sort.find((item) => {
    return item.value === state.sortType;
  })?.text;
});
const chargeTypeText = computed(() => {
  return state.chargeType.find((item) => {
    return item.value === state.chargeTypeVal;
  })?.text;
});

const parkingText = computed(() => {
  return state.parking.find((item) => {
    return item.value === state.parkingVal;
  })?.text;
});

let searchKey = ref('');
const cityName = ref(currentCityName.value);

const list = ref<any[]>([]);
let lock = false;
let latitude = store().cityInfo.latitude;
let longitude = store().cityInfo.longitude;
let pageSize = 20;
let pageNum = 1;
let hasMore = ref(true);
let showMTop = ref(0);
let tagIds = [];
let sortType = null;
let type = [];
let areaCode = '';
let initAdcode = store()?.cityInfo?.adcode;
const bannerList = ref<any[]>([]);

function _getSiteBanner() {
  getSiteBanner().then((res) => {
    if (res?.code == 200) {
      bannerList.value = res?.data?.list;
    }
  });
}
function tapToPage(item) {
  console.log(item);
  nrNavigateTo(item?.router);
}
function navigationTo(info) {
  if (info.route != 'chargingMap') {
    if (needToLogin()) return;
  }
  nrNavigateTo(info.route);
}

function menuItemClick4() {
  dropShow.value = false;
  hasOverlay.value = true;

  Taro.pageScrollTo({
    scrollTop: showMTop.value,
    duration: 0,
    selector: '#box',
    success() {
      state.showMore = true;
    },
  });
}

function setParams(g, s, t) {
  tagIds = g ?? [];
  sortType = s ?? null;
  type = t ?? [];
}
function resetParams() {
  tagIds = [];
  sortType = null;
  type = [];
}
function chooseCity() {
  cityVisible.value = true;
}

function handleSearch() {
  navigateToPage({
    route: 'chargeSearch',
  });
}
function back() {
  Taro.navigateBack();
}

function getStationListMore() {
  lock = true;
  Taro.showLoading({
    title: '加载中...',
  });
  getMarkerStation({
    latitude,
    longitude,
    pageNum,
    pageSize,
    tagIds,
    sortType,
    type,
    areaCode,
  }).then((res) => {
    Taro.hideLoading();
    lock = false;

    if (res?.code !== CODE) return useToast(res?.msg);
    list.value = [...list.value, ...res?.data?.list];
    pageNum = res.data?.nextPage == 0 ? pageNum : res.data?.nextPage;
    hasMore.value = res.data?.pageNum * res.data?.pageSize < res.data?.total;
  });
}
const scrollTop = ref(0);
usePageScroll((e) => {
  scrollTop.value = e.scrollTop;
});
function getStationListInit() {
  if (!fl.value) {
    Taro.showLoading({
      title: '加载中...',
    });
  }
  pageNum = 1;
  getMarkerStation({
    latitude,
    longitude,
    pageNum,
    pageSize,
    tagIds,
    sortType,
    type,
    areaCode,
  })
    .then((res) => {
      Taro.hideLoading();
      Taro.stopPullDownRefresh();
      if (res?.code !== CODE) return useToast(res?.msg);
      fl.value = false;
      list.value = res?.data?.list;
      pageNum = res.data?.nextPage == 0 ? pageNum : res.data?.nextPage;
      hasMore.value = res.data?.pageNum * res.data?.pageSize < res.data?.total;
    })
    .catch(() => {
      fl.value = false;
    });
}

function sortTypeChange(ret) {
  state.sortType = ret;
  setParams(tagIds, ret, type);
  getStationListInit();
  jGcustomCount(JG.CHARGE_002);
  dropShow.value = false;
}

function parkingTypeChange(ret) {
  state.parkingVal = ret;

  setParams([ret], sortType, type);
  getStationListInit();
  jGcustomCount(JG.CHARGE_002);
  dropShow.value = false;
}

function chargeTypeChange(ret) {
  state.chargeTypeVal = ret;

  setParams(tagIds, sortType, [ret]);
  getStationListInit();
  jGcustomCount(JG.CHARGE_002);
  dropShow.value = false;
}

function handleMenu(currentMenuType) {
  state.currentMenuType = currentMenuType;

  Taro.pageScrollTo({
    scrollTop: showMTop.value,
    duration: 0,
    selector: '#box',
    success() {
      dropShow.value = true;
    },
  });
}
function handleOk({ tagIds, type }) {
  setParams(tagIds, null, type);
  getStationListInit();
  resetParams();
  state.showMore = false;
}
function loadMore() {
  if (!hasMore.value) return;
  if (lock) return;
  getStationListMore();
}
function refresh() {
  state.sortType = 0;
  state.chargeTypeVal = 0;
  state.parkingVal = -1; // string[] number[]
  resetParams();
  getStationListInit();
}

useReachBottom(() => {
  loadMore();
});

function getPath(e) {
  cityName.value = e.text?.[1];
  areaCode = e.value?.[1];
  const [lon, lat] = e.center?.[1].split(',');
  latitude = lat;
  longitude = lon;

  Taro.pageScrollTo({
    scrollTop: 0,
    duration: 0,
    selector: '#box',
    success() {
      getStationListInit();
    },
  });
}
onBeforeMount(() => {
  getChargingInSite();
  _getSiteBanner();
});

onMounted(async () => {
  areaCode = initAdcode;
  jGcustomCount(JG.CHARGE_001);
  getAllEnum().then((res) => {
    if (res?.code !== CODE) return useToast(res?.msg);
    state.chargeType = regDataList(res.data?.type || []);
    state.sort = regDataList(res.data?.sortType || []);
    state.parking = regDataList(res.data?.parking || []);
  });

  useLocation()
    .then((res) => {
      latitude = res.latitude;
      longitude = res.longitude;
      getStationListInit();
    })
    .catch(() => {
      getStationListInit();
    });
});
useDidShow(() => {
  setTimeout(() => {
    useRect('#nRef').then((res: any) => {
      showMTop.value = res.bottom - RightBtnRectH.value - RightBtnRectT.value;
    });
    useRect('#header').then((res: any) => {
      headerHeight.value = res.height;
    });
    useRect('#tabs').then((res: any) => {
      tabsHeight.value = res.height;
    });
  }, 200);
});
watch(
  () => currentCityName.value,
  (v) => {
    cityName.value = v;
  }
);
usePullDownRefresh(() => {
  refresh();
});
// bottom
</script>
<style lang="scss">
page {
  background-color: #ffffff;
}
.nut-rate-item {
  margin-right: 4px !important;
}
.chooseMore > .h5-div {
  height: 100%;
}
.angle::after {
  border-color: transparent transparent currentcolor currentcolor;
  border-style: solid;
  border-width: 3px;
  content: '';
  margin-top: -5px;
  opacity: 0.8;
  position: absolute;
  right: -12px;
  top: 50%;
  -webkit-transform: rotate(-45deg);
  -ms-transform: rotate(-45deg);
  transform: rotate(-45deg);
  border-top-color: transparent;
  border-right-color: transparent;
  border-bottom-color: currentcolor;
  border-left-color: currentcolor;
  border-top-style: solid;
  border-right-style: solid;
  border-bottom-style: solid;
  border-left-style: solid;
  border-top-width: 3px;
  border-right-width: 3px;
  border-bottom-width: 3px;
  border-left-width: 3px;
}
</style>
