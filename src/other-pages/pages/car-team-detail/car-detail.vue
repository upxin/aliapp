<template>
  <main :style="stlyes" class="bg-no-repeat bg-contain pb-60px">
    <div
      :style="{
        paddingTop: pt,
      }"
      class="box-border relative overflow-hidden nrz-extra text-primary"
    >
      <div class="flex items-center justify-between px-16px text-12px pt-2px">
        <div
          class="flex items-center justify-center"
          :class="{ 'flex-1': driverAndOwner }"
        >
          <span class="iconfont icon-quan" :class="_color"></span>
          <span class="ml-4px leading-9px nrz-thin">
            {{ regChargingState }}
          </span>
        </div>
        <div class="flex items-center justify-end min-w-130px">
          <span class="mr-4px nrz-thin">{{ carData?.carName }}</span>
        </div>
      </div>
      <template v-if="chargeData?.carCharging?.startChargeSeqStat != 2">
        <div
          v-if="showTimer && isChargingCar()"
          class="absolute flex flex-col items-center justify-center border-solid rounded-full center top-240px w-110px h-110px border-10px border-hex-ACAEBA countDwon"
          @click="stop"
        >
          <span class="text-info text-24px">
            {{
              chargeSocketStore().countDown
                ? chargeSocketStore().countDown
                : '立即停止'
            }}
          </span>
          <span class="absolute opacity-70 bottom-20px text-10px">启动中</span>
        </div>
      </template>
      <template
        v-if="chargeData?.carCharging?.startChargeSeqStat == 2 && isCharging"
      >
        <section class="absolute w-full top-240px" @click="stop">
          <image
            :src="CHARGING_CAR"
            class="absolute w-200px x-center"
            mode="widthFix"
          ></image>
          <image
            :src="CHARGING_LINE"
            class="absolute w-200px left-20px"
            mode="widthFix"
          ></image>
        </section>
      </template>
      <div class="w-full text-center text-20px nrz-regular mt-36px">
        前晨{{ ' ' }}{{ carData?.type?.toUpperCase() }}
      </div>
      <div class="w-full text-center text-normal text-28px mt-300px">
        {{ chargeData.carBehavior?.remainMileage || 0 }}{{ ' ' }}km
      </div>

      <div class="flex justify-center w-full mt-10px mb-36px">
        <SkewProgress
          v-if="chargeData?.carCharging?.startChargeSeqStat != 2"
          :percent="Number(chargeData.carBehavior?.remainingBattery) || 0"
          class="w-130px"
        ></SkewProgress>
        <ChargeProgress
          v-if="chargeData?.carCharging?.startChargeSeqStat == 2"
          :percent="Number(chargeData.carBehavior?.remainingBattery) || 0"
          class="w-130px"
        ></ChargeProgress>
      </div>

      <template v-if="showChargeModule">
        <ChargeDetail
          :car-charging="chargeData?.carCharging || {}"
          :car-behavior="chargeData.carBehavior || {}"
          :vin="carData?.vin"
          @fixStartChargeSeqStat="fixStartChargeSeqStat"
        ></ChargeDetail>
      </template>
      <template v-else>
        <div
          class="bg-hex-DBE7F0 bg-opacity-44 mx-14px px-17px nrz-thin text-12px pt-20px h-90px"
          @click="
            () => {
              nrNavigateTo('use-car-summary', {
                vin: carData?.vin,
                carName: carData?.name,
                showMove: 1,
              });
            }
          "
        >
          <div class="nrz-regular text-14px h-20px leading-20px">
            <div class="flex items-center">
              <span class="mr-4px">整体数据</span>
              <div
                class="flex items-center justify-center border-solid rounded-full w-10px h-10px border-1px border-hex-aaa"
              >
                <span
                  class="iconfont text-hex-aaa icon-arrow-right-bold text-8px"
                ></span>
              </div>
            </div>
          </div>

          <div class="flex justify-between w-full my-6px h-17px leading-17px">
            <div class="flex">
              <span>已安全行驶：</span>
              <span>
                {{
                  carBehaviorNotMaybe.includes(
                    chargeData.carBehavior?.totalTime
                  )
                    ? '--'
                    : chargeData.carBehavior?.totalTime
                }}</span
              >
              <span
                v-if="
                  !carBehaviorNotMaybe.includes(
                    chargeData.carBehavior?.totalTime
                  )
                "
                >h</span
              >
            </div>
            <div class="flex w-130px">
              <span>总行驶里程：</span>
              <span>
                {{
                  carBehaviorNotMaybe.includes(
                    chargeData.carBehavior?.totalMileage
                  )
                    ? '--'
                    : chargeData.carBehavior?.totalMileage
                }}</span
              >
              <span
                v-if="
                  !carBehaviorNotMaybe.includes(
                    chargeData.carBehavior?.totalMileage
                  )
                "
                >km</span
              >
            </div>
          </div>
          <div class="flex justify-between w-full h-17px leading-17px">
            <div class="flex">
              <span>共节能减排：</span>
              <span>
                {{
                  carBehaviorNotMaybe.includes(
                    chargeData.carBehavior?.energySaving
                  )
                    ? '--'
                    : chargeData.carBehavior?.energySaving
                }}</span
              >
              <span
                v-if="
                  !carBehaviorNotMaybe.includes(
                    chargeData.carBehavior?.energySaving
                  )
                "
                >吨</span
              >
            </div>
            <div class="flex w-130px">
              <span>前晨已陪伴：</span>
              <span>{{
                carBehaviorNotMaybe.includes(chargeData.carBehavior?.days)
                  ? '--'
                  : chargeData.carBehavior?.days
              }}</span>
              <span
                v-if="
                  !carBehaviorNotMaybe.includes(chargeData.carBehavior?.days)
                "
                >天</span
              >
            </div>
          </div>
        </div>

        <div class="flex items-center justify-around px-16px mt-30px">
          <nut-button
            v-if="!isOwn"
            shape="square"
            class="box-border w-134px border-primary border-opacity-19 text-primary"
            @click="
              () => {
                makePhoneCall(carData?.owner_mobile || '');
                jGcustomCount(JG.CV_016);
              }
            "
          >
            联系车主
          </nut-button>
          <nut-button
            v-if="!isOwn"
            shape="square"
            class="box-border w-134px border-primary border-opacity-19 text-primary"
            @click="handleCarPos"
          >
            当前位置
          </nut-button>
          <nut-button
            v-if="isOwn"
            shape="square"
            class="box-border w-134px border-primary border-opacity-19 text-primary"
            @click="goCarInfo"
          >
            车辆信息
          </nut-button>
          <nut-button
            v-if="isOwn"
            shape="square"
            class="box-border w-134px border-primary border-opacity-19 text-primary"
            @click="handleCarPos"
          >
            车辆位置
          </nut-button>
        </div>
      </template>
    </div>
  </main>
</template>
<script lang="ts" setup>
import { ref, watch, computed, onBeforeMount } from 'vue';
import SkewProgress from '@/components/skew-progress/index.vue';
import ChargeProgress from '@/components/skew-progress/charge-progress.vue';

import {
  nrNavigateTo,
  makePhoneCall,
  CHARGING_LINE,
  CHARGING_CAR,
  jGcustomCount,
  JG,
} from '@/utils/index';
import ChargeDetail from '@/pages/index/components/carDetail/ChargeDetail.vue';
import { chargeSocketStore } from '@/stores/index';
import {
  GREEN_COLOR,
  RED_COLOR,
  WAIT_COLOR,
} from '@/pages/index/components/carDetail/charge';
import { useStop } from '@/pages/index/components/carDetail/useCharge';
import { useRouter } from '@tarojs/taro';

const { _stopCharge } = useStop();
let isCharging = computed(() => chargeSocketStore().isCharging);
let showTimer = computed(() => chargeSocketStore().showTimer);
interface Props {
  pt: string;
  driverAndOwner: boolean;
  isOwn: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  pt: '0',
  driverAndOwner: false,
  isOwn: false,
});
let carData = ref<any>();
const chargeData = ref<{ carBehavior: any; carCharging: any; vin: string }>({
  carBehavior: null,
  carCharging: null,
  vin: '',
});
const carBehaviorNotMaybe: any[] = ['null', null, undefined, 0, '0'];

const showChargeModule = computed(() => {
  return (
    (isCharging.value && isChargingCar()) ||
    chargeData.value?.carCharging?.startChargeSeqStat == 2
  );
});
function isChargingCar() {
  return chargeSocketStore().chargingVin === carData.value?.vin;
}
function stop() {
  _stopCharge({ vin: carData.value?.vin }, () => {
    fixStartChargeSeqStat();
  });
}
function fixStartChargeSeqStat() {
  chargeData.value.carCharging.startChargeSeqStat = 4;
}
const _color = computed(() => {
  if (showChargeModule.value) {
    if (chargeData.value?.carCharging?.startChargeSeqStat == 2) {
      return GREEN_COLOR;
    }
    return WAIT_COLOR;
  }
  if (chargeData.value.carBehavior?.state === '下电') {
    return RED_COLOR;
  }
  if (chargeData.value.carBehavior?.state === '上电') {
    return GREEN_COLOR;
  }

  return RED_COLOR;
});

let stlyes = computed(() => {
  if (isChargingCar() && isCharging.value) {
    return {
      backgroundImage: `linear-gradient(to bottom, #BFC0C4, #f2f2f2)`,
      backgroundPositionY: 0,
    };
  }
  return {
    backgroundImage: `url(${carData.value?.imgUrl})`,
    backgroundPositionY: 0,
    backgroundColor: '#f2f2f2',
  };
});

let regChargingState = computed(() => {
  if (
    isCharging.value &&
    isChargingCar() &&
    chargeData.value?.carCharging?.startChargeSeqStat != 2
  ) {
    return '启动中';
  }
  if (
    chargeData.value?.carCharging &&
    chargeData.value?.carCharging?.startChargeSeqStat == 2
  ) {
    return '充电中';
  }
  return chargeData.value?.carBehavior?.state || '下电';
});
let socketData = computed(() => chargeSocketStore()?.socketData);
watch(
  () => socketData.value,
  (v) => {
    if (!v) return;
    if (typeof v !== 'object') return;

    let temp = v?.find((item) => {
      return item.vin === carData.value?.vin;
    });

    if (temp) {
      chargeData.value = temp;
    } else {
      chargeData.value = { carBehavior: {}, carCharging: {}, vin: '' };
    }
  }
);
// watch(
//   () => chargeData.value,
//   (v) => {
//     console.log('chargingCarData', v);
//   }
// );
function handleCarPos() {
  nrNavigateTo('use-car-summary', {
    showMove: false,
    vin: carData.value?.vin,
  });
}
function goCarInfo() {
  nrNavigateTo('updateCar', {
    insurerId: carData.value?.insurer?.id || '',
    insurerName: carData.value?.insurer?.name || '',
    licensePlateNum: carData.value?.licensePlateNum || '',
    vin: carData.value?.vin || '',
    name: carData.value?.name || '',
    time: carData.value?.insurer?.time || '',
  });
}
let params = useRouter().params;
onBeforeMount(() => {
  let temp = {
    carName: params?.carName,
    vin: params?.vin,
    imgUrl: params?.imgUrl,
    state: params?.state,
    licensePlateNum: params?.licensePlateNum,
  };
  carData.value = { ...temp };
});
watch(
  () => carData.value,
  (v) => {
    console.log('-6-6-6-6--6-66--6-6-&&&&&&&&&&&&&&&&&&&', v);
    chargeSocketStore().setVins(v.vin);
  },
  {
    deep: true,
  }
);
</script>

<style lang="scss">
// box-shadow:阴影类型 X轴位移 Y轴位移 阴影大小 阴影扩展 阴影颜色
// 也可以用逗号隔开单独设置 四个方向的阴影 box-shadow: 0 0 3px 2px red,0 0 3px 6px green,;
.nr-shadow {
  box-shadow: 0 0 3px 2px rgba(0, 0, 0, 0.2);
}
.nut-popover--dark .popoverContent--left,
.nut-popover--dark .popoverContent--right,
.nut-popover--dark .popoverContent--top,
.nut-popover--dark .popoverContent,
.nut-popover .popoverContent--left,
.nut-popover .popoverContent--right,
.nut-popover .popoverContent--top,
.nut-popover .popoverContent {
  z-index: 999;
  right: 0;
}
.nut-popover--dark .popoverContent--left .popoverArrow,
.nut-popover--dark .popoverContent--right .popoverArrow,
.nut-popover--dark .popoverContent--top .popoverArrow,
.nut-popover--dark .popoverContent .popoverArrow,
.nut-popover .popoverContent--left .popoverArrow,
.nut-popover .popoverContent--right .popoverArrow,
.nut-popover .popoverContent--top .popoverArrow,
.nut-popover .popoverContent .popoverArrow {
  right: 16px;
  left: unset !important;
}
.nut-popover--dark,
.nut-popover {
  margin-right: 0;
}
.countDwon {
  background-image: linear-gradient(to bottom, #c8c9cb, #f7f7f7);
}
</style>
