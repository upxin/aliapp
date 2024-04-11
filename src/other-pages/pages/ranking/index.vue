<template>
  <CustomBar background-color="#fff" :show-icon="false">
    <template #left>
      <div
        class="flex items-center border border-solid border-hex-aaa rounded-3xl h-26px px-8px"
      >
        <span
          class="iconfont text-hex-aaa nz-rot180 icon-arrow-right-bold text-14px"
          :style="{}"
          @click="back"
        ></span>
        <div class="bg-hex-aaa h-12px w-1px opacity-80 mx-8px"></div>
        <div class="text-hex-aaa text-12px" @click="all = true">更多</div>
      </div>
    </template>
    <template #title>{{
      Params?.id == '1' ? '日行驶里程排名' : '日均能耗排名'
    }}</template>
  </CustomBar>
  <MainScroll
    :init-loading="fl"
    :pt="CalcPt"
    bg="##FFF1CB"
    @end-pull-down="_refresh"
  >
    <div class="overflow-y-auto">
      <section>
        <main :style="{ backgroundColor: getBgColor }" class="h-215px">
          <div class="flex flex-col items-center pt-30px">
            <div class="flex">
              <span class="text-hex-6178E5">「{{ name }}</span>
              <span class="text-info">{{ carNum }}辆</span>
              <span class="text-hex-6178E5">」</span>
            </div>
            <div class="mt-15px text-12px text-hex-aaa">
              {{ showDate() }}
            </div>
          </div>
        </main>
        <NrImg class="m-auto -mt-107px w-153px h-120px" :url="CUP"> </NrImg>
        <section
          v-if="_data?.length > 3"
          class="flex items-end border-0 border-dashed mx-16px mt-80px border-b-1px border-hex-eee"
        >
          <main
            class="flex-1 inline-block rank-shadow rounded-tl-2xl h-130px rounded-tr-2xl bg-hex-fff"
          >
            <div
              class="box-border flex flex-col items-center justify-start flex-1 -mt-66px text-12px"
            >
              <div>
                <NrImg
                  :url="CUP_TWO"
                  class="flex items-center justify-center bg-contain -mb-23px w-60px h-60px"
                  ><span>2</span></NrImg
                >
                <NrImg
                  :url="_data?.[1].avatar || ''"
                  class="border-solid rounded-full w-60px h-60px border-1px border-hex-C1CCDD"
                />
              </div>
              <span class="text-normal mt-12px mb-5px">{{
                _data?.[1].name
              }}</span>
              <span class="text-10px mb-10px">{{
                _data?.[1]?.vehicleName
              }}</span>
              <span class="text-hex-F5B510 mb-4px"
                >{{
                  Number(Params?.id) === 1
                    ? _data?.[1]?.mileage
                    : _data?.[1]?.energyConsumption
                }}{{ Number(Params?.id) === 1 ? 'km' : 'kW·h/100km' }}</span
              >
              <span class="transform text-primary text-10px text-hex-aaa"
                >{{ _data?.[1]?.driverTime }}h</span
              >
            </div>
          </main>
          <main
            class="flex-1 inline-block bl-br rank-shadow h-160px rounded-tl-2xl rounded-tr-2xl bg-hex-fff"
          >
            <div
              class="box-border flex flex-col items-center justify-start flex-1 -mt-66px text-12px"
            >
              <div>
                <NrImg
                  :url="CUP_ONE"
                  class="flex items-center justify-center bg-contain -mb-23px w-60px h-60px"
                  ><span>1</span></NrImg
                >
                <NrImg
                  :url="_data?.[0].avatar || ''"
                  class="border-solid rounded-full w-60px h-60px border-1px border-hex-F6D552"
                />
              </div>
              <span class="text-normal mt-12px mb-5px">{{
                _data?.[0].name
              }}</span>
              <span class="text-10px mb-10px">{{
                _data?.[0]?.vehicleName
              }}</span>
              <span class="text-hex-F5B510 mb-4px"
                >{{
                  Number(Params?.id) === 1
                    ? _data?.[0]?.mileage
                    : _data?.[0]?.energyConsumption
                }}{{ Number(Params?.id) === 1 ? 'km' : 'kW·h/100km' }}</span
              >
              <span class="transform text-primary text-10px text-hex-aaa"
                >{{ _data?.[0]?.driverTime }}h</span
              >
            </div>
          </main>
          <main
            class="flex-1 inline-block rank-shadow rounded-tl-2xl h-112px rounded-tr-2xl bg-hex-fff"
          >
            <div
              :url="CUP_TH"
              class="box-border flex flex-col items-center justify-start flex-1 -mt-66px text-12px"
            >
              <div>
                <NrImg
                  :url="CUP_TH"
                  class="flex items-center justify-center bg-contain -mb-23px w-60px h-60px"
                  ><span>3</span></NrImg
                >
                <NrImg
                  :url="_data?.[2].avatar || ''"
                  class="border-solid rounded-full w-60px h-60px border-1px border-hex-EFA76B"
                />
              </div>
              <span class="text-normal mt-12px mb-5px">{{
                _data?.[2].name
              }}</span>
              <span class="text-10px mb-10px">{{
                _data?.[2]?.vehicleName
              }}</span>
              <span class="text-hex-F5B510 mb-4px"
                >{{
                  Number(Params?.id) === 1
                    ? _data?.[2]?.mileage
                    : _data?.[2]?.energyConsumption
                }}{{ Number(Params?.id) === 1 ? 'km' : 'kW·h/100km' }}</span
              >
              <span class="transform text-primary text-10px text-hex-aaa"
                >{{ _data?.[2]?.driverTime }}h</span
              >
            </div>
          </main>
        </section>
        <div class="mx-16px bg-hex-fff">
          <section>
            <div
              v-for="(k, i) in _regData"
              :key="k"
              class="flex items-center justify-between border-0 border-solid text-12px pt-20px pb-15px border-b-1px border-hex-eee px-20px pl-10px"
            >
              <section class="flex items-center justify-between">
                <span class="mr-17px text-hex-11264d opacity-46">{{
                  i + 4
                }}</span>
                <span class="bg-red-100 rounded-full w-60px mr-14px h-60px">
                  <img
                    :src="k?.avatar || ''"
                    alt=""
                    class="w-full h-full rounded-full"
                  />
                </span>
                <div>
                  <span class="text-normal">{{ k.name }}</span>
                  <span class="text-10px text-hex-aaa mt-8px">{{
                    k?.vehicleName
                  }}</span>
                </div>
              </section>
              <section class="flex items-center justify-end">
                <span
                  class="transform mr-10px text-primary text-opacity-21 skew-x-2"
                  >{{ k?.driverTime }}h</span
                >
                <span class="text-hex-F5B510"
                  >{{
                    Number(Params?.id) === 1
                      ? k?.mileage
                      : k?.energyConsumption
                  }}{{ Number(Params?.id) === 1 ? 'km' : 'kW·h/100km' }}</span
                >
              </section>
            </div>
          </section>
        </div>
      </section>
    </div>
  </MainScroll>
  <NrzAction
    v-model:show="all"
    tips="历史记录"
    :item-list="[
      { name: '过去30天历史记录', id: 1 },
      { name: '过去4周历史记录', id: 2 },
      { name: '上月历史记录', id: 3 },
    ]"
    @choose="chooseQuantum"
  >
  </NrzAction>
  <NrzAction
    v-model:show="week4"
    tips="过去4周"
    :item-list="week4List"
    @choose="chooseWeek4"
  >
  </NrzAction>
  <NrzAction
    v-model:show="show30"
    tips="选择日期"
    :item-list="getDaysBefor30()"
    @choose="confirm30"
  >
  </NrzAction>
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
import { ref, computed, onBeforeMount, watch } from 'vue';
import CustomBar from '@/components/customHeader/index.vue';
import { systemInfo, loveCarStore } from '@/stores/index';
import { mileageRanking, energyConsumption } from '@/api/index';
import NrImg from '@/components/img/img.vue';
import NrzAction from '@/components/nrz-action/index.vue';
import {
  CODE,
  YMDHMS_EN,
  getStore,
  CUP_ONE,
  CUP_TWO,
  CUP_TH,
  YMD_CH,
  CUP,
  YMD_EN,
  USER_INFO,
} from '@/utils/index';
import dayjs from 'dayjs';
import { vrData } from '@/assets/js/virtual_car_diary_rank';
import Taro, { useRouter } from '@tarojs/taro';

definePageConfig({ transparentTitle: 'auto',titlePenetrate: 'YES',defaultTitle: '', });
let startTime = ref();
let endTime = ref();
const show30 = ref(false);
const minDate30 = new Date(getBeforDays(30));
const maxDate30 = new Date();
let Params = useRouter().params;
let LoveCarStore = loveCarStore();
let _data = ref<any[]>([]);
let fl = ref(true);
let CalcPt = computed(() => {
  return systemInfo().RightBtnRect.h + systemInfo().RightBtnRect.t + 10;
});
let all = ref(false);
let _regData = computed(() => {
  return _data?.value?.length > 3 ? _data?.value?.slice(3) : _data?.value;
});
let week4 = ref(false);
let week4List = ref();
let name = computed(() => getStore(USER_INFO)?.nickName);
let carNum = computed(() => _data.value?.length);
let getBgColor = computed(() => {
  return Number(Params?.id) === 1 ? '#F4FCFF' : '#0DCB46';
});

function getDaysBefor30() {
  let list: any = [];
  for (let i = 0; i < 30; i++) {
    list.push({
      text: dayjs().subtract(i, 'day').format(YMD_EN),
    });
  }
  return list;
}
function showDate() {
  let s = dayjs(startTime.value).format(YMD_EN);
  let d = dayjs(endTime.value).format(YMD_EN);
  if (s == d) {
    return dayjs(s).format(YMD_CH);
  }
  return `${dayjs(s).format(YMD_CH)}-${dayjs(d).format(YMD_CH)}`;
}
function initWeek4List() {
  let arr: any[] = [];
  [-6, -13, -20, -27].forEach((item) => {
    arr.push({
      name: `${dayjs()
        .startOf('week')
        .add(item, 'day')
        .format(YMD_CH)}-${dayjs()
        .endOf('week')
        .add(item, 'day')
        .format(YMD_CH)}`,
      val: `${dayjs().startOf('week').add(item, 'day').format(YMD_EN)} ${dayjs()
        .endOf('week')
        .add(item, 'day')
        .format(YMD_EN)}`,
    });
  });
  week4List.value = arr;
}
function chooseWeek4(res) {
  //
  let val1 = res.val.split(' ')[0];
  let val2 = res.val.split(' ')[1];

  startTime.value = dayjs(val1).startOf('day').format(YMDHMS_EN);
  endTime.value = dayjs(val2).endOf('day').format(YMDHMS_EN);
  setTimeout(() => {
    getData();
  }, 20);
}
function chooseQuantum(res) {
  if (res.id === 1) {
    show30.value = true;
  }
  if (res.id === 2) {
    week4.value = true;
    return;
  }
  if (res.id === 3) {
    startTime.value = dayjs()
      .subtract(30, 'day')
      .startOf('day')
      .format(YMDHMS_EN);
    endTime.value = dayjs(new Date()).endOf('day').format(YMDHMS_EN);
    setTimeout(() => {
      getData();
    }, 20);
  }
}
function _mileageRanking() {
  mileageRanking({
    start: startTime.value,
    end: endTime.value,
  }).then((res) => {
    const { data, code } = res;
    if (code !== CODE) return;
    _data.value = data?.rankingResult ?? [];
  });
}
function back() {
  Taro.navigateBack();
}
function _energyConsumption() {
  energyConsumption({
    start: startTime.value,
    end: endTime.value,
  }).then((res) => {
    const { data, code } = res;
    if (code !== CODE) return;
    _data.value = data?.rankingResult ?? [];
  });
}
function _refresh() {
  // _data.value = []; 暂时没有分页

  setTimeout(() => {
    getData();
  }, 0);
}

const confirm30 = (res) => {
  let time = res.text;
  startTime.value = dayjs(time).startOf('day').format(YMDHMS_EN);
  endTime.value = dayjs(time).endOf('day').format(YMDHMS_EN);
  setTimeout(() => {
    getData();
  }, 20);
};

function getBeforDays(n) {
  var curTime = new Date().getTime();
  var ago = curTime - n * 3600 * 24 * 1000;
  return ago;
}

function getData() {
  if (LoveCarStore?.isVr) {
    initWeek4List();
    setTimeout(() => {
      _data.value = vrData.data.rankingResult;
    }, 100);
    return;
  }
  if (Number(Params?.id) === 1) {
    // 里程
    _mileageRanking();
  } else {
    _energyConsumption(); // 耗能
  }
}

onBeforeMount(() => {
  startTime.value = Params?.startTime;
  endTime.value = Params?.endTime;
  setTimeout(() => {
    fl.value = false;
    getData();
  }, 0);
  initWeek4List();
});
watch(
  () => startTime.value,
  (v) => {
    console.log(4567, v);
  },
  {
    immediate: true,
  }
);
// bottom
</script>
<style lang="scss">
page {
  background-color: #fff1cb;
}
.rank-shadow {
  box-shadow: 0px -3px 0px 0px black;
}
.bl-br {
  border-left: 1px solid #eee;
  border-right: 1px solid #eee;
}
</style>
