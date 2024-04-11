<template>
  <FullLoading :loading="fl">
    <map
      id="chargeMap"
      style="width: 100%; height: 100%"
      :longitude="currentLon"
      :latitude="currentLat"
      :scale="scale"
      :markers="markerList"
      :show-location="true"
      @markertap="handleMarker"
      @callouttap="callouttap"
      @regionchange="regionchange"
    >
    </map>
    <HandleView
      ref="coverView"
      :show-detail="showDetail"
      :current-marker-detail="currentMarkerDetail"
      @filterMarker="filterMarker"
    ></HandleView>
  </FullLoading>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue';

import FullLoading from '@/components/full-loading/index.vue';
import HandleView from './handleView.vue';
import {
  useToast,
  MAP_MARK_ICON,
  CODE,
  debounce,
  jGcustomCount,
  JG,
} from '@/utils/index';
import { getMarkerStation, getChargingInSite } from '@/api/index';
import Taro from '@tarojs/taro';

const iconW = 22;
const iconH = 30;

definePageConfig({
  transparentTitle: 'always',
  titlePenetrate: 'YES',
  defaultTitle: '',
});

let coverView = ref();
const showDetail = ref(false);
const fl = ref(true);
const currentLon = ref(0);
const currentLat = ref(0);
let centerLng;
let centerLat;
const scale = ref(16); // 5为200KM 查看文档对应比例尺
const markerList = ref<any[]>([]);
const currentMarkerDetail = ref<any>({});
const dataList = ref<any[]>([]);
let mapCtx;
function initMapContext() {
  mapCtx = Taro.createMapContext('chargeMap');
  mapCtx.initMarkerCluster({
    enableDefaultStyle: true,
    zoomOnClick: true,
    gridSize: 160,
  });
}
function createMarkers(points) {
  const markers = points?.map((p) => {
    const {
      stationLng: longitude,
      stationLat: latitude,
      id,
      quickNums,
      slowNums,
      quickFreeNums,
      slowFreeNums,
      price,
    } = p;
    let fast = quickNums == 0 ? '' : `\n快(${quickFreeNums}/${quickNums})`;
    let slow = slowNums == 0 ? '' : `\n慢(${slowFreeNums}/${slowNums})`;
    let content = `参考价(${price}元/度)${fast}${slow}`;
    const marker = {
      iconPath: MAP_MARK_ICON,
      width: iconW,
      height: iconH,
      joinCluster: true,
      callout: {
        display: 'ALWAYS', //显示方式，可选值BYCLICK ALWAYS
        content, //文本
        color: '#11264d', //文本颜色
        borderRadius: 3, //边框圆角
        borderWidth: 1, //边框宽度
        borderColor: '#11264d', //边框颜色
        bgColor: '#ffffff', //背景色
        padding: 5, //文本边缘留白
        textAlign: 'center', //文本对齐方式。有效值: left, right, center
      },
      latitude,
      longitude,
      id: Number(id),
    };
    return marker;
  });
  markerList.value = markers;
}
let regionchange = debounce((e) => {
  if (e.type === 'end') {
    const { latitude, longitude } = e.detail.centerLocation;
    centerLat = latitude;
    centerLng = longitude;
    _getMarkerStation(latitude, longitude);
  }
}, 500);
function callouttap(res) {
  updateCard(res);
}
function handleMarker(res) {
  updateCard(res);
}
function updateCard(res) {
  const temp = dataList.value.find((item) => {
    return item.id === res.markerId;
  });
  currentMarkerDetail.value = temp;
  showDetail.value = true;
  setTimeout(() => {
    coverView.value.runAnimate();
  }, 300);
}
function filterMarker({ tagIds, type, km }) {
  getMarkerStation({
    latitude: centerLat,
    longitude: centerLng,
    tagIds,
    type,
    km,
  }).then((res) => {
    Taro.hideLoading();
    if (res?.code !== CODE) return useToast(res?.msg);
    dataList.value = res.data?.list;
    createMarkers(res.data?.list);
  });
}

async function _getMarkerStation(lat?, lon?) {
  console.log(lat, lon);
  getMarkerStation({
    latitude: lat,
    longitude: lon,
  }).then((res) => {
    if (res?.code !== CODE) return useToast(res?.msg);
    dataList.value = res.data?.list;
    createMarkers(res.data?.list);
  });
}

onMounted(() => {
  jGcustomCount(JG.CHARGE_003);
  setTimeout(() => {
    initMapContext();
  }, 50);
  setTimeout(() => {
    fl.value = false;
    mapCtx.moveToLocation({});
  }, 500);
  getChargingInSite();
});
</script>

<style lang="scss">
.triangle {
  width: 0;
  height: 0;
  border: 8px solid transparent;
  border-top: 8px solid #fff;
  transform: translateY(-2px);
}
</style>
