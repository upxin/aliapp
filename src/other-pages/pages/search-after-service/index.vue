<template>
  <CustomBar
    :shadow="false"
    :border="false"
    class="fixed"
    background-color="#fff"
    ><template #title>{{ title }}</template></CustomBar
  >
  <div
    class="box-border fixed w-full bg-hex-fff px-15px z-1000"
    :style="{ top: `${CalcPt}px` }"
  >
    <SearchBar
      v-model="searchVal"
      :city="city"
      @choose-city="chooseCity"
    ></SearchBar>
  </div>
  <div
    :style="{ paddingTop: `${CalcPt + 50}px` }"
    class="box-border h-full overflow-y-auto text-normal bg-hex-f5f5f5"
  >
    <div class="text-normal h-46px leading-46px px-15px py-6px text-opacity-34">
      当前位置
    </div>
    <div
      class="flex items-center justify-between bg-hex-fff text-14px h-46px px-15px"
    >
      <span>{{ currentPos }}</span>
      <span class="flex items-center" @click="resetLoc">
        <span class="iconfont icon-dingwei text-14px text-info"></span>
        <span class="text-hex-ef8a3c">重新定位</span>
      </span>
    </div>
    <div class="text-normal px-15px h-46px leading-46px text-opacity-34">
      附近门店
    </div>
    <div
      v-for="item in shopList"
      :key="item?.id"
      class="flex items-center justify-between border-0 border-solid h-68px bg-hex-fff px-15px border-b-1px border-b-gray-200"
    >
      <div>
        <div class="mb-10px">{{ item?.name }}</div>
        <section class="flex items-center text-12px">
          <div class="flex items-center mr-20px">
            <span class="text-hex-1990FF mr-3px">{{
              regScoreNum(item?.score)
            }}</span>
            <span
              :class="{
                'text-red-500': item.score < 3.5,
                'text-hex-ef8a3c': item.score >= 3.5,
              }"
              >{{ regScore(item.score * 1) }}</span
            >
          </div>
          <div class="flex items-center opacity-62">
            <span class="iconfont mr-3px icon-daohang text-12px"></span>
            <span>{{ item.km }}km</span>
          </div>
        </section>
      </div>
      <nut-button
        size="small"
        class="border-hex-ef8a3c w-70px text-hex-ef8a3c"
        @click="
          () => {
            chooseShop(item);
          }
        "
        >选择</nut-button
      >
    </div>
    <div class="text-center text-g text-14px my-12px">已全部加载~</div>
  </div>
  <NrzAddr v-model:show="showCityList" :layer="2" @change="onChange"></NrzAddr>
</template>
<script lang="ts">
import { onShareAppMessage, onShareTimeline } from '@/utils/index';
export default {
  inheritAttrs: false,
  onShareAppMessage,
  onShareTimeline,
};
</script>
<script lang="ts" setup>
import { computed, ref, onBeforeMount, watch } from 'vue';
import CustomBar from '@/components/customHeader/index.vue';
import Taro, { useRouter } from '@tarojs/taro';
import SearchBar from '@/components/search-bar/index.vue';
import { CODE, regScore } from '@/utils/index';
import { getShopList, getCityList } from '@/api/index';
import { systemInfo, store, loveCarStore } from '@/stores/index';
import NrzAddr from '@/components/nrz-addr/index.vue';

definePageConfig({ transparentTitle: 'always',titlePenetrate: 'YES',defaultTitle: '', });
onBeforeMount(() => {
  _getShopList();
  initPos();
  _getCityList();
});
let CalcPt = computed(
  () => systemInfo().RightBtnRect.h + systemInfo().RightBtnRect.t + 10
);
const searchVal = ref('');

const shopList = ref<any[]>([]);
const city = ref('');
const currentPos = ref('');
const showCityList = ref(false);
const cityList = ref<any[]>([]);
function chooseCity() {
  showCityList.value = true;
}
const onChange = (e) => {
  city.value = e.text?.[1];
  _getShopList(e.value?.[1]);
};

function _getCityList() {
  // 开通城市列表
  getCityList({}).then((res) => {
    if (res.code !== CODE) return;
    function regList(arr: any[]) {
      let newArr: any[] = [];
      arr.forEach((item) => {
        newArr.push(...item.children);
      });
      return newArr;
    }
    cityList.value = regList(res.data?.list || []);
    console.log(regList(res.data?.list));
  });
}
function initPos() {
  let _city = store().cityInfo.city;
  const _province = store().cityInfo.province;
  const _district = store().cityInfo.district;
  const _township = store().cityInfo.township;
  const _neighborhood = store().cityInfo.neighborhood.name;

  city.value = typeof _city === 'string' ? _city : _province;
  currentPos.value = `${_province}${
    typeof _city === 'string' ? _city : ''
  }${_district}${_township}${_neighborhood}`;
}
function chooseShop(item: any) {
  loveCarStore().setShopInfo({
    shopName: item.name,
    shopId: item.shopId,
  });
  Taro.navigateBack();
}
function regScoreNum(score: number) {
  return score.toFixed(1);
}
async function resetLoc() {
  Taro.showToast({
    title: '定位中...',
    icon: 'none',
  });
  initPos();
}

function _getShopList(key?: string) {
  // 门店列表
  const { latitude, longitude } = store().location;
  const params = {
    lat: latitude,
    lnt: longitude,
    cityId: key,
    type: useRouter().params?.type,
  };
  getShopList(params).then((res) => {
    if (res.code !== CODE) return;
    shopList.value = res.data?.list;
  });
}
const title = ref(useRouter().params?.title || '选择门店');

watch(
  () => searchVal.value,
  (v) => {
    console.log('searchVal', v);
  }
);
</script>
<style>
.nr-border {
  border: 1px solid;
  border-color: rgba(16, 16, 16, 0.34);
  border-radius: 100px;
}
::-webkit-input-placeholder {
  color: rgba(16, 16, 16, 0.24);
}
.input-placeholder {
  color: rgba(16, 16, 16, 0.24);
}
.nut-input.nut-input-border {
  border-bottom: unset;
}
</style>
