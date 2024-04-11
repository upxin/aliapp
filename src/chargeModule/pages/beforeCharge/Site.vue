<template>
  <section
    class="box-border text-12px flex items-center justify-between w-full pt-10px"
  >
    <view class="flex flex-col items-center w-80px">
      <view
        class="box-border flex items-center justify-center border-solid rounded-full border-6px w-70px h-70px"
        :style="{ borderColor: regColor(connector?.status) }"
      >
        <view class="font-bold" :style="{ color: regColor(connector?.status) }">
          {{ connector?.dict?.status }}
        </view>
      </view>
    </view>

    <section
      class="flex flex-col justify-center flex-1 overflow-hidden ml-14px mr-4px pb-10px"
    >
      <view class="flex items-center mb-10px" @tap.stop="tapToStation">
        <view
          class="flex items-center justify-center w-16px h-16px"
          :style="{ 'background-color': true ? '#F23F53' : '#5ED1F8' }"
        >
          <view class="font-normal text-fff">{{ connector?.dict?.mark }}</view>
        </view>
        <view class="flex-1 px-8px leading-normal">{{
          station?.stationName
        }}</view>
        <view class="iconfont icon-arrow-right-bold text-12px font-thin"></view>
      </view>
      <view class="flex items-center">
        <view class="opacity-50 mr-6px flex justify-between w-50px">
          <view v-for="(item, i) in '枪编号'" :key="`${item}_${i}`">
            {{ item }}
          </view>
        </view>
        <view class="flex-1 overflow-ellipsis"
          >{{ connector?.connectorId }}
        </view>
        <view
          class="text-primary icon iconfont icon-copy ml-8px"
          @click.stop="
            () => {
              copyText(connector?.connectorId);
            }
          "
        ></view>
      </view>
      <section class="flex justify-between mt-10px">
        <view v-if="connector?.current" class="nr-border p-4px">
          {{ connector?.current }}A
        </view>
        <view class="nr-border p-4px">
          {{ connector?.voltageLowerLimits }}-{{
            connector?.voltageUpperLimits
          }}V
        </view>
        <view class="nr-border p-4px">{{ connector?.power }}kW</view>
        <view class="nr-border p-4px">
          {{ connector?.dixt?.connectorType }}
          {{ connector?.dict?.nationalStandard }}
        </view>
      </section>
    </section>
  </section>
</template>
<script lang="ts" setup>
import { copyText, nrNavigateTo } from '@/utils';

interface P {
  connector: any;
  station?: any;
}
let props = withDefaults(defineProps<P>(), {
  connector: () => ({}),
  station: () => ({}),
});
function tapToStation() {
  nrNavigateTo('chargeSiteDetail', { id: props?.station?.stationId });
}
function regColor(status) {
  return {
    255: '#FFBCBE',
    0: '#D4D4D4',
    1: '#33C85A',
    2: '#4EBCD9',
    3: '#F18A2F',
    4: '#4EBCD9',
  }[status];
}
</script>
