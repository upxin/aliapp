<template>
  <CustomBar background-color="#fff" :border="false">
    <template #default>
      <section
        class="box-border flex items-center w-full px-12px"
        :style="{
          paddingRight: `${100}px`,
        }"
      >
        <span
          class="text-right iconfont nz-rot180 icon-arrow-right-bold w-20px text-14px"
          @click="back"
        ></span>

        <NrzSearch
          v-model="keyword"
          class="flex-1"
          @input="searchList"
        ></NrzSearch>
      </section>
    </template>
  </CustomBar>
  <section
    class="box-border fixed z-999 flex items-center justify-between w-full px-50px bg-fff"
    :style="{ top: `${headerHeight}px`, height: '48px' }"
  >
    <div class="flex items-center nrz-thin" @click="goCollect">
      <section
        class="flex items-center justify-center text-center rounded-full mr-10px bg-hex-04C3F6 w-25px h-25px"
      >
        <span class="iconfont icon-chongdianzhuang text-16px text-fff"></span>
      </section>
      <span>收藏电站</span>
    </div>
    <div class="flex items-center nrz-thin" @click="showMore = true">
      <image :src="CHARGE_SITE_FILTER" class="w-25px h-25px mr-10px" />
      <span>条件筛选</span>
    </div>
  </section>
  <FullLoading :loading="fullLoading">
    <MainScroll
      :has-more="hasMore"
      :pt="headerHeight + 48"
      :has-data="!!list?.length"
      :placeholder-empty="placeholderEmpty"
      placeholder-empty-text="输入您想去的充电站"
      @scroll-reach-bottom="loadMore"
      @end-pull-down="refresh"
    >
      <section class="px-12px pt-16px">
        <ChargeListItem
          :list="list"
          :custom-handle-evt="true"
          @handleSiteItem="handleSiteItem"
        >
        </ChargeListItem>
      </section>
    </MainScroll>
  </FullLoading>
  <NrzBtmPop v-model:show="showMore" height="60vh">
    <ChooseMore @handle-ok="handleOk"></ChooseMore>
  </NrzBtmPop>
</template>
<script lang="ts" setup>
import MainScroll from '@/components/scroll-main/index.vue';
import { onBeforeMount, ref, computed } from 'vue';
import CustomBar from '@/components/customHeader/index.vue';
import FullLoading from '@/components/full-loading/index.vue';
import NrzSearch from '@/chargeModule/components/search/index.vue';
import ChooseMore from '../chargeMapStationList/ChooseMore.vue';
import NrzBtmPop from '@/components/nrz-bottom-popup/index.vue';
import Taro, { useRouter } from '@tarojs/taro';
import { getMarkerStation } from '@/api/index';
import {
  CODE,
  useToast,
  useLocation,
  CHARGE_SITE_FILTER,
  navigateToPage,
  nrNavigateTo,
  _debounce,
} from '@/utils/index';
import { useHeaderHeight, useNavigateBackSetData } from '@/hooks/index';
import ChargeListItem from '../../components/chargeListItem/ChargeListItem.vue';
import { store } from '@/stores';

definePageConfig({ transparentTitle: 'auto',titlePenetrate: 'YES',defaultTitle: '', });
let list = ref<any[]>([]);
let hasMore = ref(false);
const keyword = ref('');
const fullLoading = ref(true);
let showMore = ref(false);

let pageNum = 1;
let pageSize = 20;
let latitude = store().cityInfo.latitude;
let longitude = store().cityInfo.longitude;

const { headerHeight } = useHeaderHeight();

const placeholderEmpty = computed(() => !keyword.value);

let tagIds = [];
let sortType = null;
let km = null;
let type = [];

function setParams(g, s, k, t) {
  tagIds = g ?? [];
  sortType = s ?? null;
  km = k ?? 50;
  type = t ?? [];
}
function resetParams() {
  tagIds = [];
  sortType = null;
  km = null;
  type = [];
}
function handleSiteItem(station) {
  if (useRouter().params?.find) {
    useNavigateBackSetData({ findSite: station });
  } else {
    navigateToPage({
      route: 'chargeSiteDetail',
      params: { id: station.stationId },
    });
  }
}
function getStationListMore(val?) {
  getMarkerStation({
    latitude,
    longitude,
    pageNum,
    pageSize,
    keyword: val || keyword.value,
    tagIds,
    sortType,
    km,
    type,
  }).then((res) => {
    if (res?.code !== CODE) return useToast(res?.msg);
    list.value = [...list.value, ...res?.data?.list];
    pageNum = res.data?.nextPage == 0 ? pageNum : res.data?.nextPage;
    hasMore.value =
      Number(res.data?.pages) !== Number(res.data?.pageNum) &&
      res.data?.pages != 0;
  });
}
function goCollect() {
  console.log(999);
  nrNavigateTo('collectOftenStationList');
}

function getStationListInit(val?) {
  pageNum = 1;
  getMarkerStation({
    latitude,
    longitude,
    pageNum,
    pageSize,
    keyword: val || keyword.value,
    tagIds,
    sortType,
    km,
    type,
  }).then((res) => {
    fullLoading.value = false;
    if (res?.code !== CODE) return useToast(res?.msg);
    list.value = res?.data?.list;
    pageNum = res.data?.nextPage == 0 ? pageNum : res.data?.nextPage;
    hasMore.value = Number(res.data?.pages) !== Number(res.data?.pageNum);
  });
}

function back() {
  Taro.navigateBack();
}

const searchList = _debounce(
  (v) => {
    resetParams();
    getStationListInit(v);
  },
  300,
  false
);

function loadMore() {
  if (!hasMore.value) return;
  getStationListMore();
}
function refresh() {
  resetParams();
  getStationListInit();
}
function handleOk({ tagIds, type, km }, cb) {
  console.log(123, { tagIds, type, km });
  setParams(tagIds, null, km, type);
  getStationListInit();
  resetParams();
  cb();
  showMore.value = false;
}
onBeforeMount(() => {
  useLocation().then((res) => {
    latitude = res.latitude;
    longitude = res.longitude;
    getStationListInit();
  });
  getStationListInit();
});
// bottom
</script>

<style lang="scss">
.nr-shadow {
  box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.4);
}
</style>
