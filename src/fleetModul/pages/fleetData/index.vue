<template>
  <FullLoading :loading="fl" :no-data="!todayData">
    <Car></Car>
    <div class="flex items-center justify-center bg-fff pb-10px mb-10px">
      <span class="mr-6px pb-3px">{{ params?.teamName }}</span>
      <nut-popover v-model:visible="visible">
        <template #reference>
          <span class="icon-icon-question iconfont text-16px"></span>
        </template>
        <template #content>
          <div class="p-6px">
            车队名称默认为用户名，如需修改车队名称请前往【晨光智能网联系统】使用PC端进行修改，详细地址为www.fms-admin.newrizon.com
          </div>
        </template>
      </nut-popover>
    </div>
    <section class="overflow-hidden px-14px bg-fff mb-10px">
      <div class="flex justify-between pt-10px">
        <div>历史数据</div>
        <div
          class="relative w-64px"
          @click="
            () => {
              nrNavigateTo(Routes.peersRank);
            }
          "
        >
          <span class="absolute w-full text-center text-12px nrz-thin center"
            >同业排行</span
          >
          <span
            class="absolute top-0 left-0 w-full bg-bottom bg-no-repeat bg-contain h-20px"
            :style="{
              backgroundImage: `url(${lineUrl})`,
            }"
          ></span>
        </div>
      </div>
      <HistoryPanel :cid="'carPanel'" :data="hisData"></HistoryPanel>
      <div class="flex justify-between">
        <div class="flex flex-1 items-center justify-end px-20px gra1">
          <div class="mr-20px">{{ hisData?.eleEfficiency || '--' }}%</div>
          <div
            class="nrz-thin py-4px text-12px"
            style="color: rgba(4, 111, 60, 1)"
          >
            <div class="mb-6px">电</div>
            <div>车</div>
          </div>
        </div>
        <div class="flex flex-1 items-center px-20px gra2">
          <div
            class="mr-20px nrz-thin py-4px text-12px"
            style="color: rgb(4, 111, 60)"
          >
            <div class="mb-6px">油</div>
            <div>车</div>
          </div>
          <div>{{ hisData?.oilEfficiency || '--' }}%</div>
        </div>
      </div>
      <div
        class="w-full text-center py-20px nrz-thin text-12px flex justify-center"
      >
        <div>运营效率各项指标占比每月可选择调整一次</div>
        <div
          style="color: rgba(16, 3, 230, 1)"
          @click="
            () => {
              nrNavigateTo(Routes.operationConfig);
            }
          "
        >
          调整
        </div>
        <div
          style="color: rgba(16, 3, 230, 1)"
          @click="
            () => {
              nrNavigateTo(Routes.operationConfig);
            }
          "
        >
          {{ '>>' }}
        </div>
      </div>
      <section class="pb-20px">
        <section class="flex justify-between overflow-hidden">
          <Card
            class="mb-10px"
            :val="hisData?.eleAvgEnergy"
            title="电车平均能耗"
            unit="kW•h/100km"
          ></Card>
          <Card
            class="mb-10px mx-4px"
            bg="rgba(144, 142, 2, 0.2)"
            color="rgba(144, 142, 2, 1)"
            unit="kW•h"
            title="电车日均充电"
            :val="hisData?.eleAvgAddEnergy"
          ></Card>
          <Card
            class="mb-10px mr-4px"
            :val="hisData?.avgSpeed"
            title="平均速度"
            unit="km/h"
          ></Card>
          <Card
            class="mb-10px"
            bg="rgba(144, 142, 2, 0.2)"
            color="rgba(144, 142, 2, 1)"
            unit="L/100km"
            title="油车平均油耗"
            :val="hisData?.oilAvgEnergy"
          ></Card>
        </section>
      </section>
      <div class="flex justify-around mb-40px">
        <nut-button
          class="rounded px-14px border-primary"
          @click="
            () => {
              go(2);
            }
          "
        >
          近12个月全部数据
        </nut-button>
        <nut-button
          class="rounded px-14px border-primary"
          @click="
            () => {
              go(1);
            }
          "
        >
          近12个月单车数据
        </nut-button>
      </div>
    </section>
    <section class="bg-fff">
      <section class="bg-fff98 px-14px">
        <div class="py-14px">今日用车</div>
        <div class="flex justify-between">
          <Card
            v-for="(k, index) in totalList"
            :key="k.key"
            class="mb-10px"
            :class="{ 'mx-4px': index > 0 && index < totalList?.length - 1 }"
            bg="rgba(144, 142, 2, 0.2)"
            color="rgba(144, 142, 2, 1)"
            :unit="k.unit"
            :title="k.text"
            :val="k.val"
          ></Card>
        </div>
      </section>

      <section class="flex px-14px">
        <view class="flex-1 nr-border--dashed">
          <div class="w-full text-center py-10px bg-fleet">电车</div>
          <div class="flex justify-between">
            <Item
              v-for="(k, index) in elecList1"
              :key="k.key"
              :class="{ 'nr-border-r--dashed': index === 0 }"
              :unit="k.unit"
              :title="k.text"
              :val="k.val"
            ></Item>
          </div>
          <div class="flex justify-between">
            <Item
              v-for="(k, index) in elecList2"
              :key="k.key"
              :class="{ 'nr-border-r--dashed': index === 0 }"
              :unit="k.unit"
              :title="k.text"
              :val="k.val"
            ></Item>
          </div>
          <div class="flex justify-between">
            <Item
              v-for="(k, index) in elecList3"
              :key="k.key"
              :class="{ 'nr-border-r--dashed': index === 0 }"
              :unit="k.unit"
              :title="k.text"
              :val="k.val"
            ></Item>
          </div>
        </view>
        <view class="flex-1 border-l-0 nr-border--dashed">
          <div class="w-full text-center py-10px bg-fleet">油车</div>
          <div class="flex justify-between">
            <Item
              v-for="(k, index) in oilList1"
              :key="k.key"
              :class="{ 'nr-border-r--dashed': index === 0 }"
              :unit="k.unit"
              :title="k.text"
              :val="k.val"
            ></Item>
          </div>
          <div class="flex justify-between">
            <Item
              v-for="(k, index) in oilList2"
              :key="k.key"
              :class="{ 'nr-border-r--dashed': index === 0 }"
              :unit="k.unit"
              :title="k.text"
              :val="k.val"
            ></Item>
          </div>
          <div class="flex justify-between">
            <Item
              v-for="(k, index) in oilList3"
              :key="k.key"
              :class="{ 'nr-border-r--dashed': index === 0 }"
              :unit="k.unit"
              :title="k.text"
              :val="k.val"
            ></Item>
          </div>
        </view>
      </section>
    </section>
    <div class="h-30px bg-fff"></div>
    <view class="box-border w-full bg-fff relative flex pl-20px justify-center">
      <Scatter
        @click="clickOpt"
        :legend="options1?.legend"
        :xAxis="{
          min: 0,
          max: 420,
          splitNumber: 60,
        }"
        :xAxisLine="{
          color: '#e3e3e3',
          itemGap: 88,
        }"
        :yAxis="{
          min: 0,
          max: 150,
          splitNumber: 30,
        }"
        ref="scatterRef"
      ></Scatter>
      <div class="arc-dashed"></div>
      <view
        v-show="show"
        style="z-index: 9999"
        class="absolute flex flex-col overflow-hidden rounded center bg-fff nr-shadow-full p-6px text-10px"
        @click="goMonth"
      >
        <span class="mb-6px">车牌：{{ licensePlateNumber }}</span>
        <span class="mb-6px">里程：{{ mile }}(km)</span>
        <span class="mb-6px">时间：{{ time }}(h)</span>
        <span class="mb-6px">速度：{{ speed }}(km/h)</span>
        <span class="text-park">点击查看</span>
      </view>
    </view>

    <div class="text-center text-10px pb-20px bg-fff">
      <span class="opacity-50">每个点代表一辆车的里程、时长和速度</span>
    </div>
    <section class="bg-fff py-20px">
      <div class="pl-14px py-20px">更多数据</div>
      <More
        v-for="item in moreList"
        :key="item.route"
        :text="item.text"
        :type="item.type"
        :route="item.route"
        @click="jgUpload(item?.jgId)"
      ></More>
    </section>
    <section class="bg-fff">
      <div
        :style="{ backgroundImage: `url(${LOGO_IMG_BOTTOM})` }"
        class="m-auto bg-center bg-no-repeat bg-contain w-100px h-22px py-40px"
      ></div>
    </section>
  </FullLoading>
</template>
<script lang="ts">
import { onShareAppMessage, onShareTimeline } from '@/utils/index';
import { useRouter } from '@tarojs/taro';
import { onMounted } from 'vue';
export default {
  onShareAppMessage,
  onShareTimeline,
};
</script>
<script lang="ts" setup>
import FullLoading from '@/components/full-loading/index.vue';
import HistoryPanel from './HistoryPanel.vue';
import { ref } from 'vue';
import Car from './Car.vue';
import Scatter from '@/components/tui-charts-scatter/tui-charts-scatter.vue';
import Item from './item.vue';
import More from './More.vue';
import Card from './Card.vue';
import {
  LOGO_IMG_BOTTOM,
  Routes,
  useToast,
  getStore,
  OBU_USER,
  setStore,
  USER_INFO,
  jGcustomCount,
  JG,
  nrNavigateTo,
  lineUrl,
} from '@/utils';
import { getFleetToday, getFleetHistory, getObuInfo } from '@/api';

interface PropsItem {
  text?: string;
  val?: string | number;
  decimal?: number;
  key?: string;
  unit?: string;
}
let scatterRef = ref();
let options1: any = {};

definePageConfig({
  navigationBarTitleText: '我的资产',
});
let time = ref();
let speed = ref();
let licensePlateNumber = ref();
let mile = ref();
let vinCode = ref();
let show = ref(false);
let params = useRouter()?.params;
let fl = ref(true);
let hisData = ref();
let todayData = ref();
let visible = ref(false);
let moreList = ref([
  {
    text: '定位追踪',
    route: Routes.fleetLocation,
  },
  {
    text: '历史轨迹',
    route: Routes.fleetTrail,
  },
  {
    text: '驾驶评分',
    route: Routes.drivingScore,
  },
  {
    text: '故障报警',
    route: Routes.faultWarn,
  },
  {
    text: '停车热力图',
    type: 'webview',
    jgId: JG.BV_008,
  },
  {
    text: '全量数据',
    route: Routes.allData,
    jgId: JG.BV_010,
  },
  {
    text: '数据排行',
    route: Routes.rankingData,
    jgId: JG.BV_009,
  },
  {
    text: '事件记录',
    route: Routes.eventLog,
  },
]);
let totalList = ref<PropsItem[]>([
  {
    text: '行驶里程',
    key: 'totalMileage',
    val: 0,
    unit: 'km',
  },
  {
    text: '行驶时长',
    key: 'totalRunTime',
    unit: 'h',
    val: 0,
  },
  {
    text: '平均时速',
    val: 0,
    key: 'avgSpeed',
    unit: 'km/h',
    decimal: 0,
  },
]);
let elecList1 = ref<PropsItem[]>([
  {
    text: '行驶里程',
    val: 0,
    key: 'mileage',
    unit: 'km',
  },
  {
    text: '行驶时长',
    key: 'runTime',
    unit: 'h',
    val: 0,
  },
]);
let elecList2 = ref([
  {
    text: '充电量',
    val: 0,
    unit: 'kW·h',
    key: 'addEnergy',
  },
  {
    text: '充电次数',
    val: 0,
    unit: '次',
    key: 'addTimes',
  },
]);
let elecList3 = ref([
  {
    text: '耗电量',
    val: 0,
    unit: 'kW·h',
    key: 'costEnergy',
  },
  {
    text: '能耗',
    unit: 'kW·h/100km',
    val: '',
    key: 'energyConsumption',
  },
]);
let oilList1 = ref([
  {
    text: '行驶里程',
    val: '',
    key: 'mileage',
    unit: 'km',
  },
  {
    text: '行驶时长',
    key: 'h',
    val: '',
  },
]);
let oilList2 = ref([
  {
    text: '加油量',
    unit: 'L',
    val: 0,
    key: 'addEnergy',
  },
  {
    text: '加油次数',
    unit: '次',
    val: 0,
    key: 'addTimes',
  },
]);
let oilList3 = ref([
  {
    text: '油耗量',
    val: 0,
    unit: 'L',
    key: 'costEnergy',
  },
  {
    text: '油耗',
    unit: 'L/100km',
    val: 0,
    key: 'energyConsumption',
  },
]);

let scatterOil = ref([]);
let scatterEle = ref([]);
function jgUpload(id) {
  if (!id) return;
  jGcustomCount(id);
}
function go(id) {
  let obuData = getStore(OBU_USER)?.belongTeam || {};
  if (id === 2) {
    nrNavigateTo(Routes.fleetFullYearData, {
      vinLicense: obuData?.vinCode,
      vehicleType: obuData?.vehicleType,
    });
  } else {
    nrNavigateTo(Routes.carFullYearData, {
      vinLicense: obuData?.vinCode,
      vehicleType: obuData?.vehicleType,
    });
  }
}
function clickOpt(v) {
  console.log(v);
}
const regScatter = (res) => {
  scatterOil.value = res?.data?.oil?.detail?.map((item) => {
    return [
      item?.mileage,
      item?.runTime,
      '油车',
      item?.vehicleSpeed,
      item?.licensePlateNumber,
      item?.vinCode,
    ];
  });
  scatterEle.value = res?.data?.ele?.detail?.map((item) => {
    return [
      item?.mileage,
      item?.runTime,
      '电车',
      item?.vehicleSpeed,
      item?.licensePlateNumber,
      item?.vinCode,
    ];
  });
  options1 = {
    legend: {
      show: true,
      size: 24,
      color: '#333',
    },
    dataset: [
      {
        name: '电车',
        color: '#0DEC64',
        width: 20,
        source: scatterEle.value,
      },
      {
        name: '油车',
        color: '#FB4820',
        width: 24,
        source: scatterOil.value,
      },
    ],
  };

  scatterRef.value.draw(options1.dataset);
};
// bottom
function goMonth() {
  nrNavigateTo(Routes.carteamMonthData, {
    licensePlateNumber: licensePlateNumber.value,
    vinCode: vinCode.value,
  });
}
onMounted(() => {
  jGcustomCount(JG.BV_007);
  let teamId = getStore(OBU_USER)?.teamId;
  getFleetToday({ teamId }).then((res) => {
    setTimeout(() => {
      fl.value = false;
    }, 100);
    if (res?.code !== 200) return useToast(res?.msg);
    if (res?.data) {
      getObuInfo({ mobile: getStore(USER_INFO)?.mobile }).then((obu) => {
        if (obu.code === 200) {
          setStore(OBU_USER, obu.data);
        }
      });
    }
    regScatter(res);
    todayData.value = res?.data;
    totalList.value = totalList.value?.map((item) => {
      return {
        ...item,
        val: res?.data[item.key as string],
      };
    });

    elecList1.value = elecList1.value?.map((item) => {
      return {
        ...item,
        val: res?.data?.ele?.[item.key as string],
      };
    });
    elecList2.value = elecList2.value?.map((item) => {
      return {
        ...item,
        val: res?.data?.ele?.[item.key as string],
      };
    });
    elecList3.value = elecList3.value?.map((item) => {
      return {
        ...item,
        val: res?.data?.ele?.[item.key as string],
      };
    });

    oilList1.value = oilList1.value?.map((item) => {
      console.log(
        '**********************',
        res?.data?.oil?.[item.key as string]
      );
      return {
        ...item,
        val: res?.data?.oil?.[item.key as string],
      };
    });
    oilList2.value = oilList2.value?.map((item) => {
      return {
        ...item,
        val: res?.data?.oil?.[item.key as string],
      };
    });
    oilList3.value = oilList3.value?.map((item) => {
      return {
        ...item,
        val: res?.data?.oil?.[item.key as string],
      };
    });
  });

  getFleetHistory({ teamId }).then((res) => {
    if (res?.code !== 200) return useToast(res?.msg);
    hisData.value = res?.data;
  });
});
</script>
<style>
page {
  background-color: #f5f5f5;
}
.nut-popover-taro .popover-content--bottom {
  width: 260px;
}
.cover-m {
  margin: 0;
}
.gra1 {
  background: linear-gradient(
    240deg,
    rgba(18, 213, 122, 0.4) 0%,
    rgba(30, 215, 215, 0) 100%
  );
}
.gra2 {
  background: linear-gradient(
    90deg,
    rgba(242, 169, 59, 0.4) 0%,
    rgba(242, 169, 169, 0) 100%
  );
}
.arc-dashed {
  width: 80px;
  height: 80px;
  border: 1px dashed #ccc;
  border-left-width: 0px;
  border-bottom-width: 0px;
  border-radius: 0px 80px 0 0;
  position: absolute;
  bottom: 35px;
  left: 24px;
  z-index: 1000;
}
</style>
