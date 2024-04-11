<template>
  <CustomHeader
    :border="false"
    iconColor="#fff"
    color="#fff"
    :padX="130"
    customColor="#fff"
  >
    <template #title>签到日历</template>
    <template #customLeft>
      <span @tap="tapToTaskCenter">任务中心</span>
    </template>
  </CustomHeader>

  <FullLoading :loading="fl">
    <Sign :signData="signData" :month="month" @succ="succ"></Sign>
    <view class="content -mt-60px">
      <div class="px-40px w-full h-34px -mb-14px box-border">
        <img :src="ImgUrl" class="w-full h-34px relative z-99" />
      </div>
      <fly-calendar
        :loading="loading"
        :tapYearOrMonth="true"
        class="calendar"
        :initStartDate="initStartDate"
        :status="status"
        :maxYear="endDate"
        :maxDate="maxDate"
        :maxMonth="maxMonth"
        :minMonth="minMonth"
        monthArrowColor="rgba(16, 16, 16, .69)"
        :arrowType="2"
        @change="changeDate"
      ></fly-calendar>
    </view>
  </FullLoading>
  <fly-landscape :show="show" @close="show = false">
    <div class="h-300px relative w-273px">
      <img :src="signBgUrl" class="w-full h-full" />
      <img
        :src="dateUrl"
        class="w-90px h-110px absolute x-center bottom-70px"
      />
      <div class="absolute bottom-96px font-bold z-99 x-center flex items-end">
        <div class="text-14px pb-10px">+</div>
        <div class="text-36px">
          {{ score }}
        </div>
      </div>
      <div class="absolute bottom-80px nrz-thin z-99 text-12px x-center">
        {{ toDay }}
      </div>
      <div
        class="opacity-40 absolute bottom-48px nrz-thin z-99 text-12px x-center"
      >
        签到奖励{{ score }}积分已入账
      </div>
      <button
        class="absolute x-center px-20px nrz-thin text-12px text-fff bottom-14px py-6px rounded-full"
        style="background-color: #f73333"
        @tap="tapTpScoreInfo"
      >
        查看积分
      </button>
    </div>
  </fly-landscape>
</template>

<script setup lang="ts">
import FlyCalendar from '@/components/sign-calendar/index.vue';
import FlyLandscape from '@/components/landscape/index.vue';

import { ref, onMounted } from 'vue';
import dayjs from 'dayjs';
import { useLoad, usePageScroll } from '@tarojs/taro';
import CustomHeader from '@/components/customHeader/index.vue';
import FullLoading from '@/components/full-loading/index.vue';
import Sign from './sign.vue';
import { signinCalendar } from '@/api/index';
import { YMD_EN, nrNavigateTo, Routes, useToast, CODE } from '@/utils';
import ImgUrl from './calender.png';

const signBgUrl = 'https://nrz-app.su.bcebos.com/app-pic/signin_dialog_bg.png';
const dateUrl =
  'https://nrz-app.su.bcebos.com/app-pic/signin_dialog_inner_bg.png';

definePageConfig({
  transparentTitle: 'always',
  titlePenetrate: 'YES',
  defaultTitle: '',
  navigationBarTextStyle: 'white',
});

const customTextColor = 'rgb(2, 115, 240)';
const signBg = 'rgba(169, 205, 245, 0.15)';
const noSignBg = 'rgba(249, 249, 249, 0.7)';
let initStartDate = ref(dayjs().format('YYYY-MM-DD'));
let endDate = ref(dayjs().year());
let maxMonth = ref(dayjs().format('YYYY-M'));
let minMonth = ref(dayjs().subtract(1, 'year').format('YYYY-M'));
let maxDate = ref(dayjs().add(1, 'month').format(YMD_EN));
let status = ref([]);
let scrollTop = ref();
let loading = ref(true);
let fl = ref(true);
let show = ref(false);
let score = ref(0);
let signData = ref();
let toDay = ref(dayjs().format('MM月DD日'));
let month = ref('');

usePageScroll((res) => {
  scrollTop.value = res?.scrollTop;
});

function succ(res) {
  show.value = true;
  score.value = res?.data?.awardPoints;
  let start = dayjs().startOf('month').format('YYYY-MM-DD');
  let end = dayjs().endOf('month').format('YYYY-MM-DD');
  _signinCalendar({ start, end });
}
function tapToTaskCenter() {
  nrNavigateTo(Routes.taskCenter);
}
function tapTpScoreInfo() {
  show.value = false;
  nrNavigateTo(Routes.scoreList);
}
function changeDate(res) {
  let date = res?.result;
  month.value = dayjs(date).format('YYYY年MM月');
  let start = dayjs(date).startOf('month').format('YYYY-MM-DD');
  let end = dayjs(date).endOf('month').format('YYYY-MM-DD');
  _signinCalendar({ start, end });
}

function _signinCalendar({ start, end }) {
  loading.value = true;

  signinCalendar({
    startDate: start,
    endDate: end,
  })
    .then((res) => {
      setTimeout(() => {
        fl.value = false;
        loading.value = false;
      }, 1000);
      if (res?.code != CODE) return useToast(res?.msg);
      signData.value = res?.data?.data;
      status.value = res?.data?.detail.map((item) => {
        if (item.value * 1 > 0) {
          return {
            text: '+' + item.value,
            bgColor: signBg,
            customTextColor,
          };
        }
        return {
          text: 'icon',
          bgColor: noSignBg,
          customTextColor: '#666',
        };
      });
    })
    .catch(() => {
      fl.value = false;
    });
}

onMounted(() => {
  let start = dayjs().startOf('month').format('YYYY-MM-DD');
  let end = dayjs().endOf('month').format('YYYY-MM-DD');
  _signinCalendar({
    start,
    end,
  });
});

useLoad(() => {
  my.setBackButton({
    color: '#ffffff',
  });
});
</script>

<style>
page {
  background-color: #fff;
}
.content {
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.calendar {
  border-radius: 5px;
  box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  background-color: #fff;
  padding: 0 14px;
}
</style>
