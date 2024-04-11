<template>
  <section class="flex flex-col w-full h-full">
    <CustomBar background-color="#fff" :border="false" position="unset">
      <template #title>同业排行</template>
      <template #customLeft>
        <span class="icon-rili iconfont" @click="visible = true"></span>
      </template>
    </CustomBar>
    <van-tabs :active="tabIndex" @change="changeTab">
      <van-tab title="全部" :name="0"> </van-tab>
      <van-tab title="电车" :name="1"> </van-tab>
      <van-tab title="油车" :name="2"> </van-tab>
    </van-tabs>
    <section class="flex-1 overflow-hidden">
      <MainScroll
        :init-loading="initLoading"
        :has-more="hasMore"
        :pt="0"
        :end-img="LOGO_IMG_BOTTOM"
        end-text=""
      >
        <div class="box-border w-full overflow-y-auto px-14px nrz-thin">
          <div class="flex py-10px">
            <span class="iconfont icon-clock"></span>
            <div class="ml-6px">{{ time }}</div>
          </div>

          <section class="py-14px" :style="getStyles">
            <div class="pl-20px">运营效率</div>
            <div class="pl-14px flex justify-center items-end">
              <div class="opacity-50">超过</div>
              <div class="text-30px font-bold mx-4px">
                {{ exceedOprationPercent }}
              </div>
              <div class="opacity-50">同行</div>
            </div>

            <div class="box-border flex justify-between w-full h-150px px-20px">
              <div class="flex-1 relative h-150px">
                <Chart
                  id="opEfficiency1"
                  class="h-150px"
                  :opts="myData"
                ></Chart>
                <div class="absolute center text-16px font-bold">
                  {{ allData?.efficiency?.key }}%
                </div>
              </div>

              <div class="flex-1 relative h-150px">
                <Chart
                  id="opEfficiency2"
                  class="h-150px"
                  :opts="peersTop"
                ></Chart>
                <div class="absolute center text-16px font-bold">
                  {{ allData?.efficiency?.value }}%
                </div>
              </div>
            </div>
            <div class="flex justify-between opacity-50 px-20px">
              <div class="flex-1 text-center">我的车队运营效率</div>
              <div class="flex-1 text-center">同业第一运营效率</div>
            </div>
          </section>

          <section class="py-14px mt-20px" :style="getStyles">
            <div class="pl-20px">行驶里程</div>
            <div class="pl-14px flex justify-center items-end">
              <div class="opacity-50">超过</div>
              <div class="text-30px font-bold mx-4px">
                {{ exceedMilePercent }}
              </div>
              <div class="opacity-50">同行</div>
            </div>
            <div class="box-border flex justify-between w-full py-20px px-20px">
              <Item class="mr-10px" :val="allData?.mileage?.key"></Item>
              <Item :val="allData?.mileage?.value"></Item>
            </div>
            <div class="flex justify-between opacity-50 px-20px">
              <div class="flex-1 text-center">单车平均里程</div>
              <div class="flex-1 text-center">同行第一平均里程</div>
            </div>
          </section>

          <section class="py-14px mt-20px" :style="getStyles">
            <div class="pl-20px">行驶时长</div>
            <div class="pl-14px flex justify-center items-end">
              <div class="opacity-50">超过</div>
              <div class="text-30px font-bold mx-4px">
                {{ exceedTimePercent }}
              </div>
              <div class="opacity-50">同行</div>
            </div>
            <div class="box-border flex justify-between w-full py-20px px-20px">
              <Item
                class="mr-10px"
                :val="allData?.runTime?.key"
                unit="h"
              ></Item>
              <Item unit="h" :val="allData?.runTime?.value"></Item>
            </div>
            <div class="flex justify-between opacity-50 px-20px">
              <div class="flex-1 text-center">我的车队行驶里程</div>
              <div class="flex-1 text-center">同业第一行驶里程</div>
            </div>
          </section>
        </div>
      </MainScroll>
    </section>
  </section>
  <NrzAction
    v-model:show="visible"
    tips="切换时间"
    :item-list="[
      { name: '最近12个月整体', key: '1' },
      { name: '按月选择', key: '2' },
    ]"
    @choose="choose"
  >
  </NrzAction>
  <NrzDateTime ref="datePicker" :type="3" @confirm="confirmMonth"></NrzDateTime>
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
import { computed, ref } from 'vue';
import CustomBar from '@/components/customHeader/index.vue';
import Taro, { useReady } from '@tarojs/taro';
import { peerRank } from '@/api/index';
import { CODE, useToast, YMD_EN, LOGO_IMG_BOTTOM, YMD_CH } from '@/utils/index';
import Chart from '../../comp/Chart.vue';
import NrzDateTime from '@/components/nrz-datetime/index.vue';
import NrzAction from '@/components/nrz-action/index.vue';
import dayjs from 'dayjs';
import Item from './item.vue';

definePageConfig({
 transparentTitle: 'auto',
  titlePenetrate: 'YES',
  defaultTitle: '',  usingComponents: {
    // 'ec-canvas': '../../comp/ec-canvas/ec-canvas',
  },
});
let hasMore = ref(false);
let initLoading = ref(true);
let tabIndex = ref(0);
let vehicleType = ref(0);
let visible = ref(false);
let time = ref('');
let latestYear = true;
let startDate = '';
let endDate = '';
let allData = ref();

let radius = ['60%', '70%'];
let label = {
  show: true,
  position: 'center',
  fontSize: 20,
};
let labelLine = {
  show: false,
};
let colors = {
  0: '#f9f9f9',
  1: '#F1FBF3',
  2: '#FAFBF1',
};
let getStyles = computed(() => {
  return {
    background: colors[tabIndex.value],
  };
});

let exceedOprationPercent = computed(() => {
  return allData.value?.efficiency?.rate + '%';
});

let exceedMilePercent = computed(() => {
  return allData.value?.mileage?.rate + '%';
});

let exceedTimePercent = computed(() => {
  return allData.value?.runTime?.rate + '%';
});

let myData = computed(() => {
  let myVal = allData.value?.efficiency?.key;
  let option = {
    series: [
      {
        silent: true, // 禁止饼图移入放大
        type: 'pie',
        radius,
        avoidLabelOverlap: false,
        label,
        labelLine,
        data: [
          { value: myVal, name: '', itemStyle: { color: '#00D93A' } },
          { value: 100 - myVal, name: '', itemStyle: { color: '#ccc' } },
        ],
      },
    ],
  };
  console.log(option);
  return option;
});
let peersTop = computed(() => {
  let peerVal = allData.value?.efficiency?.value;
  let option = {
    series: [
      {
        silent: true, // 禁止饼图移入放大
        type: 'pie',
        radius,
        avoidLabelOverlap: false,
        label,
        labelLine,
        data: [
          {
            value: peerVal,
            name: '',
            itemStyle: { color: '#5871F9' },
          },
          { value: 100 - peerVal, name: '', itemStyle: { color: '#ccc' } },
        ],
      },
    ],
  };
  console.log(option);
  return option;
});
const datePicker = ref();
function choose(item) {
  if (item?.key === '2') {
    datePicker.value.show();
  }
  if (item?.key === '1') {
    setFullYear();
    _getPeerRank();
  }
}
function changeTab(v) {
  tabIndex.value = v?.detail?.index;
  vehicleType.value = v?.detail?.index;
  Taro.showLoading();
  _getPeerRank();
}
function setFullYear() {
  time.value =
    dayjs().subtract(1, 'year').format('YYYY年MM月') +
    '-' +
    dayjs().format('YYYY年MM月');
}

function confirmMonth(res) {
  startDate = dayjs(res.startDate).startOf('month').format(YMD_EN);
  endDate = dayjs(res.endDate).endOf('month').format(YMD_EN);
  time.value =
    dayjs(startDate).format(YMD_CH) + '-' + dayjs(endDate).format(YMD_CH);
  latestYear = false;
  _getPeerRank();
}
function _getPeerRank() {
  peerRank({
    latestYear,
    startDate,
    endDate,
    vehicleType: vehicleType.value,
  })
    .then((res) => {
      initLoading.value = false;
      Taro.hideLoading();
      if (res?.code != CODE) return useToast(res?.msg);
      allData.value = res?.data;
    })
    .catch(() => {
      Taro.hideLoading();
      initLoading.value = false;
    });
}
useReady(() => {
  setFullYear();
  _getPeerRank();
});
// bottom
</script>
<style>
page {
  background-color: #fff;
}
</style>
