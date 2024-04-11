<template>
  <section
    v-if="store().openPrepay"
    @click="
      () => {
        nrNavigateTo(state?.data?.router);
      }
    "
  >
    <div class="mb-16px">
      <div class="flex items-center justify-between">
        <div class="w-87px h-20px text-primary text-size-14px leading-20px">
          {{ state?.data?.name }}
        </div>
        <span
          class="iconfont icon-right h-20px text-primary text-size-24px leading-20px"
        ></span>
      </div>
    </div>
    <NrzImg
      class="w-full justify-center"
      :src="state?.data?.imgUrl"
      mode="aspectFill"
      :height="167"
    >
      <div class="absolute w-full h-full">
        <view>
          {{ state?.data?.title }}
        </view>
        <div
          class="absolute z-999 nr-blur w-full h-full top-0 left-0 rgbBlack"
        ></div>
      </div>
    </NrzImg>
  </section>
</template>
<script lang="ts" setup>
import { nrNavigateTo } from '@/utils/index';
import { store } from '@/stores/index';
import NrzImg from '@/components/nrz-img/index.vue';
import { financial } from '@/api/home';
import { onBeforeMount, reactive } from 'vue';

const state = reactive({
  data: {},
});
onBeforeMount(() => {
  financial({}).then((res) => {
    state.data = res.data;
  });
});
</script>
<style>
.rgbBlack {
  background-color: rgba(0, 0, 0, 0.1);
}
</style>
