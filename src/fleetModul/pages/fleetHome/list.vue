<template>
  <section
    v-for="(k, i) in list"
    :key="k?.licensePlateNumber"
    class="p-12px bg-fff mb-2px"
    :class="{ 'nr-border-b': i < list?.length - 1 }"
    @click="
      () => {
        nrToCarData(k);
      }
    "
  >
    <section class="flex justify-between mb-4px">
      <div class="flex items-center pl-5px">
        <span
          :style="{ background: `${VehColor[k?.vehicleType]}` }"
          class="rounded-sm p-2px text-fff text-12px mr-4px"
        >
          {{ k?.vehicleTypeText }}
        </span>
        <span>{{ k?.licensePlateNumber }}</span>
      </div>
      <div class="flex justify-between">
        <span class="opacity-50">今日</span>
        <span class="text-16px">{{ k?.mileage || '--' }}</span>
        <span class="opacity-50">km</span>
      </div>
    </section>
    <div class="flex justify-end mb-10px text-hex-bbb text-12px">
      {{ k?.model }}
    </div>
    <section class="flex my-10px">
      <div class="flex justify-center w-30px">
        <span
          class="flex items-center font-bold rounded leading-1 text-10px bg-hex-bfbfbf opacity-72 text-fff p-2px"
          >VIN</span
        >
      </div>
      <span class="opacity-54"> {{ k?.vinCode }} </span>
    </section>
    <section class="flex items-center my-10px">
      <div class="flex justify-center w-30px">
        <span class="iconfont icon-siji- text-hex-bfbfbf"></span>
      </div>
      <span class="opacity-54">{{ k?.driver }}</span>
      <span class="mx-10px opacity-54"> {{ k?.driverMobile }} </span>
      <nut-button
        v-if="k?.driverMobile"
        class="px-16px"
        size="mini"
        type="primary"
        style="color: rgba(16, 16, 16, 0.67)"
        color="rgba(187, 187, 187, .27)"
        @click.stop="
          () => {
            makePhoneCall(k?.driverMobile);
            jGcustomCount(JG.CV_017);
          }
        "
        >快速联系司机</nut-button
      >
      <nut-button
        v-else
        class="px-16px"
        size="mini"
        type="primary"
        style="color: red"
        color="rgba(245, 68, 39, .15)"
        @click.stop="
          () => {
            nrNavigateTo(Routes.carRecord, { vin: k?.vinCode || k?.vin });
          }
        "
        >点击添加司机</nut-button
      >
    </section>
    <section class="flex items-start my-10px">
      <div class="flex justify-center w-30px">
        <span class="icon-weizhi iconfont text-18px"></span>
      </div>
      <Position
        class="flex-1 opacity-54"
        :latitude="k?.latitude"
        :longitude="k?.longitude"
      ></Position>
    </section>

    <section class="flex items-center justify-between bg-main py-4px nrz-thin">
      <div class="flex items-center mr-20px">
        <div class="flex justify-center w-30px">
          <span
            class="rounded-full w-10px h-10px"
            :class="{
              'bg-danger': !k?.status,
              'bg-green-400': k?.status > 0,
            }"
          ></span>
        </div>
        <span class="opacity-50 text-primary">{{ k?.statusText || '--' }}</span>
      </div>
      <span class="flex flex-1 text-right opacity-54 pr-20px text-primary">
        <span>数据更新时间：</span>
        <span class="flex-1 text-left">{{ k?.time || '--' }}</span>
      </span>
    </section>
  </section>
</template>
<script lang="ts" setup>
import {
  makePhoneCall,
  nrNavigateTo,
  Routes,
  VehColor,
  jGcustomCount,
  JG,
} from '@/utils/index';
import Position from './position.vue';
let statusMap = {
  0: '停车',
  1: '行驶中',
  2: '充电中',
  3: '充电中',
  4: 'SW_UPDATED',
};

withDefaults(defineProps<{ list: any }>(), {
  list: [],
});

function nrToCarData(item) {
  nrNavigateTo(Routes.carData, {
    vinCode: item?.vinCode,
    vinLicense: item?.licensePlateNumber,
    isOwner: 1,
    licensePlateNumber: item?.licensePlateNumber,
  });
}
</script>
