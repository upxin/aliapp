<template>
  <section
    class="w-80px bg-fff ml-10px flex flex-col justify-center items-center py-10px box-border shadow-sm"
    @click.stop="state.show = true"
  >
    <view
      class="iconfont icon-dengguangyaokongqi text-60px font-thin mb-20px opacity-70"
    ></view>
    <view class="nrz-thin">远程控车</view>
  </section>
  <NrzOverlay
    v-model:show="state.show"
    :duration="300"
    bg="rgba(0,0,0,0.2)"
    :maskClosable="false"
  >
    <view
      style="z-index: 99999"
      class="tui-text relative control-car w-220px px-20px py-10px box-border rounded-20px x-center"
      @click.stop="() => {}"
    >
      <section
        v-if="state.initLoading"
        style="background-color: #d1d1d1"
        class="absolute top-0 left-0 w-full h-full flex justify-center items-center z-999 rounded-20px"
      >
        <view class="icon-loading iconfont text-40px rotate text-info"></view>
      </section>

      <view class="flex justify-between items-center">
        <view class="w-30px h-30px"></view>
        <view class="w-20px h-3px bg-black"></view>
        <view
          class="w-40px h-40px rounded-full bg-fff shadow-md flex justify-center items-center"
          @click.stop="state.show = false"
        >
          <view class="iconfont icon-open text-14px font-extrabold"></view>
        </view>
      </view>
      <view class="text-30px text-center py-30px">iC1</view>

      <section
        class="rounded-10px shadow-md px-18px py-24px relative"
        style="background-image: linear-gradient(#e5e5e5, #cfcfcf)"
      >
        <section
          v-if="state.ktLoading"
          style="background-color: rgba(0, 0, 0, 0.2)"
          class="absolute top-0 left-0 w-full h-full flex justify-center items-center z-999 rounded-10px"
        >
          <view class="icon-loading iconfont text-24px rotate text-info"></view>
        </section>
        <section class="flex justify-between items-center pb-30px">
          <view
            class="iconfont icon-fengshan text-40px"
            :class="{ rotate: state.isOpenKt }"
          ></view>
          <NrzSwitch
            v-model:checked="state.isOpenKt"
            scaleRatio="1"
            @change="changeSwitch"
          ></NrzSwitch>
        </section>

        <section class="flex justify-between items-center">
          <span
            class="icon-arrow-right-bold iconfont text-24px"
            style="transform: rotateZ(-180deg)"
            @click="openKt(-1)"
          ></span>
          <view class="flex items-end">
            <NrzNumber
              :value="state.temperature"
              color="#101010"
              :size="36"
            ></NrzNumber>
            <span class="ml-4px">°C</span>
          </view>
          <span
            class="icon-arrow-right-bold iconfont text-24px"
            @click="openKt(1)"
          ></span>
        </section>
      </section>

      <section class="flex justify-between pt-30px">
        <view
          class="rounded-40px px-28px h-46px shadow-md flex items-center justify-center"
          style="background-color: #d1d1d1"
          @click="lockCar"
        >
          <template v-if="state.lockLoading">
            <view
              class="icon-loading iconfont text-24px rotate text-info"
            ></view>
          </template>
          <template v-else>
            <view class="w-24px h-28px flex justify-center items-center">
              <view
                v-if="state.isLock"
                class="iconfont icon-lock text-28px"
              ></view>
              <view v-else class="icon-unlock iconfont text-28px"></view>
            </view>
          </template>
        </view>

        <view
          class="rounded-40px px-28px h-46px shadow-md flex items-center justify-center"
          style="background-color: #d1d1d1"
          @click="findCar"
        >
          <template v-if="state.findingLoading">
            <view
              class="icon-loading iconfont text-24px rotate text-info"
            ></view>
          </template>
          <view v-else class="iconfont icon-vehicleSearch text-26px"></view>
        </view>
      </section>
      <Footer></Footer>
    </view>
  </NrzOverlay>
</template>
<script setup lang="ts">
import { reactive, onMounted, onBeforeMount, ref, watch } from 'vue';

import NrzOverlay from '@/components/nrz-overlay/index.vue';
import NrzSwitch from '@/components/nrz-switch/index.vue';
import NrzNumber from '@/components/numberScroll/index.vue';
import Footer from '@/components/nrz-footer/index.vue';

import HmacSHA256 from 'crypto-js/hmac-sha256';
import EncHex from 'crypto-js/enc-hex';

import {
  commandDown,
  getRemoteControlResult,
  getVehCtrState,
} from '@/api/home';
import { homeStore } from '@/stores';
import { USER_INFO, getStorage, useToast, isCH } from '@/utils';
import dayjs from 'dayjs';
import Taro, { nextTick, useDidShow } from '@tarojs/taro';

const state = reactive({
  show: false,

  isOpenKt: false,
  temperature: 20,
  isLock: false,
  findCarFlag: false, // 无实际页面效果 changeStatus要用

  lockLoading: false,
  findingLoading: false,
  ktLoading: false,

  initLoading: false,
});
const user = ref();

function createUid() {
  return `${dayjs().format('YYYYMM')}${new Date().getTime()}`;
}

function closeLoading(loadingName) {
  state[loadingName] = false;
}
function changeStatus(controlName, val) {
  console.log(controlName, val, 99999);
  state[controlName] = val;
}
function _getResult(id, loadingName, controlName) {
  let defaultTimeOut = 15;
  let timeout = defaultTimeOut;
  let delay = 2000;

  const getRet = () => {
    getRemoteControlResult({
      vin: homeStore().state.currentCar?.vin,
      flowId: id,
    }).then((res) => {
      if (res.data?.controlResult != 1) {
        setTimeout(() => {
          timeout = timeout - 1;
          if (timeout <= 0) {
            useToast(res.data?.controlResultText || '请求超时');
            timeout = defaultTimeOut;

            closeLoading(loadingName);
            if (controlName === 'isOpenKt') {
              init();
            }
            return;
          }
          getRet();
        }, delay);
      } else {
        useToast(res.data?.controlResultText || '操作成功');

        // 因为空调是按钮状态先显示的
        if (controlName != 'isOpenKt') {
          changeStatus(controlName, true);
        }
        // false为解锁
        if (controlName == 'isLock') {
          changeStatus(controlName, false);
        }
        closeLoading(loadingName);
      }
    });
  };
  getRet();
}
function _command(
  controlInstruction,
  parameterValue,
  id,
  loadingName,
  controlName
) {
  const timestamp = new Date().getTime();
  let sign = `nonce=${id}&timestamp=${timestamp}&key=jNYlxvK3g6OvSgOkC7XyNEv5PwOGY3od`;
  sign = HmacSHA256(sign, 'jNYlxvK3g6OvSgOkC7XyNEv5PwOGY3od');
  // 使用16进制的方法加密，输出字符串
  sign = EncHex.stringify(sign).toLocaleUpperCase();

  commandDown(
    {
      time: new Date().getTime(),
      vin: homeStore().state.currentCar?.vin,
      sequenceId: id,
      userId: 'NEWRIZONAPPID' + user.value?.member_id,
      controlParameter: {
        controlInstruction,
        parameterValue,
      },
    },
    { nonce: id, timestamp, sign }
  )
    .then((res) => {
      if (res.data === true) {
        _getResult(id, loadingName, controlName);
      } else {
        const str = isCH(res.msg) ? res.msg : '系统错误';
        closeLoading(loadingName);
        if (controlName === 'isOpenKt') {
          init();
        }
        useToast(str);
      }
    })
    .catch(() => {
      closeLoading(loadingName);
      if (controlName === 'isOpenKt') {
        init();
      }
    });
}

function findCar() {
  if (state.findingLoading) return;
  state.findingLoading = true;
  _command(5, 3, createUid(), 'findingLoading', 'findCarFlag');
}

// 开关车门
function lockCar() {
  if (state.lockLoading) return;
  state.lockLoading = true;
  nextTick(() => {
    _command(16, state.isLock ? 1 : 2, createUid(), 'lockLoading', 'isLock');
  });
}

// controlInstruction== 5:寻车，16:车门控制，71:空调温度控制，64:空调关闭
// parameterValue == 寻车(3:闪灯鸣笛)，车门控制（1:解锁，2:上锁），空调温度控制（15-30，最小单位1），空调关闭：2
function openKt(num: number) {
  state.temperature = state.temperature + num;

  if (num != 0 && state.isOpenKt == false) {
    return;
  }

  nextTick(() => {
    state.ktLoading = true;
    _command(71, state.temperature, createUid(), 'ktLoading', 'isOpenKt');
  });
}
function changeSwitch(v) {
  if (v) {
    openKt(0);
  } else {
    state.ktLoading = true;
    _command(64, 2, createUid(), 'ktLoading', 'isOpenKt');
  }
}

function init() {
  getVehCtrState({
    vin: homeStore().state.currentCar?.vin,
  })
    .then((res) => {
      state.initLoading = false;
      if (res.code == 200) {
        state.temperature = +res?.data?.vbuFrntTemp;
        state.isOpenKt = res?.data?.vbuAirCondSwt == 1;
        state.isLock = res?.data?.bcmDoorLockStatus == 1;
      }
    })
    .catch(() => {
      state.initLoading = false;
      useToast('服务错误');
    });
}
onBeforeMount(() => {
  getStorage(USER_INFO).then((res) => {
    user.value = res;
  });
});
useDidShow(() => {
  if (user.value) return;
  getStorage(USER_INFO).then((res) => {
    user.value = res;
  });
});
watch(
  () => state.show,
  (v) => {
    if (v) {
      state.initLoading = true;
      init();
    }
  }
);
</script>
<style>
.control-car {
  background-image: linear-gradient(#fff, #afafaf);
}
</style>
