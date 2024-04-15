<template>
  <section style="background: linear-gradient(#d5ebfc, #fff)">
    <ChangeCar></ChangeCar>
    <template v-if="HomeStore.state.mouduleType == 'parts'">
      <!-- 有渲染bug -->
      <WithParts></WithParts>
    </template>
    <template v-if="HomeStore.state.mouduleType == 'prepay'">
      <Delivered></Delivered>
    </template>
    <template v-if="HomeStore.state.mouduleType == 'car'">
      <NrzImg
        :width="264"
        :height="205"
        class="m-auto py-40px"
        mode="aspectFit"
        :src="
          isCharging
            ? HomeStore.state.currentCar?.chargeImgUrl
            : HomeStore.state.currentCar?.imgUrl
        "
      ></NrzImg>

      <template v-if="isCharging">
        <ChargingProgress></ChargingProgress>
      </template>
      <Navi></Navi>
    </template>
    <section
      v-if="HomeStore.state.mouduleType == 'car'"
      class="px-18px pb-30px"
    >
      <section class="flex justify-between mt-20px nrz-light">
        <template v-if="isCharging">
          <ChargingData class="flex-1"></ChargingData>
        </template>
        <template v-if="!isCharging && HomeStore.state.cars?.length">
          <History></History>
        </template>

        <template v-if="HomeStore.state.currentCar?.typeText === 'iC1'">
          <ControlCar></ControlCar>
        </template>
      </section>
    </section>
  </section>

  <section class="px-20px bg-fff">
    <ChargeService class="py-40px"></ChargeService>
    <Diary class="mb-40px"></Diary>
    <CarService class="mb-40px"></CarService>
    <Atlas class="mb-40px"></Atlas>
    <NStore class="mb-40px"></NStore>
    <Financial></Financial>
  </section>
</template>
<script lang="ts" setup>
import { computed } from 'vue';

import { homeStore } from '@/stores/index';

import ChargingData from './components/chargingData/index.vue';
import Navi from './components/navi/index.vue';
import ControlCar from './components/controlCar/index.vue';
import ChargeService from './components/charge-service/index.vue';
import NStore from './components/nearby-stores/index.vue';
import Atlas from './components/video-atlas/index.vue';
import Financial from './components/financial/index.vue';
import CarService from './components/car-service/index.vue';
import Diary from './components/diary/index.vue';
import NrzImg from '@/components/nrz-img/index.vue';
import ChangeCar from './components/changeCar/index.vue';
import History from './components/history/index.vue';
import WithParts from './components/with-parts/index.vue';
import Delivered from './components/car-be-delivered/index.vue';

import ChargingProgress from './components/chargingProgress/index.vue';

interface Props {
  data?: any;
}

const isCharging = computed(() => {
  if (HomeStore.state.currentCar?.vin) {
    return HomeStore.state.currentCar?.vin === HomeStore.state.charginCar?.vin;
  }
  return false;
});

const HomeStore = homeStore();

withDefaults(defineProps<Props>(), {
  data: {},
});
</script>
<style lang="scss">
.line {
  height: 43px;
  width: 1px;
  transform: rotateZ(30deg);
  background-color: rgba(255, 255, 255, 100);
}
</style>
