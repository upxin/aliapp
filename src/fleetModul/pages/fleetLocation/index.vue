<template>
  <CustomHeader background-color="#fff" :pad-x="80">
    <template #title>
      <div
        v-if="isOwner"
        class="flex items-center w-full justify-center"
        @click="menuVisible = !menuVisible"
      >
        <CarInfo
          :vehicle-text="currentCarPlateNum"
          :vehicle-type="carData?.vehicleType"
        ></CarInfo>
        <span
          class="iconfont icon-sanjiao text-18px"
          :class="{ trans: menuVisible, intrans: !menuVisible }"
        ></span>
      </div>
      <CarInfo
        v-else
        :vehicle-text="currentCarPlateNum"
        :vehicle-type="carData?.vehicleType"
      ></CarInfo>
    </template>
  </CustomHeader>
  <FL :loading="fl">
    <map
      id="map"
      class="fixed z-1"
      style="width: 100%; height: 100%"
      :longitude="carLon"
      :latitude="carLat"
      scale="12"
      :show-location="true"
      :markers="markers"
    >
    </map>
    <div
      class="box-border absolute flex justify-center w-full px-20px"
      :style="{ top: `${headerHeight + 10}px` }"
    >
      <div class="rounded bg-fff py-8px px-10px z-99 text-12px">
        <span class="leading-normal opacity-50"
          >最后更新时间：{{ state.time || '--' }}</span
        >
        <span class="leading-normal opacity-50">
          {{ state.addr || '暂无位置信息' }}
        </span>
      </div>
    </div>

    <footer
      class="fixed flex items-center justify-around w-full nrz-thin bottom-60px z-997 text-12px"
    >
      <div
        class="flex flex-col items-center justify-center rounded-full w-45px h-45px bg-fff nr-shadow-full"
        @click="callMan"
      >
        <span class="mb-4px">联系</span>
        <span>{{ isOwner ? '车主' : '司机' }}</span>
      </div>
      <div
        class="flex items-center justify-center rounded-full bg-fff w-85px h-36px nr-shadow-full"
        @click="navitoTrail"
      >
        历史轨迹
      </div>
      <div
        class="flex items-center justify-center rounded-full bg-fff w-85px h-36px nr-shadow-full"
      >
        <span
          class="rounded-full w-10px h-10px mr-6px"
          :class="{
            'bg-red-700': !state.vehStatus,
            'bg-hex-0ac85c': state.vehStatus,
          }"
        ></span>
        <span>{{ state.vehStatusText }}</span>
      </div>
      <view
        class="flex items-center justify-center rounded-full bg-fff w-85px h-36px nr-shadow-full"
        @tap="tapToCarData"
        >用车数据</view
      >
      <div
        class="flex flex-col items-center justify-center rounded-full w-45px h-45px bg-fff nr-shadow-full"
        @click="refresh"
      >
        <span class="mb-4px">刷新</span>
        <span>位置</span>
      </div>
    </footer>
  </FL>
  <DropMenu
    v-model:show="menuVisible"
    v-model:currentVal="currentCarPlateNum"
    v-model:full-list="fullCarList"
    v-model:car-data="carData"
    v-model:vin-code="vinLicense"
  ></DropMenu>
</template>

<script lang="ts">
import { onShareAppMessage, onShareTimeline } from '@/utils/index';
import { useRouter } from '@tarojs/taro';
export default {
  onShareAppMessage,
  onShareTimeline,
};
</script>

<script lang="ts" setup>
import { ref, onBeforeMount, computed, watch, reactive, onMounted } from 'vue';
import { useHeaderHeight } from '@/hooks';
import DropMenu from '../../comp/dropMenu/index.vue';
import FL from '@/components/full-loading/index.vue';
import {
  JG,
  jGcustomCount,
  makePhoneCall,
  MAP_CAR_ICON,
  useToast,
} from '@/utils';
import CustomHeader from '@/components/customHeader/index.vue';
import { getCarPosition, getCityInfo } from '@/api/index';
import { Routes, nrNavigateTo } from '@/utils';
import CarInfo from '../../comp/CarInfo.vue';
import { loveCarStore } from '@/stores';
import { vr } from './vr';
import Taro from '@tarojs/taro';

definePageConfig({
  transparentTitle: 'always',
  titlePenetrate: 'YES',
  defaultTitle: '',
});

const mapCtx = Taro.createMapContext('map');

let params = useRouter()?.params;
let { headerHeight } = useHeaderHeight();
let menuVisible = ref(false);
let fl = ref(true);
let currentCarPlateNum = ref(params?.licensePlateNum);
let carData = ref();
let vinLicense = ref(params?.vinLicense);
let vehicleType = ref(params?.vehicleType);
let carLat = ref<number>(31.211499);
let carLon = ref<number>(121.310145);
let fullCarList = ref<any[]>([]);
let state = reactive({
  addr: '',
  time: '',
  vehStatusText: '',
  vehStatus: 0,
  ownerMobile: '',
  driverMobile: '',
});
let isOwner = computed(() => {
  return fullCarList.value?.some(
    (item) => item?.licensePlateNumber === currentCarPlateNum.value
  );
});

let markers = ref<any[]>([]);

function navitoTrail() {
  nrNavigateTo(Routes.fleetTrail, {
    vinLicense: vinLicense.value,
    licensePlateNumber: currentCarPlateNum.value,
    licensePlateNum: currentCarPlateNum.value,
    vehicleType: vehicleType.value,
    vinCode: vinLicense.value,
  });
}
function tapToCarData() {
  nrNavigateTo(Routes.carData, {
    vinLicense: vinLicense.value,
    vinCode: vinLicense.value,
    licensePlateNumber: currentCarPlateNum.value,
    vehicleType: vehicleType.value,
  });
}
let callMan = () => {
  let val;
  if (isOwner.value) {
    val = state?.ownerMobile;
  } else {
    val = state?.driverMobile;
  }
  makePhoneCall(val);
};

function setData(res) {
  let {
    longitude,
    latitude,
    time,
    vehStatus,
    vehStatusText,
    driverMobile,
    ownerMobile,
  } = res?.data;
  state.time = time;
  state.vehStatusText = vehStatusText;
  state.ownerMobile = ownerMobile;
  state.driverMobile = driverMobile;
  state.vehStatus = vehStatus;
  carLat.value = latitude;
  carLon.value = longitude;

  mapCtx.moveToLocation({
    latitude,
    longitude,
  });
  markers.value = [
    {
      iconPath: MAP_CAR_ICON,
      latitude,
      longitude,
      id: 1,
      width: 25,
      height: 60,
    },
  ];
  getCityInfo({
    longitude,
    latitude,
  }).then((res) => {
    if (res.status != '1') return;
    state.addr =
      typeof res.regeocode.formatted_address === 'string'
        ? res.regeocode.formatted_address
        : '';
  });
}
let _getCarPosition = (code) => {
  Taro.showLoading({
    title: '',
  });
  getCarPosition({ vinLicense: code }).then((res) => {
    fl.value = false;
    Taro.hideLoading();
    if (res?.code !== 200) return useToast(res?.msg);
    setData(res);
  });
};

let refresh = () => {
  if (loveCarStore()?.isVr) {
    Taro.showLoading({ title: '' });
    setTimeout(() => {
      Taro.hideLoading();
    }, 1000);
    return;
  }
  _getCarPosition(params?.vinLicense || currentCarPlateNum.value);
};

watch(
  () => vinLicense.value,
  (v) => {
    if (!v) return;
    if (loveCarStore()?.isVr) return;
    _getCarPosition(v);
  },
  {
    immediate: true,
    deep: true,
  }
);

onBeforeMount(() => {
  jGcustomCount(JG.CV_009);
  let isVr = loveCarStore()?.isVr;
  if (isVr) {
    setData(vr);
    currentCarPlateNum.value = params?.licensePlateNum || '';
  }
});
onMounted(() => {
  _getCarPosition(params?.vinLicense);
});
watch(
  () => fullCarList.value,
  (v) => {
    if (!v?.length) return;
    currentCarPlateNum.value = v?.[0]?.licensePlateNumber;
  },
  {
    immediate: true,
    deep: true,
  }
);
</script>
<style></style>
