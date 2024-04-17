<template>
  <customHeader background-color="#fff">
    <template #title> 我的车队 </template>
    <template #customLeft>
      <nut-popover v-model:visible="showTooltip" location="bottom-start">
        <template #reference>
          <span class="iconfont icon-gengduo text-18px"></span>
        </template>
        <template #content>
          <div
            class="flex items-center justify-center p-8px w-92px"
            @click.stop="
              () => {
                handleTooltip(1);
              }
            "
          >
            <div class="text-center text-12px">只看电车</div>
          </div>
          <div
            class="flex items-center justify-center p-8px w-92px"
            @click.stop="
              () => {
                handleTooltip(2);
              }
            "
          >
            <div class="text-center text-12px">只看油车</div>
          </div>
          <div
            class="flex items-center justify-center p-8px w-92px nr-border-b--dashed"
            @click.stop="
              () => {
                handleTooltip(-1);
              }
            "
          >
            <div class="text-center text-12px">所有车辆</div>
          </div>
          <div
            class="flex items-center justify-center p-8px w-92px"
            @click.stop="
              () => {
                handleTooltip('nr', '添加车辆');
              }
            "
          >
            <view class="icon-tianjia iconfont mr-6px"></view>
            <div class="text-left text-12px">添加前晨车辆</div>
          </div>
          <div
            class="flex items-center justify-center p-8px w-92px"
            @click.stop="
              () => {
                handleTooltip('other', '成为车主');
              }
            "
          >
            <view class="icon-tianjia iconfont mr-6px"></view>
            <div class="text-left text-12px">添加其他车辆</div>
          </div>
        </template>
      </nut-popover>
    </template>
  </customHeader>
  <FullLoading :loading="floading" :no-data="!total">
    <div>
      <view :style="{ paddingTop: `${headerHeight}px` }">
        <div class="flex items-end justify-center text-12px pt-20px">
          <span>共</span>
          <span class="text-18px mx-4px">{{ total }}</span>
          <span>辆</span>
        </div>
        <div class="w-full h-300px pl-30rpx box-border pt-20px">
          <TChartBar
            tooltip
            ref="chartRef"
            :max="maxNum"
            :splitNumber="splitNumber"
            :yAxis="['油车', '电车']"
          ></TChartBar>
        </div>
      </view>
      <div class="flex justify-center my-20px">
        <nut-button
          class="px-16px nz-shadow"
          type="default"
          @click="naviToFleetData"
          >点击查看车队数据</nut-button
        >
      </div>
      <List :list="list"></List>
      <div
        class="text-center nrz-safe nrz-thin text-primary h-60px leading-60px"
      >
        {{ '--->NEWRIZON<---' }}
      </div>
    </div>
  </FullLoading>
</template>
<script lang="ts">
import { onShareAppMessage as S, onShareTimeline } from '@/utils/index';
export default {
  onShareAppMessage: (res) => {
    jGcustomCount(JG.BV_003);
    S(res);
  },
  onShareTimeline,
};
</script>
<script setup lang="ts">
import FullLoading from '@/components/full-loading/index.vue';
import { onBeforeMount, onMounted, ref } from 'vue';
import customHeader from '@/components/customHeader/index.vue';
import TChartBar from '@/components/tui-charts-bar/tui-charts-bar.vue';
import {
  CODE,
  nrNavigateTo,
  OBU_USER,
  Routes,
  useToast,
  getStore,
  jGcustomCount,
  JG,
} from '@/utils/index';
import { getVehList, onlineCars } from '@/api/index';
import { useHeaderHeight } from '@/hooks';
import List from './list.vue';
import Taro, { usePullDownRefresh, useReachBottom } from '@tarojs/taro';

definePageConfig({
  transparentTitle: 'always',
  titlePenetrate: 'YES',
  defaultTitle: '',
  enablePullDownRefresh: true,
});
let chartRef = ref();
let { headerHeight } = useHeaderHeight();
let showTooltip = ref(false);
let total = ref();
let floading = ref(true);
let pageNum = 1;
let pageSize = 5;
let vehicleType = -1; // 1-电车 2-油车 -1全部
let hasMore = ref(true);
let list = ref<any[]>([]);

let maxNum = ref();
let splitNumber = ref();

let dataset = [
  {
    name: '共',
    color: '#ccc',
    source: [],
  },
  {
    name: '在线',
    color: '#5677fc',
    source: [],
  },
];

function naviToFleetData() {
  let myTeam = getStore(OBU_USER);
  nrNavigateTo(Routes.fleetData, {
    type: myTeam?.vehicleType === '油车' ? 2 : 1,
    vinLicense: myTeam?.vinCode,
    licensePlateNumber: myTeam?.licensePlateNumber,
    isOwner: 1,
    teamName: myTeam?.teamName,
  });
}
function handleTooltip(type, title?) {
  showTooltip.value = false;

  if (typeof type === 'number') {
    vehicleType = type;
    _getVehList();
    return;
  }
  nrNavigateTo(Routes.ownerAddCar, { type, title });
}

function getMax(max = 0, k = 5) {
  if (max <= k) {
    return k;
  }

  let rest = max % k;
  max = max + rest;

  return max;
}
function updateChart(res) {
  maxNum.value = Math.max(
    ...[
      res?.data?.oilOffline + res?.data?.oilOnline,
      res?.data?.eleOffline + res?.data?.eleOnline,
    ]
  );

  maxNum.value = getMax(maxNum.value, 5);
  splitNumber.value = maxNum.value / 5;
  console.log(maxNum.value, splitNumber.value, 7777);
  return [
    {
      name: '共',
      color: '#ccc',
      source: [
        res?.data?.oilOffline + res?.data?.oilOnline,
        res?.data?.eleOffline + res?.data?.eleOnline,
      ],
    },
    {
      name: '在线',
      color: '#5677fc',
      source: [res?.data?.oilOnline, res?.data?.eleOnline],
    },
  ];
}

function getParams() {
  return {
    pageNum,
    pageSize,
    vehicleType,
  };
}

function _getVehList() {
  getVehList(getParams()).then((res) => {
    Taro.stopPullDownRefresh();
    if (res?.code !== 200) return useToast(res?.msg);

    list.value = res?.data?.records;
    const { total, size, current } = res?.data || {};
    hasMore.value = current * size < total;
  });
}
function _getVehListMore() {
  if (!hasMore.value) return;

  pageNum += pageNum;
  getVehList(getParams()).then((res) => {
    if (res?.code !== 200) return useToast(res?.msg);
    list.value = [...list.value, ...res?.data?.records];

    const { total, size, current } = res?.data || {};
    hasMore.value = current * size < total;
  });
}

function getOnline() {
  onlineCars({}).then((res) => {
    if (res?.code !== CODE) return useToast(res?.msg || '接口异常');
    total.value = res?.data?.total;
    setTimeout(() => {
      floading.value = false;
      dataset = updateChart(res) as any;
      chartRef.value.draw(dataset);
    }, 1000);
  });
}
usePullDownRefresh(() => {
  _getVehList();
  getOnline();
});

useReachBottom(() => {
  _getVehListMore();
});

onBeforeMount(() => {
  _getVehList();
});

onMounted(() => {
  jGcustomCount(JG.BV_002);
  getOnline();
});
</script>
<style>
page {
  background-color: #fff;
}
.nz-shadow {
  box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.19);
  border: 0;
}
</style>
