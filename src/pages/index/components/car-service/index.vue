<template>
  <div v-if="store().openPrepay && carService">
    <div class="flex items-center justify-between mb-16px">
      <div class="w-57px h-20px text-primary text-size-14px leading-20px">
        用车服务
      </div>
      <span
        class="iconfont icon-right h-20px text-primary text-size-24px leading-20px"
      ></span>
    </div>
    <section class="pb-0 bg-hex-f5f5f5 p-20px">
      <div
        v-for="itemVal in list"
        :key="itemVal.categoryId"
        class="text-primary"
      >
        <div class="font-bold text-primary text-12px my-15px">
          {{ itemVal.name }}
        </div>
        <div class="flex flex-wrap justify-start">
          <div
            v-for="k in itemVal.list"
            :key="k.categoryId"
            class="flex flex-col items-center justify-center w-1_4 mb-23px"
            @click="
              () => {
                handleItem(k);
              }
            "
          >
            <span
              class="bg-center bg-cover w-28px h-28px"
              :style="{
                backgroundImage: `url(${k.imgUrl})`,
              }"
            ></span>
            <span class="mt-4px text-12px">{{ k.name }}</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<script lang="ts" setup>
import { homeStore, store } from '@/stores/index';
import { CODE, JG, jGcustomCount, nrNavigateTo } from '@/utils';
import { dynamicMenu } from '@/api/home';
import { watch, ref, computed } from 'vue';
const carService = ref();

function getCarServ(vin) {
  dynamicMenu(vin).then((res) => {
    if (res.code == CODE) {
      carService.value = res.data;
    }
  });
}
function handleItem(item) {
  if (item?.name === '保修手册') {
    jGcustomCount(JG.CV_020);
  }
  if (item?.name === '车主权益') {
    jGcustomCount(JG.CV_021);
  }
  console.log(item.router);
  nrNavigateTo(item.router);
}

const list = computed(() => {
  if (!carService.value) return [];
  const list: any[] = [];
  for (const key of Object.keys(carService.value)) {
    const menus = carService.value[key]?.menus;
    list.push(...menus);
  }
  return list;
});

watch(
  () => homeStore().state.currentCar,
  (v) => {
    if (v?.vin) {
      getCarServ(v?.vin);
    }
  },
  {
    immediate: true,
    deep: true,
  }
);
</script>
