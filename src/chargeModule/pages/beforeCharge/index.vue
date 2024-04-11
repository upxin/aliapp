<template>
  <Full :loading="loading" :err="err" @re-load="init">
    <view class="px-16px nrz-thin nrz-safe">
      <Site
        :station="state.data?.station"
        :connector="state.data?.connector"
      ></Site>
      <view class="bg-main h-1px my-10px"></view>

      <Price
        :station="state.data?.station"
        :connector="state.data?.connector"
      ></Price>
      <view class="bg-main h-1px my-10px"></view>
      <Pay v-model:pay-type="payType" :isOpen="isOpen" :coin="coin"></Pay>
      <view class="bg-main h-1px my-10px"></view>
      <section>
        <div class="flex items-center">
          <span
            class="flex items-center justify-center bg-hex-04C3F6 mr-8px font-800 w-14px h-14px text-8px text-fff"
          >
            <span class="iconfont icon-youhuiquan1 text-12px"></span>
          </span>
          <span class="text-14px">优惠券</span>
        </div>
        <div
          style="background-color: rgba(154, 206, 247, 0.2)"
          class="leading-normal px-10px text-12px opacity-70 py-8px mt-15px text-12px flex justify-between items-center ml-22px"
          @tap.stop="toCouponList"
        >
          <view v-if="coupon.couponName">{{ coupon.couponName }}</view>
          <view v-else-if="availableCoupon">
            {{ availableCoupon }}张优惠券可用
          </view>
          <view v-else>暂无优惠券可用</view>
          <view
            class="iconfont icon-arrow-right-bold text-12px font-thin"
          ></view>
        </div>
      </section>
      <view class="bg-main h-1px my-10px"></view>
      <view :id="'car'"></view>
      <Cars v-model:currentCar="currentCar"></Cars>
      <section
        class="nrz-safe fixed z-100 bg-fff w-full left-0 bottom-0"
        style="box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.4)"
      >
        <view
          class="flex justify-between items-center w-full text-12px px-14px box-border py-20px"
        >
          <view
            :style="{
              color: currentCar?.licensePlateNum
                ? '#ff0606'
                : 'rgba(0,0,0,0.5)',
            }"
          >
            {{
              currentCar?.licensePlateNum
                ? currentCar?.licensePlateNum
                : '绑定车牌享电站停车政策'
            }}
          </view>
          <div class="flex flex-col items-center mr-auto pl-10px" @click="call">
            <span class="text-20px iconfont icon-phone"> </span>
            <span>客服</span>
          </div>
          <view :class="{ dis: waiting }" @tap.stop="openDialog">
            <view
              v-if="payType === 4"
              class="bg-primary ml-20px w-100px py-10px text-fff text-center"
            >
              启动充电
            </view>
            <view
              v-else
              class="text-fff py-10px px-14px rounded-full"
              style="background-color: #41b967"
              >使用微信支付分启动充电</view
            >
          </view>
        </view>
      </section>
    </view>
  </Full>
  <NrzModal
    v-model:show="show"
    title="开启充电"
    :buttons="buttons"
    @click="buttonTap"
  >
    <template #content>
      <view
        >{{ '确认给（' }}{{ currentCar?.licensePlateNum }}{{ '）充电？' }}</view
      >
    </template>
  </NrzModal>
  <tuiToast ref="toast" :content="timeout ? timeout + 's' : ''"></tuiToast>
</template>
<script lang="ts" setup>
import Full from '@/components/full-loading/index.vue';
import tuiToast from '@/components/tui-toast/tui-toast.vue';
import {
  makePhoneCall,
  NRZ_TEL,
  useToast,
  CODE,
  jGcustomCount,
  JG,
  nrNavigateTo,
  goPages,
  showCharginCar,
} from '@/utils';
import NrzModal from '@/components/nrz-modal/index.vue';
import {
  parseSite,
  isOpenWallet,
  walletDetail,
  beforeChargeCheck,
  confirmInfo,
  wechatCharge,
  getAvailableCoupon,
} from '@/api';
import { reactive, ref, onBeforeMount, watch } from 'vue';
import Site from './Site.vue';
import Price from './Price.vue';
import Pay from './Pay.vue';
import Cars from './Cars.vue';
import { useDidShow, useRouter } from '@tarojs/taro';
import Taro from '@tarojs/taro';
import { useGetNavigateBackParams } from '@/hooks/index';

let cid = 'XPQC-SH11295#248881';
definePageConfig({
  navigationBarTitleText: '电桩详情',
});
let buttons = [
  {
    text: '重选',
  },
  {
    text: '确定',
    color: '#586c94',
  },
];
let toast = ref();
let payType = ref(1);
let currentCar = ref<any>({});
let show = ref(false);
let loading = ref(true);
let state = reactive<any>({
  data: {},
});
let coin = ref(0);
let err = ref(false);
let params = useRouter()?.params;
let isOpen = ref(false);
let waiting = ref(false);
let coupon = ref({});
function _walletDetail() {
  walletDetail({}).then((res) => {
    if (res.code !== CODE) return;
    coin.value = res.data?.coin;
  });
}
function openDialog() {
  if (waiting.value) return;
  show.value = true;
}
function _isOpenWallet() {
  isOpenWallet({}).then((res) => {
    if (res.code !== CODE) return;
    isOpen.value = res?.data;

    if (res.data) {
      _walletDetail();
    }
  });
}
function buttonTap({ index }) {
  if (!payType.value) {
    useToast('请选择支付方式');
    return;
  }
  if (index === 1) {
    // ok
    sureCharge(payType.value);
    show.value = false;
  } else {
    show.value = false;
    Taro.pageScrollTo({
      scrollTop: 200,
      duration: 300,
    });
  }
}
function toCouponList() {
  if (availableCoupon.value < 1) return;
  nrNavigateTo('chooseCoupon', {
    discount: state.data.station?.discount,
    areaCode: state.data.station?.areaCode,
  });
}

function toChargingPage(otherVin) {
  const _vin = otherVin ? otherVin : currentCar.value?.vinCode;

  if (_vin?.startsWith('nrz_')) {
    Taro.redirectTo({
      url: `/noCarCharge/pages/chargingOtherCar/index?vin=${_vin}`,
    });
  } else {
    showCharginCar(_vin);
    Taro.switchTab({
      url: `/pages/index/index`,
    });
  }
}
const timeout = ref(100);
const orderId = ref('');
function sureCharge(payType) {
  if (!currentCar.value?.vinCode) return useToast('请选择车辆');
  Taro.showLoading({
    title: '启动中...',
  });
  waiting.value = true;
  beforeChargeCheck({
    payType,
    vin: currentCar.value?.vinCode || '',
    plateNum: currentCar?.value?.licensePlateNum || '',
    connectorId: params?.connectorId,
    couponId: coupon.value.couponId,
  }).then((res) => {
    Taro.hideLoading();
    if (res?.data?.timeout) {
      timeout.value = res?.data?.timeout;
    }

    if (res?.code !== CODE) {
      if (res?.code === -2) {
        Taro.showModal({
          title: '提示',
          confirmText: '查看',
          content: '当前有其他车辆正在充电,是否查看？',
          success(res2) {
            if (res2.confirm) {
              console.log('用户点击确定');
              // 设置充电车辆，回到首页会拉取soket
              toChargingPage(res?.msg);
            } else if (res2.cancel) {
              console.log('用户点击取消');
            }
          },
        });
        waiting.value = false;
        return;
      }
      waiting.value = false;
      useToast(res?.msg);
      return;
    }
    orderId.value = res?.data?.startChargeSeq;

    if (res.data?.confirmFlag) {
      const {
        mch_id,
        package: p,
        timestamp,
        nonce_str,
        sign_type,
        sign,
      } = res?.data?.packageData;
      let params = {
        mch_id,
        package: p,
        timestamp,
        nonce_str,
        sign_type,
        sign,
      };
      console.log(params, 111);
      my.navigateToMiniProgram({
        appId: 'wxd8f3793ea3b935b8',
        path: 'pages/use/use',
        extraData: params,
      });
      return;
    }

    // 完成充电前置校验后要去的地方
    jGcustomCount(JG.CHARGE_004);
    toChargingPage();
    useToast(res?.msg);
    waiting.value = false;
  });
}
function call() {
  makePhoneCall(state?.data?.stationTel || state?.data?.serviceTel || NRZ_TEL);
}
const availableCoupon = ref(0);
function init() {
  parseSite({
    qrCode: params?.qrCode,
    connectorId: params?.connectorId || cid,
  })
    .then((res) => {
      err.value = false;
      loading.value = false;
      if (res?.code !== 200) return useToast(res?.msg);
      state.data = res?.data;
      getAvailableCoupon({
        serviceType: 'charge',
        areaCode: res.data.station?.areaCode,
      })
        .then((res) => {
          loading.value = false;
          availableCoupon.value = res?.data;
        })
        .catch(() => {
          loading.value = false;
          err.value = true;
        });
    })
    .catch(() => {
      loading.value = false;
      err.value = true;
    });
}
onBeforeMount(() => {
  init();
});
useDidShow(() => {
  coupon.value = useGetNavigateBackParams('coupon') || {};
  _isOpenWallet();
});
// 打开微信支付分后  回来开始轮询
function _confirmInfo() {
  confirmInfo(orderId.value).then((res) => {
    if (res?.code === CODE) {
      if (res?.data?.confirm) {
        // 微信支付分通过
        wechatCharge(orderId.value)
          .then((resp) => {
            waiting.value = false;
            clearTimeout(timeoutClear);
            toast.value.close();

            if (resp?.code === CODE) {
              toChargingPage();
              return;
            } else {
              waiting.value = false;
              useToast(resp?.msg);
            }
          })
          .catch((err) => {
            waiting.value = false;
            useToast(err);
            toast.value.close();
          });
      } else {
        setTimeout(() => {
          _confirmInfo();
        }, 3000);
      }
    } else {
      waiting.value = false;
      toast.value.close();

      useToast(res?.msg);
      // 异常了
    }
  });
}
let initLoad = true;
let timeoutClear;
useDidShow(() => {
  if (initLoad) {
    initLoad = false;
    return;
  }
  if (!orderId.value) return;
  if (payType.value != 1) return;

  toast.value.show({ title: '确认中...' });

  _confirmInfo();
  if (timeout.value) {
    timeoutClear = setInterval(() => {
      timeout.value = timeout.value - 1;
      if (timeout.value <= 0) {
        clearTimeout(timeoutClear);
        toast.value.close();
        useToast('确认超时');
      }
    }, 1000);
  }
});

watch([payType, currentCar], () => {
  waiting.value = false;
});
</script>
<style>
page {
  background-color: #fff;
}
.dis {
  filter: grayscale(100%);
}
</style>
