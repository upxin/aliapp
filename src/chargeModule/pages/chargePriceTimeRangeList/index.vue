<template>
  <CustomBar background-color="#fff">
    <template #title>价格详情</template>
  </CustomBar>
  <FullLoading :loading="fullLoading">
    <div class="overflow-y-auto" :style="{ paddingTop: `${headerHeight}px` }">
      <section
        v-for="(k, i) in priceList"
        :key="i"
        class="relative flex w-full border-0 border-solid h-100px border-b-1px border-main"
      >
        <div class="box-border flex flex-col justify-around flex-1 pl-20px">
          <div>{{ k?.startTime }}-{{ k?.endTime }}</div>
          <div
            class="flex items-baseline mr-10px"
            style="color: rgba(242, 3, 23, 0.76)"
          >
            <span class="font-bold text-20px">{{ k?.price }}</span>
            <span>元/度</span>
          </div>
          <div class="flex text-hex-555 text-opacity-44 text-12px">
            <span>电费：{{ k?.elecPrice }}元/度</span>
            <span>服务费：{{ k?.sevicePrice }}元/度</span>
          </div>
        </div>
        <div v-if="k?.current" class="triangle-r">
          <span class="absolute w-24px h-14px text-10px y-center -right-36px"
            >当前</span
          >
        </div>
      </section>
    </div>
  </FullLoading>
</template>
<script lang="ts">
import { onShareAppMessage, onShareTimeline } from '@/utils/index';
export default {
  onShareAppMessage,
  onShareTimeline,
};
</script>
<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import CustomBar from '@/components/customHeader/index.vue';
import FullLoading from '@/components/full-loading/index.vue';
import { store } from '@/stores/index';
import { useHeaderHeight } from '@/hooks/index';

definePageConfig({
 transparentTitle: 'auto',
  titlePenetrate: 'YES',
  defaultTitle: '',});

let fullLoading = ref(true);
const { headerHeight } = useHeaderHeight();

let priceList = computed(() => {
  return store().priceList;
});

onMounted(() => {
  setTimeout(() => {
    fullLoading.value = false;
  }, 100);
});
// bottom
</script>
<style>
page {
  background-color: #fff;
}
.triangle-r {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  border-top: 36px solid transparent;
  border-bottom: 36px solid transparent;
  border-left: 36px solid transparent;
  border-right: 36px #04c3f6 solid;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  box-sizing: border-box;
  width: 36px;
  height: 36px;
  color: #fff;
}
</style>
