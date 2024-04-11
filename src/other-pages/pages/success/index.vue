<template>
  <CustomBar
    :border="false"
    class="fixed"
    :bind-back="true"
    icon-color="#fff"
    @back="goHome"
  >
  </CustomBar>
  <div
    :style="{ paddingTop: `${CalcPt}px` }"
    class="h-full overflow-y-scroll text-center bg-gradient-to-b from-hex-bfc0c4 to-hex-eaeaea"
  >
    <div class="font-bold text-info text-20px mt-10px">恭喜您，预定成功</div>
    <div class="text-normal mt-16px">
      {{
        CarConfStore.state?.type?.includes('i') ? '为场景而生' : '纯电轻卡王'
      }}
      {{ '  ' }}
      {{ CarConfStore.state?.name }}
    </div>
    <NrImg
      :url="carUrl()"
      class="w-full bg-contain my-20px h-200px"
      :style="{ 'background-size': 'contain' }"
    ></NrImg>
    <div class="text-18px">{{ CarConfStore.state?.lead_time }}</div>
    <div class="text-12px mt-8px mb-35px">预计交付周期</div>
    <div class="box-border text-left pl-87px text-normal">
      预定成功，进入排单流程
    </div>
    <div class="my-10px">
      <img class="m-auto w-29px h-29px" :src="next" alt="" />
    </div>
    <div class="box-border text-left pl-87px text-normal">
      APP-我的-订单-车辆订单 中查看
    </div>
    <div class="my-10px">
      <img class="m-auto w-29px h-29px" :src="next" alt="" />
    </div>
    <div class="box-border text-left pl-87px text-normal">
      等待VIP客服联系通知线下提车
    </div>
    <div class="my-10px">
      <img class="m-auto w-29px h-29px" :src="next" alt="" />
    </div>
    <div class="box-border text-left pl-87px text-normal">
      使用前晨APP智能控车
    </div>
    <div class="mt-35px">
      <NrImg :url="QR" class="m-auto w-180px h-190px"></NrImg>
    </div>
    <div class="text-hex-000 opacity-36 mt-16px mb-60px">
      『 前晨汽车科技公众号 』
    </div>
    <div class="flex items-center justify-between px-20px mb-90px">
      <nut-button
        shape="square"
        class="border border-solid w-155px border-primary"
        @click="goOrder"
        >查看订单</nut-button
      >
      <nut-button
        shape="square"
        class="border border-solid w-155px border-primary bg-primary text-light-50"
        @click="goHome"
        >返回首页</nut-button
      >
    </div>
  </div>
</template>
<script lang="ts">
import { onShareAppMessage, onShareTimeline } from '@/utils/index';
import { useRouter } from '@tarojs/taro';
export default {
  onShareAppMessage,
  onShareTimeline,
};
</script>
<script lang="ts" setup>
import CustomBar from '@/components/customHeader/index.vue';
import { systemInfo, CarConf } from '@/stores';
import next from '@/assets/icons/next.png';
import { goPages, nrNavigateTo, QR } from '@/utils/index';
import NrImg from '@/components/img/img.vue';
import { computed } from 'vue';
const CarConfStore = CarConf();
definePageConfig({
  transparentTitle: 'always',
  titlePenetrate: 'YES',
  defaultTitle: '',
});
const { order_id } = useRouter().params;
let CalcPt = computed(
  () => systemInfo().RightBtnRect.h + systemInfo().RightBtnRect.t + 10
);
function carUrl() {
  return CarConfStore.state?.imgUrl;
}
function goHome() {
  goPages('index');
}
function goOrder() {
  nrNavigateTo('carOrderDetail', { order_id });
}
</script>
