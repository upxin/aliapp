<template>
  <CustomHeader iconColor="#fff" :border="false">
    <template #title>
      <span class="text-fff">{{ state?.licensePlateNumber || '' }}</span>
    </template>
  </CustomHeader>
  <FullLoading :loading="floading">
    <view class="box pb-40px">
      <div :style="{ paddingTop: `${headerHeight}px` }"></div>

      <view
        v-if="waiting"
        class="w-full h-260px flex justify-center items-center"
      >
        <div
          class="mx-auto text-info flex flex-col items-center justify-center rounded-full w-110px h-110px countDwon"
          @click="_stopCharge"
        >
          <span class="text-24px">
            {{ waiting ? waiting : '立即停止' }}
          </span>
          <span class="text-10px pt-10px">启动中...</span>
        </div>
      </view>
      <div
        v-else
        class="w-full box-border flex justify-center w-260px h-260px relative mx-auto"
      >
        <img :src="PIC" alt="" class="absolute w-full h-full" />
        <NrProgress
          class="w-full h-full z-100"
          :radius="radius"
          :progressCanvasId="'noCarCharge'"
          :percent="percent"
          :progressWidth="8"
        ></NrProgress>
      </div>
      <view
        class="flex justify-center items-end"
        style="color: rgba(154, 241, 251, 1)"
      >
        <view class="text-28px font-bold">{{ restHour }}</view>
        <view class="nrz-thin mx-6px"> 小时 </view>
        <view class="text-28px font-bold mr-6px">{{ restMiunites }}</view>
        <view class="nrz-thin"> 分钟 </view>
      </view>
      <view class="predict nrz-thin mb-24px mt-10px">预估剩余充电时间</view>

      <section class="flex justify-between px-30px mb-27px">
        <view
          class="flex flex-col justify-center items-center"
          style="color: rgba(127, 229, 249, 0.63)"
        >
          <view
            class="text-16px font-bold mb-4px"
            style="color: rgba(154, 241, 251, 1)"
          >
            {{ nullText(state?.totalPower, 2) }}
          </view>
          <view class="nrz-thin text-12px mx-6px"> 已充电量(度) </view>
        </view>
        <view
          class="flex flex-col justify-center items-center"
          style="color: rgba(127, 229, 249, 0.63)"
        >
          <view
            class="text-16px font-bold mb-4px"
            style="color: rgba(154, 241, 251, 1)"
          >
            {{ nullText(state?.period) }}分钟
          </view>
          <view class="nrz-thin text-12px mx-6px"> 已充时长 </view>
        </view>
        <view
          class="flex flex-col justify-center items-center"
          style="color: rgba(127, 229, 249, 0.63)"
        >
          <view
            class="text-16px font-bold mb-4px"
            style="color: rgba(154, 241, 251, 1)"
          >
            {{ nullText(state?.totalMoney) }}
          </view>
          <view class="nrz-thin text-12px mx-6px"> 已经消费(元)</view>
        </view>
      </section>

      <section class="flex justify-between px-30px mb-27px">
        <view
          class="flex flex-col justify-center items-center"
          style="color: rgba(127, 229, 249, 0.63)"
        >
          <view
            class="text-16px font-bold mb-4px"
            style="color: rgba(154, 241, 251, 1)"
          >
            {{ nullText(state?.currentA, 2) }}
          </view>
          <view class="nrz-thin text-12px mx-6px"> 实时电流(A) </view>
        </view>
        <view
          class="flex flex-col justify-center items-center"
          style="color: rgba(127, 229, 249, 0.63)"
        >
          <view
            class="text-16px font-bold mb-4px"
            style="color: rgba(154, 241, 251, 1)"
          >
            {{ nullText(state?.voltageA, 2) }}
          </view>
          <view class="nrz-thin text-12px mx-6px"> 实时电压(V) </view>
        </view>
        <view
          class="flex flex-col justify-center items-center"
          style="color: rgba(127, 229, 249, 0.63)"
        >
          <view
            class="text-16px font-bold mb-4px"
            style="color: rgba(154, 241, 251, 1)"
          >
            {{
              nullText(
                formatThousands((state?.voltageA * state?.currentA) / 1000),
                2
              )
            }}
          </view>
          <view class="nrz-thin text-12px mx-6px">实时功率(kW)</view>
        </view>
      </section>

      <view style="background-color: #517381" class="p-10px nrz-thin mx-30px">
        <view style="color: rgba(154, 241, 251, 1)">
          结束充电码：{{ nullText(state?.identCode) }}
        </view>
        <view class="text-10px pt-6px" style="color: rgba(127, 229, 249, 0.63)"
          >如遇无法结束充电，可再充电桩输入上面的结束码停止充电</view
        >
      </view>

      <view
        class="rounded-full text-20px w-80px h-80px mt-40px mx-auto text-fff flex justify-center items-center"
        style="background-color: rgba(127, 229, 249, 1)"
        @tap="_stopCharge"
      >
        停止
      </view>
    </view>
  </FullLoading>
</template>
<script lang="ts" setup>
import NrProgress from './progress.vue';
import { computed, ref, onUnmounted } from 'vue';
import CustomHeader from '@/components/customHeader/index.vue';
import { useHeaderHeight } from '@/hooks';
import { getOtherCarChargingData, stopCharge } from '@/api/index';
import {
  getStore,
  USER_INFO,
  useToast,
  nullText,
  nrNavigateTo,
  goPages,
  formatThousands,
} from '@/utils';
import { useDidShow } from '@tarojs/taro';
import Taro from '@tarojs/taro';
import PIC from './pic.jpg';
import { systemInfo } from '@/stores/index';
import FullLoading from '@/components/full-loading/index.vue';

definePageConfig({
 transparentTitle: 'auto',
  titlePenetrate: 'YES',
  defaultTitle: '',  enablePullDownRefresh: true,
});
const { headerHeight } = useHeaderHeight();
let phone = getStore(USER_INFO)?.mobile;
let waiting = ref(60);
let radius = computed(() => {
  let r = systemInfo()?.app?.windowWidth;
  return (r / 414) * 80;
});
let orderId;
let licensePlateNum;
let floading = ref(true);
let state = ref<any>({
  estimatePeriod: 0,
  soc: 0,
});
let timer3;
let percent = computed(() => {
  return state?.value?.soc ? +state?.value?.soc : 0;
});
function _stopCharge() {
  Taro.showModal({
    title: '提示',
    showCancel: true,
    content: '是否结束充电',
    success(res) {
      if (res.confirm) {
        stopCharge({ vin: `nrz_${phone}` }).then((res) => {
          if (res?.code === 200) {
            setTimeout(() => {
              Taro.showModal({
                title: '提示',
                showCancel: true,
                confirmText: '查看订单',
                cancelText: '回到首页',
                content: '充电已结束',
                success(res) {
                  if (res.confirm) {
                    nrNavigateTo('chargeOrderList');
                  } else if (res.cancel) {
                    goPages('index');
                  }
                },
              });
            }, 1000);
          }
          useToast(res?.msg);
        });
      } else if (res.cancel) {
        console.log('用户点击取消');
      }
    },
  });
}
let timer2;
function getChargingInfo() {
  timer2 = setTimeout(() => {
    getChargingInfo();
  }, 10000);
  getOtherCarChargingData(`nrz_${phone}`)
    .then((res) => {
      floading.value = false;
      if (res?.code === 200) {
        state.value = res?.data;

        if (res.data?.startChargeSeqStat > 1) {
          waiting.value = 0;
          clearInterval(timer3);
        }

        if (res.data?.startChargeSeqStat != 4) {
          orderId = res.data?.startChargeSeq;
          licensePlateNum = res.data?.licensePlateNumber;
        }

        if (res.data?.startChargeSeqStat == 4) {
          clearTimeout(timer2);
          timer2 = null;
          Taro.showModal({
            title: '提示',
            showCancel: true,
            confirmText: '查看订单',
            content: '充电已结束',
            success(res) {
              if (res.confirm) {
                Taro.redirectTo({
                  url: `/chargeModule/pages/chargeOrderDetail/index?orderId=${orderId}&licensePlateNum=${licensePlateNum}`,
                });
              } else if (res.cancel) {
                console.log('用户点击取消');
              }
            },
          });
        }
      }
    })
    .catch(() => {
      floading.value = false;
    });
}
let restHour = computed(() => {
  let str = 0;
  if (state?.value?.estimatePeriod >= 60) {
    str = Math.floor(state.value?.estimatePeriod / 60);
  }
  return state?.value?.estimatePeriod ? str : '--';
});
let restMiunites = computed(() => {
  let str = 0;
  if (state?.value?.estimatePeriod >= 60) {
    str = state.value?.estimatePeriod % 60;
  } else {
    str = state.value?.estimatePeriod;
  }
  return str || '--';
});

useDidShow(() => {
  timer3 = setInterval(() => {
    if (waiting.value === 0) {
      clearInterval(timer3);
      timer3 = null;
      return;
    }
    waiting.value = waiting.value - 1;
  }, 1000);
  getChargingInfo();
});

onUnmounted(() => {
  clearTimeout(timer2);
  timer2 = null;
});
</script>
<style lang="scss">
.box {
  min-height: 100%;
  background: linear-gradient(to bottom, #033449, #4e717f);
}
.predict {
  color: rgba(127, 229, 249, 0.63);
  font-size: 12px;
  text-align: center;
}
.countDwon {
  background-image: linear-gradient(
    to bottom,
    rgb(200, 201, 203, 0.2),
    rgb(247, 247, 247, 0.2)
  );
  border: 10px solid rgb(204, 204, 204, 0.2);
}
</style>
