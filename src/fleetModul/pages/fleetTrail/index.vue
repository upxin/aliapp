<template>
  <CustomHeader background-color="#fff" :pad-x="80">
    <template #title>
      <div class="flex items-center" @click="menuVisible = !menuVisible">
        <CarInfo
          :vehicle-text="currentCarPlateNum"
          :vehicle-type="carData?.vehicleType"
        ></CarInfo>
        <span
          class="iconfont icon-sanjiao text-18px"
          :class="{ trans: menuVisible, intrans: !menuVisible }"
        ></span>
      </div>
    </template>
  </CustomHeader>
  <Fl :loading="loading">
    <map
      id="map"
      class="fixed z-1"
      style="width: 100%; height: 100%"
      :longitude="carLon"
      :latitude="carLat"
      scale="14"
      :show-location="true"
      :markers="markers"
      :polyline="polyline"
    >
    </map>

    <div
      class="box-border fixed bottom-0 w-full x-center z-99 bg-fff px-10px py-20px"
    >
      <section class="flex items-center text-10px text-primary">
        <div
          class="flex flex-col items-center flex-1 text-center"
          @click="chooseStartTime"
        >
          <div>{{ dayjs(startTime).format(YMDHMS_EN) }}</div>
          <div>（点击选开始）</div>
        </div>
        <span
          v-if="!isPlay"
          style="color: #15db65"
          class="icon-zantinganniu iconfont text-30px mx-8px"
          @click="runCar"
        ></span>
        <span
          v-else
          style="color: #15db65"
          class="icon-ai06 iconfont text-30px mx-8px"
          @click="stopCar"
        ></span>
        <div
          class="flex flex-col items-center flex-1 text-center"
          @click="chooseEndTime"
        >
          <div>{{ dayjs(endTime).format(YMDHMS_EN) }}</div>
          <div>（点击选结束）</div>
        </div>
      </section>

      <section class="flex mt-10px">
        <div
          v-for="(item, i) in steps"
          :key="item.val"
          class="box-border flex flex-col items-center justify-center flex-1 py-10px"
        >
          <div class="relative flex items-center justify-center w-full h-18px">
            <div
              :class="{ invisible: i === 0 }"
              class="flex-1 h-3px"
              style="background-color: #ddd"
            ></div>
            <div
              class="box-border rounded-full"
              :class="{
                'w-18px': item.choosed,
                'h-18px': item.choosed,
                'bg-green-400': item.choosed,
                'w-14px': !item.choosed,
                'h-14px': !item.choosed,
                'bg-fff': !item.choosed,
                'border-2px': !item.choosed,
                'border-solid': !item.choosed,
                'border-second': !item.choosed,
              }"
              @click="
                () => {
                  changeRate(item);
                }
              "
            ></div>
            <div
              :class="{ invisible: i === steps.length - 1 }"
              class="flex-1 h-3px"
              style="background-color: #ddd"
            ></div>
          </div>
          <div
            class="opacity-60 text-12px py-8px px-4px"
            @click="
              () => {
                changeRate(item);
              }
            "
          >
            {{ item?.text }}
          </div>
        </div>
      </section>
    </div>
  </Fl>
  <van-popup
    :show="showStart"
    position="bottom"
    :round="true"
    :z-index="9999"
    @close="showStart = false"
  >
    <van-datetime-picker
      type="datetime"
      title="开始时间选择"
      visible-item-count="5"
      :value="startTime"
      :min-date="minDate"
      :max-date="maxDate"
      :show-toolbar="true"
      @cancel="showStart = false"
      @confirm="confirmStartTime"
    />
  </van-popup>
  <van-popup
    :z-index="9999"
    :show="showEnd"
    position="bottom"
    :round="true"
    @close="showEnd = false"
  >
    <van-datetime-picker
      :show-toolbar="true"
      type="datetime"
      title="结束时间选择"
      visible-item-count="5"
      :value="endTime"
      :min-date="minDate"
      :max-date="maxDate"
      @cancel="showEnd = false"
      @confirm="confirmEndTime"
    />
  </van-popup>
  <DropMenu
    v-model:show="menuVisible"
    v-model:currentVal="currentCarPlateNum"
    v-model:full-list="fullCarList"
    v-model:vin-code="vinCode"
  ></DropMenu>
</template>

<script lang="ts">
import { onShareAppMessage, onShareTimeline } from '@/utils/index';
export default {
  onShareAppMessage,
  onShareTimeline,
};
</script>

<script lang="ts" setup>
import { ref, watch, onMounted } from 'vue';
import { hisTravel } from '@/api/index';
import { useRouter } from '@tarojs/taro';
import { JG, jGcustomCount, useToast, YMDHMS_EN } from '@/utils';
import CustomHeader from '@/components/customHeader/index.vue';
import DropMenu from '../../comp/dropMenu/index.vue';
import CarInfo from '../../comp/CarInfo.vue';
import Fl from '@/components/full-loading/index.vue';
import dayjs from 'dayjs';

let POS = 'https://nrz-app.su.bcebos.com/resources/pos.png';
let START = 'https://nrz-app.su.bcebos.com/resources/start.png';
let END = 'https://nrz-app.su.bcebos.com/resources/end.png';
let PARK = 'https://nrz-app.su.bcebos.com/resources/park.png';

definePageConfig({
 transparentTitle: 'always',
  titlePenetrate: 'YES',
  defaultTitle: '',});

let showStart = ref(false);
let showEnd = ref(false);
let loading = ref(true);
let params = useRouter()?.params;
let carData = ref();
let menuVisible = ref(false);
let currentCarPlateNum = ref(params?.licensePlateNumber);
let vinCode = ref(params?.vinCode);
let fullCarList = ref<any[]>([]);
let isPlay = ref(false);
let pause = false;
let baseMs = ref(3000);
let rate = ref(1);
let minDate = dayjs(new Date()).subtract(1, 'year').valueOf();
let maxDate = dayjs(new Date()).valueOf();
let carLat = ref<number>(40.040129);
let carLon = ref<number>(116.274968);
let steps = ref([
  {
    text: '0.5倍速',
    val: 0.5,
    choosed: false,
  },
  {
    text: '正常',
    val: 1,
    choosed: true,
  },
  {
    text: '2倍速',
    val: 2,
    choosed: false,
  },
  {
    text: '4倍速',
    val: 4,
    choosed: false,
  },
  {
    text: '8倍速',
    val: 8,
    choosed: false,
  },
  {
    text: '16倍速',
    val: 16,
    choosed: false,
  },
]);
let markers = ref<any[]>();
let startTime = ref(dayjs().startOf('date'));
let endTime = ref(dayjs());
let polyline = ref<any[]>([]);
let hasData = ref(false);
let _hisTrail = () => {
  let diff = dayjs(endTime.value).diff(startTime.value, 'hours');
  if (diff < 0) {
    return useToast('结束时间必须大于开始时间');
  }
  if (diff > 24) {
    return useToast('起止时间最长为24小时');
  }
  hisTravel({
    startTime: dayjs(startTime.value).format(YMDHMS_EN),
    endTime: dayjs(endTime.value).format(YMDHMS_EN),
    vinLicense: currentCarPlateNum.value,
  }).then((res) => {
    if (res?.code !== 200) return useToast(res?.msg);
    if (!res?.data?.list?.length) return useToast('暂无轨迹数据');
    hasData.value = res?.data?.list?.length;
    let { latitude, longitude } = res?.data?.list?.[0] || {};

    carLat.value = latitude;
    carLon.value = longitude;
    let endPoint = res?.data?.list?.[res?.data?.list?.length - 1];
    let startPoint = res?.data?.list?.[0];
    console.log('9012903910====', endPoint, startPoint);
    let stopList = res?.data?.stopList?.map((k, i) => {
      return {
        ...k,
        iconPath: PARK,
        id: 200 + i,
        width: 20,
        height: 30,
      };
    });
    markers.value = [
      {
        iconPath: POS,
        latitude: startPoint?.latitude,
        longitude: startPoint?.longitude,
        id: 111,
        width: 30,
        height: 30,
      },
      {
        iconPath: START,
        latitude: startPoint?.latitude,
        longitude: startPoint?.longitude,
        id: 112,
        width: 20,
        height: 30,
      },
      {
        iconPath: END,
        latitude: endPoint?.latitude,
        longitude: endPoint?.longitude,
        id: 113,
        width: 20,
        height: 30,
      },

      ...stopList,
    ];

    let remotePoints = res?.data?.list?.map((item) => {
      return {
        ...item,
      };
    });
    polyline.value = [
      {
        points: remotePoints,
        color: '#3875FF',
        width: 6,
      },
    ];
  });
};

function confirmStartTime(v) {
  startTime.value = v?.detail;
  showStart.value = false;
  _hisTrail();
}
function confirmEndTime(v) {
  showEnd.value = false;
  endTime.value = v?.detail;
  _hisTrail();
}

function changeRate(item) {
  steps.value = steps.value.map((k) => {
    return {
      ...k,
      choosed: item.val === k.val,
    };
  });
  rate.value = item.val;
}
function chooseStartTime() {
  if (isPlay.value) return;
  showStart.value = true;
}
function chooseEndTime() {
  if (isPlay.value) return;
  showEnd.value = true;
}
function checkVersion() {
  const version = my.getSystemInfoSync().SDKVersion;
  const compareVersion = (v1, v2) => {
    v1 = v1.split('.');
    v2 = v2.split('.');
    const len = Math.max(v1.length, v2.length);

    while (v1.length < len) {
      v1.push('0');
    }
    while (v2.length < len) {
      v2.push('0');
    }

    for (let i = 0; i < len; i++) {
      const num1 = parseInt(v1[i]);
      const num2 = parseInt(v2[i]);

      if (num1 > num2) {
        return 1;
      } else if (num1 < num2) {
        return -1;
      }
    }
    return 0;
  };
  if (compareVersion(version, '2.13.0') < 0) {
    my.showToast({
      title: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。',
      icon: 'none',
    });
    return true;
  }
  return false;
}
let mapCtx: any;

let symbolMarkerIndex = 0;
function runCar() {
  if (!hasData.value) return useToast('暂无轨迹数据');
  isPlay.value = true;
  pause = false;
  if (checkVersion()) return;
  // 默认api不能暂停
  //  autoRotate: true 真机生效
  // mapCtx.moveAlong({
  //   markerId: 111,
  //   path: polyline.value[0].points,
  //   duration: (baseMs.value * 100) / rate.value, // 调整倍速
  //   autoRotate: true,
  // });

  let { latitude, longitude } = polyline.value[0].points?.[symbolMarkerIndex];
  translateMarker({ longitude, latitude });
}
function stopCar() {
  isPlay.value = false;
  pause = true;
}
function translateMarker({ longitude, latitude }) {
  console.log(987654, pause);
  if (pause) {
    carLat.value = latitude;
    carLon.value = longitude;
    return;
  }
  mapCtx.translateMarker({
    markerId: 111,
    path: polyline.value[0].points,
    duration: baseMs.value / rate.value, // 调整倍速
    autoRotate: true,
    moveWithRotate: true,
    destination: {
      longitude,
      latitude,
    },
    animationEnd() {
      symbolMarkerIndex = symbolMarkerIndex + 1;
      if (symbolMarkerIndex > polyline.value[0].points?.length - 1) {
        symbolMarkerIndex = 0;
        let { latitude, longitude } =
          polyline.value[0].points?.[symbolMarkerIndex];
        carLat.value = latitude;
        carLon.value = longitude;
        // 回到起点
        mapCtx.translateMarker({
          markerId: 111,
          duration: 0,
          path: [],
          destination: {
            longitude,
            latitude,
          },
        });
        isPlay.value = false;
        return;
      }

      let { latitude, longitude } =
        polyline.value[0].points?.[symbolMarkerIndex];

      mapCtx.moveToLocation({
        latitude,
        longitude,
      });
      translateMarker({ latitude, longitude });
    },
  });
}
onMounted(() => {
  jGcustomCount(JG.CV_010);
  setTimeout(() => {
    loading.value = false;
    mapCtx = my.createMapContext('map', this);
  }, 50);
});

watch(
  () => fullCarList.value,
  (v) => {
    if (!v?.length) return;
    currentCarPlateNum.value = v?.[0]?.licensePlateNumber;
    _hisTrail();
  },
  {
    immediate: true,
    deep: true,
  }
);

watch(
  () => currentCarPlateNum.value,
  () => {
    _hisTrail();
  }
);
</script>
