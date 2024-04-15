<template>
  <view id="box" class="bg-fff">
    <Full :loading="state.loading" :err="state.err" @re-load="_getHomepage(1)">
      <!-- 无车下面的部分跟其他不同，顺序打乱了所以拆分 -->
      <NoCar v-if="state.status == 1" @change="changeState"></NoCar>
      <!-- 选配 有车  充电 共用main组件 -->
      <Main v-if="state.status == 2"></Main>
      <Foolter></Foolter>
      <Activity></Activity>
    </Full>
    <Notice v-if="notice" :router="noticeRouter"></Notice>
    <div
      v-if="LoveCarStore?.isVr"
      class="fixed flex flex-col items-center justify-center rounded-full shadow z-999 shadow-gray-300 bg-hex-fff text-12px bottom-30px right-24px w-50px h-50px"
      @click="clearVr"
    >
      <div class="pb-4px">退出</div>
      <div class="pt-4px">体验</div>
    </div>
  </view>
</template>
<script lang="ts" setup>
import { reactive, onBeforeMount, ref, provide } from 'vue';
import Notice from '@/components/notice/notice.vue';
import Full from '@/components/full-loading/index.vue';
import NoCar from './noCar.vue';
import Main from './main.vue';
import Foolter from '@/components/nrz-footer/index.vue';
import {
  deliverProcess,
  getObuInfo,
  getHomepage,
  inviteSuccess,
} from '@/api/index';
import { homeStore, loveCarStore } from '@/stores';
import Taro, {
  usePullDownRefresh,
  useDidShow,
  useShareAppMessage,
  useLoad,
} from '@tarojs/taro';
import Activity from './components/activity/Activity.vue';
import {
  CAR_CONF,
  USER_INFO,
  getStorage,
  useToast,
  BTN_SHARE,
  OBU_USER,
  setStore,
} from '@/utils';
import { Keys } from '@/common/constant';

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
const LoveCarStore = loveCarStore();

const state = reactive({
  loading: true,
  status: 0,
  err: false,
  stack: [],
});
function changeState() {
  state.status = 2;
  initModule();
}
function clearVr() {
  LoveCarStore.setIsVr(false);
  state.status = 1;
  initModule();
}

function initModule() {
  if (HomeStore.state.cars?.length) {
    HomeStore.setState('mouduleType', 'car');
    return;
  }
  if (HomeStore.state.deliveries?.length) {
    HomeStore.setState('mouduleType', 'prepay');
    return;
  }
  getStorage(CAR_CONF).then((res) => {
    if (res) {
      HomeStore.setState('mouduleType', 'parts');
    }
  });
}

function _getHomepage(cb?) {
  if (typeof cb == 'function') {
    Taro.startPullDownRefresh();
  }
  getHomepage({})
    .then((res) => {
      state.err = false;

      setTimeout(() => {
        Taro.stopPullDownRefresh();
      }, 300);

      if (res.code != 200) {
        useToast(res.msg);
        return;
      }

      if (typeof cb == 'function') {
        cb?.();
      }

      HomeStore.setState('books', res.data?.books);
      HomeStore.setState('optional', res.data.optional);
      HomeStore.setState('cars', res.data.cars);
      HomeStore.setState('deliveries', res.data.deliveries);

      if (res.data?.optional) {
        setStore(CAR_CONF, HomeStore.state.optional);
      }

      if (res.data?.books?.length) {
        getStorage(CAR_CONF)
          .then((local) => {
            if (local) {
              state.status = 2;
            } else {
              state.status = 1;
            }
          })
          .catch(() => {
            state.status = 1;
          });
      } else {
        state.status = 2;
      }
      if (cb == '1') {
        initModule();
      }

      if (cb == '2') {
        state.stack.forEach((item: () => void) => {
          item?.();
        });
      }

      setTimeout(() => {
        state.loading = false;
      }, 100);
    })
    .catch(() => {
      state.loading = false;
      state.err = true;
      Taro.stopPullDownRefresh();
    });
}

const notice = ref();
const noticeRouter = ref();

interface User {
  member_id: string;
  mobile: string;
  nickName: string;
  token: string;
  avatar: string;
}
function _deliverProcess() {
  getStorage<User>(USER_INFO).then((res) => {
    if (res) {
      deliverProcess({}).then(({ data }) => {
        if (data) {
          notice.value = true;
          noticeRouter.value = data;
        }
      });
      let member_id = res?.member_id || false;
      if (member_id) {
        getObuInfo({ mobile: res?.mobile }).then((obu) => {
          if (obu.code === 200) {
            setStore(OBU_USER, obu.data);
          }
        });
      }
    }
  });
}

onBeforeMount(() => {
  console.log('index onBeforeMount===============');
  _getHomepage(1);
  _deliverProcess();
});

usePullDownRefresh(() => {
  _getHomepage(2);
});

useDidShow(() => {
  if (homeStore().state.needRefresh) {
    HomeStore.setState('needRefresh', false);
    state.status = 0;
    state.loading = true;
    _getHomepage(1);
  }
});

useLoad((opts) => {
  if (opts?.mobile && opts?.mobile != 'undefined') {
    getStorage(USER_INFO)
      .then((res) => {
        if (res) {
          inviteSuccess(opts?.mobile);
        } else {
          setStore(Keys.INVITE_MOBILE, opts?.mobile);
        }
      })
      .catch(() => {
        setStore(Keys.INVITE_MOBILE, opts?.mobile);
      });
  }
});

provide('HOME', { _getHomepage, stack: state.stack });
</script>
