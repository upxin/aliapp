<template>
  <CustomBar class="fixed" :show-icon="false" background-color="#fff">
    <template #left>
      <div
        class="flex items-center border border-gray-200 border-solid rounded-3xl text-hex-555 h-26px px-8px"
      >
        <span
          class="iconfont text-hex-aaa nz-rot180 icon-arrow-right-bold text-14px"
          :style="{}"
          @click="back"
        ></span>
        <div class="bg-hex-aaa h-12px w-1px opacity-80 mx-8px"></div>
        <div class="text-hex-aaa text-12px" @click="visible = true">筛选</div>
      </div>
    </template>
    <template #title>{{ name }}</template>
  </CustomBar>
  <MainScroll
    :has-more="hasMore"
    :init-loading="initLg"
    @scroll-reach-bottom="loadMore"
    @end-pull-down="refresh"
  >
    <div class="overflow-y-auto nrz-safe">
      <section class="box-border h-full overflow-y-auto pt-26px px-30px">
        <nut-steps progress-dot direction="vertical" current="2">
          <nut-step
            v-for="k in list"
            :id="`nr${k.type}`"
            :key="k.event_time"
            :title="k.event_time"
            :content="k.description"
          ></nut-step>
        </nut-steps>
      </section>
    </div>
  </MainScroll>
  <NrzAction
    v-model:show="visible"
    tips="状态筛选"
    :item-list="[
      { name: '全部', type: null },
      { name: '上电行车', type: 1 },
      { name: '未下电停车', type: 2 },
      { name: '下电停车', type: 3 },
      { name: '充电', type: 4 },
    ]"
    @click="_changeType"
  ></NrzAction>
</template>

<script lang="ts">
import { onShareAppMessage, onShareTimeline } from '@/utils/index';
import dayjs from 'dayjs';
export default {
  onShareAppMessage,
  onShareTimeline,
};
</script>

<script lang="ts" setup>
import MainScroll from '@/components/scroll-main/index.vue';
import { ref, computed, onBeforeMount } from 'vue';
import CustomBar from '@/components/customHeader/index.vue';
import { loveCarStore } from '@/stores/index';
import Taro, { useRouter } from '@tarojs/taro';
import { timeAxis } from '@/api/index';
import { CODE, YMD_EN } from '@/utils/index';
import { vrData } from '@/assets/js/virtual_car_diary_time_line';
import NrzAction from '@/components/nrz-action/index.vue';
definePageConfig({ transparentTitle: 'always',titlePenetrate: 'YES',defaultTitle: '', });

let Params = useRouter().params;
const LoveCarStore = loveCarStore();
let list = ref<any[]>([]);
let nt = null;
let pt = null;
let visible = ref(false);
let type = null;
let initLg = ref(true);
let hasMore = ref(false);
let name = ref(Params?.carName);
async function _timeAxis() {
  try {
    const { data, code } = await timeAxis({
      vin: Params?.vin,
      nt,
      pt,
      type,
      date: Params?.date || new Date(),
    });
    setTimeout(() => {
      initLg.value = false;
    }, 1000);
    if (code !== CODE) return;
    list.value = [...list.value, ...data?.list];
    hasMore.value = !!data?.list?.length;

    nt = data?.nt;
    pt = data?.pt;
  } catch (error) {
    console.log(error);
    initLg.value = false;
  }
}
function _changeType(res) {
  refresh(res.type);
}
function back() {
  Taro.navigateBack();
}

function loadMore() {
  if (hasMore.value) {
    _timeAxis();
  }
}
async function refresh(type?) {
  // 直接调一次重置参数的方法  不要用定时器 会导致视图异常变化
  nt = null;
  pt = null;
  try {
    const { data, code } = await timeAxis({
      vin: Params?.vin,
      nt,
      pt,
      date: Params?.date || dayjs().format(YMD_EN),
      type,
    });
    if (code !== CODE) return;
    list.value = [...data?.list];
    hasMore.value = !!data?.list?.length;
    nt = data?.nt;
    pt = data?.pt;
  } catch (error) {
    console.log(error);
  }
}
onBeforeMount(() => {
  if (LoveCarStore?.isVr) {
    setTimeout(() => {
      list.value = vrData.data.list;
      name.value = '物流一号';
    }, 100);
    return;
  }
  _timeAxis();
});
// bottom
</script>
<style lang="scss">
.nut-steps-vertical .nut-step {
  // min-height: 120px;
}
.nut-step-title {
  margin-bottom: 4px;
}
.nut-step-content {
  border-radius: 5px;
  padding: 10px;
  word-break: break-all;
}

#nr1 .nut-step-content {
  background: #1d88c7;
  margin-bottom: 20px;
}
#nr4 .nut-step-content {
  background: #08be3e;
  margin-bottom: 20px;
}
#nr3 .nut-step-content {
  background: #efa76b;
  margin-bottom: 20px;
}
#nr2 .nut-step-content {
  background: #eb5c4f;
  margin-bottom: 20px;
}
.nut-steps-vertical.nut-steps-dot .nut-step-wait .nut-step-content {
  color: #fff;
}
.nut-step-content {
  color: #fff;
  max-width: 290px;
  min-width: 290px;
}
.nut-step-main {
  padding-right: 4%;
}
</style>
