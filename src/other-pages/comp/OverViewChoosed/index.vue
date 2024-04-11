<template>
  <div class="box-border overflow-hidden px-20px text-primary text-14px">
    <div class="font-bold text-16px pt-23px mb-22px">车辆价格明细</div>
    <div v-if="showType" class="flex justify-between">
      <span>购车类型</span>
      <span>
        <NrzRadioGroup v-model:model-value="buyType">
          <NrzRadio value="0"> 个人购车 </NrzRadio>
          <NrzRadio value="1"> 企业购车 </NrzRadio>
        </NrzRadioGroup>
      </span>
    </div>
    <div
      v-for="(k, i) in list"
      :key="i"
      class="flex justify-between text-12px my-10px pr-6px"
    >
      <span class="opacity-40 flex-1">{{ k?.description }}</span>
      <span> ￥{{ formatThousands(k?.price, 2) }}</span>
    </div>
    <div
      v-if="extraMoney != 0"
      class="flex justify-between text-12px my-10px pr-6px"
    >
      <span class="opacity-40 flex-1">国家补贴</span>
      <span class="text-danger"> ￥{{ formatThousands(extraMoney, 2) }} </span>
    </div>
    <div class="flex justify-between mt-10px pr-6px mt-34px">
      <span>总价</span>
      <span>
        ￥{{ formatThousands(CarConfStore.state.totalPrice || '') }}
      </span>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { store, CarConf } from '@/stores/index';
import { formatThousands } from '@/utils/index';
import { nextTick } from '@tarojs/taro';
import { computed, watch, ref, onBeforeMount } from 'vue';
import NrzRadio from '@/components/nrz-radio/index.vue';
import NrzRadioGroup from '@/components/nrz-radio-group/index.vue';
defineProps({
  showType: {
    type: Boolean,
    default: true,
  },
});

const CarConfStore = CarConf();

const Store = store();

const buyType = computed({
  get: () => {
    return Store.choosedBuyType;
  },
  set: (v) => {
    Store.setChoosedBuyType(v);
  },
});
const list = ref<any[]>([]);
const discountPrice = ref(0);
const extraMoney = ref(0);
onBeforeMount(() => {
  // hack 配置预览不显示
  _UpdateView();
});

function _UpdateView() {
  list.value = [
    {
      description: CarConfStore.state?.name,
      price: CarConfStore.state?.basePrice,
    },
    CarConfStore.state.color ?? {},
    CarConfStore.state?.box ?? {},
    ...(CarConfStore.state?.optional ?? []),
  ].filter((item) => item?.description);

  const all =
    list.value.reduce((p, c) => {
      const c1 = c?.price ?? 0;
      return p + c1 * 10000;
    }, 0) / 10000;

  // 折扣
  const discount =
    list.value.reduce((p, c) => {
      const c1 = c?.priceDiscount ?? 0;
      return p + c1 * 10000;
    }, 0) / 10000;
  discountPrice.value = discount;

  // 国家补贴
  const extra =
    (CarConfStore.state.extra ?? []).reduce((p, c) => {
      const c1 = c?.price ?? 0;
      return p + c1 * 10000;
    }, 0) / 10000;
  extraMoney.value = extra;

  const finalPrice = discount + all + extra;

  nextTick(() => {
    CarConfStore.setState('totalPrice', finalPrice);
  });
}
watch(
  () => CarConfStore.state,
  (v) => {
    if (v) {
      _UpdateView();
    }
  },
  {
    deep: true,
    immediate: true,
  }
);
// bottom
</script>
