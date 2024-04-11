<template>
  <!-- 车辆数据 -->
  <CustomBar
    :border="false"
    :background-color="`rgba(255,255,255, ${opacity})`"
    :color="titleColor"
    :icon-color="titleColor"
    :custom-color="titleColor"
  >
    <template #title>
      <CarInfo
        v-if="!floading"
        :vehicle-text="params?.licensePlateNumber"
        :vehicle-type="(params?.vehicleType as string)"
      ></CarInfo>
    </template>
    <template #customLeft>
      <nut-popover v-model:visible="showTooltip" location="bottom-start">
        <template #reference>
          <span class="iconfont icon-gengduo text-16px"></span>
        </template>
        <template #content>
          <div
            v-for="(item, index) in menuList"
            :key="index"
            :class="{ 'text-info': item.name === current }"
            class="flex items-center justify-center pt-12px py-8px w-90px"
            @click="
              () => {
                naviTo(item.route);
              }
            "
          >
            {{ item.name }}
          </div>
          <div class="w-full h-12px"></div>
        </template>
      </nut-popover>
    </template>
  </CustomBar>
  <FullLoading :loading="floading">
    <div class="relative h-560px">
      <image :src="Yb" class="w-full h-full mr-6px" mode="aspectFill" />
      <div
        class="absolute left-0 w-full h-full text-center z-100 text-fff top-132px"
      >
        <div class="nrz-thin">GPS更新时间</div>
        <div class="mb-6px nrz-thin">
          {{ dashboardData?.eventTime || '--' }}
        </div>
        <div class="flex items-end justify-center mt-6px">
          <span class="font-bold text-18px">{{
            dashboardData?.totalMileage || '--'
          }}</span>
          <span class="text-10px">km</span>
        </div>

        <div class="flex justify-between font-bold text-fff text-20px px-30px">
          <span class="text-center w-90px">
            {{ dashboardData?.vehicleSpeed || '--' }}
          </span>
          <span class="text-center w-90px">
            {{ formatThousands(dashboardData?.remainingEnergy, 2) || '--' }}%
          </span>
        </div>

        <div
          class="flex items-center justify-between text-fff text-10px px-30px mt-44px"
        >
          <span class="text-center w-90px">km/h</span>
          <span class="flex items-center justify-center text-center w-90px">
            <span class="iconfont icon-chongdianzhuang text-10px"></span>
          </span>
        </div>
        <div
          class="box-border w-full leading-normal text-center text-10px pt-6px px-20px"
          @click="go"
        >
          {{ addr || '暂无位置信息' }}
        </div>
      </div>
    </div>
    <Chart
      id="mile"
      class="-mt-200px"
      title="行驶里程"
      :opts="mileData"
    ></Chart>
    <div class="mb-20px"></div>
    <Chart id="time" title="行驶时间" :opts="timeChartData"></Chart>
    <div class="mb-20px"></div>
    <Chart id="speed" title="行驶速度" :opts="speedData"></Chart>
    <div
      class="flex justify-between text-center px-20px text-10px text-fff mb-20px"
    >
      <div class="px-4px w-70px py-6px bg-info">空白处车辆静止</div>
      <div class="px-4px w-70px py-6px bg-primary">小于40km/h</div>
      <div
        class="px-4px w-70px py-6px bg-green"
        style="background-color: #15db65"
      >
        40-80km/h
      </div>
      <div
        class="px-4px w-70px py-6px bg-info"
        style="background-color: #f54427"
      >
        大于80km/h
      </div>
    </div>

    <!-- <Chart
      id="everage"
      :title="params?.type == '2' ? '每日耗油量' : '每日耗电量'"
      :opts="oilConsumptionData"
    ></Chart>
    <div class="mb-20px"></div>

    <Chart
      id="oilConsumption"
      title="日均能耗"
      :opts="energyConsumptionData"
    ></Chart>
    <div class="mb-20px"></div>
    <Chart
      id="oilConsumption"
      title="满电续航"
      :opts="fullyMileageData"
    ></Chart>
    <div class="mb-20px"></div>

    <Chart
      id="oilConsumption"
      title="20%低电量续航"
      :opts="lowMileageData"
    ></Chart> -->

    <div
      class="flex flex-col items-center justify-center py-10px bg-fff mb-20px"
    >
      <div class="pb-4px">其他数据</div>
      <div class="bar"></div>
    </div>
    <view class="box-border w-full bg-fff px-14px">
      <aside class="table w-full border-collapse text-10px nrz-thin">
        <div class="table-header-group">
          <div
            v-for="item in columns"
            :key="item.title"
            class="table-cell py-10px pl-6px tableHeader"
            :style="{ width: item?.width ? item.width + 'px' : '' }"
          >
            <div class="flex">
              <span>{{ item.title }}</span>
              <span v-if="item.unit" class="opacity-50">({{ item.unit }})</span>
            </div>
          </div>
        </div>

        <div v-for="(k, i) in allData?.otherData" :key="i" class="table-row">
          <div
            v-for="item in columns"
            :key="k[item.prop]"
            class="table-cell py-10px pl-6px nr-border--dashed"
          >
            {{ k[item.prop] }}
          </div>
        </div>
      </aside>
    </view>

    <div
      class="flex flex-col items-center justify-center py-10px bg-fff mb-20p"
    >
      <div class="pb-4px">历史总数</div>
      <div class="bar"></div>
    </div>
    <section>
      <div class="flex">
        <Item
          :val="carDataHisData?.hisTotalMileage"
          text="总行驶里程(km)"
          bg="#fff3f1"
          text-color="rgba(245, 68, 39, 48)"
          val-color="#bc1e04"
        ></Item>
        <Item
          :val="carDataHisData?.hisDrivingTime"
          text="总行驶时长(h)"
          bg="#F1FCF0"
          text-color="rgba(74, 230, 73, 1)"
          val-color="rgba(7, 169, 6, 1)"
        ></Item>
        <Item
          :val="carDataHisData?.hisAvgSpeed"
          text="平均速度(km/h)"
          bg="#f5f6ff"
          text-color="rgba(3, 20, 176, 0.48)"
          val-color="rgba(3, 20, 176, 0.99)"
        ></Item>
      </div>
      <div class="flex">
        <Item
          :val="carDataHisData?.hisCostEnergy"
          :text="params?.type == '2' ? '总耗油量(L)' : '总耗电量(kW·h)'"
          bg="#F1FCF0"
          text-color="rgba(74, 230, 73, 1)"
          val-color="rgba(7, 169, 6, 1)"
        ></Item>
        <Item
          :val="carDataHisData?.hisAddTimes"
          :text="params?.type == '2' ? '总加油次数(次)' : '总充电次数(次)'"
          bg="#f5f6ff"
          text-color="rgba(3, 20, 176, 0.48)"
          val-color="rgba(3, 20, 176, 0.99)"
        ></Item>
        <Item
          :val="carDataHisData?.hisAvgEnergyConsumption"
          :text="
            params?.type == '2' ? '平均油耗(L/100km)' : '平均能耗(kw·h/100km)'
          "
          bg="#fff3f1"
          text-color="rgba(245, 68, 39, 48)"
          val-color="#bc1e04"
        ></Item>
      </div>
      <div class="flex">
        <Item
          :val="carDataHisData?.serviceTime"
          text="总服务时长(h)"
          bg="#f5f6ff"
          text-color="rgba(3, 20, 176, 0.48)"
          val-color="rgba(3, 20, 176, 0.99)"
        ></Item>
        <Item
          :val="carDataHisData?.hisHundredBrake"
          text="百公里刹车(次)"
          bg="#fff3f1"
          text-color="rgba(245, 68, 39, 48)"
          val-color="#bc1e04"
        ></Item>
        <Item
          :val="carDataHisData?.hisHundredDeceleration"
          text="百公里加减速(次)"
          bg="#F1FCF0"
          text-color="rgba(74, 230, 73, 1)"
          val-color="rgba(7, 169, 6, 1)"
        ></Item>
      </div>
    </section>
    <section class="bg-fff pt-30px nrz-safe">
      <NrImg
        :url="LOGO_IMG_BOTTOM"
        class="m-auto bg-center bg-no-repeat bg-contain w-100px h-32px"
      ></NrImg>
    </section>
    <div class="pb-80px"></div>
  </FullLoading>
</template>
<script lang="ts">
import { onShareAppMessage as s, onShareTimeline } from '@/utils/index';
import { loveCarStore } from '@/stores';
export default {
  onShareAppMessage: (res) => {
    jGcustomCount(JG.CV_011);
    s(res);
  },
  onShareTimeline,
};
</script>
<script lang="ts" setup>
import NrImg from '@/components/img/img.vue';

import FullLoading from '@/components/full-loading/index.vue';
import { onBeforeMount, computed, ref } from 'vue';
import CustomBar from '@/components/customHeader/index.vue';
import { useRouter, usePageScroll } from '@tarojs/taro';
import { fleetCarData, dashboard, carDataHis, getCityInfo } from '@/api/index';
import CarInfo from '../../comp/CarInfo.vue';

import {
  CODE,
  nrNavigateTo,
  Routes,
  useToast,
  formatThousands,
  jGcustomCount,
  LOGO_IMG_BOTTOM,
  JG,
} from '@/utils/index';
import Chart from './Chart.vue';
import Item from './Item.vue';
// import * as echarts from '../../comp/ec-canvas/echarts.js';
import dayjs from 'dayjs';
import { vrBoard, vrChart, vrHis } from './vr';
let Yb = 'https://nrz-app.su.bcebos.com/resources/yb.png';

console.log('2023-01-03 18:36:00', dayjs('2023-01-03 18:36:00').minute());
definePageConfig({
  transparentTitle: 'auto',
  titlePenetrate: 'YES',
  defaultTitle: '',
  // usingComponents: {
  //   'ec-canvas': '../../comp/ec-canvas/ec-canvas',
  // },
});
let floading = ref(true);
// type 2 油车
let params = useRouter().params || {};
let dashboardData = ref();
let carDataHisData = ref();
let allData = ref();
let columns = [
  {
    title: '日期',
    prop: 'day',
    unit: '',
    width: 80,
  },
  {
    title: params?.type == '2' ? '加油次数' : '补能次数',
    prop: 'addTimes',
    unit: '次',
  },
  {
    title: params?.type == '2' ? '加油量' : '补能量',
    prop: 'addEnergy',
    unit: 'L',
  },
  {
    title: '百公里刹车',
    prop: 'todayHundredBrake',
    unit: '次',
  },
  {
    title: '百公里加减速',
    prop: 'todayHundredDeceleration',
    unit: '次',
  },
];
let addr = ref();
let mileData = computed(() => {
  let xD = (allData.value?.mileageData || [])?.map((k) => k?.key);
  let yD = (allData.value?.mileageData || [])?.map((k) => k?.value);
  return {
    color: [],
    xAxis: {
      splitLine: { show: false },
      type: 'category',
      data: xD,
      axisTick: {
        alignWithLabel: true,
      },
    },
    yAxis: {
      splitLine: { show: false },
      type: 'value',
      axisLine: {
        show: true,
      },
    },
    series: [
      {
        label: {
          show: true, //开启显示
          position: 'top', //在上方显示
        },
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#1956F9' },
            { offset: 1, color: '#35D0EA' },
          ]),
        },
        data: yD,
        type: 'bar',
      },
    ],
  };
});
let timeChartData = computed(() => {
  let xD = (allData.value?.runTimeData || [])?.map((k) => k?.key);
  let yD = (allData.value?.runTimeData || [])?.map((k) => k?.value);
  return {
    color: [],

    xAxis: {
      splitLine: { show: false },
      type: 'category',
      data: xD,
      axisTick: {
        alignWithLabel: true,
      },
    },
    yAxis: {
      splitLine: { show: false },
      type: 'value',
      axisLine: {
        show: true,
      },
    },
    series: [
      {
        label: {
          show: true, //开启显示
          position: 'top', //在上方显示
        },
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#F9EB19' },
            { offset: 1, color: '#69E934' },
          ]),
        },
        data: yD,
        type: 'bar',
      },
    ],
  };
});

function getHour(d) {
  return dayjs(d).hour();
}
function getLessHour(d) {
  return Number((dayjs(d).minute() / 60).toFixed(2));
}
let speedData = computed(() => {
  let yD1 = (allData.value?.speedData || [])?.map((k) => k?.key.slice(5));
  let yD2 = (allData.value?.speedData || [])?.map((k) => k?.value);
  let speedList = allData.value?.speedList;

  let data: any[] = [];
  let regData = (d = [], color, i, name) => {
    d?.forEach?.((z: any) => {
      let s = getHour(z?.start) + getLessHour(z?.start);
      let end = getHour(z?.end) + getLessHour(z?.end);
      data.push({
        name,
        value: [i, s, end],
        itemStyle: {
          normal: {
            color,
          },
        },
      });
    });
  };
  speedList?.forEach((k) => {
    let lineIndex = allData.value?.speedData?.findIndex((j) => {
      return j?.key == k?.date;
    });
    let name = k?.date;
    regData(k?.slow, '#11264d', lineIndex, name);
    regData(k?.mid, '#15DB65', lineIndex, name);
    regData(k?.quick, '#F54427', lineIndex, name);
  });

  function renderItem(params, api) {
    var categoryIndex = api.value(0);
    var start = api.coord([api.value(1), categoryIndex]);
    var end = api.coord([api.value(2), categoryIndex]);
    var height = api.size([0, 1])[1] * 0.5;
    var rectShape = echarts.graphic.clipRectByRect(
      {
        x: start[0],
        y: start[1] - height / 2,
        width: end[0] - start[0],
        height: height,
      },
      {
        x: params.coordSys.x,
        y: params.coordSys.y,
        width: params.coordSys.width,
        height: params.coordSys.height,
      }
    );
    return (
      rectShape && {
        type: 'rect',
        transition: ['shape'],
        shape: rectShape,
        style: api.style(),
      }
    );
  }
  let option = {
    grid: {
      top: '3%',
      left: '3%',
      right: '3%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      min: 0,
      max: 24,
      scale: true,
      axisLine: {
        show: true,
      },
    },
    yAxis: [
      {
        type: 'category',
        data: yD1,
      },
      {
        type: 'category',
        data: yD2,
      },
    ],
    series: [
      {
        type: 'custom',
        renderItem: renderItem,
        encode: {
          x: [1, 2],
          y: 0,
        },
        data: data,
      },
    ],
  };
  return option;
});

let oilConsumptionData = computed(() => {
  let xD = (allData.value?.costEnergyData || [])?.map((k) => k?.key);
  let yD = (allData.value?.costEnergyData || [])?.map((k) => k?.value);
  return {
    color: [],

    xAxis: {
      splitLine: { show: false },
      type: 'category',
      data: xD,
      axisTick: {
        alignWithLabel: true,
      },
    },
    yAxis: {
      splitLine: { show: false },
      type: 'value',
      axisLine: {
        show: true,
      },
    },
    series: [
      {
        label: {
          show: true, //开启显示
          position: 'top', //在上方显示
        },
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#F54527' },
            { offset: 1, color: '#E99835' },
          ]),
        },
        data: yD,
        type: 'bar',
      },
    ],
  };
});
let energyConsumptionData = computed(() => {
  let xD = (allData.value?.energyConsumptionData ?? [])?.map((k) => k?.key);
  let yD = (allData.value?.energyConsumptionData ?? [])?.map((k) => k?.value);
  return {
    color: [],

    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    xAxis: {
      type: 'category',
      data: xD,
      axisTick: {
        alignWithLabel: true,
      },
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: true,
      },
      splitLine: { show: true },
    },
    series: [
      {
        label: {
          show: true, //开启显示
          position: 'top', //在上方显示
        },
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#2731F5' },
            { offset: 1, color: '#6D5DBC' },
          ]),
        },
        data: yD,
        type: 'bar',
      },
    ],
  };
});
let fullyMileageData = computed(() => {
  let xD = (allData.value?.fullyMileageData?.mileageData || [])?.map(
    (k) => k?.key
  );
  let yD = (allData.value?.fullyMileageData?.mileageData || [])?.map(
    (k) => k?.value
  );
  return {
    color: [],

    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    xAxis: {
      type: 'category',
      data: xD,
      axisTick: {
        alignWithLabel: true,
      },
    },
    yAxis: {
      axisLine: {
        show: true,
      },
      type: 'value',
      splitLine: { show: false },
    },
    series: [
      {
        label: {
          show: true, //开启显示
          position: 'top', //在上方显示
        },

        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#F54527' },
            { offset: 1, color: '#E99835' },
          ]),
        },
        data: yD,
        type: 'bar',
      },
    ],
  };
});
let lowMileageData = computed(() => {
  let xD = (allData.value?.lowMileageData?.mileageData || [])?.map(
    (k) => k?.key
  );
  let yD = (allData.value?.lowMileageData?.mileageData || [])?.map(
    (k) => k?.value
  );
  return {
    color: [],

    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    xAxis: {
      type: 'category',
      data: xD,
      axisTick: {
        alignWithLabel: true,
      },
    },
    yAxis: {
      axisLine: {
        show: true,
      },
      type: 'value',
      splitLine: { show: false },
    },
    series: [
      {
        label: {
          show: true, //开启显示
          position: 'top', //在上方显示
        },
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#2731F5' },
            { offset: 1, color: '#6D5DBC' },
          ]),
        },
        data: yD,
        type: 'bar',
      },
    ],
  };
});
let current = ref('');
let showTooltip = ref(false);
let menuList1 = ref([
  { name: '车辆档案', route: Routes.carRecord },
  { name: '事件记录', route: Routes.eventLog },
  { name: '历史轨迹', route: Routes.fleetTrail },
  { name: '定位追踪', route: Routes.fleetLocation },
  { name: '故障报警', route: Routes.faultWarn },
  { name: '驾驶评分', route: Routes.drivingScore },
]);
let menuList2 = ref([
  { name: '事件记录', route: Routes.eventLog },
  { name: '历史轨迹', route: Routes.fleetTrail },
  { name: '定位追踪', route: Routes.fleetLocation },
  { name: '故障报警', route: Routes.faultWarn },
  { name: '驾驶评分', route: Routes.drivingScore },
]);
let menuList = computed(() => {
  return params?.isOwner == '1' ? menuList1.value : menuList2.value;
});

function naviTo(route) {
  nrNavigateTo(route, {
    licensePlateNumber: params?.licensePlateNumber,
    licensePlateNum: params?.licensePlateNumber,
    vinCode: params?.vinCode,
    vin: params?.vinCode,
    vinLicense: params?.vinLicense,
  });
}
onBeforeMount(() => {
  if (loveCarStore()?.isVr) {
    carDataHisData.value = vrHis?.data;
    dashboardData.value = vrBoard?.data;
    allData.value = vrChart?.data;
    addr.value = '上海市闵行区申昆路2177号';
    return;
  }
  fleetCarData({ vinLicense: params?.vinLicense }).then((res) => {
    jGcustomCount(JG.CV_010);

    if (res?.code !== CODE) return useToast(res?.msg);
    allData.value = res?.data;
  });
  dashboard({ vinLicense: params?.vinLicense }).then((res) => {
    setTimeout(() => {
      floading.value = false;
    }, 300);
    if (res?.code !== CODE) return useToast(res?.msg);
    dashboardData.value = res?.data;
    let { longitude, latitude } = res?.data;
    getCityInfo({
      longitude,
      latitude,
    }).then((res) => {
      if (res.status != '1') return;
      addr.value =
        typeof res.regeocode.formatted_address === 'string'
          ? res.regeocode.formatted_address
          : '';
    });
  });
  carDataHis({ vinLicense: params?.vinLicense }).then((res) => {
    if (res?.code !== CODE) return useToast(res?.msg);
    carDataHisData.value = res?.data;
  });
});
function go() {
  nrNavigateTo(Routes.fleetLocation, {
    vinLicense: params?.vinLicense,
    licensePlateNum: params?.licensePlateNum,
  });
}
let opacity = ref(0);
let titleColor = ref('#fff');
usePageScroll((res) => {
  const cur = +(Math.abs(Math.round(res.scrollTop)) / 200).toFixed(1);
  if (res.scrollTop <= 2) {
    titleColor.value = '#fff';
  } else {
    titleColor.value = `rgba(0,0,0, ${cur})`;
  }
  opacity.value = cur;
});
// bottom
</script>
<style>
page {
  background-color: #fff;
}
.bar {
  width: 70px;
  height: 1px;
  line-height: 20px;
  background-color: rgba(255, 255, 255, 0.77);
  text-align: center;
  box-shadow: 0px 3px 6px 1px rgba(17, 38, 77, 25);
}
.gra {
  background-image: linear-gradient(#dee3eb, #fff);
}
.tableHeader {
  border: 1px solid #f9f9f9;
  background: #f9f9f9;
}
</style>
