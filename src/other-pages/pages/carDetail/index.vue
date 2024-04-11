<template>
  <CustomBar class="fixed" background-color="#fff" :pad-x="140">
    <template v-if="params?.type === 'EC1'" #customLeft>
      <div @click="visible = true">省钱计算器</div>
    </template>
    <template #title>{{ params.type }}</template>
  </CustomBar>
  <div
    :style="{ paddingTop: `${CalcPt}px` }"
    class="box-border h-full overflow-y-auto nrz-safe bg-fff"
  >
    <img
      v-for="item in state.list"
      :key="item?.id"
      mode="widthFix"
      :src="item.imgUrl"
      alt=""
      class="w-full"
    />
    <div class="h-60px"></div>
  </div>
  <section class="fixed bottom-0 w-full nrz-safe bg-fff nr-shadow-t">
    <section class="bg-fff flex justify-end py-10px w-full box-border px-20px">
      <NrzBtn
        class="py-12px"
        plain
        @click="
          () => {
            nrNavigateTo('testDrive', { type: 'ec1' });
          }
        "
      >
        预约试驾
      </NrzBtn>
      <NrzBtn
        v-if="store().openPrepay"
        class="ml-20px py-12px"
        @click="reserve"
      >
        即刻预定
      </NrzBtn>
    </section>
  </section>

  <NrzBtmPop v-model:show="visible">
    <div class="overflow-hidden pb-20px text-14px p-14px bg-blue-gray-200">
      <div class="flex">
        <div class="iconfont icon-jisuanqi text-44px"></div>
        <div class="flex flex-col justify-center ml-4px">
          <div>{{ params.type }}</div>
          <div class="mt-4px">省钱计算器</div>
        </div>
      </div>
      <div class="flex items-center justify-center">
        <span class="text-orange-500 mr-4px">每年可省</span>
        <nut-popover v-model:visible="popover" :overlay-style="{}" style="">
          <template #reference>
            <div
              class="text-center bg-orange-500 rounded-full text-10px leading-13px w-13px h-13px text-light-50"
            >
              ?
            </div>
          </template>
          <template #content>
            <div class="rounded-md shadow-md p-12px w-160px shadow-gray-400">
              {{ msg }}
            </div>
          </template>
        </nut-popover>
      </div>
      <div class="flex items-end justify-center my-6px">
        <span class="text-28px">{{
          formatThousands(saveMoney[coefficient])
        }}</span>
        <span class="mt-4px">元</span>
      </div>
      <div class="text-center text-g text-12px mb-20px">与同级别燃油车相比</div>
      <section class="rounded-t-lg p-14px bg-light-100">
        <div class="mb-10px">货箱版本</div>
        <div class="flex items-center justify-between mb-16px">
          <NrzBtn
            class="flex-1 mr-5px py-12px"
            plain
            :style="{
              borderColor: boxType == 0 ? 'orange' : '#11264d',
              color: boxType == 0 ? 'orange' : '#11264d',
            }"
            @click="boxType = 0"
          >
            铝货箱
          </NrzBtn>
          <NrzBtn
            :style="{
              borderColor: boxType == 1 ? 'orange' : '#11264d',
              color: boxType == 1 ? 'orange' : '#11264d',
            }"
            class="flex-1 ml-5px py-12px"
            plain
            @click="boxType = 1"
          >
            钢货箱
          </NrzBtn>
        </div>
        <div class="my-10px">平均载货重量</div>
        <div
          class="box-border flex items-center justify-between nr-border px-8px mb-16px h-36px"
        >
          <span
            class="iconfont icon-arrow-right-bold"
            :style="{
              color: weight > 0.5 ? orange : color9,
              transform: 'rotateZ(180deg)',
            }"
            @click="
              () => {
                weightChange(-0.5);
              }
            "
          ></span>
          <span>{{ weight }}{{ ' ' }}吨</span>
          <span
            class="iconfont icon-arrow-right-bold"
            :style="{
              color: weight < 1.5 ? orange : color9,
            }"
            @click="
              () => {
                weightChange(0.5);
              }
            "
          ></span>
        </div>
        <div class="mb-10px">日平均里程</div>
        <div
          class="box-border flex items-center justify-between nr-border px-8px h-36px"
        >
          <span
            class="iconfont icon-arrow-right-bold"
            :style="{
              color: distance > 100 ? orange : color9,
              transform: 'rotateZ(180deg)',
            }"
            @click="
              () => {
                distanceChange(-100);
              }
            "
          ></span>
          <span>{{ distance }}{{ ' ' }}公里</span>
          <span
            class="iconfont icon-arrow-right-bold"
            :style="{
              color: distance < 400 ? orange : color9,
            }"
            @click="
              () => {
                distanceChange(100);
              }
            "
          ></span>
        </div>
      </section>
    </div>
  </NrzBtmPop>
</template>
<script lang="ts" setup>
import CustomBar from '@/components/customHeader/index.vue';
import { systemInfo } from '@/stores/systemInfo';
import { useRouter, useShareAppMessage } from '@tarojs/taro';
import { ref, computed, onMounted, reactive } from 'vue';
import { formatThousands } from '@/utils/index';
import { carDetail } from '@/api/index';
import { nrNavigateTo } from '@/utils/index';
import { store } from '@/stores/index';
import NrzBtmPop from '@/components/nrz-bottom-popup/index.vue';
import NrzBtn from '@/components/nrz-button/index.vue';
definePageConfig({ transparentTitle: 'always',titlePenetrate: 'YES',defaultTitle: '', enableShareAppMessage: true });

const color9 = '#999';
const orange = 'rgb(249, 115, 22)';
const weight = ref(0.5);
const distance = ref(100);
const boxType = ref(0);
const visible = ref(false);
const popover = ref(false);
const weightMap = {
  0.5: 0,
  1: 1,
  1.5: 2,
};
const distanceMap = {
  100: 0,
  200: 1,
  300: 2,
  400: 3,
};
const saveMoney = {
  0: 26710,
  1: 50540,
  2: 74380,
  3: 98210,
  10: 26040,
  11: 49210,
  12: 72380,
  13: 95550,
  20: 25270,
  21: 47670,
  22: 70070,
  23: 92470,
  100: 26570,
  101: 50260,
  102: 73960,
  103: 97650,
  110: 25900,
  111: 48930,
  112: 71960,
  113: 94990,
  120: 25130,
  121: 47390,
  122: 69650,
  123: 91910,
};
const coefficient = computed(() => {
  return (
    boxType.value * 100 +
    weightMap[weight.value] * 10 +
    distanceMap[distance.value]
  );
});
const msg = ref(
  '*此功能的计算模型应用了CHTC工况标准, 模拟了用户的日常使用场景; 本页面信息演示了载货重量、日均行驶里程及车型配置因素对费用变化的动态影响。 在用户实际运行中，或因实际场景工况、驾驶习惯、燃料费用差异及气候状况等有所变化。'
);
interface Item {
  id: number;
  imgUrl: string;
  height: number;
}
interface State {
  list: Array<Item>;
}
const state = reactive<State>({
  list: [],
});

let CalcPt = computed(
  () => systemInfo().RightBtnRect.h + systemInfo().RightBtnRect.t + 10
);
const params = computed(() => useRouter().params);

onMounted(() => {
  carDetail({ type: params.value.type }).then((res: any) => {
    if (res?.code !== 200) return;
    state.list = res.data;
  });
});
function weightChange(val) {
  if (weight.value === 0.5 && val < 0) return;
  if (weight.value === 1.5 && val > 0) return;
  weight.value = weight.value + val;
}
function distanceChange(val) {
  if (distance.value === 100 && val < 0) return;
  if (distance.value === 400 && val > 0) return;
  distance.value = distance.value + val;
}
function reserve() {
  nrNavigateTo('chooseCarType');
}

useShareAppMessage(() => {
  return {
    title: `${params.value?.type}详情介绍`,
    path: `/other-pages/pages/carDetail/index`,
    imageUrl:
      params.value?.type === 'iC1'
        ? 'https://nrz-app.su.bcebos.com/resources/iC1_detail_share.jpg'
        : 'https://nrz-app.su.bcebos.com/resources/EC1_detail_share.jpg',
  };
});
</script>
<style>
.nr-border {
  border: 1px solid #11264d;
}
.nut-popover--dark .popoverContent--left,
.nut-popover--dark .popoverContent--right,
.nut-popover--dark .popoverContent--top,
.nut-popover--dark .popoverContent,
.nut-popover .popoverContent--left,
.nut-popover .popoverContent--right,
.nut-popover .popoverContent--top,
.nut-popover .popoverContent {
  z-index: 999;
  top: 23px !important;
  left: 50%;
  transform: translateX(-50%);
}
.nut-popover--dark .popoverContent--left .popoverArrow,
.nut-popover--dark .popoverContent--right .popoverArrow,
.nut-popover--dark .popoverContent--top .popoverArrow,
.nut-popover--dark .popoverContent .popoverArrow,
.nut-popover .popoverContent--left .popoverArrow,
.nut-popover .popoverContent--right .popoverArrow,
.nut-popover .popoverContent--top .popoverArrow,
.nut-popover .popoverContent .popoverArrow {
  left: 50% !important;
}
</style>
