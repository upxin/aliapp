<template>
  <CustomBar :border="false">
    <template #title>{{ title }}</template>
  </CustomBar>
  <map
    id="map"
    style="width: 100%; height: 100%"
    :longitude="currentCenterLon"
    :latitude="currentCenterLat"
    :scale="scale"
    :markers="markers"
    :polyline="polyline"
    :show-location="true"
    @tap="tapMap"
    @markertap="markertap"
  >
  </map>
  <section
    class="absolute left-0 flex justify-center w-full top-100px z-1000"
  ></section>
  <section
    class="absolute flex items-center justify-center overflow-hidden font-bold text-center text-g rounded-lg bg-hex-fff right-20px z-2000 bottom-340px w-40px h-40px"
    @click="moveToCurrentPosi"
  >
    <span class="iconfont icon-dingwei text-20px text-normal"></span>
  </section>
  <section
    v-if="markCard?.id"
    class="box-border absolute left-0 w-full z-1000 bottom-20px px-16px"
    @click="
      () => {
        openNavi();
      }
    "
  >
    <view
      class="box-border flex w-full m-auto shadow-md text-14px text-primary p-16px pb-6px rounded-xl shadow-gray-400 bg-hex-fff h-130px"
    >
      <view class="box-border flex w-full">
        <NrImg
          :url="markCard?.photos?.[0]?.url || ''"
          class="rounded-lg min-w-104px h-84px mr-10px"
        ></NrImg>
        <view class="box-border flex-1 overflow-auto">
          <view class="text-normal mb-10px overflow-ellipsis">
            {{ markCard?.name }}
          </view>
          <view class="flex items-center text-gray-600 text-12px mb-8px">
            <view class="flex items-center">
              <view v-if="!markCard.business.rating" class="flex items-center"
                ><nut-rate
                  :value="0"
                  active-color="#EF8A3C"
                  icon-size="10"
                  readonly
                />
                <view>暂无评价</view>
              </view>
              <nut-rate
                v-else
                v-model="markCard.business.rating"
                active-color="#EF8A3C"
                icon-size="10"
                readonly
              />
              <view
                v-if="markCard.business.rating"
                class="flex text-blue-500 ml-4px"
              >
                <view class="font-bold mr-2px">{{
                  markCard.business.rating
                }}</view>
                <view>分</view>
              </view>
            </view>
          </view>
          <view class="text-g leading-sm overflow-ellipsis mb-6px">
            营业时间：{{ markCard?.business?.opentime_week || '--' }}
          </view>
          <view class="text-g text-12px">
            {{ regDistance(distance) }}
          </view>
        </view>
      </view>
    </view>
  </section>
</template>
<script lang="ts">
import { onShareAppMessage, onShareTimeline } from '@/utils/index';
export default {
  onShareAppMessage,
  onShareTimeline,
};
</script>
<script lang="ts" setup>
import { nextTick, ref } from 'vue';
import CustomBar from '@/components/customHeader/index.vue';
import Taro, { useReady, useRouter } from '@tarojs/taro';
import { get, formatThousands, MAP_MARK_ICON } from '@/utils/index';
import { systemInfo, store } from '@/stores/index';
import NrImg from '@/components/img/img.vue';
const Params = useRouter().params;
const Store = store();
definePageConfig({
  transparentTitle: 'auto',
  titlePenetrate: 'YES',
  defaultTitle: '',
});
interface MarkersInfo {
  name: string;
  business?: { rating: ''; opentime_week: '' };
  photos?: any;
  location: string;
  address: string;
  id: number;
  [propName: string]: any;
}
const mapCtx = Taro.createMapContext('map');
const currentCenterLat = ref(); // 当前屏幕中心所在经纬度
const currentCenterLon = ref();
let firstLat = 0; // 本身最初的定位
let firstLon = 0;
const scale = ref(15);
const markCard = ref<MarkersInfo>({
  name: '',
  location: '',
  address: '',
  id: 0,
});

const distance = ref('');
const keywords = decodeURIComponent(Params.keyword || '');
const title = decodeURIComponent(Params.title || '');
let addr = Params.addr;
let baseIdNumber = 0;

const markers = ref<MarkersInfo[]>([]);
const polyline = ref<any>([
  {
    points: [
      {
        latitude: 31.22399873739076,
        longitude: 121.47398134848152,
      },
      {
        latitude: 31.222899233119982,
        longitude: 121.47999943082812,
      },
      {
        latitude: 31.22774574053832,
        longitude: 121.48762341189718,
      },
    ],
    color: '#FA6400',
    width: 4,
    dottedLine: false,
  },
]);
function openNavi() {
  setTimeout(() => {
    Taro.openLocation({
      //​使用微信内置地图查看位置。
      latitude: Number(firstLat), //要去的纬度-地址
      longitude: Number(firstLon), //要去的经度-地址
      name: markCard.value?.name,
      address: markCard.value?.addr,
      fail: (err) => {
        Taro.showToast({
          title: JSON.stringify(err),
          duration: 3000,
        });
      },
    });
  }, 20);
}
function searchAroundPoi({ location, keywords }) {
  get({
    url: 'https://restapi.amap.com/v5/place/around',
    params: {
      location,
      key: systemInfo().webServerApiKey,
      keywords,
      page_size: 50,
      show_fields: 'photos,business,children,navi', // 必须用逗号隔开额外参数至少两个 传一个不返回 有bug
    },
  }).then((res: any) => {
    markCanteen(res.pois);
  });
}
function moveToCurrentPosi() {
  // 回到当前位置, 有个bug--- 会触发一次regionchange 导致moveLat是上次手动拖动的坐标
  mapCtx.moveToLocation({
    latitude: +firstLat,
    longitude: +firstLon,
  });
}

function fixedScale(val) {
  // 修改地图缩放比例
  let newVal = scale.value + val;
  if (newVal > 20) return;
  if (newVal < 3) return;
  mapCtx.getCenterLocation({
    success: function (res) {
      const { latitude, longitude } = res;
      // （重要）改变scale时先修改中心点为当前拖动后的中心点  防止拖动地图后缩放地图会移动到之前的中心点
      console.log(latitude, longitude);
      currentCenterLat.value = latitude;
      currentCenterLon.value = longitude;
      scale.value = scale.value + val;
    },
  });
}
// 打点餐饮 type:1
function regDistance(d) {
  if (d < 1000) {
    return `${d}m`;
  } else {
    return (+formatThousands(d).split(',').join('.')).toFixed(1) + '公里';
  }
}
function markCanteen(data: MarkersInfo[]) {
  let ret = data.map((item, i) => {
    baseIdNumber++;
    const [longitude, latitude] = item.location.split(',');
    return {
      ...item,
      latitude,
      longitude,
      iconPath: MAP_MARK_ICON,
      width: 20,
      height: 28,
      id: i + baseIdNumber,
      callout: {
        // 点击显示
        content: item.name, //文本
        color: '#11264d', //文本颜色
        borderRadius: 3, //边框圆角
        borderWidth: 1, //边框宽度
        borderColor: '#11264d', //边框颜色
        bgColor: '#ffffff', //背景色
        padding: 5, //文本边缘留白
        textAlign: 'center', //文本对齐方式。有效值: left, right, center
      },
    };
  });
  markers.value = ret;
}
function markertap(e) {
  // 点击打点位置 也会导致回到原点同样需要做移动中心处理
  mapCtx.getCenterLocation({
    success: function (res) {
      const { latitude, longitude } = res;
      // （重要）改变scale时先修改中心点为当前拖动后的中心点  防止拖动地图后缩放地图会移动到之前的中心点
      console.log(latitude, longitude);
      currentCenterLat.value = latitude;
      currentCenterLon.value = longitude;
    },
  });
  let clickedMark = markers.value.filter((item) => {
    return item?.id === e.detail.markerId;
  });
  const { latitude, longitude } = clickedMark[0];
  mapCtx.calculateDistance({
    points: [
      {
        latitude: firstLat,
        longitude: firstLon,
      },
      {
        latitude: latitude,
        longitude: longitude,
      },
    ],
    success: function (ret) {
      distance.value = ret.distance;
    },
  });
  markCard.value = clickedMark[0];
}
function tapMap(e) {
  console.log(e.detail);
}
useReady(async () => {
  const { latitude, longitude } = Store.location;
  currentCenterLat.value = latitude;
  currentCenterLon.value = longitude;
  firstLat = Number(latitude);
  firstLon = Number(longitude);
  if (keywords) {
    searchAroundPoi({
      location: `${latitude},${longitude}`,
      keywords: keywords,
    });
  }
  // drawPolyline();
});
</script>
<style>
.nut-rate-item {
  margin-right: 4px !important;
  margin-top: -11px;
}
</style>
