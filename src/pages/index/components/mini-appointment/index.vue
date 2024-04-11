<template>
  <div
    style="z-index: 9999"
    :class="props.scrollTop > 320 ? 'nr-top-0' : ''"
    class="box-border fixed flex items-center justify-between w-full shadow-md anit shadow-gray-500 -top-200px h-160px bg-hex-fff pr-21px pl-28px pt-80px"
  >
    <img class="w-100px h-62px" :src="MINE_TOP_IMG" mode="aspectFit" />
    <div>
      <nut-button
        shape="square"
        class="box-border border-primary nrz-thin w-90px rounded-sm"
        @click="
          () => {
            nrNavigateTo('testDrive', { type: 'ec1' });
          }
        "
      >
        预约试驾
      </nut-button>
      <nut-button
        v-if="store().openPrepay"
        class="border-none rounded-sm ml-14px bg-primary w-90px text-light-50"
        @click="reserve"
      >
        即刻预定
      </nut-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { MINE_TOP_IMG, nrNavigateTo } from '@/utils/index';
import { store } from '@/stores/index';
import { watch } from 'vue';
const props = defineProps({
  scrollTop: {
    default: 0,
    type: Number,
  },
});
watch(
  () => props.scrollTop,
  (v) => {
    console.log(v);
  }
);
function reserve() {
  nrNavigateTo('chooseCarType');
}
</script>
<style lang="scss">
.nr-top-0 {
  top: 0 !important;
}
.nr-img {
  width: 84px !important;
  height: 64px !important;
}
.anit {
  transition: all 0.3s;
  border-radius: 0 0 10px 10px;
}
</style>
