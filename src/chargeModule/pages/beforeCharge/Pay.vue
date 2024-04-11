<template>
  <section>
    <view class="flex items-center">
      <view
        style="background-color: #03db2e"
        class="flex text-fff items-center justify-center mr-8px font-bold w-14px h-14px text-8px"
      >
        <view>C</view>
      </view>
      <view class="text-14px">支付类型</view>
    </view>
    <section class="bg-fleet ml-22px">
      <view
        v-for="item in payList"
        :key="item.payType"
        class="bg-fleet flex items-center px-14px py-16px mt-15px text-14px"
        @click="changePayType(item.payType)"
      >
        <NrzImg
          only-img
          class="w-35px h-35px"
          mode="scaleToFill"
          :url="item.icon"
        ></NrzImg>
        <view class="mx-10px text-12px">
          <view class="mb-4px">{{ item.title }}</view>
          <view class="opacity-40">{{ item.remark }}</view>
        </view>

        <template v-if="item.payType === 4">
          <view v-if="isOpen" class="mx-10px flex flex-col items-center">
            <view class="opacity-40 text-10px mb-4px"
              >余额 <text class="text-16px">{{ coin }}</text> 币</view
            >
            <view
              style="text-decoration: underline; color: #2085ec"
              @tap.stop="buy"
              >购买</view
            >
          </view>
          <view v-else @tap.stop="open">开通钱包</view>
          <span
            class="icon-check- iconfont ml-auto text-28px"
            :style="{ color: payType === 4 ? 'rgba(241, 138, 48, 1)' : '#ddd' }"
          ></span>
        </template>
        <template v-if="item.payType === 1">
          <span
            class="icon-check- iconfont ml-auto text-28px"
            :style="{ color: payType === 1 ? 'rgba(241, 138, 48, 1)' : '#ddd' }"
          ></span>
        </template>
      </view>
    </section>
  </section>
</template>
<script lang="ts" setup>
import NrzImg from '@/components/img/img.vue';
import { nrNavigateTo } from '@/utils';
import { onBeforeMount, ref } from 'vue';
import { payTypeList } from '@/api';

interface P {
  isOpen: boolean;
  coin?: string | number;
  payType: number;
}
const emits = defineEmits(['update:payType']);
withDefaults(defineProps<P>(), {
  isOpen: false,
  coin: 0,
  payType: 0,
});

function open() {
  nrNavigateTo('chargeWalletHome');
}
function buy() {
  nrNavigateTo('chargeWalletCoinBuy');
}

let payList = ref<any[]>([]);
function changePayType(v) {
  emits('update:payType', v);
}
onBeforeMount(() => {
  payTypeList().then((res) => {
    payList.value = res.data;
  });
});
</script>
