<template>
  <CarDeatil
    :pt="topBarHeight(44)"
    :driver-and-owner="false"
    :is-own="true"
    :car-data="currentChoosedCar"
  >
  </CarDeatil>
  <div class="py-36px px-26px">
    <ChargeServe :car="currentChoosedCar" :is-notify="true"></ChargeServe>
    <DiaryCom :diary="diaryData" :car-name="currentChoosedCar?.name"></DiaryCom>
    <div class="mt-30px">
      <CarService :car-service="carService"></CarService>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, computed, watch, onBeforeMount } from 'vue';
import { systemInfo, chargeSocketStore } from '@/stores/index';
import Taro, { useRouter } from '@tarojs/taro';
import CarService from '@/pages/index/components/car-service/index.vue';
// 等待交车
import CarDeatil from './car-detail.vue';
import DiaryCom from '@/pages/index/components/diary/index.vue';
import ChargeServe from '@/pages/index/components/charge-service/index.vue';
import { carInfo } from '@/api/index';
import { CODE } from '@/utils/index';

let params = useRouter().params;
let socketData = computed(() => chargeSocketStore()?.socketData);

let currentChoosedCar = ref();
let carService = ref();
let diaryData = ref({});

const _getHomePage = async () => {
  try {
    const { data: driver, code: code1 } = await carInfo({ isOwner: false });
    if (code1 !== CODE) return;
    const { data: owner, code: code2 } = await carInfo({ isOwner: true });
    if (code2 !== CODE) return;

    carService.value = useRouter()?.params?.isOwner
      ? owner.car_service
      : driver?.car_service;
  } catch (error) {}
};
const topBarHeight = (val = 0) =>
  Taro.pxTransform(systemInfo().app.statusBarHeight + Number(val));

onBeforeMount(() => {
  let temp = {
    carName: params?.carName,
    vin: params?.vin,
    imgUrl: params?.imgUrl,
    state: params?.state,
    licensePlateNum: params?.licensePlateNum,
  };
  _getHomePage();
  currentChoosedCar.value = { ...temp };
});

watch(
  () => socketData.value,
  (v) => {
    if (!v) return;
    if (typeof v !== 'object') return;

    diaryData.value =
      v?.find((item) => {
        return item.vin === currentChoosedCar.value?.vin;
      }) || {};
  }
);
</script>
