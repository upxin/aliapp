<template>
  <section
    v-for="station in list"
    :key="station.id"
    :class="{
      'nr-border-b ': border,
      'px-18px': border,
      'px-10px': !border,
      'pt-0': border,
    }"
    class="box-border w-full py-12px bg-fff text-12px mb-14px"
    @click.stop="
      () => {
        handleStationItem(station);
      }
    "
  >
    <div class="flex items-center">
      <div
        v-if="station?.officialTagText"
        class="w-50px h-14px mr-6px bg-cover bg-no-repeat"
        :style="{ backgroundImage: `url(${station?.officialTagText})` }"
      ></div>
      <span class="text-14px text-left flex-1">{{ station.stationName }}</span>
      <div
        v-if="station.collect"
        class="flex items-center justify-center w-40px h-40px"
        @click.stop="
          () => {
            _collect(0, station.stationId, station);
          }
        "
      >
        <span class="icon-star-full iconfont text-info"></span>
      </div>
      <div
        v-if="!station.collect"
        class="flex items-center justify-center w-40px h-40px"
        @click.stop="
          () => {
            _collect(1, station.stationId, station);
          }
        "
      >
        <span class="icon-xing iconfont"></span>
      </div>
    </div>

    <div class="opacity-30 nrz-thin mt-6px text-10px mb-10px">
      {{ station.remark }}
    </div>

    <div class="flex items-center mb-10px">
      <span
        class="w-46px"
        :style="{
          textDecoration: station?.discount != 1 ? 'line-through' : '',
        }"
        >￥{{ formatThousands(station.price, 2) }}</span
      >
      <span
        v-if="station?.discount !== 1"
        class="mr-8px text-18px font-bold"
        style="color: #eecb1d"
      >
        {{ station?.discountText }}
      </span>
      <Tag
        v-if="station?.quickNums"
        :info-value="`${station?.quickFreeNums || 0}/${
          station?.quickNums || 0
        }`"
        short="快"
        class="mr-4px"
      ></Tag>
      <Tag
        v-if="station?.slowNums"
        :info-value="`${station?.slowFreeNums || 0}/${station?.slowNums || 0}`"
        short="慢"
        color="#11264d"
        class="mr-4px"
      ></Tag>
      <Tag
        v-if="station?.offlineNums"
        :info-value="`${station?.offlineNums || 0}`"
        short="异"
        color="#B3B3B3"
        info="离网"
      ></Tag>
    </div>

    <div class="min-h-12px">
      <div v-if="station.parkFee" class="flex items-center">
        <span
          class="text-center leading-14px mr-8px font-800 w-12px h-12px text-8px bg-hex-04C3F6 text-fff"
        >
          P
        </span>
        <span class="flex-1 nrz-thin .overflow-ellipsis">{{
          station.parkFee
        }}</span>
      </div>
    </div>

    <div class="flex items-center mt-10px text-hex-aaa nrz-thin">
      <span class="iconfont icon-weizhi mr-6px"></span>
      <span class="flex-1 mr-10px .overflow-ellipsis">{{
        station.address || '--'
      }}</span>
      <nut-button
        class="text-hex-04c3f6 h-24px border-hex-04c3f6 px-10px"
        @click.stop="
          () => {
            openMapApp(station);
          }
        "
      >
        <div class="flex items-center justify-between">
          <span
            class="iconfont icon-daohang text-size-15px text-hex-04c3f6"
          ></span>
          <div class="h-20px leading-20px ml-4px">
            {{ formatThousands(station.km, 2) }}km
          </div>
        </div>
      </nut-button>
    </div>
  </section>
</template>
<script lang="ts" setup>
import {
  formatThousands,
  navigateToPage,
  useToast,
  needToLogin,
} from '@/utils/index';
import Taro from '@tarojs/taro';
import Tag from '@/chargeModule/pages/chargingMap/tag.vue';
import { collectStation } from '@/api/index';
let props = withDefaults(
  defineProps<{ list: any[]; customHandleEvt?: boolean; border?: boolean }>(),
  {
    list: () => [],
    border: false,
    customHandleEvt: false,
  }
);
let emits = defineEmits(['handleSiteItem']);
function openMapApp(station) {
  // let mapCtx = Taro.createMapContext('chargeMap');
  const { stationLat, stationLng, address, stationName } = station;
  Taro.openLocation({
    longitude: stationLng,
    latitude: stationLat,
    address: address,
    name: stationName,
  });
}

function handleStationItem(station) {
  if (props?.customHandleEvt) {
    emits('handleSiteItem', station);
    return;
  }
  navigateToPage({
    route: 'chargeSiteDetail',
    params: { id: station.stationId },
  });
}

function _collect(submitOrCancel, stationId, station) {
  if (needToLogin()) return;

  station.collect = !station.collect;
  collectStation({
    submitOrCancel,
    stationId,
  }).then((res) => {
    useToast(res?.data);
  });
}
</script>
