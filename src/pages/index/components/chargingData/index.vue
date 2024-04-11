<script setup lang="ts">
import { nullText, useToast } from '@/utils';

import { homeStore } from '@/stores/index';
import { computed } from 'vue';

import { stopCharge } from '@/api/index';
import { useModal } from '@/hooks';
import Taro from '@tarojs/taro';

const stationName = computed(() => {
  return homeStore().state.charginCar?.stationName;
});
const currentA = computed(() => {
  return homeStore().state.charginCar?.currentA;
});
const totalMoney = computed(() => {
  return homeStore().state.charginCar?.totalMoney;
});
const voltageA = computed(() => {
  return homeStore().state.charginCar?.voltageA;
});

const currentPower = computed(() => {
  let p = (Number(currentA.value) * Number(voltageA.value)) / 1000;
  return Math.floor(p);
});

let usedTime = computed(() => {
  let time =
    new Date(homeStore().state.charginCar?.endTime || '')?.getTime() -
    new Date(homeStore().state.charginCar?.startTime || '')?.getTime();
  return Math.ceil(time / 1000 / 60);
});

const totalPower = computed(() => {
  return homeStore().state.charginCar?.totalPower;
});

function stop() {
  useModal({
    content: `是否结束该车辆${
      homeStore().state.charginCar?.licensePlateNumber ?? ''
    }充电?`,
    success: () => {
      Taro.showLoading();
      stopCharge({
        vin: homeStore().state.charginCar?.vin as string,
      }).then((res) => {
        useToast(res.msg);
        homeStore().setState('charginCar', {});
        Taro.hideLoading();
      });
    },
  });
}
</script>

<template>
  <section class="bg-fff py-16px rounded-2px text-10px">
    <view class="text-center pb-20px">{{ stationName }}</view>
    <section class="flex justify-between">
      <div class="flex flex-col justify-center items-center leftBr px-10px">
        <span class="mb-6px font-thin">已经消费</span>
        <span class="flex">
          <view class="opacity-60 pr-4px">
            {{ nullText(totalMoney) }}
          </view>
          <view>元</view>
        </span>
      </div>
      <div class="flex flex-col justify-center items-center leftBr px-8px">
        <span class="mb-6px font-thin">实时电流</span>

        <span class="flex">
          <view class="opacity-60 pr-4px">
            {{ nullText(currentA) }}
          </view>
          <view>A</view>
        </span>
      </div>
      <div class="flex flex-col justify-center items-center leftBr px-8px">
        <span class="mb-6px font-thin">实时电压</span>

        <span class="flex">
          <view class="opacity-60 pr-4px">
            {{ nullText(voltageA) }}
          </view>
          <view>V</view>
        </span>
      </div>
      <div class="flex flex-col justify-center items-center px-10px">
        <span class="mb-6px font-thin">实时功率</span>

        <span class="flex">
          <span class="opacity-60 pr-4px">{{ nullText(currentPower) }}</span>
          <span>KW</span>
        </span>
      </div>
    </section>

    <section class="flex px-10px pt-20px items-center">
      <section class="flex-1">
        <view class="flex items-center">
          <view class="icon-chongdianzhuang iconfont text-10px w-16px"></view>
          <view class="px-4px opacity-60"> 已充时长 </view>
          <view class="pr-4px min-w-14px text-center">
            {{ nullText(usedTime) }}
          </view>
          <view> 分钟 </view>
        </view>

        <view class="flex items-center py-6px">
          <view
            class="iconfont icon-shandian-shi text-12px w-16px pr-2px"
            style="color: #05d58e"
          ></view>
          <view class="px-4px opacity-60"> 已充电量 </view>
          <view class="pr-4px min-w-14px text-center">
            {{ nullText(totalPower) }}
          </view>
          <view> 度 </view>
        </view>

        <view class="flex items-center">
          <view class="icon-shizhongfill iconfont text-info text-12px w-16px">
          </view>
          <view class="px-4px opacity-60"> 剩余时间 </view>
          <view class="text-black pr-4px min-w-14px text-center">
            {{
              homeStore().state?.carBehavior?.remainingChargingTime == 1441
                ? '--'
                : nullText(
                    homeStore().state?.carBehavior?.remainingChargingTime
                  )
            }}
          </view>
          <view class="text-black"> 分钟 </view>
        </view>
      </section>

      <view
        style="background-color: #f1f1f1"
        class="rounded-full w-60px h-60px flex flex-col justify-center items-center font-thin text-14px leading-normal"
        @click="stop"
      >
        <view>停止</view>
        <view>充电</view>
      </view>
    </section>
  </section>
</template>
<style>
.leftBr {
  position: relative;
}
.leftBr::after {
  content: '';
  position: absolute;
  height: 100%;
  background-color: #f5f5f5;
  width: 1px;
  right: 0;
  top: 0;
}
</style>
