<template>
  <view id="box" class="bg-fff">
    <Full :loading="state.loading" :err="state.err" @re-load="_getHomepage">
      <!-- 无车下面的部分跟其他不同，顺序打乱了所以拆分 -->
      <NoCar v-if="state.status == 1"></NoCar>
      <!-- 选配 有车  充电 共用main组件 -->
      <Main v-if="state.status == 2"></Main>
      <Foolter></Foolter>
      <Activity></Activity>
    </Full>
    <Notice v-if="notice" :router="noticeRouter"></Notice>
  </view>
</template>
<script lang="ts" setup>
import { reactive, onBeforeMount, ref, provide } from 'vue';
import Notice from '@/components/notice/notice.vue';
import Full from '@/components/full-loading/index.vue';
import NoCar from './noCar.vue';
import Main from './main.vue';
import Foolter from '@/components/nrz-footer/index.vue';
import { getHomepage } from '@/api/home';
import { deliverProcess } from '@/api/index';

import { homeStore } from '@/stores';
import Taro, {
  usePullDownRefresh,
  useDidShow,
  nextTick,
  useShareAppMessage,
} from '@tarojs/taro';
import Activity from './components/activity/Activity.vue';
import { USER_INFO, getStorage, useToast } from '@/utils';
import { BTN_SHARE } from '@/utils';

definePageConfig({
  transparentTitle: 'always',
  titlePenetrate: 'YES',
  defaultTitle: '',
  enablePullDownRefresh: true,
  enableShareAppMessage: true,
});
useShareAppMessage(() => {
  return {
    title: '前晨汽车 智能网联商用车引领者',
    path: `/pages/index/index`,
    imageUrl: BTN_SHARE,
  };
});

const HomeStore = homeStore();
const state = reactive({
  loading: true,
  status: 0,
  err: false,
});
function _getHomepage(cb?) {
  if (cb) {
    Taro.startPullDownRefresh();
  }

  getHomepage({})
    .then((res) => {
      state.err = false;
      state.loading = false;

      setTimeout(() => {
        Taro.stopPullDownRefresh();
      }, 300);

      if (res.code != 200) {
        useToast(res.msg);
        return;
      }

      if (cb) {
        cb?.();
      }

      if (res.data.books?.length) {
        HomeStore.setState('books', res.data.books);
        state.status = 1;
      } else {
        HomeStore.setState('optional', res.data.optional);
        HomeStore.setState('cars', res.data.cars);
        HomeStore.setState('deliveries', res.data.deliveries);
        state.status = 2;
      }
    })
    .catch(() => {
      state.loading = false;
      state.err = true;
      Taro.stopPullDownRefresh();
    });
}

const notice = ref();
const noticeRouter = ref();

function _deliverProcess() {
  getStorage(USER_INFO).then((res) => {
    if (res) {
      deliverProcess({}).then(({ data }) => {
        if (data) {
          notice.value = true;
          noticeRouter.value = data;
        }
      });
    }
  });
}

onBeforeMount(() => {
  _getHomepage();
  _deliverProcess();
});

usePullDownRefresh(() => {
  _getHomepage();
});

useDidShow(() => {
  if (homeStore().state.needRefresh) {
    Taro.pageScrollTo({
      scrollTop: 0,
      duration: 0,
      selector: '#box',
      success() {
        nextTick(() => {
          Taro.startPullDownRefresh();
          _getHomepage();
          HomeStore.setState('needRefresh', false);
        });
      },
    });
  }
});

provide('HOME', { _getHomepage });
</script>
