<template>
  <div class="w-full text-10px">
    <div class="box-border w-full bg-hex-DBE7F0 bg-opacity-44 p-10px">
      <div class="text-center">{{ nullText(carCharging?.stationName) }}</div>
      <div class="text-center opacity-40 mt-6px">
        充电枪编号：{{ nullText(carCharging?.connectorId) }}
      </div>
      <section class="flex justify-between text-center my-20px">
        <div class="flex flex-col">
          <span class="flex items-center mb-6px">
            <span class="mr-4px">已经消费</span>
            <div>
              <nut-popover v-model:visible="visible">
                <template #reference>
                  <span class="icon-icon-question iconfont text-10px"></span>
                </template>
                <template #content>
                  <span class="leading-normal p-6px text-8px"
                    >此处费用可能会有滞后，实际以订单数据为准</span
                  >
                </template>
              </nut-popover>
            </div>
          </span>
          <span>{{ nullText(carCharging?.totalMoney) }}元</span>
        </div>
        <div class="h-32px w-1px bg-hex-bbb opacity-30"></div>
        <div class="flex flex-col">
          <span class="mb-6px">实时电流</span>
          <span>{{ nullText(carCharging?.currentA) }}A</span>
        </div>
        <div class="h-32px w-1px bg-hex-bbb opacity-30"></div>
        <div class="flex flex-col">
          <span class="mb-6px">实时电压</span>
          <span>{{ nullText(carCharging?.voltageA) }}V</span>
        </div>
        <div class="h-32px w-1px bg-hex-bbb opacity-30"></div>
        <div class="flex flex-col">
          <span class="mb-6px">实时功率</span>
          <span>{{ nullText(currentPower) }}KW</span>
        </div>
      </section>
      <section class="px-10px py-10px bg-hex-B8B4B4 bg-opacity-10">
        <div class="mb-6px">
          结束充电码：{{ nullText(carCharging?.identCode) }}
        </div>
        <div class="opacity-50">
          如遇无法结束充电，可再充电桩输入上面的结束码停止充电
        </div>
      </section>
      <section class="flex justify-between mt-10px">
        <div class="flex flex-col justify-between">
          <div class="flex">
            <span class="icon-chongdianzhuang iconfont text-10px"></span>
            <span class="ml-4px mr-6px">已充电</span>
            <span class="font-bold text-primary">{{ nullText(usedTime) }}</span>
            <span>分钟</span>
          </div>
          <div class="flex">
            <span
              class="icon-shandian-shi iconfont text-10px text-hex-05D58E"
            ></span>
            <span class="ml-4px mr-6px">已充电</span>
            <span class="font-bold text-primary">{{
              nullText(carCharging?.totalPower)
            }}</span>
            <span>度</span>
          </div>
          <div class="flex">
            <span
              class="icon-shizhongfill iconfont text-10px text-hex-FDB901"
            ></span>
            <span class="ml-4px mr-6px">剩余时间</span>
            <span class="font-bold text-primary">{{
              carBehavior?.remainingChargingTime == 1441
                ? '--'
                : nullText(carBehavior?.remainingChargingTime)
            }}</span>
            <span>分钟</span>
          </div>
        </div>
        <div class="flex flex-col justify-between">
          <nut-button
            shape="square"
            size="mini"
            class="rounded-sm w-70px mb-10px"
            @click="handleCarPos"
          >
            车辆位置
          </nut-button>
          <nut-button
            shape="square"
            size="mini"
            class="rounded-sm w-70px"
            :class="_color"
            @click="handleStop"
          >
            {{ ChargeMap[chargeState] }}
          </nut-button>
        </div>
      </section>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue';
// import dayjs from 'dayjs';
import { nullText, nrNavigateTo, jGcustomCount, JG } from '@/utils/index';
import { chargeSocketStore } from '@/stores/chargeStore';
import { useStop } from './useCharge';
let ChargeMap = {
  '1': '启动中',
  '2': '停止充电',
  '4': '已结束',
};
let visible = ref(false);

let props = withDefaults(
  defineProps<{ carCharging: any; carBehavior: any; vin: string }>(),
  {
    carCharging: () => {
      return {};
    },
    carBehavior: () => {
      return {};
    },
    vin: '',
  }
);
let emits = defineEmits(['fixStartChargeSeqStat']);
let chargeState = computed(() => {
  if (props?.carCharging?.startChargeSeqStat == 2) {
    return '2';
  }
  if (chargeSocketStore().countDown == 0) {
    return '2';
  }
  return '1';
});

let currentPower = computed(() => {
  let p =
    (Number(props?.carCharging?.voltageA) *
      Number(props?.carCharging?.currentA)) /
    1000;
  return Math.floor(p);
});
let usedTime = computed(() => {
  let time =
    new Date(props?.carCharging?.endTime || '')?.getTime() -
    new Date(props?.carCharging?.startTime || '')?.getTime();
  return Math.ceil(time / 1000 / 60);
});

const _color = computed(() => {
  if (props?.carCharging?.startChargeSeqStat == 2) {
    return {
      'text-red-700': true,
      'border-red-700': true,
      'border-opacity-40': true,
    };
  }

  return {
    'text-hex-E2A80A': true,
    'border-hex-E2A80A': true,
    'border-opacity-40': true,
  };
});
let { _stopCharge } = useStop();
function handleStop() {
  jGcustomCount(JG.CHARGE_007);
  _stopCharge({ vin: props.vin }, () => {
    emits('fixStartChargeSeqStat');
  });
}
function handleCarPos() {
  nrNavigateTo('use-car-summary', {
    showMove: false,
    vin: props?.vin,
  });
}
</script>
