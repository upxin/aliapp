<template>
  <CustomHeader background-color="#fff" :z="1000" :pad-x="80">
    <template #title>
      <div
        v-if="isOwner"
        class="flex items-center"
        @click="menuVisible = !menuVisible"
      >
        <CarInfo
          :vehicle-text="currentCarPlateNum"
          :vehicle-type="carData?.vehicleType"
        ></CarInfo>
        <span
          class="iconfont icon-sanjiao text-18px"
          :class="{ trans: menuVisible, intrans: !menuVisible }"
        ></span>
      </div>
      <div v-else class="flex items-center">
        <CarInfo
          :vehicle-text="currentCarPlateNum"
          :vehicle-type="carData?.vehicleType"
        ></CarInfo>
      </div>
    </template>
    <template #customLeft>
      <nut-popover v-model:visible="showTooltip" location="bottom-start">
        <template #reference>
          <div class="iconfont icon-gengduo"></div>
        </template>
        <template #content>
          <div
            v-for="(item, index) in statusList"
            :key="index"
            class="flex items-center justify-center p-8px"
            @click.stop="
              () => {
                chooseTooltip(item);
              }
            "
          >
            <div
              class="text-center w-80px"
              :style="{
                color: item.eventType === eventType ? 'orange' : '#aaa',
              }"
            >
              {{ item.name }}
            </div>
          </div>
        </template>
      </nut-popover>
    </template>
  </CustomHeader>
  <div :style="{ height: `${headerHeight}px` }"></div>
  <van-sticky :offset-top="headerHeight">
    <div class="flex items-center justify-between px-16px py-10px bg-fff">
      <span
        :class="{ 'opacity-50': !add && alraedyClick }"
        @click="changeDay(false)"
        >前一天</span
      >
      <span
        class="rounded-full p-6px px-10px bg-fleet"
        @click="showPicker = true"
        >{{ dayjs(currentTime).format(YMD_EN) }}</span
      >
      <span
        :class="{ 'opacity-50': add && alraedyClick }"
        @click="changeDay(true)"
        >后一天</span
      >
    </div>
  </van-sticky>
  <FullLoading :loading="loading">
    <div
      v-for="(item, i) in steps"
      :key="item.time"
      class="box-border flex w-full px-14px"
    >
      <div class="flex flex-col items-center pr-10px">
        <div
          class="flex items-center justify-center rounded-full w-30px h-30px nrc-border"
          :style="{ borderColor: color[item.type], color: color[item.type] }"
        >
          {{ tagMap[item?.type] }}
        </div>
        <div
          v-if="i != steps?.length - 1"
          class="flex-1 w-1px nrc-border-r-dashed"
        ></div>
      </div>
      <div
        class="flex flex-col justify-between flex-1 p-10px mb-20px"
        :style="{ background: bgColor[item.type] }"
      >
        <div class="flex justify-between text-12px mb-10px">
          <span>{{ item?.eventTime }}</span>
          <span :style="{ color: color[item.type] }">{{ regDesc(item) }}</span>
        </div>
        <Position
          class="break-words break-all opacity-40 text-12px"
          :longitude="item?.longitude"
          :latitude="item?.latitude"
        ></Position>
      </div>
    </div>
  </FullLoading>

  <DropMenu
    v-model:show="menuVisible"
    v-model:currentVal="currentCarPlateNum"
    v-model:full-list="fullCarList"
    v-model:vin-code="vinCode"
    v-model:car-data="carData"
    @success="success"
  ></DropMenu>

  <van-popup
    :show="showPicker"
    position="bottom"
    :round="true"
    :z-index="10000"
    @close="showPicker = false"
  >
    <van-datetime-picker
      type="date"
      visible-item-count="5"
      :min-date="dayjs().subtract(1, 'year').valueOf()"
      :show-toolbar="true"
      :value="currentTime"
      :max-date="dayjs().valueOf()"
      @confirm="confirmPeriod"
      @cancel="showPicker = false"
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
import FullLoading from '@/components/full-loading/index.vue';
import { ref, onBeforeMount, computed, watch } from 'vue';
import { useHeaderHeight } from '@/hooks';
import { CODE, useToast, YMD_EN } from '@/utils';
import CustomHeader from '@/components/customHeader/index.vue';
import DropMenu from '../../comp/dropMenu/index.vue';
import dayjs from 'dayjs';
import { vehEvent } from '@/api';
import { useRouter, usePageScroll } from '@tarojs/taro';
import Position from '../../pages/fleetHome/position.vue';
import CarInfo from '../../comp/CarInfo.vue';

definePageConfig({
 transparentTitle: 'auto',
  titlePenetrate: 'YES',
  defaultTitle: '',});
let params = useRouter()?.params;

let loading = ref(true);
let showPicker = ref(false);
let currentTime = ref(dayjs().subtract(1, 'days').valueOf());
let currentCarPlateNum = ref(params?.licensePlateNumber);
let vinCode = ref();
let fullCarList = ref();
let menuVisible = ref(false);
let carData = ref({});
let eventType = ref();
let color = {
  1: 'rgba(242, 183, 82, 1)', // 上电 yellow
  2: 'rgba(16, 16, 16, 1)', // 下电 gray
  3: 'rgba(1, 123, 34, 1)', // 充电 green
  4: 'rgba(249, 17, 17, 1)', // 未下电停车超过5min red
  5: 'rgba(16, 16, 16, 1)', // 下电停车 gray
};
let bgColor = {
  1: 'rgba(242, 183, 82, 0.08)', // 上电 yellow
  2: 'rgba(16, 16, 16, 0.08)', // 下电 gray
  3: 'rgba(1, 123, 34, 0.08)', // 充电 green
  4: 'rgba(249, 17, 17, 0.08)', // 未下电停车超过5min red
  5: 'rgba(16, 16, 16, 0.08)', // 下电停车 gray
};
let alraedyClick = ref(false);
let add = ref();
function changeDay(n) {
  add.value = n;
  alraedyClick.value = true;
  if (n) {
    currentTime.value = dayjs(currentTime.value).add(1, 'days').valueOf();
  } else {
    currentTime.value = dayjs(currentTime.value).subtract(1, 'days').valueOf();
  }
}
const scrollTop = ref(0);
usePageScroll((e) => {
  scrollTop.value = e.scrollTop;
});
let tagMap = {
  1: '上电',
  2: '下电',
  3: '充电',
  4: 'p',
  5: 'p',
};
let statusList = ref([
  {
    name: '全部',
    eventType: null,
  },
  {
    name: '上电',
    eventType: 1,
  },
  {
    name: '下电',
    eventType: 2,
  },
  {
    name: '充电',
    eventType: 3,
  },
  {
    name: '未下电停车',
    eventType: 4,
  },
  {
    name: '停车',
    eventType: 5,
  },
]);
let { headerHeight } = useHeaderHeight();
let showTooltip = ref(false);
let steps = ref<any[]>([]);
let isOwner = computed(() => {
  return fullCarList.value?.some(
    (item) => item?.licensePlateNumber === currentCarPlateNum.value
  );
});
let _vehEvent = () => {
  vehEvent({
    vinLicense: vinCode.value,
    eventTime: dayjs(currentTime.value).format(YMD_EN),
    eventType: eventType.value,
  })
    .then((res) => {
      loading.value = false;
      if (res?.code !== CODE) return useToast();
      steps.value = res?.data;
    })
    .catch(() => {
      loading.value = false;
    });
};

function regDesc(item) {
  if (item.type == 4) {
    return `未下电停车${item.parkingTime}min`;
  }
  if (item.type == 5) {
    return `停车${item.parkingTime}min`;
  }
  if (item.type == 3) {
    return `充电${item.chargingTime}min`;
  }
}
function confirmPeriod(e) {
  currentTime.value = e?.detail;
  showPicker.value = false;
  _vehEvent();
}
function chooseTooltip(item) {
  eventType.value = item.eventType;
  showTooltip.value = false;
  _vehEvent();
}

function success(opts) {
  if (params?.vinLicense) return;
  vinCode.value = opts?.vinCode;
  currentCarPlateNum.value = opts?.licensePlateNumber;
  _vehEvent();
}
onBeforeMount(() => {
  if (!params?.vinLicense) return;
  vinCode.value = params?.vinLicense;
  currentCarPlateNum.value = params?.licensePlateNumber;
  _vehEvent();
});

watch(
  () => currentTime.value,
  () => {
    _vehEvent();
  }
);
</script>
<style>
page {
  background-color: #fff;
}
.nrc-border {
  border: 1px solid #101010;
}
.nrc-border-r-dashed {
  border-right: 1px dashed rgba(16, 16, 16, 0.15);
}

.nr-slide-enter-active,
.nr-slide-leave-active {
  transition: all 0.5s;
}
.nr-slide-enter-from {
  transform: translateY(-100%);
}
.nr-slide-enter-to {
  transform: translateY(0%);
}

.nr-slide-leave-to {
  transform: translateY(-100%);
}
.input-placeholder {
  text-align: center;
}
</style>
