<template>
  <section class="flex flex-col w-full h-full overflow-hidden">
    <CustomBar :border="false" position="unset"></CustomBar>
    <section class="flex-1 overflow-hidden">
      <MainScroll
        :has-more="hasMore"
        bg="#eef3f9"
        :pt="0"
        :refresher-enabled="false"
        refresh-bg="#ddd"
        :init-loading="initLoading"
        :end-text="''"
      >
        <div class="px-20px overflow-auto">
          <div class="my-10px">车型</div>
          <section class="flex text-12px">
            <div
              class="bg-fff py-6px px-8px mr-10px"
              :style="{ color: state.carType === 0 ? color : '' }"
              @click="chooseCarType(0)"
            >
              EC1
            </div>
            <div
              class="bg-fff py-6px px-8px"
              :style="{ color: state.carType === 1 ? color : '' }"
              @click="chooseCarType(1)"
            >
              iC1
            </div>

            <div
              class="ml-auto bg-fff py-6px px-8px mr-10px"
              :style="{ color: state.carBoxType === 'box' ? color : '' }"
              @click="chooseCarBoxType('box')"
            >
              货箱
            </div>
            <div
              class="bg-fff py-6px px-8px"
              :style="{ color: state.carBoxType === 'stake' ? color : '' }"
              @click="chooseCarBoxType('stake')"
            >
              仓栅
            </div>
          </section>

          <div
            class="relative flex justify-center items-center w-310px h-310px bg-fff bg-car rounded-full mt-30px mx-auto"
          >
            <section
              class="flex justify-center w-full bg-contain h-200px w-200px bg-no-repeat"
              :style="{
                backgroundImage: `url(${getUrl})`,
                backgroundPosition: 'center 0px',
              }"
            ></section>
            <div
              v-if="state.carType == 0"
              class="absolute bottom-30px x-center"
            >
              <div class="flex justify-center items-end">
                <NrzNumber :value="calcMile" color="#11264d"></NrzNumber>
                <div>km</div>
              </div>
              <div class="text-12px mt-10px">实际运行续航里程</div>
            </div>
            <div v-else class="absolute bottom-30px x-center">
              <div class="text-12px mt-10px">敬请期待</div>
            </div>
          </div>

          <div class="py-10px mt-30px">平均载货重量</div>
          <section class="flex text-12px justify-between">
            <div
              v-for="item in avWeightList1"
              :key="item"
              class="w-70px text-center bg-fff py-6px"
              :style="{ color: state.avWeight === item ? color : '' }"
              @click="
                () => {
                  state.avWeight = item;
                }
              "
            >
              {{ item }}
            </div>
          </section>
          <section class="flex text-12px mt-16px justify-between">
            <div class="bg-fff py-6px w-70px text-center text-info">超重:</div>
            <div
              v-for="item in avWeightList2"
              :key="item"
              class="bg-fff py-6px w-70px text-center text-info"
              :style="{ color: state.avWeight === item ? 'red' : '' }"
              @click="
                () => {
                  state.avWeight = item;
                }
              "
            >
              {{ item }}
            </div>
          </section>

          <div class="py-10px mt-30px">使用区域</div>
          <section class="flex text-12px">
            <div
              class="flex items-center bg-fff py-6px px-8px mr-10px"
              @click="chooseCity"
            >
              <div :style="{ color }">{{ city }}</div>
              <span class="iconfont icon-sanjiao text-12px ml-4px"></span>
            </div>
          </section>

          <div class="py-10px mt-30px">行驶道路类型</div>
          <section class="flex text-12px">
            <div
              v-for="item in roadList"
              :key="item + 'road'"
              class="bg-fff py-6px px-8px mr-10px"
              :style="{ color: state.roadType === item ? color : '' }"
              @click="state.roadType = item"
            >
              {{ item === 0 ? '城市道路' : '高速/国道' }}
            </div>
          </section>

          <div class="py-10px mt-30px">季节</div>
          <section class="flex text-12px">
            <div
              v-for="item in season"
              :key="item.key + 'season'"
              class="bg-fff py-6px px-8px mr-10px text-center min-w-30px"
              :style="{ color: state.seasonType === item.key ? color : '' }"
              @click="state.seasonType = item.key"
            >
              {{ item.name }}
            </div>
          </section>

          <div class="py-10px mt-30px">制动能量回收</div>
          <section class="flex text-12px">
            <div
              v-for="item in [0, 1]"
              :key="item + 'recovery'"
              class="bg-fff py-6px px-10px mr-10px min-w-30px text-center"
              :style="{ color: state.recovery === item ? color : '' }"
              @click="state.recovery = item"
            >
              {{ item === 0 ? '● 开' : '○ 关' }}
            </div>
          </section>
        </div>
      </MainScroll>
    </section>
  </section>
  <NrzAddr v-model:show="cityVisible" :layer="2" @change="getPath"></NrzAddr>
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
import { onBeforeMount, reactive, ref, watch, computed } from 'vue';
import CustomBar from '@/components/customHeader/index.vue';
import { store } from '@/stores/index';
import { CODE, useToast, jGcustomCount, JG } from '@/utils/index';
import { mileageCalcConfig } from '@/api/index';
import { useShareAppMessage } from '@tarojs/taro';
import NrzNumber from '@/components/numberScroll/index.vue';
import NrzAddr from '@/components/nrz-addr/index.vue';

useShareAppMessage(() => {
  jGcustomCount(JG.MALL_003, { name: '里程计算器' });
  return {
    title: '前晨汽车里程计算器',
    path: `/fleetModul/pages/mileCalculatorPage/index`,
    imageUrl: 'https://nrz-app.su.bcebos.com/resources/lcjsq_share.jpg',
  };
});
definePageConfig({ transparentTitle: 'auto',titlePenetrate: 'YES',defaultTitle: '', });
const carBox = 'https://nrz-app.su.bcebos.com/app-pic/EC1/lcjsq_ec1_hx.png';
const iC1 = 'https://nrz-app.su.bcebos.com/app-pic/iC1/iC1_wait.png';
const carSt = 'https://nrz-app.su.bcebos.com/app-pic/EC1/lcjsq_ec1_cs.png';
let hasMore = ref(false);
let initLoading = ref(false);
let cityVisible = ref(false);
let city = ref('');
let color = '#73BEE3';
let calcMile = ref(0);
let calcConfig = ref();
let avWeightList1 = ref([0, 0.5, 1, 1.5]);
let avWeightList2 = ref([2, 2.5, 3]);

let roadList = ref([0, 1]);
let season = ref([
  { name: '春', key: 0 },
  { name: '夏', key: 1 },
  { name: '秋', key: 2 },
  { name: '冬', key: 3 },
]);
const state = reactive({
  carType: 0,
  carBoxType: 'box',
  avWeight: 0,
  roadType: 0,
  seasonType: 0, // 季节
  recovery: 0, // 制动能回收开关
  adcode: '',
});
let getUrl = computed(() => {
  if (state.carType == 0) {
    if (state.carBoxType == 'box') {
      return carBox;
    }
    if (state.carBoxType == 'stake') {
      return carSt;
    }
  } else {
    return iC1;
  }
  return '';
});
function chooseCarType(type) {
  state.carType = type;
}
function chooseCarBoxType(t) {
  state.carBoxType = t;
}
function getPath(e) {
  state.adcode = e.value?.[1];
  city.value = e.text?.join('/');
}
function chooseCity() {
  cityVisible.value = true;
}

onBeforeMount(() => {
  mileageCalcConfig().then((res) => {
    if (res?.code !== CODE) return;
    calcConfig.value = res?.data;
    calcRestMile();
  });
  let { city: c, province, adcode } = store().cityInfo || {};
  city.value = `${province}/${typeof c == 'string' ? c : province}`;
  state.adcode = adcode;
});

function calcRestMile() {
  if (state.carType === 1) return useToast('敬请期待');
  // 地区对应的系数 取不到为1
  let areaCoefficient =
    calcConfig.value?.influence?.find((item) => {
      return item?.k === state.adcode;
    })?.v || 1;
  // 获取车型对应的数据 目前只有EC1
  let data =
    calcConfig.value?.vehicle?.EC1?.find((item) => {
      return item?.type === state.carBoxType;
    })?.data || [];
  // 获取重量对应的数据
  let weightFilterData = data?.find((item) => {
    return state.avWeight * 1000 == item?.load;
  });

  // 获取道路跟动能回收
  let maps = {
    // 00 01 代表道路类型+动能开关
    '00': 'nOn',
    '01': 'nOff',
    '10': 'hsOn',
    '11': 'hsOff',
  };
  let key = `${state.roadType}${state.recovery}`;
  let reasonData = weightFilterData?.[maps?.[key]];
  let ret = reasonData?.[state.seasonType];
  calcMile.value = Math.ceil(ret * areaCoefficient);
}
watch(
  () => state,
  () => {
    calcRestMile();
  },
  { deep: true, immediate: true }
);

// bottom
</script>
<style>
page {
  background-color: #eef3f9;
}
.bg-car {
  /* background-image: radial-gradient(circle, #e2edf7 55%, #fff 15%); */
  background: radial-gradient(circle, #e2edf7 55%, #fff 75%);
}
</style>
