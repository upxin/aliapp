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
          {{ HomeStore.state.currentCar?.licensePlateNum }}
        </span>
        <span class="icon-sanjiao iconfont text-22px"></span>
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
        class="nr-border mx-20px p-8px flex justify-between items-center border-2px rounded-4px mb-10px"
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
    :tips="`查看订单（共${state.prepayList?.length}单）`"
    :itemList="state.orderList"
    @click="choosePrepayOrderItem"
  ></NrzAction>
  <NrzModal
    v-model:show="state.showModal"
    textAlign="left"
    contentColor="#101010"
    radius="3px"
    title="提醒"
    split-btns
    :content="`是否将【${info}】设置为默认车辆，每次打开APP会展示该辆车的相关信息。`"
    @ok="setDefaultCar"
  >
  </NrzModal>
</template>
<script lang="ts" setup>
import { computed, ref, reactive } from 'vue';
import { homeStore, type CarInfo } from '@/stores/index';
import Taro, { nextTick, useDidHide, useDidShow } from '@tarojs/taro';
import { useHeaderHeight } from '@/hooks';
import NrzAction from '@/components/nrz-action/index.vue';
import NrzModal from '@/components/nrz-modal/index.vue';
import { onBeforeMount } from 'vue';
import { onMessage, initSocket, useToast, goPages } from '@/utils';
import { setDefault } from '@/api/home';
import { inject } from 'vue';

interface Props {
  data?: any;
}
interface PanelItem {
  text: string;
  color?: string;
  [key: string]: any;
}
interface PrepayOrder {}

type CarInfoPanel = PanelItem & CarInfo & PrepayOrder;

interface State {
  imgList: any[];
  showChoosePanel: boolean;
  showChooseCar: boolean;
  currentPanelCar: CarInfoPanel;
  lookPrepay: boolean;
  prepayList: any[];
  showModal: boolean;
  controlCar: boolean;
  orderList: any[];
}

withDefaults(defineProps<Props>(), {
  data: {},
});
const HOME = inject('HOME');
let SOCKET_TASK: any;

const HomeStore = homeStore();

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
  orderList: [{ text: 'JASDJALK921301NA' }, { text: 'KALOWQ0988' }],
});
const info = ref('');
const searchKey = ref('');
const firstPanelList = ref<PanelItem[]>([
  { text: '切换车辆', color: '' },
  { text: '查看预定', color: '', hidden: !HomeStore.state.deliveries?.length },
  { text: '查看选配', color: '', hidden: !HomeStore.state.optional },
]);
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

function handleTopLeft() {
  if (HomeStore.state.optional || HomeStore.state.deliveries?.length) {
    state.showChoosePanel = true;
  } else {
    state.showChooseCar = true;
  }
}
function search(e) {
  searchKey.value = e.detail.value;
}
function delConf() {
  Taro.showModal({
    title: '提示',
    content: '确认删除选配吗？',
    success(res) {
      if (res.confirm) {
        console.log('del');
      }
    },
  });
}

function handleCarList() {
  nextTick(() => {
    HomeStore.setState('mouduleType', 'car');
    HomeStore.setState('currentCar', state.currentPanelCar);
    sendMsg(state.currentPanelCar.vin);
    searchKey.value = '';
  });
}

function choosePrepayOrderItem() {
  HomeStore.setState('mouduleType', 'prepay');
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
    HomeStore.setState('mouduleType', 'parts');
  }
}
function setDefaultCar() {
  state.showModal = false;
  state.showChooseCar = false;
  setDefault({ vin: willBeDefault.value.vin }).then((res) => {
    useToast(res.msg);
    if (res.code == 200) {
      HOME._getHomepage(() => {
        setTimeout(() => {
          initCar();
          oldSocket();
        }, 0);
      });
    }
  });
}

// socket 相关
function sendMsg(data) {
  console.log('WebSocket send msg==========', data);
  SOCKET_TASK.send({
    data,
    success(res) {
      console.log('WebSocket 发送测试信息成功===', data, res);
    },
    fail: (err) => {
      console.log('WebSocket 发送测试信息失败===', data, err);
    },
  });
}
function initCar() {
  const first = carListBase.value?.[0];
  state.currentPanelCar = { ...first, text: '' };

  HomeStore.setState('currentCar', state.currentPanelCar);

  if (HomeStore.state.cars?.length) {
    HomeStore.setState('mouduleType', 'car');
    return;
  }

  if (HomeStore.state.deliveries?.length) {
    HomeStore.setState('mouduleType', 'prepay');
    return;
  }

  if (HomeStore.state.optional) {
    HomeStore.setState('mouduleType', 'parts');
  }
}

function oldSocket() {
  console.log(999999, '=====================');
  initSocket().then((task: any) => {
    SOCKET_TASK = task;
    task.onOpen = () => {
      //钩子函数
      console.log('WebSocket open===========================');
      sendMsg(state.currentPanelCar.vin);
    };
    task.onClose = () => {
      console.log('WebSocket close=============================');
    };
    task.onError = (e) => {
      console.log('WebSocket onError===========================', e);
    };
    task.onMessage = (data) => {
      onMessage(data);
    };
    task.onReconnect = () => {
      console.log('WebSocket reconnect==================');
    };
  });
}
onBeforeMount(() => {
  oldSocket();
  initCar();
});

useDidShow(() => {
  if (HomeStore.state.fromCharging) {
    const temp = carListBase.value?.find((item) => {
      return item.vin === HomeStore.state.charginCar?.vin;
    });
    state.currentPanelCar = { ...temp, text: '' };
    HomeStore.setState('fromCharging', false);
  }
  oldSocket();
});

useDidHide(() => {
  SOCKET_TASK?.close?.();
});
</script>
<style lang="scss">
.line {
  height: 43px;
  width: 1px;
  transform: rotateZ(30deg);
  background-color: rgba(255, 255, 255, 100);
}
</style>
