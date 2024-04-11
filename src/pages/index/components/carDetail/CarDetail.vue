<template>
  <main :style="stlyes" class="bg-no-repeat bg-contain pb-16px">
    <div
      :style="{
        paddingTop: pt,
      }"
      class="box-border relative overflow-hidden px-16px nrz-extra text-primary"
    >
      <div class="flex items-center justify-between text-12px pt-2px">
        <div class="opacity-0 min-w-130px"></div>
        <div
          class="flex items-center justify-center"
          :class="{ 'flex-1': driverAndOwner }"
        >
          <span class="iconfont icon-quan" :class="_color"></span>
          <span class="ml-4px leading-9px nrz-thin">
            {{ regChargingState }}
          </span>
        </div>
        <div
          class="flex items-center justify-end min-w-130px"
          @click="showCarList"
        >
          <span class="mr-4px nrz-thin">{{ carData?.name }}</span>
          <span
            v-if="carList?.length > 1"
            :style="{
              transform: !toolTipCar ? 'rotateZ()' : 'rotateZ(180deg)',
              transition: 'all 0.3s ease-in-out',
            }"
            class="font-bold iconfont icon-sanjiao text-14px"
          ></span>
        </div>
      </div>

      <div
        class="w-full text-center text-14px nrz-regular mt-20px mb-10px opacity-80"
      >
        我的{{ carData?.type?.toUpperCase() }}
      </div>
      <div
        class="flex items-baseline justify-center w-full text-center text-normal text-18px"
      >
        <span class="text-40px"
          >{{ chargeData.carBehavior?.remainMileage || 0 }}{{ ' ' }}</span
        >
        <span>km</span>
      </div>
      <div class="box-border flex justify-center w-full my-14px pl-16px">
        <div
          class="flex font-bold bg-no-repeat bg-contain text-16px pr-16px"
          :style="{
            backgroundImage: `url(${lineUrl})`,
            backgroundPosition: 'bottom',
          }"
          @click="goChargeList"
        >
          <div class="flex pr-6px pb-4px">
            <span class="mr-10px ml-4px">点</span>
            <span class="mx-10px">击</span>
            <span class="mx-10px">充</span>
            <span class="ml-10px">电</span>
          </div>
        </div>
      </div>
      <div class="flex justify-center w-full mt-10px mb-16px">
        <div class="w-70px h-24px">
          <SkewProgress
            v-if="chargeData?.carCharging?.startChargeSeqStat != 2"
            :percent="Number(chargeData.carBehavior?.remainingBattery) || 0"
          ></SkewProgress>
          <ChargeProgress
            v-if="chargeData?.carCharging?.startChargeSeqStat == 2"
            :percent="Number(chargeData.carBehavior?.remainingBattery) || 0"
          ></ChargeProgress>
        </div>
      </div>

      <section
        v-if="chargeData?.carCharging?.startChargeSeqStat != 2"
        class="flex justify-center pt-14px"
      >
        <div
          v-if="showTimer && isChargingCar()"
          class="relative flex flex-col items-center justify-center border-solid rounded-full mb-20px w-110px h-110px border-10px border-hex-ACAEBA countDwon"
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
        <image
          v-else
          :src="mainCarUrl"
          class="w-300px my-20px"
          mode="widthFix"
        ></image>
      </section>
      <template
        v-if="chargeData?.carCharging?.startChargeSeqStat == 2 && isCharging"
      >
        <section
          class="flex items-center justify-center w-full overflow-hidden h-200px"
        >
          <section
            class="flex justify-center w-full bg-contain h-300px"
            :style="{
              backgroundImage: `url(${chargeCarUrl})`,
              backgroundPosition: '30px -30px',
            }"
          ></section>
        </section>
      </template>

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
          class="bg-hex-DBE7F0 bg-opacity-44 mx-14px px-17px nrz-thin text-12px py-10px"
          @click="
            () => {
              nrNavigateTo(Routes.carData, {
                vin: carData?.vin,
                carName: carData?.name,
                licensePlateNumber: carData?.licensePlateNum,
                vinLicense: carData?.vin,
              });
            }
          "
        >
          <div class="nrz-regular text-14px h-20px leading-20px">
            <div class="flex items-center">
              <span v-if="carData?.lifetimeWarranty" class="text-primary">
                终身质保
              </span>
              <span v-if="carData?.lifetimeWarranty" class="text-18px">·</span>
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

        <div class="flex items-center justify-around px-16px mt-16px">
          <nut-button
            v-if="!isOwn"
            shape="square"
            class="box-border border-0 rounded btnShadow w-134px bg-hex-D3D7D9"
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
            class="box-border border-0 rounded btnShadow w-134px bg-hex-D3D7D9"
            @click="handleCarPos"
          >
            当前位置
          </nut-button>
          <nut-button
            v-if="isOwn"
            shape="square"
            class="box-border border-0 rounded btnShadow w-134px bg-hex-D3D7D9"
            @click="goCarRecord"
          >
            车辆档案
          </nut-button>
          <nut-button
            v-if="isOwn"
            shape="square"
            class="box-border border-0 rounded btnShadow w-134px bg-hex-D3D7D9"
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
import { ref, watch, computed, inject } from 'vue';
import SkewProgress from '@/components/skew-progress/index.vue';
import ChargeProgress from '@/components/skew-progress/charge-progress.vue';
import { vrData } from '@/assets/js/virtual_car_behavior';
import {
  nrNavigateTo,
  makePhoneCall,
  navigateToPage,
  Routes,
  jGcustomCount,
  JG,
} from '@/utils/index';
import ChargeDetail from './ChargeDetail.vue';
import { chargeSocketStore, loveCarStore } from '@/stores/index';
import {
  GREEN_COLOR,
  RED_COLOR,
  WAIT_COLOR,
  mainCarUrl,
  chargeCarUrl,
  lineUrl,
} from './charge';
import { useStop } from './useCharge';
const { _stopCharge } = useStop();
const {
  driverChoosedCar,
  ownerChoosedCar,
  driverCarList,
  ownerCarList,
  showOwnerCarList,
  showDriverCarList,
} = indexContext || {};

let LoveCarStore = loveCarStore();
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
const chargeData = ref<{ carBehavior: any; carCharging: any; vin: string }>({
  carBehavior: null,
  carCharging: null,
  vin: '',
});
const carBehaviorNotMaybe: any[] = ['null', null, undefined, 0, '0'];
const carData = computed(() => {
  return props.isOwn ? ownerChoosedCar.value : driverChoosedCar.value;
});

let stlyes = computed(() => {
  if (isChargingCar() && isCharging.value) {
    return {
      backgroundImage: `linear-gradient(to bottom, #BFC0C4, #f2f2f2)`,
    };
  }
  return {
    backgroundColor: '#EFF4F8',
  };
});
const toolTipCar = ref(false);
const showChargeModule = computed(() => {
  return (
    (isCharging.value && isChargingCar()) ||
    chargeData.value?.carCharging?.startChargeSeqStat == 2
  );
});

function goChargeList() {
  navigateToPage({
    route: 'chargeMapStationList',
  });
}
function isChargingCar() {
  return chargeSocketStore().chargingVin === carData.value?.vin;
}
function stop() {
  _stopCharge({ vin: carData.value?.vin });
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

let carList = computed(() =>
  props.isOwn ? ownerCarList.value : driverCarList.value
);
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
function showCarList() {
  if (carList.value?.length <= 1 || carList.value === null) return;
  if (props?.isOwn) {
    showOwnerCarList.value = true;
  } else {
    showDriverCarList.value = true;
  }
}
let socketData = computed(() => chargeSocketStore()?.socketData);

function handleCarPos() {
  nrNavigateTo(Routes.fleetLocation, {
    vinLicense: carData.value?.vinCode || carData.value?.vin,
    licensePlateNum: carData.value?.licensePlateNum,
  });
}
function goCarRecord() {
  nrNavigateTo(Routes.carRecord, {
    insurerId: carData.value?.insurer?.id || '',
    insurerName: carData.value?.insurer?.name || '',
    licensePlateNum: carData.value?.licensePlateNum || '',
    vin: carData.value?.vin || '',
    name: carData.value?.name || '',
    time: carData.value?.insurer?.time || '',
  });
}

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
watch(
  () => LoveCarStore.isVr,
  (v) => {
    if (v) {
      chargeData.value = {
        carBehavior: vrData?.data,
        carCharging: {},
        vin: '',
      };
    }
  },
  {
    deep: true,
    immediate: true,
  }
);

watch(
  () => isCharging.value,
  (v) => {
    console.log('isCharging', v);
  },
  {
    immediate: true,
  }
);
</script>
