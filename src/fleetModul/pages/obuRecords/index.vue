<template>
  <MainScroll
    :has-more="hasMore"
    :pt="0"
    :bg="'#fff'"
    @scroll-reach-bottom="loadMore"
    @end-pull-down="refresh"
  >
    <div class="overflow-y-auto">
      <section
        v-for="(k, i) of list"
        :key="k?.licensePlateNumber"
        class="flex p-14px"
        :class="{ 'nr-border-b': i < list?.length - 1 }"
      >
        <NrImg
          :only-img="true"
          class="w-120px h-90px"
          :url="k?.vehicleImg"
          mode="scaleToFill"
        ></NrImg>
        <div class="flex flex-col flex-1 pl-10px">
          <div class="flex items-center justify-between">
            <span>{{ k?.licensePlateNumber }}</span>
            <span class="opacity-50 text-12px">{{ k?.updateTime }}</span>
          </div>
          <div class="opacity-30 text-12px mt-10px">
            {{ nullText(k?.vinCode) }}
          </div>
          <div class="opacity-30 text-12px mt-6px">{{ k?.model }}</div>
          <div class="flex items-end justify-between mt-auto">
            <span>{{ k?.teamName }}</span>
            <div class="-mt-10px">
              <div class="text-center">{{ nullText(k?.points) }}</div>
              <div>奖励积分</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </MainScroll>
</template>
<script lang="ts">
import { onShareAppMessage, onShareTimeline } from '@/utils/index';
export default {
  onShareAppMessage,
  onShareTimeline,
};
</script>
<script lang="ts" setup>
import MainScroll from '@/components/scroll-main/index.vue';
import { onBeforeMount, ref } from 'vue';
import CustomBar from '@/components/customHeader/index.vue';
import FullLoading from '@/components/full-loading/index.vue';
import { systemInfo } from '@/stores/index';
import Taro from '@tarojs/taro';
import { obuRecords } from '@/api/index';
import { CODE, getStore, nullText, USER_INFO, useToast } from '@/utils/index';
import NrImg from '@/components/img/img.vue';
import { useHeaderHeight, useRequest } from '@/hooks/index';
definePageConfig({
  navigationStyle: 'default',
  navigationBarTitleText: 'OBU推广记录',
});
let list = ref<any[]>([]);
let hasMore = ref(false);

let pageNum = 1;
let pageSize = 20;

function getParams() {
  return {
    pageNum,
    pageSize,
    installMobile: getStore(USER_INFO)?.mobile,
  };
}
function loadMore() {
  if (!hasMore.value) return;
  pageNum = pageNum + 1;
  obuRecords(getParams()).then((res) => {
    list.value = [...list.value, ...res?.data?.records];

    const { total, size, current } = res?.data;
    hasMore.value = current * size < total;
  });
}
function refresh(cb?) {
  pageNum = 1;
  obuRecords(getParams(), () => {
    if (!cb) return;
    useToast('刷新成功');
  }).then((res) => {
    list.value = res?.data?.records;
    const { total, size, current } = res?.data;
    hasMore.value = current * size < total;
    cb && cb();
  });
}

onBeforeMount(() => {
  refresh();
});
// bottom
</script>
<style>
page {
  background-color: #fff;
}
</style>
