<template>
  <CustomBar class="fixed" background-color="#eee">
    <template #title> 维修订单详情 </template>
  </CustomBar>
  <div
    :style="{ paddingTop: `${CalcPt}px` }"
    class="box-border h-full overflow-y-auto bg-gray-300 pb-50px"
  >
    <section class="text-14px text-normal bg-hex-fff pb-10px mb-5px pt-16px">
      <aside class="overflow-hidden px-16px">
        <div class="flex items-center justify-between mb-20px opacity-62">
          <div class="flex items-center">
            <span class="bg-blue-500 rounded-full w-16px h-16px mr-6px"></span>
            <span>常规保养</span>
          </div>
          <div>{{ '门店详情》' }}</div>
        </div>
        <div class="my-16px opacity-62">门店名称：</div>
        <div class="my-16px opacity-62">门店名称：</div>
        <div class="my-16px opacity-62">门店名称：0123-23134</div>
      </aside>
    </section>
    <section
      class="overflow-hidden text-14px text-normal bg-hex-fff pb-10px mb-5px"
    >
      <aside class="px-16px mt-14px">
        <div
          class="font-bold border-0 border-orange-400 border-solid leading-17px h-17px pl-10px border-l-2px mb-20px"
        >
          订单信息
        </div>
        <div class="flex leading-normal my-16px opacity-62">
          <span>门店名称：</span>
          <span class="flex-1">张江高科</span>
        </div>
        <div class="flex items-center my-16px opacity-62">
          <div>订单编号：123132</div>
          <span
            class="text-primary icon iconfont icon-copy ml-8px"
            @click="
              () => {
                copyText('');
              }
            "
          ></span>
        </div>
        <div class="flex leading-normal my-16px opacity-62">
          <span>问题描述：</span>
          <span class="flex-1"
            >爱神的箭啊爱神的箭啊爱神的箭啊爱神的箭啊爱神的箭啊爱神的箭啊爱神的箭啊</span
          >
        </div>
      </aside>
    </section>
    <section
      class="overflow-hidden text-14px text-normal bg-hex-fff pb-10px mb-5px"
    >
      <aside class="px-16px mt-14px">
        <div
          class="font-bold border-0 border-orange-400 border-solid leading-17px h-17px pl-10px border-l-2px mb-20px"
        >
          联系信息
        </div>
        <div class="flex leading-normal my-16px opacity-62">
          <span>门店名称：</span>
          <span class="flex-1">张江高科</span>
        </div>
      </aside>
    </section>
    <section
      class="overflow-hidden text-14px text-normal bg-hex-fff pb-10px mb-5px"
    >
      <aside class="px-16px mt-14px">
        <div
          class="font-bold border-0 border-orange-400 border-solid leading-17px h-17px pl-10px border-l-2px mb-20px"
        >
          联系信息
        </div>
        <div class="flex leading-normal my-16px opacity-62">
          <span>门店名称：</span>
          <span class="flex-1">张江高科</span>
        </div>
      </aside>
    </section>
    <section class="overflow-hidden text-14px text-normal bg-hex-fff pb-20px">
      <aside class="px-16px mt-14px">
        <div
          class="font-bold border-0 border-orange-400 border-solid leading-17px h-17px pl-10px border-l-2px mb-20px"
        >
          评论信息
        </div>
        <div class="flex justify-center leading-normal my-30px">
          <nut-button
            class="w-full border-hex-11264d text-hex-11264d"
            @click="
              () => {
                nrNavigateTo('comment');
              }
            "
            >评论得积分</nut-button
          >
        </div>
      </aside>
    </section>
  </div>
  <div
    class="fixed bottom-0 flex justify-between w-full h-50px bg-hex-fff shadow-top"
  >
    <nut-button
      class="flex-1 h-full"
      @click="
        () => {
          makePhoneCall(phone);
        }
      "
    >
      <div class="flex items-center justify-center">
        <span class="iconfont icon-phone text-primary"></span>
        <div class="h-20px leading-20px ml-10px">客服电话</div>
      </div>
    </nut-button>
    <div class="h-full bg-gray-300 w-1px"></div>
    <nut-button class="flex-1 h-full">
      <div class="flex items-center justify-center animate-flip">
        <span class="iconfont icon-message"></span>
        <div class="h-20px leading-20px ml-10px">极速咨询</div>
      </div>
    </nut-button>
  </div>
</template>

<script lang="ts">
import { onShareAppMessage, onShareTimeline } from '@/utils/index';
export default {
  onShareAppMessage,
  onShareTimeline,
};
</script>

<script lang="ts" setup>
import CustomBar from '@/components/customHeader/index.vue';
import { systemInfo } from '@/stores/systemInfo';
import { copyText, nrNavigateTo, makePhoneCall } from '@/utils/index';
import { ref, computed } from 'vue';

definePageConfig({ transparentTitle: 'always',titlePenetrate: 'YES',defaultTitle: '', });

const phone = ref('136');
let CalcPt = computed(
  () => systemInfo().RightBtnRect.h + systemInfo().RightBtnRect.t + 10
);
</script>
