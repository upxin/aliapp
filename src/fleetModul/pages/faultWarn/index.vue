<template>
  <CustomHeader background-color="#fff" :pad-x="144">
    <template #title> 故障报警 </template>
    <template #customLeft>
      <span @click="state.visible = true">
        {{
          state.currentDate
            ? dayjs(state.currentDate).format(YMD_EN)
            : '选择日期'
        }}
      </span>
    </template>
  </CustomHeader>
  <FullLoading :loading="floading">
    <div
      :style="{ top: `${headerHeight}px` }"
      class="fixed w-full nrz-thin z-999"
    >
      <nut-noticebar
        :close-mode="true"
        background="#f5f5f5"
        color="#101010"
        @close="noticeBar = 0"
      >
        <template #left-icon>
          <span class="iconfont icon-notice"></span>
        </template>
        <template #right-icon>
          <span class="iconfont icon-close text-16px"></span>
        </template>
        故障报警处理请登录晨光智能网联平台操作。
      </nut-noticebar>
    </div>

    <MainScroll
      :has-more="hasMore"
      :has-data="!!list?.length"
      refresh-bg="#f9f9f9"
      :pt="headerHeight + noticeBar"
      bg="#fff"
      @scroll-reach-bottom="loadMore"
      @end-pull-down="refresh"
    >
      <div class="overflow-y-auto">
        <section
          v-for="(k, i) in list"
          :key="k?.vinCode"
          class="box-border px-14px py-10px"
          :class="{ 'nr-border-b': i < list?.length - 1 }"
        >
          <span class="mb-10px pl-6px">
            {{ nullText(k?.licensePlateNumber) }}
          </span>
          <section class="flex mb-2px">
            <div class="flex items-center justify-center w-30px">
              <span
                class="flex items-center justify-center font-bold rounded text-8px bg-hex-bfbfbf opacity-72 text-fff px-2px h-16px"
              >
                VIN
              </span>
            </div>
            <span class="opacity-54"> {{ nullText(k?.vinCode) }} </span>
          </section>
          <div class="flex justify-between">
            <aside class="flex items-center">
              <div class="flex justify-center w-30px">
                <span class="iconfont icon-siji- text-hex-bfbfbf"></span>
              </div>
              <span class="opacity-54">{{ nullText(k?.driver) }}</span>
              <span class="mx-10px opacity-54">
                {{ nullText(k?.driverMobile) }}
              </span>
            </aside>
            <nut-button
              v-if="k?.driverMobile"
              class="px-16px"
              size="mini"
              type="primary"
              style="color: rgba(16, 16, 16, 0.67)"
              color="rgba(187, 187, 187, .27)"
              @click.stop="
                () => {
                  makePhoneCall(k?.driverMobile);
                  jGcustomCount(JG.CV_017);
                }
              "
              >快速联系司机</nut-button
            >
            <nut-button
              v-else
              class="px-16px"
              size="mini"
              type="primary"
              style="color: red"
              color="rgba(245, 68, 39, .15)"
              @click.stop="
                () => {
                  nrNavigateTo(Routes.carRecord, { vin: k?.vinCode || k?.vin });
                }
              "
              >点击添加司机</nut-button
            >
          </div>
          <aside class="text-12px nrz-thin bg-second py-12px px-10px mt-10px">
            <div class="opacity-50">故障时间：{{ nullText(k?.time) }}</div>
            <div class="flex justify-between my-10px">
              <span class="opacity-50"
                >上报时间：{{ nullText(k?.createTime) }}</span
              >
              <span class="flex">
                <span>故障码：</span>
                <span class="text-danger">{{ nullText(k?.faultCode) }}</span>
              </span>
            </div>
            <div>详细内容：{{ nullText(k?.faultName) }}</div>
          </aside>
        </section>
      </div>
    </MainScroll>
  </FullLoading>
  <van-popup
    :show="state.visible"
    position="bottom"
    :round="true"
    @close="state.visible = false"
  >
    <van-datetime-picker
      type="date"
      visible-item-count="5"
      :value="state.currentDate"
      :min-date="dayjs().subtract(1, 'year').valueOf()"
      :show-toolbar="true"
      :max-date="dayjs().valueOf()"
      @confirm="vanConfirm"
    />
  </van-popup>
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
import { onBeforeMount, reactive, ref } from 'vue';
import FullLoading from '@/components/full-loading/index.vue';
import Taro, { useRouter } from '@tarojs/taro';
import { faultList } from '@/api/index';
import {
  CODE,
  nullText,
  YMD_EN,
  nrNavigateTo,
  Routes,
  makePhoneCall,
  jGcustomCount,
  JG,
} from '@/utils/index';
import { useHeaderHeight } from '@/hooks/index';
import CustomHeader from '@/components/customHeader/index.vue';
import dayjs from 'dayjs';

definePageConfig({
 transparentTitle: 'always',
  titlePenetrate: 'YES',
  defaultTitle: '',  navigationBarTitleText: '邀请好友记录',
});

const state = reactive({
  currentDate: dayjs().valueOf(),
  visible: false,
  minDate: dayjs().subtract(80, 'year').valueOf(),
  maxDate: dayjs().valueOf(),
});
let params = useRouter()?.params;
let floading = ref(true);
let noticeBar = ref(40);
let list = ref<any[]>([]);
let hasMore = ref(false);
let pageNum = 1;
let pageSize = 20;
function getParams() {
  return {
    pageNum,
    pageSize,
    date: dayjs(state.currentDate).format(YMD_EN),
    vinLicense: params?.vinCode ? params?.vinCode : null,
  };
}
const { headerHeight } = useHeaderHeight();
function vanConfirm(v) {
  state.currentDate = v.detail;
  state.visible = false;
  refresh();
}
function loadMore() {
  if (!hasMore.value) return;
  pageNum += 1;

  faultList({
    ...getParams(),
  }).then((res) => {
    if (res?.code !== CODE) return;
    list.value = [...list.value, ...res?.data?.records];
    const { total, size, current } = res?.data;
    hasMore.value = current * size < total;
  });
}
function refresh(cb?) {
  pageNum = 1;
  faultList({
    ...getParams(),
  }).then((res) => {
    floading.value = false;
    if (res?.code !== CODE) return;
    list.value = res?.data?.records;
    const { total, size, current } = res?.data;
    hasMore.value = current * size < total;
    cb && cb();
  });
}
onBeforeMount(() => {
  jGcustomCount(JG.CV_013);
  refresh();
});
// bottom
</script>
<style>
page {
  background-color: #fff;
}
</style>
