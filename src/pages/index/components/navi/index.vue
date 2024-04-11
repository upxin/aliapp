<template>
  <section class="flex justify-between px-18px">
    <div
      class="bg-fff rounded-1px w-80px box-border flex justify-center items-center w-76px h-65px"
      @click="handleCard"
    >
      <view class="iconfont icon-identity text-34px opacity-70"></view>
    </div>

    <div
      class="w-76px h-65px bg-fff rounded-1px w-80px box-border flex justify-center items-center"
      @click="
        toPage(Routes.carData, {
          vinLicense: HomeStore.state.currentCar?.vin,
          licensePlateNumber: HomeStore.state.currentCar?.licensePlateNum,
          licensePlateNum: HomeStore.state.currentCar?.licensePlateNum,
        })
      "
    >
      <view
        class="iconfont icon-ico_doc_chart_trend text-34px opacity-70"
      ></view>
    </div>

    <div
      class="w-76px h-65px bg-fff rounded-1px w-80px box-border flex justify-center items-center"
      @click="
        toPage(Routes.fleetLocation, {
          vinLicense: HomeStore.state.currentCar?.vin,
          licensePlateNumber: HomeStore.state.currentCar?.licensePlateNum,
          licensePlateNum: HomeStore.state.currentCar?.licensePlateNum,
        })
      "
    >
      <view class="iconfont icon-ditu text-34px opacity-70"></view>
    </div>

    <div
      class="w-76px h-65px bg-fff rounded-1px w-80px box-border flex justify-center items-center"
      @click="toPage(Routes.chargingMap)"
    >
      <view class="iconfont icon-device text-32px opacity-70"></view>
    </div>
  </section>
</template>
<script setup lang="ts">
import { Routes, makePhoneCall, nrNavigateTo } from '@/utils';
import { homeStore } from '@/stores/home';
const HomeStore = homeStore();
function toPage(path, params?) {
  nrNavigateTo(path, params ? params : {});
}
function handleCard() {
  if (HomeStore.state.currentCar?.identity == 2) {
    console.log(
      HomeStore.state.currentCar.ownerMobile,
      'HomeStore.state.ownerMobile'
    );
    makePhoneCall(HomeStore.state.currentCar.ownerMobile);
  } else {
    toPage(Routes.carRecord, {
      vinLicense: HomeStore.state.currentCar?.vin,
      licensePlateNumber: HomeStore.state.currentCar?.licensePlateNum,
      licensePlateNum: HomeStore.state.currentCar?.licensePlateNum,
    });
  }
}
</script>
