<template>
  <CustomBar background-color="#fff">
    <template #title>路径规划</template>
  </CustomBar>
  <map
    id="map"
    style="width: 100%; height: 100%"
    :longitude="fromLon"
    :latitude="fromLat"
    :scale="scale"
    :polyline="polyline"
    :show-location="false"
  >
  </map>
  <div class="box-border fixed w-full bottom-40px px-20px">
    <nut-button
      class="w-full h-50px rounded-4px"
      color="#11264d"
      @click="openLocation"
    >
      导航
    </nut-button>
  </div>
</template>
<script lang="ts">
import { onShareAppMessage, onShareTimeline } from '@/utils/index';
export default {
  onShareAppMessage,
  onShareTimeline,
};
</script>
<script lang="ts" setup>
import { ref, onBeforeMount } from 'vue';
import Taro, { useRouter } from '@tarojs/taro';
import { geoAddrToLat } from '@/api/index';
import { AMap } from '@/utils/amap';
import CustomBar from '@/components/customHeader/index.vue';

definePageConfig({
 transparentTitle: 'auto',
  titlePenetrate: 'YES',
  defaultTitle: '',});

const polyline = ref<any[]>([]);
const fromLon = ref<number>();
const fromLat = ref<number>();

const toLat = ref<number>();
const toLon = ref<number>();

const scale = ref(16); // 5为200KM 查看文档对应比例尺
const { params } = useRouter();

async function openLocation() {
  Taro.openLocation({
    latitude,
    longitude,
    scale: 18,
  });
}
async function initPolyline() {
  AMap.getDrivingRoute({
    origin: `${fromLon.value},${fromLat.value}`,
    destination: `${toLon.value},${toLat.value}`,
    success: function (data) {
      var points = [];
      if (data.paths && data.paths[0] && data.paths[0].steps) {
        var steps = data.paths[0].steps;
        for (var i = 0; i < steps.length; i++) {
          var poLen = steps[i].polyline.split(';');
          for (var j = 0; j < poLen.length; j++) {
            points.push({
              longitude: parseFloat(poLen[j].split(',')[0]),
              latitude: parseFloat(poLen[j].split(',')[1]),
            });
          }
        }
      }

      polyline.value = [
        {
          points: points,
          color: '#0091ff',
          width: 6,
        },
      ];
    },
  });
}

async function initLocation() {
  const { geocodes: toLocation } = await geoAddrToLat(params.toSite);
  const { geocodes: fromLocation } = await geoAddrToLat(params.fromSite);

  let fromLocationList = fromLocation?.[0]?.location?.split(',');
  fromLon.value = fromLocationList?.[0];
  fromLat.value = fromLocationList?.[1];

  let toLocationList = toLocation?.[0]?.location?.split(',');
  toLon.value = toLocationList?.[0];
  toLat.value = toLocationList?.[1];
}

onBeforeMount(async () => {
  initLocation();
  setTimeout(() => {
    initPolyline();
  }, 500);
});
// bottom
</script>
