<template>
  <section class="pt-10px">
    <view :style="{ height: headerHeight + 'px' }"></view>
    <view class="flex justify-between px-20px text-primary nrz-light">
      <view class="flex items-center leading-none" @click="handleTopLeft">
        <template
          v-if="
            HomeStore.state.currentCar?.lifetimeWarranty &&
            HomeStore.state.mouduleType === 'car'
          "
        >
          <span class="iconfont icon-bao3 text-info"></span>
        </template>

        <span class="pl-4px">
          {{ leftText }}
        </span>
        <span
          v-if="
            HomeStore.state.cars?.length || HomeStore.state.deliveries?.length
          "
          class="icon-sanjiao iconfont text-22px"
        ></span>
      </view>
      <template v-if="HomeStore.state.mouduleType === 'parts'">
        <view class="icon-shenglvehao iconfont" @click="delConf"></view>
      </template>
      <view v-if="HomeStore.state.mouduleType === 'car'">
        {{ HomeStore.state.currentCar?.identity == 1 ? '车主' : '司机' }}
      </view>
    </view>
  </section>

  <NrzAction
    v-model:show="state.showChoosePanel"
    tips="切换"
    :itemList="firstPanelList"
    @click="choosePanel"
  ></NrzAction>
  <NrzAction
    v-model:show="state.showChooseCar"
    v-model:current="state.currentPanelCar"
    tips="切换车辆"
    :itemList="carList"
    @click="handleCarList"
    @handleLong="handleLong"
  >
    <template v-if="carList.length > 10" #top>
      <view
        class="nrz-border mx-20px p-8px flex justify-between items-center border-2px rounded-4px mb-10px"
      >
        <input
          :style="{ visibility: state.showChooseCar ? 'visible' : 'hidden' }"
          :value="searchKey"
          type="text"
          placeholder="输入车牌或VIN搜索"
          class="flex-1 text-left nrz-light"
          placeholder-class="nrz-light"
          @change="search"
        />
        <view
          v-if="searchKey"
          class="iconfont icon-close1 text-g"
          @click="searchKey = ''"
        ></view>
        <view v-else class="iconfont icon-search text-g"></view>
      </view>
    </template>
    <template #item="{ item }">
      <view class="flex box-border w-full">
        <view class="text-right" style="width: 60%">
          {{ item.typeText }}-{{ item.licensePlateNum }}
        </view>
        <view class="px-10px">{{ item.identity == 1 ? '车主' : '司机' }}</view>
        <view>{{ item.defaultFlag ? ' 默认' : '' }}</view>
      </view>
    </template>
    <template #bottom>
      <view class="text-danger text-12px py-10px text-center">
        * 长按切换默认显示车辆
      </view>
    </template>
  </NrzAction>
  <NrzAction
    v-model:show="state.lookPrepay"
    :tips="`查看订单（共${HomeStore.state.deliveries?.length}单）`"
    :itemList="orderList"
    @click="choosePrepayOrderItem"
  ></NrzAction>
  <NrzModal
    v-model:show="state.showModal"
    textAlign="left"
    contentColor="#101010"
    radius="3px"
    title="提醒"
    split-btns
    :buttons="[
      {
        text: '取消',
        color: '#fff',
      },
      {
        text: '确定',
        color: '#fff',
      },
    ]"
    :content="`是否将【${info}】设置为默认车辆，每次打开APP会展示该辆车的相关信息。`"
    @ok="setDefaultCar"
  >
  </NrzModal>
</template>
<script lang="ts" setup>
import { computed, ref, reactive } from 'vue';
import { homeStore, CarConf, type CarInfo, loveCarStore } from '@/stores/index';
import Taro, { useDidHide, useDidShow } from '@tarojs/taro';
import { useHeaderHeight } from '@/hooks';
import NrzAction from '@/components/nrz-action/index.vue';
import NrzModal from '@/components/nrz-modal/index.vue';
import { onBeforeMount } from 'vue';
import {
  onMessage,
  initSocket,
  useToast,
  setStore,
  getStore,
  CAR_CONF,
  getStorage,
  USER_INFO,
} from '@/utils';
import { delRemoteConf, setDefault } from '@/api/index';

import { inject } from 'vue';
import { watch } from 'vue';

interface Props {
  data?: any;
}
interface PanelItem {
  text: string;
  color?: string;
  [key: string]: any;
}

type CarInfoPanel = PanelItem & CarInfo;

interface State {
  imgList: any[];
  showChoosePanel: boolean;
  showChooseCar: boolean;
  currentPanelCar: CarInfoPanel;
  lookPrepay: boolean;
  prepayList: any[];
  showModal: boolean;
  controlCar: boolean;
}

withDefaults(defineProps<Props>(), {
  data: {},
});
const HOME = inject('HOME');
let SOCKET_TASK: any;

const HomeStore = homeStore();
const CarConfStore = CarConf();
const { headerHeight } = useHeaderHeight();
const state = reactive<State>({
  imgList: [{ url: null }, { url: undefined }],
  showChoosePanel: false,
  showChooseCar: false,
  currentPanelCar: { text: '' },
  prepayList: [],
  lookPrepay: false,
  showModal: false,
  controlCar: false,
});
const info = ref('');
const searchKey = ref('');
const localCarConf = ref();
const currentOrder = ref<any>({});

getStorage(CAR_CONF).then((res) => {
  localCarConf.value = res;
});

const firstPanelList = computed(() => {
  return [
    { text: '切换车辆', color: '' },
    {
      text: '查看预定',
      color: '',
      hidden: !HomeStore.state.deliveries?.length,
    },
    {
      text: '查看选配',
      color: '',
      hidden: !HomeStore.state.optional && !localCarConf.value,
    },
  ];
});

const carListSearch = computed(() => {
  return HomeStore.state.cars.filter((item) => {
    return item.licensePlateNum?.includes(searchKey.value);
  });
});

const carListBase = computed(() => {
  return HomeStore.state.cars;
});

const carList = computed(() => {
  if (searchKey.value) {
    return carListSearch.value.map((k) => {
      const text = `${k?.typeText}-${k?.licensePlateNum} ${
        k?.identity == 1 ? '车主' : '司机'
      }${k?.defaultFlag ? ' 默认' : ''}`;

      return {
        ...k,
        text,
        color:
          state.currentPanelCar.licensePlateNum == k.licensePlateNum
            ? '#067ED0'
            : '#101010',
      };
    });
  }

  return carListBase.value.map((k) => {
    const text = `${k?.typeText}-${k?.licensePlateNum} ${
      k?.identity == 1 ? '车主' : '司机'
    }${k?.defaultFlag ? ' 默认' : ''}`;

    return {
      ...k,
      text,
      color:
        state.currentPanelCar.licensePlateNum == k.licensePlateNum
          ? '#067ED0'
          : '#101010',
    };
  });
});
const orderList = computed(() => {
  // orderList: [{ text: 'JASDJALK921301NA' }, { text: 'KALOWQ0988' }],

  return HomeStore.state.deliveries?.map((item) => {
    return { ...item, text: item.orderId };
  });
});

const leftText = computed(() => {
  if (HomeStore.state.mouduleType === 'parts') {
    return '已选配';
  }
  if (HomeStore.state.mouduleType === 'prepay') {
    return '订单-' + currentOrder.value.text?.slice(-6);
  }
  return HomeStore.state.currentCar?.licensePlateNum;
});
function handleTopLeft() {
  if (loveCarStore().isVr) return;
  if (!HomeStore.state.cars?.length && !HomeStore.state.deliveries?.length) {
    return;
  }

  if (HomeStore.state.optional || HomeStore.state.deliveries?.length) {
    state.showChoosePanel = true;
  } else {
    state.showChooseCar = true;
  }
}

function search(e) {
  searchKey.value = e.detail.value;
}
function _delConf() {
  delRemoteConf()
    .then(() => {
      Taro.reLaunch({
        url: '/pages/index/index',
      });
    })
    .catch((err) => {
      console.log(err);
    });
}
function delConf() {
  Taro.showModal({
    title: '提醒',
    content: '是否删除该配置?',
    success(res) {
      if (res.confirm) {
        CarConfStore.setState('imgUrl', '');
        CarConfStore.setState('optional', []);
        CarConfStore.setState('type', '');
        CarConfStore.setState('typeText', '');
        CarConfStore.setState('name', '');
        CarConfStore.setState('amount', 0);
        setStore(CAR_CONF, null);

        if (getStore(USER_INFO)) {
          _delConf();
        } else {
          Taro.reLaunch({
            url: '/pages/index/index',
          });
        }
      } else if (res.cancel) {
        console.log('用户点击取消');
      }
    },
  });
}
function handleCarList() {
  Taro.startPullDownRefresh();
  HOME.stack.push(() => {
    HomeStore.setState('mouduleType', 'car');
    HomeStore.setState('currentCar', state.currentPanelCar);
    sendMsg(state.currentPanelCar.vin);
    searchKey.value = '';
  });
}

function choosePrepayOrderItem(res) {
  Taro.startPullDownRefresh();

  HOME.stack.push(() => {
    HomeStore.setState('mouduleType', 'prepay');
    currentOrder.value = res;
    HomeStore.setState('currentOrder', res);
  });
}

const willBeDefault = ref();
function handleLong(item) {
  state.showModal = true;
  info.value = item.text;
  willBeDefault.value = item;
}

function choosePanel({ index }) {
  state.showChoosePanel = false;

  // 打开车辆列表
  if (index == 0) {
    state.showChooseCar = true;
  }
  // 打开预定订单列表
  if (index == 1) {
    state.lookPrepay = true;
  }

  if (index == 2) {
    Taro.startPullDownRefresh();
    HOME.stack.push(() => {
      HomeStore.setState('mouduleType', 'parts');
    });
  }
}

function setChargingCar() {
  const temp = carListBase.value?.find((item) => {
    return item.vin === HomeStore.state.charginCar?.vin;
  });

  if (temp) {
    state.currentPanelCar = { ...temp, text: '' };
  }
}

function initCar() {
  if (HomeStore.state.cars?.length) {
    const first = carListBase.value?.[0];
    state.currentPanelCar = { ...first, text: '' };
    HomeStore.setState('currentCar', state.currentPanelCar);
  }
}

function setDefaultCar() {
  state.showModal = false;
  state.showChooseCar = false;
  setDefault({ vin: willBeDefault.value.vin }).then((res) => {
    useToast(res.msg);
    if (res.code == 200) {
      Taro.startPullDownRefresh();
      HOME.stack.push(() => {
        console.log('setDefault');
        initCar();
        oldSocket();
      });
    }
  });
}

// socket 相关
function sendMsg(data) {
  SOCKET_TASK.send({
    data,
    success(res) {
      console.log('WebSocket 发送测试信息成功===', data, res);
    },
    fail: (err) => {
      // console.log('WebSocket 发送测试信息失败===', data, err);
    },
  });
}

function oldSocket() {
  initSocket().then((task: any) => {
    SOCKET_TASK = task;
    task.onOpen = () => {
      //钩子函数
      // console.log('WebSocket open===========================');
      sendMsg(state.currentPanelCar.vin);
    };
    task.onClose = () => {
      // console.log('WebSocket close=============================');
    };
    task.onError = (e) => {
      // console.log('WebSocket onError===========================', e);
    };
    task.onMessage = (data) => {
      onMessage(data);
    };
    task.onReconnect = () => {
      // console.log('WebSocket reconnect==================');
    };
  });
}

onBeforeMount(() => {
  initCar();
  oldSocket();
});

useDidShow(() => {
  oldSocket();
  if (HomeStore.state.fromCharging) {
    setChargingCar();
    HomeStore.setState('fromCharging', false);
  }
});

useDidHide(() => {
  SOCKET_TASK?.close();
});

watch(
  () => homeStore().state.currentCar,
  (v) => {
    state.currentPanelCar = v;
  }
);
</script>
<style lang="scss">
.line {
  height: 43px;
  width: 1px;
  transform: rotateZ(30deg);
  background-color: rgba(255, 255, 255, 100);
}
</style>
