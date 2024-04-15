<template>
  <div
    :style="{ paddingTop: pt }"
    class="box-border overflow-hidden bg-center bg-contain px-16px nrz-extra text-primary bg-no-repeat"
  >
    <div class="w-full text-center text-20px nrz-regular mt-16px">
      {{ delivered?.title }}
    </div>

    <view class="flex justify-center py-20px">
      <LazyImg
        :src="delivered.imgUrl"
        :height="210"
        :width="270"
        mode="aspectFit"
      />
    </view>

    <div class="flex items-center justify-center w-full text-16px">
      <span class="text-normal text-28px mx-4px nrz-regular">
        已预定 {{ ' ' }}{{ delivered.days }}{{ ' ' }}天
      </span>
    </div>
    <div
      v-if="delivered?.cycle"
      class="text-center text-12px text-normal nrz-thin pb-30px pt-26px"
    >
      {{ delivered.cycle }}
    </div>
    <div class="text-center text-12px text-normal nrz-thin">
      您的车辆正在等待交付，届时您的交付专员会联系您做交车准备
    </div>
    <div
      class="flex items-center justify-center px-16px h-120px"
      @click="nrNavigateTo(delivered.router)"
    >
      <NrzBtn class="w-full h-40px leading-40px">
        {{ delivered?.name || '联系专员' }}
      </NrzBtn>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { makePhoneCall, NEWRIZON_TEL, nrNavigateTo } from '@/utils/index';
import LazyImg from '@/components/nrz-img/index.vue';
import NrzBtn from '@/components/nrz-button/index.vue';
import { computed } from 'vue';
import { homeStore } from '@/stores';
defineProps({
  pt: {
    default: '0',
    type: String,
  },
});

const delivered = computed(() => {
  return homeStore().state.currentDeliveries;
});
</script>
