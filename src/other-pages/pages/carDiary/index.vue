<template>
  <CustomBar
    :border="false"
    :show-icon="false"
    :icon-color="`#${diary.keyColor}`"
    :color="`#${diary.keyColor}`"
  >
    <template #left>
      <div
        class="flex items-center border border-solid border-hex-fff rounded-3xl h-26px px-8px"
      >
        <span
          class="iconfont text-hex-fff nz-rot180 icon-arrow-right-bold text-14px"
          :style="{}"
          @click="back"
        ></span>
        <div class="bg-hex-fff h-12px w-1px opacity-80 mx-8px"></div>
        <div class="text-hex-fff text-12px" @click="all = true">历史记录</div>
      </div>
    </template>
    <template #title>{{ diary?.carName }}</template>
  </CustomBar>
  <FullLoading :loading="fl">
    <div
      :style="{
        paddingTop: `${CalcPt}px`,
        backgroundImage: `url(${diary?.background || ''})`,
      }"
      class="box-border h-full overflow-y-auto text-center bg-gray-300 bg-center bg-no-repeat bg-cover text-14px text-hex-fff"
    >
      <div class="text-28px mt-78px">{{ diary?.title }}</div>
      <div v-if="around" class="flex items-center justify-center mt-56px">
        <span class="text-14px">{{ around }}</span>
      </div>
      <div v-else class="flex items-center justify-center mt-56px">
        <span class="text-14px mx-4px">{{ _date }}</span>
        <!-- <span class="text-14px mr-20px">{{ city }}</span> -->
        <span class="transform text-20px mx-4px -skew-x-14">{{
          weekdays[dayjs(_enDate).day()]
        }}</span>
        <span class="text-20px mx-4px">{{ diary?.weatherInfo }}</span>
      </div>
      <section
        v-for="(child, pi) in stringsList"
        :key="pi"
        class="flex items-end justify-center my-26px"
      >
        <span
          v-for="(grandchild, gi) in child"
          :id="`text${grandchild.id}`"
          :key="gi"
          class="invisible h-20px"
          :style="{
            color: grandchild.color,
            fontSize: getPx(grandchild.size),
            height: getPx(grandchild.height),
            visibility: show[grandchild.id] ? 'unset' : 'hidden',
          }"
          >{{ grandchild.text }}</span
        >
      </section>
      <div
        class="text-22px mt-140px before-tran1 text-hex-EFA76B"
        :style="{ color: `#${diary.messageColor}` }"
      >
        {{ diary.message }}
      </div>
    </div>
  </FullLoading>
  <NrzAction
    v-model:show="all"
    tips="历史记录"
    :item-list="[
      { name: '过去30天历史记录', id: 1 },
      { name: '过去4周历史记录', id: 2 },
      { name: '上月历史记录', id: 3 },
    ]"
    @click="chooseQuantum"
  >
  </NrzAction>
  <NrzAction
    v-model:show="week4"
    tips="过去4周"
    :item-list="week4List"
    @click="chooseWeek4"
  >
  </NrzAction>
  <NrzAction
    v-model:show="showDay30"
    tips="选择日期"
    :item-list="getDaysBefor30()"
    @choose="confirm30"
  >
  </NrzAction>

  <span
    v-show="endAnimate"
    class="box-border fixed right-0 flex flex-col items-center justify-center shadow z-999 shadow-gray-300 y-center bg-hex-fff w-26px h-48px rounded-tl-xl z-10000 rounded-bl-xl"
    @click="
      () => {
        goSum();
      }
    "
  >
    <div
      class="flex flex-col items-center justify-between overflow-hidden w-16px"
    >
      <span class="iconfont icon-more -mb-10px"></span>
      <span class="iconfont icon-more"></span>
      <span class="iconfont icon-more -mt-10px"></span>
    </div>
  </span>
</template>
<script lang="ts">
import { onShareAppMessage, onShareTimeline } from '@/utils/index';
export default {
  onShareAppMessage,
  onShareTimeline,
};
</script>
<script lang="ts" setup>
import { ref, onMounted, computed, watch, onBeforeMount } from 'vue';
import CustomBar from '@/components/customHeader/index.vue';
import { systemInfo, loveCarStore } from '@/stores/index';
import Taro, { useRouter } from '@tarojs/taro';
import { getDiary } from '@/api/index';
import FullLoading from '@/components/full-loading/index.vue';
import NrzDateTime from '@/components/nrz-datetime/index.vue';
import {
  CODE,
  weekdays,
  nrNavigateTo,
  YMDHMS_EN,
  YMD_EN,
  YMD_CH,
} from '@/utils/index';
import * as dayjs from 'dayjs';
import { vrData } from '@/assets/js/virtual_car_diary';
import NrzAction from '@/components/nrz-action/index.vue';

definePageConfig({ navigationStyle: 'custom' });
let around = ref('');
const showDay30 = ref(false);
const params = useRouter().params;
let startTime = '';
let endTime = '';
let _date = ref();
let _enDate = ref();
let all = ref(false);
let CalcPt = computed(
  () => systemInfo().RightBtnRect.h + systemInfo().RightBtnRect.t + 10
);
let fl = ref(true);
const LoveCarStore = loveCarStore();
let end = ref(false);
const minDate30 = dayjs().startOf('month').format(YMD_EN);
const maxDate30 = dayjs().endOf('month').format(YMD_EN);
console.log(minDate30, maxDate30);
const confirm30 = (res) => {
  let time = res.text;
  startTime = dayjs(time).startOf('day').format(YMDHMS_EN);
  endTime = dayjs(time).endOf('day').format(YMDHMS_EN);
  _date.value = `${dayjs(time).format(YMD_CH)}`;
  _enDate.value = startTime;
  around.value = '';
  _getDiary(params.vin, startTime, endTime);
};

const diary = ref<any>({});
let stringsList = ref<any[]>([]);

function goSum() {
  nrNavigateTo('carData', {
    startTime,
    endTime,
    vin: params.vin,
    vinLicense: params?.vin,
    carName: params?.carName,
    showMove: 1,
  });
}

let week4 = ref(false);
let week4List = ref();
let endAnimate = ref(false);
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

  startTime = dayjs(val1).startOf('day').format(YMDHMS_EN);
  endTime = dayjs(val2).endOf('day').format(YMDHMS_EN);
  around.value = `${dayjs(val1).startOf('day').format(YMD_CH)}-${dayjs(val2)
    .startOf('day')
    .format(YMD_CH)}`;
  _getDiary(params.vin, startTime, endTime);
}
function getDaysBefor30() {
  let list: any = [];
  for (let i = 0; i < 30; i++) {
    list.push({
      text: dayjs().subtract(i, 'day').format(YMD_EN),
    });
  }
  return list;
}
function chooseQuantum(res) {
  if (res.id === 1) {
    showDay30.value = true;
  }
  if (res.id === 2) {
    week4.value = true;
    return;
  }
  if (res.id === 3) {
    let start = dayjs().subtract(30, 'day').startOf('day').format(YMDHMS_EN);
    let end = dayjs(new Date()).endOf('day').format(YMDHMS_EN);
    _getDiary(params.vin, start, end);
  }

  if (res.id === 4) {
    //
  }
}

function getPx(v) {
  return Taro.pxTransform(v);
}
function back() {
  Taro.navigateBack();
}

// 字体一个个出现动画
const show = ref<boolean[]>([]);
const showLen = computed(() => {
  return stringsList.value?.reduce((prev, cur) => {
    return prev + cur.length;
  }, 0);
});

function _getDiary(vin, start, end) {
  if (LoveCarStore?.isVr) {
    fl.value = false;
    initWeek4List();
    startTime = dayjs().add(-1, 'day').startOf('day').format(YMDHMS_EN);
    endTime = dayjs().add(-1, 'day').endOf('day').format(YMDHMS_EN);
    _date.value = dayjs().add(-1, 'day').startOf('day').format(YMD_CH);
    _enDate.value = startTime;
    setTimeout(() => {
      show.value = [];
      diary.value = vrData?.data;
      setTimeout(() => {
        runItyped(showLen.value);
      }, 200);
    }, 30);
    return;
  }
  show.value = [];
  getDiary({ vin, start, end })
    .then((res) => {
      fl.value = false;
      if (res.code !== CODE) return;
      diary.value = res.data;
      setTimeout(() => {
        runItyped(showLen.value);
      }, 600);
    })
    .catch(() => {
      fl.value = false;
    });
}
function runItyped(length) {
  setTimeout(() => {
    if (show?.value?.length > length) {
      end.value = true;
      endAnimate.value = true;
      return;
    }
    show.value = [...show.value, true];
    runItyped(showLen.value);
  }, 50);
}
onBeforeMount(() => {
  initWeek4List();
});
onMounted(() => {
  let start = dayjs().startOf('day').format(YMDHMS_EN);
  let end = dayjs().endOf('day').format(YMDHMS_EN);
  _date.value = dayjs().startOf('day').format(YMD_CH);
  _getDiary(params.vin, start, end);
});

watch(
  () => diary.value,
  () => {
    if (!diary.value?.list.length) return;
    let id = 0;
    stringsList.value = (diary.value?.list ?? []).map((item) => {
      let keyList = (item.key || '').split('').map((key) => {
        id = id + 1;
        return {
          text: key,
          color: '#fff',
          height: 16,
          size: 16,
          id: id - 1,
        };
      });
      let valueList = (item.value || '0').split('').map((value) => {
        id = id + 1;
        return {
          id: id - 1,
          text: value,
          size: 24,
          color: `#${diary.value.valueColor}`,
          height: 22,
          margin: '0 6px',
        };
      });
      let unitList = (item.unit || '').split('').map((unit) => {
        id = id + 1;
        return {
          id: id - 1,
          text: unit,
          size: 16,
          color: `#${diary.value.valueColor}`,
          height: 16,
        };
      });
      return [...keyList, ...valueList, ...unitList];
    });
  }
);
</script>
