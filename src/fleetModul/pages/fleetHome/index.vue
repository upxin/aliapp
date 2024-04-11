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
        <div class="flex items-end justify-center text-12px pt-10px">
          <span>共</span>
          <span class="text-18px mx-4px">{{ total }}</span>
          <span>辆</span>
        </div>
        <div class="w-full h-300px">
          <ec-canvas
            id="fleetHome"
            canvas-id="mychart-bar"
            :ec="ec"
          ></ec-canvas>
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
      <div class="text-center nrz-safe nrz-thin text-primary h-60px leading-60px">
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
import * as echarts from '../../comp/ec-canvas/echarts.js';
import {
  CODE,
  nrNavigateTo,
  OBU_USER,
  Routes,
  useToast,
  getStore,
  OIL_COLOR,
  ELE_COLOR,
  jGcustomCount,
  JG,
} from '@/utils/index';
import { getVehList, onlineCars } from '@/api/index';
import { useHeaderHeight } from '@/hooks';
import List from './list.vue';
import Taro, { usePullDownRefresh, useReachBottom } from '@tarojs/taro';

definePageConfig({
  usingComponents: {
    'ec-canvas': '../../comp/ec-canvas/ec-canvas',
  },
 transparentTitle: 'auto',
  titlePenetrate: 'YES',
  defaultTitle: '',  enablePullDownRefresh: true,
});
let { headerHeight } = useHeaderHeight();
let showTooltip = ref(false);
let chart: ChartIns | null;
let total = ref();
let ec = ref({
  onInit: initChart,
});
let floading = ref(true);
let pageNum = 1;
let pageSize = 5;
let vehicleType = -1; // 1-电车 2-油车 -1全部
let hasMore = ref(true);
let list = ref<any[]>([]);
interface ChartIns {
  setOption: (p: any) => void;
}
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
function initChart(canvas, width, height, dpr) {
  chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr, // new
  }) as ChartIns;
  return chart;
}
function updateChart(res) {
  const labelOption = {
    show: true,
    position: 'left',
    distance: 0,
    align: 'left',
    verticalAlign: 'middle',
    rotate: 0,
    formatter: '  {a} {c} 辆',
    fontSize: 12,
    rich: {
      name: {},
    },
  };
  let option = {
    color: ['#ddd'],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    grid: {
      left: '3%',
      right: '13%',
      bottom: '3%',
      containLabel: true,
    },
    yAxis: {
      name: '(车辆类型)',
      type: 'category',
      data: ['油车', '电车'],
    },
    xAxis: {
      axisLine: {
        show: true, //显示坐标轴线
      },
      axisTick: {
        show: true, //显示坐标轴刻度线
      },
      name: '(数量)',
      type: 'value',
    },
    series: [
      {
        barGap: 0,
        label: labelOption,
        barWidth: 24,
        name: '共',
        type: 'bar',
        data: [
          res?.data?.oilOffline + res?.data?.oilOnline,
          res?.data?.eleOffline + res?.data?.eleOnline,
        ],
      },
      {
        barGap: 0,
        label: labelOption,
        barWidth: 24,
        name: '在线',
        type: 'bar',
        data: [
          {
            value: res?.data?.oilOnline,
            itemStyle: {
              color: OIL_COLOR,
            },
          },
          {
            value: res?.data?.eleOnline,
            itemStyle: {
              color: ELE_COLOR,
            },
          },
        ],
      },
    ],
  };
  chart?.setOption(option);
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
usePullDownRefresh(() => {
  _getVehList();
  onlineCars({}).then((res) => {
    if (res?.code !== CODE) return useToast(res?.msg || '接口异常');
    total.value = res?.data?.total;
    setTimeout(() => {
      floading.value = false;
      updateChart(res);
    }, 1000);
  });
});
useReachBottom(() => {
  _getVehListMore();
});
onBeforeMount(() => {
  _getVehList();
});
onMounted(() => {
  jGcustomCount(JG.BV_002);
  onlineCars({}).then((res) => {
    if (res?.code !== CODE) return useToast(res?.msg || '接口异常');
    total.value = res?.data?.total;
    setTimeout(() => {
      floading.value = false;
      updateChart(res);
    }, 1000);
  });
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
