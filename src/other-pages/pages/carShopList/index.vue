<template>
  <CustomBar
    :show-icon="true"
    :border="false"
    background-color="#fff"
    :pad-x="140"
    :z="1008"
  >
    <template #customLeft>
      <span class="text-10px" @click="goPartner">成为合作伙伴</span>
    </template>
    <template #title>门店查询</template>
  </CustomBar>

  <div
    class="fixed left-0 w-full z-2000 min-h-48px"
    :style="{ top: `${CalcPt}px` }"
  >
    <section
      :catch-move="true"
      class="flex justify-between items-center bg-fff px-14px text-16px h-50px"
    >
      <div
        class="flex-1 flex items-center justify-center min-w-0"
        @click="goCityList"
      >
        <span class="overflow-ellipsis">{{ cityName }}</span>
        <span class="iconfont icon-sanjiao"></span>
      </div>

      <div
        class="flex-1 flex items-center justify-center min-w-0"
        @click="dropShow = true"
      >
        <span class="overflow-ellipsis">
          {{ shopText }}
        </span>
        <span class="iconfont icon-sanjiao"></span>
      </div>
    </section>
  </div>
  <DownList
    :show="dropShow"
    :paddingbtm="10"
    :translatey="tranY"
    @close="dropShow = false"
  >
    <DownListItem
      v-model:text="shopText"
      v-model:value="shopId"
      :list="shopTypeList"
      @change-item="handleAll"
    ></DownListItem>
  </DownList>
  <MainScroll
    ref="MainScrollRef"
    :pt="CalcPt + 48"
    :has-more="hasMore"
    :init-loading="loading"
    :bg="'#f9f9f9'"
    :has-data="!!shopList?.length"
    @scroll-reach-bottom="loadMore"
    @end-pull-down="refresh"
  >
    <section
      v-for="item in shopList"
      id="carShopList"
      :key="item"
      class="mb-14px bg-fff"
    >
      <div
        class="overflow-hidden text-normal"
        @click.stop="
          () => {
            goToDetail(item);
          }
        "
      >
        <LazyImg
          mode="aspectFill"
          :height="200"
          class="w-full h-200px"
          :src="item?.imgUrls?.[0]"
        />
        <div class="py-14px px-14px">
          <div class="flex items-center text-14px">
            <span
              class="border-solid rounded-sm p-4px text-10px border-1px"
              :style="{
                color: getFlagColor(item?.type),
                borderColor: getFlagColor(item?.type),
              }"
              >{{ item.typeText }}</span
            >
            <span class="ml-6px">{{ item.name }}</span>
          </div>
          <div class="leading-normal opacity-75 my-8px text-size-12px">
            {{ item.address }}
          </div>
          <div class="flex items-center justify-between text-size-12px mt-10px">
            <div class="flex">
              <div class="flex items-center justify-between mr-12px">
                <span class="iconfont icon-daohang text-size-15px"></span>
                <div class="h-20px leading-20px ml-4px">{{ item.km }}km</div>
              </div>
              <div
                class="flex items-center justify-between"
                @click.stop="
                  () => {
                    makePhoneCall(item.tel);
                  }
                "
              >
                <span class="iconfont icon-phone"></span>
                <div class="h-20px leading-20px ml-4px">极速咨询</div>
              </div>
            </div>
            <Btn :type="item.type" :shopId="item.shopId" @repair="repair"></Btn>
          </div>
        </div>
      </div>
    </section>
  </MainScroll>
  <Repair
    v-model:show="showRepair"
    :shop-id="shopInfo?.shopId"
    :shop-name="shopInfo?.shopName"
    :after-time="afterTime"
    @close="
      () => {
        showRepair = false;
      }
    "
  ></Repair>
  <NrzAddr v-model:show="showCity" :layer="2" @change="chooseCity"></NrzAddr>
</template>
<script lang="ts">
import { onShareAppMessage, onShareTimeline } from '@/utils/index';
export default {
  onShareAppMessage,
  onShareTimeline,
};
</script>
<script lang="ts" setup>
import { ref, computed, onBeforeMount, nextTick } from 'vue';
import CustomBar from '@/components/customHeader/index.vue';
import { systemInfo, store } from '@/stores/index';
import { getShopList, getCityList, shopDetail } from '@/api/index';
import MainScroll from '@/components/scroll-main/index.vue';
import {
  CODE,
  makePhoneCall,
  PRE_SALES_SERVICE_CENTER,
  PRE_SALES_CITY_EXHIBITION_HALL,
  CUSTOMER_SERVICE_REPAIR_SHOP,
  nrNavigateTo,
  isPreSalesCityExhibitionHall,
  isPreSalesServiceCenter,
  isCustomerServiceShop,
  DIRECT_SHOP,
  CITY_INFO_KEY,
} from '@/utils/index';
import Repair from '@/components/repair/index.vue';
import Taro, { useShareAppMessage, useDidShow } from '@tarojs/taro';
import Btn from './Buts.vue';
import LazyImg from '@/components/nrz-img/index.vue';
import { useGetNavigateBackParams } from '@/hooks';
import DownList from '@/components/nrz-down-list/index.vue';
import DownListItem from '@/components/nrz-down-list-item/index.vue';
import NrzAddr from '@/components/nrz-addr/index.vue';
definePageConfig({ navigationStyle: 'custom', enableShareAppMessage: true });

useShareAppMessage(() => {
  return {
    title: '前晨汽车经销门店',
    path: `other-pages/pages/carShopList/index`,
    imageUrl: 'https://nrz-app.su.bcebos.com/resources/shop_share.jpg',
  };
});

let loading = ref(true);
let shopList = ref<any[]>([]);
let nt = null;
let pt = null;
let hasMore = ref(false);
let CalcPt = computed(
  () => systemInfo().RightBtnRect.h + systemInfo().RightBtnRect.t + 10
);
const showCity = ref(false);
let showRepair = ref(false);
const cityList = ref<any[]>();
const dropShow = ref(false);
let shopTypeList = ref<any[]>([
  { value: 0, text: '全部' },
  { value: DIRECT_SHOP, text: '直营店' },
  { value: PRE_SALES_CITY_EXHIBITION_HALL, text: '城市展厅' },
  { value: CUSTOMER_SERVICE_REPAIR_SHOP, text: '特约维修店' },
  { value: PRE_SALES_SERVICE_CENTER, text: '销售服务中心' },
]);
let shopId = ref(0);
let shopInfo = ref();
let cityId = ref('0');
const cityName = ref('全国');
let afterTime = ref('');
const shopText = ref('全部');

// 车主有选配是再次预定 车主无选配是预约试驾

function repair(shopId) {
  _shopDetail({ shopId });
}

function chooseCity(e) {
  cityId.value = e.value?.[1];
  cityName.value = e.text?.[1];
  nextTick(() => {
    _change();
  });
}

function _shopDetail({ shopId }) {
  shopDetail({ shopId }).then((res) => {
    if (res.code !== CODE) return;
    afterTime.value = res?.data?.after_business_hours;
  });
}

// tag颜色
function getFlagColor(type) {
  if (isPreSalesServiceCenter(type)) {
    return '#007AFF';
  } else if (isPreSalesCityExhibitionHall(type)) {
    return '#F18A30';
  } else if (isCustomerServiceShop(type)) {
    return '#D50000';
  }
  return '#fff';
}

/**
 * 获取店铺名称
 * @return
 */

function goToDetail(item) {
  nrNavigateTo('shopeDetail', {
    id: item.shopId,
    commentNum: item?.commentNum,
  });
}
function goPartner() {
  nrNavigateTo('applyPartner');
}
function goCityList() {
  dropShow.value = false;
  showCity.value = true;
}

function handleAll() {
  dropShow.value = false;
  _change();
}
function _getShopList() {
  let _cityId = cityId.value === '0' ? null : cityId.value;

  getShopList({
    nt,
    pt,
    cityId: _cityId,
    type: shopId.value,
    lat: store().location?.latitude,
    lnt: store().location?.longitude,
  })
    .then((res) => {
      setTimeout(() => {
        loading.value = false;
      }, 1000);
      if (res.code !== CODE) return;
      shopList.value = [...shopList.value, ...res.data?.list];
      hasMore.value = res.data?.list?.length >= 15;
      nt = res.data.nt;
      pt = res.data.pt;
    })
    .catch(() => {
      loading.value = false;
    });
}

function _getCityList() {
  getCityList({}).then((res) => {
    if (res.code !== CODE) return;
    function regList(arr: any[]) {
      let newArr: any[] = [];
      arr.forEach((item) => {
        newArr.push(...item.children);
      });
      return newArr;
    }
    cityList.value = [
      { text: '全国', value: '0' },
      ...regList(res.data?.list || []).map((k) => {
        return {
          text: k.name,
          value: k.key,
        };
      }),
    ];
  });
}
onBeforeMount(() => {
  _getShopList();
  _getCityList();
});
function loadMore() {
  if (hasMore.value) {
    _getShopList();
  }
}
function refresh(done?) {
  let _cityId = cityId.value === '0' ? null : cityId.value;
  nt = null;
  pt = null;
  nextTick(() => {
    getShopList({
      nt,
      pt,
      cityId: _cityId,
      type: shopId.value,
      lat: store().location?.latitude,
      lnt: store().location?.longitude,
    }).then((res) => {
      setTimeout(() => {
        done && done();
      }, 500);
      if (res.code !== CODE) return;
      shopList.value = [...res.data?.list];
      hasMore.value = res.data?.list?.length >= 15;
      nt = res.data.nt;
      pt = res.data.pt;
    });
  });
}
let MainScrollRef = ref<any>(null);

function _change() {
  MainScrollRef?.value?.scrollToTop?.();

  let _cityId = cityId.value === '0' ? null : cityId.value;
  nt = null;
  pt = null;
  nextTick(() => {
    getShopList({
      nt,
      pt,
      cityId: _cityId,
      type: shopId.value,
      lat: store().location?.latitude,
      lnt: store().location?.longitude,
    }).then((res) => {
      if (res.code !== CODE) return;
      shopList.value = [...res.data?.list];
      hasMore.value = res.data?.list?.length >= 15;
      nt = res.data.nt;
      pt = res.data.pt;
    });
  });
}

const tranY = computed(() => {
  return CalcPt.value + 50;
});
</script>
<style lang="scss">
page {
  background: #f9f9f9;
}
.nr-shopbtn-orange {
  background-color: #f18a30;
  color: #fff;
  border-top-right-radius: 100px;
  border-bottom-right-radius: 100px;
  box-sizing: border-box;
  height: 100%;
  width: 46px;
}
.nr-shopbtn-666 {
  border-color: #666;
  color: #666;
  border-left: 1px solid #666;
  border-top: 1px solid #666;
  border-bottom: 1px solid #666;
  border-top-left-radius: 100px;
  border-bottom-left-radius: 100px;
  box-sizing: border-box;
  height: 100%;
  width: 46px;
}
</style>
