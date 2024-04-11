<template>
  <custom-bar background-color="#fff" :show-icon="true">
    <template #title>
      <div>{{ car }}</div>
    </template>
  </custom-bar>
  <Scroll :init-loading="fullLoading">
    <section class="overflow-yauto">
      <div class="box-border flex items-center w-full nrz-thin py-30px px-13px">
        <view class="w-123px flex justify-center mr-16px">
          <view
            class="w-100px h-70px flex justify-center items-center bg-fleet"
          >
            <view class="icon-chongdianzhuang iconfont text-30px"></view>
          </view>
        </view>

        <view class="nrz-thin">
          <view>其他车辆</view>
          <view class="opacity-40 text-12px pt-4px">非前晨车辆</view>
        </view>
        <div class="flex flex-col items-center ml-auto">
          <button
            class="w-78px justify-center rounded-full nr-border border-primary h-22px text-12px px-10px flex items-center"
            @click="goCarDetail('other')"
          >
            选择
          </button>
        </div>
      </div>
      <div class="bg-fleet h-20px"></div>
      <section
        v-for="k in list"
        :key="k?.vin"
        class="bg-hex-fff py-10px px-13px mb-2px nrz-thin"
        @click="
          () => {
            goCarDetail(k);
          }
        "
      >
        <div class="box-border flex items-center w-full pt-30px">
          <NrImg
            :url="k?.imgUrl.includes('white') ? WHITE_CAR : BLUE_CAR"
            class="w-123px h-90px mr-16px"
          ></NrImg>
          <aside class="text-center w-97px">
            <NrImg
              v-if="k?.licensePlateNum"
              :url="PLATE"
              class="bg-green-400 rounded-md w-97px h-34px leading-34px"
            >
              {{ k?.licensePlateNum }}
            </NrImg>
            <div
              v-else
              class="border-solid rounded-md border-hex-aaa border-1px w-97px h-34px leading-34px"
              @click.stop="
                () => {
                  goUpdateCar(k);
                }
              "
            >
              添加车牌
            </div>
          </aside>
          <div class="flex flex-col items-center ml-auto">
            <span
              class="font-normal text-12px h-20px leading-20px text-normal my-6px"
              >前晨{{ k?.type }}</span
            >
            <button
              class="w-78px justify-center rounded-full nr-border border-primary h-22px text-12px px-10px flex items-center"
            >
              选择
            </button>
          </div>
        </div>
      </section>
    </section>
  </Scroll>
</template>
<script lang="ts">
import { onShareAppMessage, onShareTimeline } from '@/utils/index';
export default {
  onShareAppMessage,
  onShareTimeline,
};
</script>
<script lang="ts" setup>
import { systemInfo } from '@/stores/index';
import CustomBar from '@/components/customHeader/index.vue';
import { ref, computed, onBeforeMount } from 'vue';
import { useNavigateBack } from '@/hooks/index';

import {
  CODE,
  PLATE,
  BLUE_CAR,
  WHITE_CAR,
  VIN_KEY,
  nrNavigateTo,
  getStore,
  USER_INFO,
} from '@/utils/index';
import { carInfo } from '@/api/index';
import NrImg from '@/components/img/img.vue';
import { useRouter } from '@tarojs/taro';
import Scroll from '@/components/scroll-main/index.vue';

definePageConfig({
 transparentTitle: 'auto',
  titlePenetrate: 'YES',
  defaultTitle: '',});
let list = ref<any[]>([]);
let fullLoading = ref(true);
const car = ref('车队');
async function getCars() {
  let arr: any[] = [];
  const { data: driver, code: code1 } = await carInfo({ isOwner: false });
  if (code1 !== CODE) return;
  arr = arr.concat(driver.cars ? driver.cars : []).map((item) => {
    return {
      ...item,
      isOwner: false,
    };
  });

  const { data: owner, code: code2 } = await carInfo({ isOwner: true });
  if (code2 !== CODE) return;
  arr = arr.concat(owner.cars ? owner.cars : []).map((item) => {
    return {
      ...item,
      isOwner: true,
    };
  });

  fullLoading.value = false;
  list.value = arr;
}
function addPlate() {
  // 添加车牌  转成大写
}
function goCarDetail(item) {
  let mobile = getStore(USER_INFO)?.mobile;
  if (item === 'other') {
    useNavigateBack({ [VIN_KEY]: { vin: `nrz_${mobile}` } });
    return;
  }
  if (useRouter().params.choose) {
    useNavigateBack({ [VIN_KEY]: item });
    return;
  }
}

function goUpdateCar(item) {
  nrNavigateTo('updateCar', {
    vin: item?.vin || '',
    name: item?.name || '',
    insurerId: item?.insurer?.id || '',
    insurerName: item?.insurer?.name || '',
    time: item?.insurer?.time || '',
  });
}
onBeforeMount(() => {
  getCars();
});
</script>
<style>
page {
  background-color: #fff;
}
</style>
