<template>
  <CustomBar background-color="#fff">
    <template #title>所属车队</template>
    <template v-if="rank" #customLeft>
      <span
        @click="
          () => {
            makePhoneCall(belongTeam?.mainAccount);
          }
        "
        >联系老板</span
      >
    </template>
  </CustomBar>
  <FL :loading="loading" :no-data="!rank">
    <section :style="{ paddingTop: `${headerHeight}px` }">
      <Chart :is-leader="false"></Chart>

      <div class="flex justify-center px-14px mt-20px">
        <div class="w-full bg-fleet p-10px px-14px">
          <div class="font-bold text-center text-16px py-10px">
            {{ belongTeam?.teamName }}
          </div>
          <aside class="flex flex-col opacity-90">
            <span class="my-6px">车辆品牌：{{ belongTeam?.model }}</span>
            <span class="my-6px"
              >车辆类型：{{ belongTeam?.vehicleTypeText }}</span
            >
            <span class="my-6px">车辆VIN：{{ belongTeam?.vinCode }}</span>
            <span class="my-6px"
              >终端设备编号：{{ belongTeam?.simNumber }}</span
            >
          </aside>
          <button
            class="ml-auto rounded-full bg-fleet p-10px px-16px w-100px"
            style="color: #1723f0"
            @click="
              () => {
                nrNavigateTo(Routes.fleetLocation, {
                  vinLicense: belongTeam?.vinCode,
                  vinCode: belongTeam?.vinCode,
                  licensePlateNum: belongTeam?.licensePlateNumber,
                });
              }
            "
          >
            查看位置
          </button>
        </div>
      </div>
    </section>
    <div class="font-bold text-16px pl-14px my-20px mt-34px">运行数据</div>
    <div class="flex items-center justify-between text-12px px-14px">
      <span class="opacity-50">数据更新时间：2222-12-12</span>
      <button
        class="rounded-full bg-fleet p-10px px-16px"
        style="color: rgba(16, 16, 16, 0.55)"
        @click="
          () => {
            nrNavigateTo(Routes.carData, {
              type: belongTeam?.vehicleType === '油车' ? 2 : 1,
              vinLicense: belongTeam?.vinCode,
              vinCode: belongTeam?.vinCode,
              licensePlateNumber: belongTeam?.licensePlateNumber,
              isOwner: 0,
            });
          }
        "
      >
        更多数据
      </button>
    </div>

    <section class="px-14px mt-20px">
      <aside class="table w-full border-collapse nrz-thin">
        <div class="table-header-group">
          <div
            v-for="item in columns"
            :key="item.title"
            class="table-cell py-10px pl-6px tableHeader"
            :style="{ width: item?.width ? item.width + 'px' : '' }"
          >
            <span>{{ item.title }}</span>
          </div>
        </div>

        <div v-for="(k, i) in rank" :key="i" class="table-row">
          <div
            v-for="item in columns"
            :key="k[item.prop]"
            class="table-cell py-10px pl-6px nr-border-b--dashed"
          >
            {{ k[item.prop] }}{{ item.prop === 'value' ? k.unit : '' }}
          </div>
        </div>
      </aside>
    </section>
    <section class="bg-fff py-20px">
      <div class="pl-14px py-6px bl-2 mx-10px my-10px">更多数据</div>
      <More
        v-for="item in moreList"
        :key="item.route"
        :text="item.text"
        :route="item.route"
      ></More>
    </section>
    <div class="leading-normal opacity-50 text-12px px-14px mt-20px pb-60px">
      <div>备注：</div>
      <div>
        1. 您是当前车辆司机，且被车队添加后在该页面会出现车辆相关 信息、数据等。
      </div>
      <div>2. 所属车队中只能查看车辆数据、无法做任何修改。</div>
      <div>3. 仅可查看自己为司机的车辆信息。</div>
      <div>4. 当车队所有者修改车辆司机或删除您之后该页面数据同步清空。</div>
      <div>5. 每个人仅可成为一辆车的司机，可以是油车或前晨电车。</div>
    </div>
  </FL>
</template>
<script lang="ts">
import { onShareAppMessage, onShareTimeline } from '@/utils/index';
export default {
  onShareAppMessage,
  onShareTimeline,
};
</script>
<script lang="ts" setup>
import { onBeforeMount, ref, onMounted } from 'vue';
import CustomBar from '@/components/customHeader/index.vue';
import { teamRank, getObuInfo } from '@/api/index';
import More from './More.vue';
import FL from '@/components/full-loading/index.vue';

import {
  CODE,
  Routes,
  nrNavigateTo,
  getStore,
  OBU_USER,
  useToast,
  setStore,
  makePhoneCall,
  USER_INFO,
  LOGO_IMG_BOTTOM,
  jGcustomCount,
  JG,
} from '@/utils/index';
import { useHeaderHeight } from '@/hooks/index';
import Chart from './Chart1.vue';
definePageConfig({
  transparentTitle: 'auto',
  titlePenetrate: 'YES',
  defaultTitle: '',
});
let loading = ref(true);
let moreList = ref([
  {
    text: '定位追踪',
    route: Routes.fleetLocation,
  },
  {
    text: '事件记录',
    route: Routes.eventLog,
  },
  {
    text: '历史轨迹',
    route: Routes.fleetTrail,
  },
  {
    text: '故障报警',
    route: Routes.faultWarn,
  },
  {
    text: '驾驶评分',
    route: Routes.drivingScoreDetail,
  },
]);
let belongTeam = getStore(OBU_USER)?.belongTeam;
let rank = ref<any>([]);
let columns = [
  {
    title: '名称',
    prop: 'name',
  },
  {
    title: '值',
    prop: 'value',
    width: 120,
  },
  {
    title: '车队内排名',
    prop: 'rank',
  },
];
const { headerHeight } = useHeaderHeight();
onBeforeMount(() => {
  jGcustomCount(JG.BV_011);
  teamRank({}).then((res) => {
    loading.value = false;
    if (res?.code !== CODE) return useToast(res?.msg);
    rank.value = res?.data;
    if (res?.data) {
      getObuInfo({ mobile: getStore(USER_INFO)?.mobile }).then((obu) => {
        if (obu.code === 200) {
          setStore(OBU_USER, obu.data);
        }
      });
    }
  });
});
// bottom
</script>
<style>
page {
  background-color: #fff;
}
.tableHeader {
  background: #f9f9f9;
}
.bl-2 {
  border-left: 2px #101010 solid;
}
</style>
