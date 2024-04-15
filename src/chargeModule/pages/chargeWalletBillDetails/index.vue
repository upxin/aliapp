<template>
  <CustomBar class="fixed" background-color="#fff" :border="false">
    <template #customLeft>
      <span
        @click="
          () => {
            calendar.show();
          }
        "
        >日期筛选</span
      >
    </template>
    <template #title>充电钱包明细</template>
  </CustomBar>
  <FullLoading :loading="state.fullLoading">
    <div :style="{ height: `${headerHeight}px` }"></div>
    <NrzTabs
      v-model:current="state.initTab"
      :tabs="['充电记录', '购币记录', '退币记录']"
      @change="swiperChange"
    >
    </NrzTabs>
    <ChargeRecord
      v-show="state.initTab == 0"
      :scroll-h="scrollH"
      :start-date="date[0]"
      :end-date="date[1]"
    ></ChargeRecord>
    <BuyCoinRecord
      v-show="state.initTab == 1"
      :scroll-h="scrollH"
      :start-date="date[0]"
      :end-date="date[1]"
    >
    </BuyCoinRecord>
    <BackCoinRecord
      v-show="state.initTab == 2"
      :scroll-h="scrollH"
      :start-date="date[0]"
      :end-date="date[1]"
    >
    </BackCoinRecord>
  </FullLoading>
  <NrzCalendar
    ref="calendar"
    is-fixed
    :type="2"
    title="选择单个日期或范围"
    lunar
    @change="setChooseValue"
  ></NrzCalendar>
</template>
<script lang="ts" setup>
import { reactive, ref, computed } from 'vue';
import CustomBar from '@/components/customHeader/index.vue';
import FullLoading from '@/components/full-loading/index.vue';
import { YMD_EN } from '@/utils/index';
import { useHeaderHeight } from '@/hooks/index';
import ChargeRecord from './chargeRecord.vue';
import { systemInfo } from '@/stores/index';
import Taro from '@tarojs/taro';
import BuyCoinRecord from './buyCoinRecord.vue';
import BackCoinRecord from './backCoinRecord.vue';
import dayjs from 'dayjs';
import NrzCalendar from '@/components/nrz-calendar/index.vue';
import NrzTabs from '@/components/nrz-tabs/index.vue';

definePageConfig({
  transparentTitle: 'always',
  titlePenetrate: 'YES',
  defaultTitle: '',
  enablePullDownRefresh: true,
});
const { headerHeight } = useHeaderHeight();
const calendar = ref();

let date = ref([
  dayjs(new Date()).subtract(20, 'day').format(YMD_EN),
  dayjs(new Date()).format(YMD_EN),
]);
let state = reactive({
  tabs: [
    { text: '充电记录', id: 1 },
    { text: '购币记录', id: 2 },
    { text: '退币记录', id: 3 },
  ],
  fullLoading: false,
  currentIndex: 1,
  initTab: 0,
  duration: 300,
});
const setChooseValue = (res) => {
  date.value = [res.startDate, res.endDate];
};
let scrollH = computed(() => {
  return Taro.pxTransform(
    systemInfo().app.screenHeight - headerHeight.value - 46
  );
});
function swiperChange(res) {
  state.initTab = res.index;
}
</script>
<style lang="scss">
page {
  background-color: #fff;
}
</style>
