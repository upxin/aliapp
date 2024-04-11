<template>
  <CustomBar class="fixed" :z="100" background-color="#fff">
    <template #title> 门店地图 </template>
  </CustomBar>
  <map
    id="map"
    style="width: 100%; height: 100%"
    longitude="113.324520"
    latitude="23.099994"
    scale="14"
    :markers="markers"
    :polyline="polyline"
    :show-location="true"
    @regionchange="regionchange"
    @markertap="markertap"
  />
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

definePageConfig({
  transparentTitle: 'auto',
  titlePenetrate: 'YES',
  defaultTitle: '',
});

const markers = ref([
  {
    iconPath:
      'https://avatars2.githubusercontent.com/u/1782542?s=460&u=d20514a52100ed1f82282bcfca6f49052793c889&v=4',
    id: 0,
    latitude: 23.099994,
    longitude: 113.32452,
    width: 50,
    height: 50,
  },
]);
const polyline = ref([
  {
    points: [
      {
        longitude: 113.3245211,
        latitude: 23.10229,
      },
      {
        longitude: 113.32452,
        latitude: 23.21229,
      },
    ],
    color: '#FF0000DD',
    width: 2,
    dottedLine: true,
  },
]);
function regionchange(e) {
  console.log(e.type);
}
function markertap(e) {
  console.log('markertap:', e.detail.markerId);
}
</script>
