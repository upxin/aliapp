<template>
  <CustomBar :border="false">
    <template #title>{{ Params?.title }}</template>
  </CustomBar>
  <FullLoading :loading="fl">
    <map
      id="map"
      style="width: 100%; height: 100%"
      :longitude="currentCenterLon"
      :latitude="currentCenterLat"
      :scale="scale"
      :markers="markers"
      :show-location="true"
      @markertap="markertap"
    >
    </map>
    <section
      class="absolute left-0 flex justify-center w-full top-100px z-1000"
    ></section>
    <section
      class="absolute flex items-center justify-center overflow-hidden font-bold text-center text-g rounded-lg bg-hex-fff right-20px z-2000 bottom-40px w-40px h-40px"
      @click="moveToCurrentPosi"
    >
      <span class="iconfont icon-dingwei text-20px text-second"></span>
    </section>
    <section
      class="absolute flex items-center justify-center overflow-hidden font-bold text-center text-g rounded-lg bg-hex-fff right-20px z-2000 bottom-100px w-40px h-40px"
      @click="
        () => {
          openNavi();
        }
      "
    >
      <span class="iconfont icon-daohang text-size-15px text-hex-666"></span>
    </section>
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
import { ref } from 'vue';
import CustomBar from '@/components/customHeader/index.vue';
import Taro, { useReady, useRouter } from '@tarojs/taro';
import { WMap, MAP_MARK_ICON } from '@/utils/index';
import FullLoading from '@/components/full-loading/index.vue';
import { geoAddrToLat } from '@/api/index';

const Params = useRouter().params;
definePageConfig({
  transparentTitle: 'auto',
  titlePenetrate: 'YES',
  defaultTitle: '',
});
interface MarkersInfo {
  name: string;
  business?: { rating: ''; opentime_week: '' };
  photos?: [];
  location: string;
  address: string;
  id: number;
  [propName: string]: any;
}
let fl = ref(true);
let uid = 0;
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
let addr = Params.addr;

const markers = ref<any[]>([]);
function _geoAddrToLat(addr) {
  geoAddrToLat(addr)
    .then((res) => {
      fl.value = false;
      if (res.status == 1) {
        let [longitude, latitude] = res?.geocodes?.[0]?.location?.split(',');
        currentCenterLat.value = latitude;
        currentCenterLon.value = longitude;
        firstLat = latitude;
        firstLon = longitude;
        markers.value = [
          {
            iconPath: MAP_MARK_ICON,
            latitude: latitude,
            longitude: longitude,
            id: uid + 1,
            width: 20,
            height: 28,
            callout: {
              // 点击显示
              content: Params?.addr, //文本
              color: '#11264d', //文本颜色
              borderRadius: 3, //边框圆角
              borderWidth: 1, //边框宽度
              borderColor: '#11264d', //边框颜色
              bgColor: '#ffffff', //背景色
              padding: 5, //文本边缘留白
              textAlign: 'center', //文本对齐方式。有效值: left, right, center
            },
          },
        ];
      }
    })
    .catch(() => {
      fl.value = false;
    });
}
function moveToCurrentPosi() {
  // 回到当前位置, 有个bug--- 会触发一次regionchange 导致moveLat是上次手动拖动的坐标
  mapCtx.moveToLocation({
    latitude: +firstLat,
    longitude: +firstLon,
  });
}
function openNavi() {
  Taro.openLocation({
    //​使用微信内置地图查看位置。
    latitude: Number(firstLat), //要去的纬度-地址
    longitude: Number(firstLon), //要去的经度-地址
    name: Params?.title,
    address: addr,
    fail: (err) => {
      Taro.showToast({
        title: JSON.stringify(err),
        duration: 3000,
      });
    },
  });
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
  WMap.calculateDistance({
    mode: 'straight',
    from: `${firstLat},${firstLon}`, // 从定位计算距离
    to: `${latitude},${longitude}`,
    success: function (_, data) {
      distance.value = data.distanceResult[0];
    },
  });
  markCard.value = clickedMark[0];
}
useReady(async () => {
  _geoAddrToLat(addr);
});
</script>
<style>
.nut-rate-item {
  margin-right: 4px !important;
  margin-top: -11px;
}
</style>
