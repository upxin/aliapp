<template>
  <div class="box-border overflow-hidden px-16px nrz-extra text-primary">
    <view class="text-center py-10px text-20px"
      >前晨{{ carConfLocal?.typeText }}</view
    >
    <view class="flex justify-center py-20px">
      <LazyImg
        :src="carConfLocal?.imgUrl"
        :height="210"
        :width="270"
        mode="aspectFit"
      />
    </view>
    <div class="w-full text-center text-normal text-18px mb-27px">
      <div class="py-20px">
        ￥{{ formatThousands(carConfLocal?.amount ?? 0, 2) }}
      </div>
      <div class="w-full text-center text-normal opacity-50 text-10px mt-6px">
        * 实际价格以支付定金时刻为准，此处为选配时的参考价格。
      </div>
    </div>

    <div class="flex justify-between text-12px px-28px nrz-thin text-normal">
      <div class="overflow-hidden w-200px overflow-ellipsis whitespace-nowrap">
        {{ description }}
      </div>
      <div class="flex items-center" @click="reSelect">
        <div class="mr-4px">
          {{ carConfLocal?.more?.title ?? '重选配置' }}
        </div>
        <span
          class="iconfont text-normal icon-arrow-right-bold text-10px"
        ></span>
      </div>
    </div>
    <div class="flex items-center justify-center px-26px py-16px">
      <NrzBtn v-if="store().openPrepay" class="w-full py-14px" @click="prePay">
        即刻预定
      </NrzBtn>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, ref } from 'vue';
import LazyImg from '@/components/nrz-img/index.vue';
import {
  getStore,
  formatThousands,
  USER_INFO,
  nrNavigateTo,
  Routes,
  getStorage,
  CAR_CONF,
} from '@/utils/index';
import { store } from '@/stores/index';
import NrzBtn from '@/components/nrz-button/index.vue';
import { onBeforeMount } from 'vue';

const carConfLocal = ref<Record<string, any>>({});

const description = computed(() => {
  return carConfLocal.value?.options
    ?.map((item) => item?.description)
    ?.join(' 丨 ');
});

function reSelect() {
  nrNavigateTo(
    carConfLocal.value?.more?.router ?? Routes.carConfig,
    carConfLocal.value?.more?.router ? {} : { type: carConfLocal.value?.type }
  );
}
function prePay() {
  if (!getStore(USER_INFO)) {
    nrNavigateTo('login', { url: '/other-pages/pages/bookCar/index' });
    return;
  } else {
    nrNavigateTo('bookCar');
  }
}
onBeforeMount(() => {
  getStorage(CAR_CONF).then((res: any) => {
    carConfLocal.value = res;
  });
});
</script>
