<template>
  <CustomBar background-color="#fff" class="fixed" :shadow="true">
    <template #title>转账汇款</template>
  </CustomBar>
  <div
    :style="{ paddingTop: `${CalcPt}px` }"
    class="text-center text-normal text-14px"
  >
    <div class="mt-50px mb-30px">{{ bankData?.company }}转账汇款信息</div>
    <div class="m-auto w-234px h-76px mb-40px">
      <image
        :src="bankData?.staging_agency_img"
        mode="aspectFit"
        class="w-full h-full"
      ></image>
    </div>
    <div class="text-left pl-60px">
      <div class="my-22px">开户银行：{{ bankData?.staging_agency }}</div>
      <div class="my-22px">
        开户地址：{{ bankData?.staging_agency_address }}
      </div>
      <div class="my-22px">开户行号：{{ bankData?.staging_agency_no }}</div>
      <div class="my-22px">银行行号：{{ bankData?.bank_no }}</div>
    </div>
    <div class="px-36px my-50px">
      <nut-button
        class="w-full border border-solid border-hex-11264d text-normal"
        plain
        shape="square"
        @click="
          () => {
            copyText(
              `开户银行:${bankData?.staging_agency} 开户地址:${bankData?.staging_agency_address} 开户行号:${bankData?.staging_agency_no} 银行行号:${bankData?.bank_no}`
            );
          }
        "
        >复制</nut-button
      >
    </div>
    <section class="px-26px nrz-safe">
      <div class="flex leading-5 text-left">
        <div class="w-70px">温馨提示：</div>
        <div class="flex flex-col flex-1">
          <span>
            1.线下转账汇款后，请使用汇款转账记录联系您的交付专员，确定收款后您的订单装改会自动修改；
          </span>
          <span class="text-hex-8CD3E5">2.转账备注请添加订单编号；</span>
          <span class="text-red-500"
            >3.账汇款需核对确认后尾款支付状态才会变更，请勿重复操作！！！</span
          >
        </div>
      </div>
    </section>
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
import { ref, computed, onBeforeMount } from 'vue';
import CustomBar from '@/components/customHeader/index.vue';
import { systemInfo } from '@/stores/systemInfo';
import { copyText, CODE } from '@/utils/index';
import { getBank } from '@/api/index';

definePageConfig({
  transparentTitle: 'auto',
  titlePenetrate: 'YES',
  defaultTitle: '',
});

let CalcPt = computed(
  () => systemInfo().RightBtnRect.h + systemInfo().RightBtnRect.t + 10
);

let bankData = ref<any>({});
async function _getBank() {
  let { data, code } = await getBank({});
  if (code !== CODE) return;
  bankData.value = data;
}

onBeforeMount(() => {
  _getBank();
});
</script>
