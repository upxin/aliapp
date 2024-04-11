<template>
  <view>
    <div class="flex items-center justify-between mb-16px">
      <div class="w-57px h-20px text-primary text-size-14px leading-20px">
        充电服务
      </div>
      <span
        class="iconfont icon-down2 h-20px text-primary text-size-24px leading-20px"
        style="transform: rotate(-90deg)"
      ></span>
    </div>
    <div class="box-border flex items-center justify-between w-full py-10px">
      <NrzImg
        only-img
        :url="CHARGE_MAP_MAIN"
        class="flex-1 h-100px"
        @click="goChargeMap"
      >
        <div class="absolute flex flex-col bottom-20px text-primary left-14px">
          <div class="opacity-90 text-10px mb-10px">专属充电桩，补能无忧</div>
          <div class="flex items-center">
            <span class="mr-6px">充电地图</span>
            <span class="iconfont icon-arrow-right-bold text-10px"></span>
          </div>
        </div>
      </NrzImg>
      <div
        class="flex flex-col items-center justify-end ml-20px h-75px"
        @click="handleScan"
      >
        <div class="flex items-center justify-center flex-1 w-75px">
          <div class="iconfont icon-scan text-40px text-second"></div>
        </div>
        <div class="text-center w-75px bg-fleet py-4px text-primary text-12px">
          扫码充电
        </div>
      </div>
    </div>
    <section class="divide-y pb-17px divide-dashed text-12px nrz-thin">
      <div class="flex justify-between px-10px">
        <div
          v-for="item in rechargeServe"
          :key="item.text"
          class="flex flex-col items-center justify-between flex-1 mt-4px"
          @click="
            () => {
              handleItem(item.route);
            }
          "
        >
          <NrzImg :url="item.icon" class="w-20px h-20px"></NrzImg>
          <span class="mt-4px">{{ item.text }}</span>
        </div>
      </div>
    </section>
  </view>
</template>
<script lang="ts" setup>
import { ref, watch } from 'vue';
import NrzImg from '@/components/img/img.vue';
import {
  navigateToPage,
  CHARGE_WALLET_ICON,
  CHARGE_ORDER_ICON,
  CHARGE_SIET_ICON,
  CHARGE_EXPLAIN_ICON,
  CHARGE_MAP_MAIN,
  WEBVIEW_PREFIX,
  needToLogin,
} from '@/utils/index';
import { store, chargeSocketStore } from '@/stores/index';
import { checkChargeCar, getCharging } from '@/api/index';
let props = withDefaults(defineProps<{ car?: any; isNotify?: boolean }>(), {
  car: () => ({}),
  isNotify: true,
});
function handleScan() {
  getCharging();
}

const rechargeServe = ref([
  {
    text: '充电钱包',
    route: 'chargeWalletHome',
    icon: CHARGE_WALLET_ICON,
  },
  {
    text: '充电订单',
    route: 'chargeOrderList',
    icon: CHARGE_ORDER_ICON,
  },
  {
    text: '常去电站',
    route: 'collectOftenStationList',
    icon: CHARGE_SIET_ICON,
  },
  {
    text: '充电说明',
    route: `${WEBVIEW_PREFIX}url=https://h5.newrizon.cloud/chargingInstructions`,
    icon: CHARGE_EXPLAIN_ICON,
  },
]);

function handleItem(route) {
  if (needToLogin()) return;
  navigateToPage({
    route,
  });
}
function goChargeMap() {
  let temp = {
    vin: props.car?.vin,
    licensePlateNum: props.car?.licensePlateNum,
  };
  chargeSocketStore().setScanInfoFromMapDetail(temp);
  navigateToPage({
    route: 'chargingMap',
    params: temp,
  });
}
</script>
