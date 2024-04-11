<template>
  <section class="pb-20px bg-fff nrz-thin">
    <div
      class="box-border w-full overflow-x-auto whitespace-nowrap py-10px px-20px"
    >
      <span
        v-for="k in tabs"
        :key="k.key"
        class="inline-block text-center rounded-30px px-10px mx-10px nrz-thin py-4px"
        :style="{
          'background-color': k.checked ? 'rgba(252, 191, 72, 0.3)' : '#f5f5f5',
          color: k.checked ? 'rgba(252, 191, 72)' : 'text-second',
        }"
        @click="
          () => {
            handleTab(k);
          }
        "
      >
        {{ k.value }}
      </span>
    </div>

    <section
      v-for="gun in list"
      :key="gun.connectorId"
      class="box-border flex items-center justify-between w-full px-14px py-10px"
      @tap="tapToPage(gun)"
    >
      <div class="flex flex-col items-center text-second w-80px">
        <span
          class="box-border flex items-center justify-center border-solid rounded-full border-6px w-70px h-70px"
          :style="{ borderColor: regColor(gun?.status) }"
        >
          <span class="font-bold" :style="{ color: regColor(gun?.status) }">
            {{ gun?.dict?.status }}
          </span>
        </span>
        <span class="mt-4px text-12px">
          {{ gun?.dixt?.connectorType }}
        </span>
        <span class="text-12px mt-4px">{{ gun?.dict?.nationalStandard }}</span>
      </div>

      <section
        class="flex flex-col justify-center flex-1 overflow-hidden ml-14px mr-4px pb-10px nr-border-b"
      >
        <div class="flex items-center">
          <span class="text-second mr-6px">枪编号</span>
          <span class="flex-1 overflow-ellipsis">{{ gun?.connectorId }} </span>
          <span
            class="text-primary icon iconfont icon-copy ml-8px"
            @click.stop="
              () => {
                copyText(gun?.connectorId);
              }
            "
          ></span>
        </div>

        <div class="flex items-center mt-6px">
          <span class="text-second mr-6px">车位号</span>
          <span>{{ gun?.parkNo || '__' }} </span>
        </div>

        <div class="flex items-center mt-6px">
          <span class="text-second mr-6px">额定电流</span>
          <span>{{ gun?.current || '__' }}A </span>
        </div>

        <div class="flex items-center mt-6px">
          <span class="text-second mr-6px">额定电压</span>
          <span>
            {{ gun?.voltageLowerLimits }}-{{ gun?.voltageUpperLimits }}
          </span>
        </div>

        <div class="flex items-center mt-6px">
          <span class="text-second mr-6px">额定功率</span>
          <span>{{ gun?.power }}K/W </span>
        </div>
      </section>

      <div
        class="flex items-center justify-center rounded-full w-30px h-30px"
        :style="{ 'background-color': true ? '#F23F53' : '#5ED1F8' }"
      >
        <span class="font-normal text-fff">{{ gun?.dict?.mark }}</span>
      </div>
    </section>
  </section>
</template>
<script lang="ts" setup>
import { ref, watch, onBeforeMount } from 'vue';
import {
  copyText,
  getStore,
  nrNavigateTo,
  Routes,
  USER_INFO,
} from '@/utils/index';
import { getChargeGunList } from '@/api/index';
import { CODE, useToast } from '@/utils/index';
import { useRouter } from '@tarojs/taro';
withDefaults(defineProps<{ chargeNums: any }>(), {
  chargeNums: 0,
});
let emits = defineEmits(['update:chargeNums']);
let tabs = ref<any[]>([]);
let list = ref<any[]>([]);
let stationId = useRouter().params?.id;
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
function _getChargeGunList() {
  getChargeGunList({
    key: 0,
    type: 0,
    stationId,
  }).then((res) => {
    if (res?.code !== CODE) return useToast(res?.msg);
    list.value = res.data?.list;
    tabs.value = res.data?.tabs.map((item) => {
      return {
        ...item,
        checked: false,
      };
    });
    emits('update:chargeNums', res.data?.list?.length);
  });
}
function _getChargeGunListChecked({ key, type }) {
  getChargeGunList({
    key,
    type,
    stationId,
  }).then((res) => {
    if (res?.code !== CODE) return useToast(res?.msg);
    list.value = res.data?.list;
  });
}
function handleTab(item) {
  let temp = tabs?.value?.map((k) => {
    return {
      ...k,
      checked: item.key === k.key,
    };
  });
  tabs.value = temp;
  _getChargeGunListChecked(item);
}
function tapToPage(gun) {
  if (!gun?.enabledToCharge) return;
  if (!getStore(USER_INFO)) {
    nrNavigateTo('login');
    return;
  }
  nrNavigateTo(Routes.beforeCharge, { connectorId: gun?.connectorId });
}
onBeforeMount(() => {
  _getChargeGunList();
});
</script>
<style></style>
