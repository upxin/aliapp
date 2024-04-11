<template>
  <CustomBar background-color="#fff">
    <template #customLeft>
      <span @click="goMall">商城首页</span>
    </template>
    <template #title>{{ params?.orderStatus }}</template>
  </CustomBar>

  <FullLoading :loading="loading">
    <section>
      <div :style="{ paddingTop: `${headerHeight}px` }"></div>
      <view class="flex px-15px py-16px bg-fff mb-10px">
        <BgImg
          class="bg-center bg-cover w-120px h-120px z-999"
          only-img
          :url="detail?.imageUrl"
        >
        </BgImg>
        <view class="flex flex-col justify-between px-15px py-8px">
          <div class="">
            <view class="pb-20px text-16px">{{ detail?.title }}</view>
            <view class="flex opacity-40 text-12px">
              <span> {{ detail?.spec }}</span>
              <span class="ml-10px">x</span>
              <span>{{ detail?.amount }}</span>
            </view>
          </div>
          <view class="flex pt-20px">
            <div>实付：</div>
            <view class="flex items-center mr-30px">
              <view class="mr-6px nrz-thin">￥</view>
              <view>{{ detail?.payMoney }}</view>
            </view>
            <view class="flex items-center">
              <view class="icon-jinbi iconfont text-14px mr-6px nrz-thin"></view>
              <view>{{ detail?.payPoints }}</view>
            </view>
          </view>
        </view>
      </view>
      <div
        v-if="detail?.logisticsNumber"
        class="bg-fff pt-10px pb-15px px-15px mb-20px"
      >
        <nut-button class="w-100px" @click="naviToLogistics"
          >查看物流</nut-button
        >
      </div>
      <Verify :goodsVerifies="detail?.goodsVerifies"></Verify>

      <section
        class="overflow-hidden text-14px text-normal bg-hex-fff py-16px px-15px mb-10px"
      >
        <div
          class="font-bold border-0 border-solid border-primary leading-17px h-17px pl-10px border-l-3px mb-20px"
        >
          订单信息
        </div>
        <section class="pl-13px">
          <section class="flex my-10px">
            <div class="flex">
              <span class="opacity-50">订单编号：</span>
              <span>{{ detail?.orderId }}</span>
            </div>
            <span
              class="text-primary icon iconfont icon-copy ml-8px"
              @click="
                () => {
                  copyText(detail?.orderId);
                }
              "
            ></span>
          </section>
          <section class="flex my-10px">
            <div class="flex">
              <span class="opacity-50">交易单号：</span>
              <span>{{ detail?.outTradeNo }}</span>
            </div>
            <span
              class="text-primary icon iconfont icon-copy ml-8px"
              @click="
                () => {
                  copyText(detail?.outTradeNo);
                }
              "
            ></span>
          </section>
          <div class="flex my-10px">
            <span class="opacity-50">下单时间：</span>
            <span>
              {{ detail?.orderTime }}
            </span>
          </div>
        </section>
      </section>

      <section
        class="overflow-hidden text-14px text-normal bg-hex-fff py-16px px-15px mb-10px"
      >
        <div
          class="font-bold border-0 border-solid border-primary leading-17px h-17px pl-10px border-l-3px mb-20px"
        >
          支付信息
        </div>
        <section class="pl-13px">
          <div v-if="detail?.payType > 0" class="flex my-10px">
            <span class="leading-normal opacity-50">支付方式：</span>
            <span class="flex-1 leading-normal">{{
              payTypeMap[detail?.payType]
            }}</span>
          </div>
          <div v-if="detail?.payMoney" class="flex my-10px">
            <span class="leading-normal opacity-50">支付金额：</span>
            <span class="flex-1 leading-normal">{{ detail?.payMoney }}</span>
          </div>
          <div v-if="detail?.payPoints" class="flex my-10px">
            <span class="leading-normal opacity-50">使用积分：</span>
            <span class="flex-1 leading-normal">{{ detail?.payPoints }}</span>
          </div>
          <div v-if="detail?.payTime" class="flex my-10px">
            <span class="leading-normal opacity-50">支付时间：</span>
            <span class="flex-1 leading-normal">{{ detail?.payTime }}</span>
          </div>
        </section>
      </section>

      <section
        v-if="detail?.goodsType != 2"
        class="overflow-hidden text-14px text-normal bg-hex-fff py-16px px-15px mb-10px"
      >
        <div
          class="font-bold border-0 border-solid border-primary leading-17px h-17px pl-10px border-l-3px mb-20px"
        >
          物流信息
        </div>
        <div v-if="detail?.logisticsState" class="flex my-10px pl-13px">
          <span class="leading-normal opacity-50">物流状态：</span>
          <span class="flex-1 leading-normal">{{
            detail?.logisticsState
          }}</span>
        </div>

        <div class="flex my-10px">
          <span class="leading-normal opacity-50">收货信息：</span>
          <span class="flex-1 leading-normal">
            <span>{{ `${detail?.receiveName}${detail?.receiveMobile}` }}</span>
            <span>{{
              `${detail?.province}${detail?.city}${detail?.district}${detail?.address}`
            }}</span>
          </span>
        </div>

        <div v-if="detail?.logisticsCompany" class="flex my-10px">
          <span class="leading-normal opacity-50">配送方式：</span>
          <span class="flex-1 leading-normal">{{
            detail?.logisticsCompany
          }}</span>
        </div>

        <div v-if="detail?.deliveryTime" class="flex my-10px">
          <span class="leading-normal opacity-50">发货时间：</span>
          <span class="flex-1 leading-normal">{{
            detail?.deliveryTime || ''
          }}</span>
        </div>

        <div v-if="detail?.signTime" class="flex my-10px">
          <span class="leading-normal opacity-50">签收时间：</span>
          <span class="flex-1 leading-normal">{{
            detail?.signTime || ''
          }}</span>
        </div>
      </section>

      <section
        class="overflow-hidden text-14px text-normal bg-hex-fff py-16px px-15px mb-10px"
      >
        <div
          class="font-bold border-0 border-solid border-primary leading-17px h-17px pl-10px border-l-3px mb-20px"
        >
          备注信息
        </div>
        <div class="pl-13px">
          {{ detail?.memo }}
        </div>
      </section>

      <section
        class="overflow-hidden text-14px text-normal bg-hex-fff py-16px px-15px mb-20px"
      >
        <div
          v-if="detail?.commentScore"
          class="font-bold border-0 border-solid border-primary leading-17px h-17px pl-10px border-l-3px mb-20px"
        >
          评价信息
        </div>
        <div v-if="detail?.commentScore" class="my-10px">
          <span class="leading-normal opacity-50">{{
            detail?.commentTime
          }}</span>
          <nut-rate
            active-color="#FFC800"
            :model-value="detail?.commentScore"
            readonly
          />
        </div>
        <div class="flex justify-around py-60px bg-fff">
          <nut-button
            class="w-120px"
            @click="
              () => {
                makePhoneCall(NEWRIZON_TEL);
              }
            "
          >
            <div class="flex items-center justify-around">
              <span class="icon-phone iconfont"></span>
              <span class="ml-4px">客服电话</span>
            </div>
          </nut-button>
          <nut-button class="w-120px" @click="_onlineKefu">
            <div class="flex items-center justify-around">
              <span class="iconfont icon-message"></span>
              <span class="ml-4px">在线客服</span>
            </div>
          </nut-button>
        </div>
      </section>
    </section>
  </FullLoading>
</template>
<script lang="ts">
import { onShareAppMessage, onShareTimeline } from '@/utils/index';
import Verify from './verify.vue';
export default {
  onShareAppMessage,
  onShareTimeline,
};
</script>
<script lang="ts" setup>
import CustomBar from '@/components/customHeader/index.vue';
import FullLoading from '@/components/full-loading/index.vue';
import Taro, { usePullDownRefresh, useRouter } from '@tarojs/taro';
import { getMallOrderDetail } from '@/api/index';
import {
  copyText,
  makePhoneCall,
  onlineKefu,
  NEWRIZON_TEL,
  nrNavigateTo,
  payTypeMap,
  goPages,
} from '@/utils/index';
import { useHeaderHeight, useRequest } from '@/hooks/index';
import BgImg from '@/components/bg-img/bg-img.vue';

definePageConfig({ navigationStyle: 'custom', enablePullDownRefresh: true });
//     UN_PAY(0, "待支付"),
//     NOT_SHIPPED(1, "待发货"),
//     YES_SHIPPED(2, "待收货"),
//     FINISHED(3, "已完成"),
//     CLOSED(4, "订单关闭"),

let { headerHeight } = useHeaderHeight();
let params = useRouter().params;
let {
  data: detail,
  loading,
  run,
} = useRequest(getMallOrderDetail, {
  immediate: true,
  params: {
    orderId: params?.orderId,
  },
});
function goMall() {
  goPages('shop');
}
function naviToLogistics() {
  let { logisticsNumber, logisticsType } = detail.value;
  nrNavigateTo('mallLogisticsInfo', {
    logisticsNumber,
    type: logisticsType,
  });
}
function _onlineKefu() {
  onlineKefu();
}
usePullDownRefresh(() => {
  run({}).then(() => {
    Taro.stopPullDownRefresh();
  });
});
// bottom
</script>
<style></style>
