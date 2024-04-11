<template>
  <section class="rounded-tl-18px rounded-tr-18px bg-fff pb-20px">
    <div class="px-16px">
      <div class="font-bold pt-20px pb-10px">{{ detailData?.stationName }}</div>

      <div class="flex text-12px pb-12px">
        <span class="opacity-30 ml-6px mr-20px">{{
          detailData?.operatorName
        }}</span>
        <div class="opacity-30">{{ detailData?.busineHours }}</div>
      </div>

      <div class="flex items-center justify-between text-normal">
        <div class="flex items-center opacity-60">
          <span class="icon-weizhi iconfont text-18px mr-6px"></span>
          <span class="mr-10px text-12px">{{ detailData?.address }}</span>
        </div>
        <nut-button
          class="text-hex-04c3f6 h-24px border-hex-04c3f6 px-10px"
          @click="navToMap"
        >
          <div class="flex items-center justify-between">
            <span
              class="iconfont icon-daohang text-size-15px text-hex-04c3f6"
            ></span>
            <div class="h-20px leading-20px ml-4px">
              {{ formatThousands(detailData?.km, 2) }}km
            </div>
          </div>
        </nut-button>
      </div>

      <section
        :style="{ backgroundColor: 'rgba(252, 191, 72, 0.16)' }"
        class="px-12px mt-26px py-10px"
        @click="toFindSite"
      >
        <div class="flex items-center justify-between">
          <image :src="TAP_IMG" class="w-12px h-12px mr-6px" />
          <span class="flex-1 opacity-60 nrz-thin text-12px">
            摸桩行动 - 赢取积 分方便他人
          </span>
          <span
            class="iconfont text-normal text-12px opacity-60 icon-arrow-right-bold"
          ></span>
        </div>
        <div class="leading-normal text-12px opacity-60 nrz-thin mt-10px">
          * 对该电站的充电桩数据进行探索添加标签，添加成功后会获取积分奖励。
        </div>
      </section>

      <section class="flex justify-between text-10px mt-15px">
        <div
          class="flex items-center justify-center flex-1 border-dashed mr-30px border-1px border-info rounded-3px py-4px"
        >
          <span class="rounded-full mr-10px bg-info text-10px text-fff p-2px"
            >快</span
          >
          <span class="flex text-info">
            <span>空闲 {{ detailData?.quickFreeNums }} </span>
            <span class="px-4px">|</span>
            <span>共 {{ detailData?.quickNums }}</span>
          </span>
        </div>
        <div
          class="flex items-center justify-center flex-1 border-dashed border-1px border-hex-11264d border-opacity-70 rounded-3px py-4px text-normal"
        >
          <span class="rounded-full mr-10px bg-primary text-fff p-2px">慢</span>
          <span class="flex text-primary opacity-70">
            <span>空闲 {{ detailData?.slowFreeNums }} </span>
            <span class="px-4px">|</span>
            <span>共 {{ detailData?.slowNums }}</span>
          </span>
        </div>
      </section>
    </div>
  </section>
</template>
<script lang="ts" setup>
import { formatThousands, navigateToPage } from '@/utils/index';
import TAP_IMG from '@/assets/imgs/tap.png';
import Taro from '@tarojs/taro';

interface Props {
  detailData: { [propKey: string]: any };
}
let props = withDefaults(defineProps<Props>(), {
  detailData: () => ({}),
});

function toFindSite() {
  navigateToPage({
    route: 'chargeFindPileActionPage',
    params: {
      address: props.detailData?.address,
      stationName: props.detailData?.stationName,
      stationId: props.detailData?.stationId,
      operatorName: props.detailData?.operatorName,
    },
  });
}
function navToMap() {
  const { stationLat, stationLng, address, stationName } = props?.detailData;
  Taro.openLocation({
    longitude: stationLng,
    latitude: stationLat,
    address: address,
    name: stationName,
  });
}
// bottom
</script>
