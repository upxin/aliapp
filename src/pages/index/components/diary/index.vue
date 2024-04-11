<template>
  <section @click="handleDiary">
    <div class="mt-30px mb-16px">
      <div class="flex items-center justify-between">
        <div class="w-57px h-20px text-primary text-size-14px leading-20px">
          我的日记
        </div>
        <span
          class="iconfont icon-right h-20px text-primary text-size-24px leading-20px"
        ></span>
      </div>
    </div>
    <div class="flex items-center h-70px bg-hex-f5f5f5 px-14px">
      <NrzImg :url="DIARY_MINI_ICON" only-img class="w-40px nr-h-36px" />
      <div class="flex justify-end flex-1 text-12px text-primary">
        <span class="mr-12px">
          今日行驶{{ ' ' }}
          {{
            HomeStore.state?.carBehavior?.todayTime || vrD?.todayTime || '--'
          }}
          h
        </span>
        <span>
          行驶里程{{ ' ' }}
          {{
            HomeStore.state?.carBehavior?.todayMileage ||
            vrD?.todayMileage ||
            '--'
          }}
          km
        </span>
      </div>
    </div>
  </section>
</template>
<script lang="ts" setup>
import { nrNavigateTo, DIARY_MINI_ICON } from '@/utils/index';
import NrzImg from '@/components/img/img.vue';
import { vrData } from '@/assets/js/virtual_car_behavior';
import { loveCarStore, homeStore } from '@/stores/index';
import { watch, ref } from 'vue';

let LoveCarStore = loveCarStore();
const HomeStore = homeStore();
function handleDiary() {
  nrNavigateTo('carDiary', {
    carName: HomeStore.state?.currentCar?.licensePlateNum || '',
    vin: HomeStore.state?.currentCar?.vin,
  });
}

let vrD = ref();
watch(
  () => LoveCarStore.isVr,
  (v) => {
    if (v) {
      vrD.value = vrData?.data;
    }
  },
  {
    deep: true,
    immediate: true,
  }
);
</script>
<style>
.nr-h-36px {
  height: 36px;
}
</style>
