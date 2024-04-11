<template>
  <section class="flex flex-col h-full overflow-hidden">
    <CustomBar :show-icon="true" background-color="#fff" position="unset">
      <template #customLeft>
        <nut-popover v-model:visible="showTooltip" location="bottom-start">
          <template #reference>
            <div class="font-bolder">{{ typeText }}</div>
          </template>
          <template #content>
            <div
              v-for="(item, index) in iconItemList"
              :key="index"
              class="flex items-center justify-between py-10px w-90px"
              @click.stop="
                () => {
                  chooseTooltip(item);
                }
              "
            >
              <div class="text-center w-full">
                {{ item.text }}
              </div>
            </div>
          </template>
        </nut-popover>
      </template>
      <template #title> 我的积分 </template>
    </CustomBar>
    <section
      class="flex justify-between relative items-center text-10px py-20px px-14px box-border bg-fleet"
    >
      <img :src="LOGO_IMG_BOTTOM" alt="" class="rotImg" />
      <div>
        <div class="text-30px font-bold mb-6px">
          {{ formatThousands(allCores, 0) }}
        </div>
        <div class="opacity-50 text-12px nrz-thin">我的总积分</div>
      </div>
      <div class="text-fff">
        <div
          class="w-100px h-25px rounded-full flex justify-center items-center mb-14px"
          style="background-color: rgba(2, 115, 240, 8)"
          @tap="tapToTask"
        >
          做任务赚积分
        </div>
        <div
          style="background-color: rgba(253, 191, 57, 0.67)"
          class="w-100px flex h-25px justify-center items-center overflow-hidden rounded-full"
          @tap="
            () => {
              goPages('shop');
            }
          "
        >
          <div>兑商品</div>
          <div
            class="w-1px h-40px mx-10px line"
            style="background-color: rgba(247, 189, 65, 0.43)"
          ></div>
          <div>兑充电</div>
        </div>
      </div>
    </section>
    <div class="flex justify-between px-20px box-border py-20px">
      <div class="flex-1"></div>
      <div class="w-80px text-center">积分明细</div>
      <div
        class="opacity-50 flex items-center justify-end flex-1"
        @tap="showCalendar"
      >
        <span class="icon-rili iconfont mr-4px text-12px"></span>
        <div class="text-12px">{{ searchDate ? searchDate : '选择日期' }}</div>
      </div>
    </div>
    <div class="flex-1 overflow-hidden">
      <MainScroll
        v-model:loading="refreshLoading"
        :has-more="hasMore"
        :init-loading="fl"
        :has-data="!!list?.length"
        :pt="0"
        @scroll-reach-bottom="loadMore"
        @end-pull-down="refresh"
      >
        <div
          v-for="item in list"
          :key="item.title"
          class="flex items-center justify-between pt-12px pb-14px px-16px nr-border-b border-fleet bg-hex-fff"
        >
          <div class="text-normal">
            <span class="text-14px">{{ item.purpose }}</span>
            <span class="text-12px opacity-46 mt-14px">{{
              item.sendTime
            }}</span>
          </div>
          <div
            class="text-20px"
            :class="{
              'text-hex-3CEFA9': item.points > 0,
              'text-red-500': item.points < 0,
            }"
          >
            {{ item.points > 0 ? `+${item.points}` : item.points }}
          </div>
        </div>
      </MainScroll>
    </div>
    <Calendar
      ref="calendar"
      is-fixed
      :type="2"
      title="选择单个日期或范围"
      lunar
      :extra-btn="true"
      :max-year="dayjs().year()"
      @change="chooseDate"
      @get-all="getAllHis"
    ></Calendar>
  </section>
</template>

<script lang="ts">
import {
  onShareAppMessage,
  onShareTimeline,
  formatThousands,
} from '@/utils/index';
export default {
  onShareAppMessage,
  onShareTimeline,
};
</script>

<script lang="ts" setup>
import { ref } from 'vue';
import {
  getStore,
  USER_INFO,
  CODE,
  nrNavigateTo,
  Routes,
  goPages,
  LOGO_IMG_BOTTOM,
} from '@/utils/index';
import { getScoreList, getPayPointsAll } from '@/api/index';
import CustomBar from '@/components/customHeader/index.vue';
import MainScroll from '@/components/scroll-main/index.vue';
import Calendar from '@/components/nrz-calendar/index.vue';;
import dayjs from 'dayjs';
import Taro, { useReady } from '@tarojs/taro';

definePageConfig({
 transparentTitle: 'always',
  titlePenetrate: 'YES',
  defaultTitle: '',});
const iconItemList = [
  {
    type: 0,
    text: '全部',
  },
  {
    type: 1,
    text: '收入',
  },
  {
    type: -1,
    text: '支出',
  },
  {
    type: 3,
    text: '所有历史',
  },
];
let calendar = ref();
let typeText = ref('全部');
let allCores = ref(0);

let list = ref<any[]>([]);
let pageNum = 1;
let pageSize = 15;
let logType = 0;
let hasMore = ref(false);
let fl = ref(true);
let showTooltip = ref(false);
let searchDate = ref('');
let refreshLoading = ref(false);

let startDate = '';
let endDate = '';
let init = true;
let member_id = getStore(USER_INFO)?.member_id;

function resetParams() {
  pageNum = 1;
  init = true;
}

function tapToTask() {
  nrNavigateTo(Routes.taskCenter);
}
function chooseDate({ startDate: start, endDate: end }) {
  let temp = '';
  if (start === end) {
    temp = dayjs(start).format('MM月DD');
  } else {
    temp = `${dayjs(start).format('MM月DD')} - ${dayjs(end).format('MM月DD')}`;
  }
  startDate = start;
  endDate = end;
  searchDate.value = temp;
  Taro.showLoading();
  resetParams();
  _getScoreList();
}

function showCalendar() {
  calendar.value?.show();
}
function getAll() {
  getPayPointsAll({ member_id }).then((res) => {
    if (res.code !== CODE) return;
    allCores.value = res.data;
  });
}
function chooseTooltip({ text, type }) {
  resetParams();
  logType = type;
  typeText.value = text;
  showTooltip.value = false;
  Taro.showLoading();
  _getScoreList();
}
function getAllHis() {
  calendar.value?.hide();
  resetParams();
  logType = 0;
  searchDate.value = '';
  startDate = '';
  endDate = '';
  typeText.value = '全部';
  Taro.showLoading();
  _getScoreList();
}
function _getScoreList() {
  getScoreList({
    pageNum,
    pageSize,
    logType,
    startDate,
    endDate,
  }).then((res) => {
    setTimeout(() => {
      fl.value = false;
      refreshLoading.value = false;
      Taro.hideLoading();
    }, 200);

    if (res.code !== CODE) return;
    if (init) {
      list.value = res.data?.list;
    } else {
      list.value = [...list.value, ...res.data?.list];
    }

    hasMore.value = res.data?.list?.length == pageSize;
  });
}
function loadMore() {
  init = false;
  if (hasMore.value) {
    pageNum += 1;
    _getScoreList();
  }
}
function refresh() {
  resetParams();
  _getScoreList();
}
useReady(() => {
  console.log('before');
  resetParams();
  _getScoreList();
  getAll();
});
</script>
<style>
page {
  background-color: #fff;
}
.line {
  transform: rotateZ(30deg);
}
.rotImg {
  left: 50%;
  top: 50%;
  transform: translate3d(-50%, -50%, 0) rotate(-40deg);
  width: 100px;
  height: 30px;
  position: absolute;
  opacity: 0.1;
}
</style>
