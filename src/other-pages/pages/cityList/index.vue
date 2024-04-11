<template>
  <Full :loading="loading">
    <van-index-bar :index-list="indexList" highlight-color="#f21c33">
      <view>
        <div
          class="text-12px text-hex-000 h-30px leading-30px text-opacity-30 px-18px bg-fff"
        >
          {{ '当前城市' }}
        </div>
        <div class="flex justify-between m-auto bg-fff px-18px pb-16px">
          <span
            class="box-border text-center border-solid rounded text-12px leading-30px w-72px h-30px border-1px border-hex-ddd"
            @click="handleClickItem(store()?.cityInfo, true)"
          >
            {{ currentCityName ? currentCityName : '定位失败' }}
          </span>
          <span class="flex items-center" @click="resetLoc">
            <span class="iconfont icon-dingwei text-18px text-info"></span>
            <span class="text-14px ml-2px text-info">重新定位</span>
          </span>
        </div>
      </view>

      <view>
        <div
          class="text-12px h-30px leading-30px text-hex-000 text-opacity-30 px-18px bg-fff"
        >
          {{ '热门城市' }}
        </div>
        <div class="flex flex-wrap m-auto px-18px bg-fff">
          <div
            v-for="(hot, hotIndex) in hotData"
            :key="hot.name"
            class="box-border text-center border-solid rounded text-12px overflow-ellipsis mb-15px leading-30px w-72px h-30px border-1px border-hex-ddd"
            :class="{
              'mr-16px': (hotIndex + 1) % 4 !== 0,
              'mr-0px': (hotIndex + 1) % 4 === 0,
            }"
            @click="handleClickItem(hot)"
          >
            {{ hot.name }}
          </div>
        </div>
      </view>

      <view v-for="p in cityData" :key="p.title">
        <van-index-anchor :index="p.title" />
        <van-cell
          v-for="child in p.list"
          :key="child.adcode"
          :title="child.name"
          @click="handleClickItem(child)"
        />
      </view>
    </van-index-bar>
  </Full>
</template>
<script lang="ts" setup>
import { cityData, hotData } from './cityData';
import { computed, onBeforeMount, ref, onMounted } from 'vue';
import Taro from '@tarojs/taro';
import { store } from '@/stores/index';
import {
  useLocation,
  saveCityInfo,
  useToast,
  CITY_INFO_KEY,
} from '@/utils/index';
import { useNavigateBackSetData } from '@/hooks/index';
import Full from '@/components/full-loading/index.vue';
definePageConfig({
  navigationBarTitleText: '选择城市',
});
let loading = ref(true);
let indexList = ref<any[]>();
let currentCityName = computed({
  get: () =>
    typeof store()?.cityInfo?.city === 'string'
      ? store()?.cityInfo?.city
      : store()?.cityInfo?.province,
  set: (val) => {
    store().setCityInfo(val);
  },
});

let posLock = false;
let initPos = async () => {
  useLocation()
    .then(({ latitude, longitude }) => {
      store().setLocation({ latitude, longitude });
      saveCityInfo({ latitude, longitude });
      Taro.hideToast();
      posLock = true;
    })
    .catch((err) => {
      useToast(err.errMsg);
    });
};
async function resetLoc() {
  Taro.showToast({
    title: '定位中...',
    icon: 'none',
  });
  if (posLock) {
    setTimeout(() => {
      Taro.hideToast();
    }, 300);
    return;
  }
  initPos();
}
function handleClickItem(item, pos?) {
  if (pos) {
    useNavigateBackSetData({
      [CITY_INFO_KEY]: {
        name: typeof item.city === 'string' ? item.city : item.province,
        center: `${item?.longitude},${item?.latitude}`,
        adcode: item?.adcode,
        citycode: item?.citycode,
      },
    });
    return;
  }
  if (typeof item !== 'object') return;
  useNavigateBackSetData({ [CITY_INFO_KEY]: item });
}
onBeforeMount(() => {
  let titles = cityData.map((item) => item.title);
  indexList.value = [...titles];
});
onMounted(() => {
  setTimeout(() => {
    loading.value = false;
  }, 1000);
});
</script>
