<template>
  <CustomBar class="fixed" background-color="#fff"
    ><template #title>违章查询</template></CustomBar
  >
  <MainScroll
    :pt="CalcPt"
    :has-more="hasMore"
    :init-loading="fl"
    @scroll-reach-bottom="loadMore"
    @end-pull-down="refresh"
  >
    <div class="overflow-y-auto text-14px">
      <div
        v-for="k in _data?.details"
        :key="k?.vio_code"
        class="pb-0 overflow-hidden my-10px bg-hex-fff p-18px text-normal"
      >
        <div class="flex justify-between w-full mb-16px">
          <span class="opacity-45 w-70px">车牌号</span>
          <span class="flex-1 text-right">{{ _data?.car_no }}</span>
        </div>
        <div class="flex justify-between w-full mb-16px">
          <span class="opacity-45 w-70px">违章扣分</span>
          <span class="flex-1 text-right">{{ k?.vio_score }}</span>
        </div>
        <div class="flex justify-between w-full mb-16px">
          <span class="opacity-45 w-70px">违章罚款</span>
          <span class="flex-1 text-right">{{ k?.vio_fine }}</span>
        </div>
        <div class="flex justify-between w-full mb-16px">
          <span class="opacity-45 w-70px">违章时间</span>
          <span class="flex-1 text-right">{{ k?.vio_time }}</span>
        </div>
        <div class="flex justify-between w-full mb-16px">
          <span class="opacity-45 w-70px">违章原因</span>
          <span class="flex-1 text-right">{{ k?.vio_action }}</span>
        </div>
        <div class="flex justify-between w-full mb-16px">
          <span class="opacity-45 w-70px">违章地址</span>
          <span class="flex-1 text-right">{{ k?.vio_address }}</span>
        </div>
        <div class="flex justify-between w-full mb-16px">
          <span class="opacity-45 w-70px">违章城市</span>
          <span class="flex-1 text-right">{{ k?.vio_city }}</span>
        </div>
        <div class="flex justify-between w-full mb-16px">
          <span class="opacity-45 w-70px">处理结果</span>
          <span
            class="flex-1 text-right"
            :style="{
              color:
                k?.handle_sign == 1 || !!k?.handle_sign ? 'red' : '#f18a30',
            }"
            >{{ regText(k?.handle_sign) }}</span
          >
        </div>
      </div>
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
import CustomBar from '@/components/customHeader/index.vue';
import { systemInfo } from '@/stores/systemInfo';
import Taro, { useRouter } from '@tarojs/taro';
import { onMounted, computed, ref } from 'vue';
import { searchBreakRules } from '@/api/index';
import { CODE, JG, jGcustomCount } from '@/utils/index';
import MainScroll from '@/components/scroll-main/index.vue';
definePageConfig({ transparentTitle: 'auto',titlePenetrate: 'YES',defaultTitle: '', });

let CalcPt = computed(
  () => systemInfo().RightBtnRect.h + systemInfo().RightBtnRect.t + 10
);
let {
  vin = '',
  name = '',
  id = '',
  licensePlateNum = '',
  time = '',
  insurerName = '',
} = useRouter().params;
let fl = ref(true);
let pt: any = null;
let nt: any = null;
let hasMore = ref(false);
let _data = ref<{ details: any; [key: string]: any }>({ details: [] });
function regText(type) {
  return (
    { 1: '未处理 未缴费', 2: '已处理 未缴费', 3: '已处理 已缴费' }[type] ||
    '未处理 未缴费'
  );
}
function _searchBreakRules() {
  jGcustomCount(JG.CV_008);
  searchBreakRules({ vin, nt, pt })
    .then((res) => {
      fl.value = false;
      if (res.code !== CODE) {
        Taro.showToast({
          title: res.msg,
          icon: 'none',
        });
        return;
      }
      _data.value = res?.data;
      nt = res?.nt;
      pt = res?.pt;
    })
    .catch(() => {
      fl.value = false;
    });
}
onMounted(() => {
  _searchBreakRules();
});
function refresh() {
  // isRefresh.value = true;
}
function loadMore() {
  //
}
</script>
