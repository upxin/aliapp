<template>
  <section>
    <NrzOverlay :show="show" :z-index="997" @click="handleOverLay"></NrzOverlay>
    <view
      :catch-move="true"
      :class="{ slide_up: show, slide_down: !show }"
      class="fixed top-0 left-0 w-full z-998"
      :style="{
        paddingTop: `${offsetTop}px`,
        height,
      }"
    >
      <div
        class="box-border flex flex-col w-full h-full overflow-hidden bg-fff px-14px"
      >
        <div class="h-10px"></div>
        <section
          style="background-color: #f6f6f6"
          class="box-border flex items-center justify-between w-full rounded-full px-20px py-6px"
        >
          <span
            class="iconfont icon-search text-18px text-second mr-10px font-normal"
          ></span>
          <input
            v-model="searchValue"
            type="text"
            placeholder="输入车牌搜索"
            class="flex-1"
            @input="search"
          />
          <span class="iconfont icon-search text-16px opacity-0"></span>
        </section>
        <div class="flex-1 overflow-scroll">
          <CarInfo
            v-for="item in innerList"
            :key="item.vinCode"
            width="44%"
            :align-text="true"
            class="flex items-center justify-center my-20px text-16px"
            :checked="item.vinCode === vinCode"
            :vehicle-text="item.licensePlateNumber"
            :vehicle-type="item?.vehicleType"
            @click="
              () => {
                handleItem(item);
              }
            "
          ></CarInfo>
        </div>
      </div>
    </view>
  </section>
</template>
<script lang="ts" setup>
import { ref, onBeforeMount } from 'vue';
import { systemInfo } from '@/stores/index';
import { getFleetVehList } from '@/api/index';
import { useToast } from '@/utils';
import CarInfo from '../CarInfo.vue';
import NrzOverlay from '@/components/nrz-overlay/index.vue';

interface Props {
  show: boolean;
  currentVal: any;
  offsetTop?: string | number;
  height?: string;
  searchLocal?: boolean;
  vinCode?: string;
  carData?: any;
}

let props = withDefaults(defineProps<Props>(), {
  show: false,
  currentVal: '',
  height: '44%',
  searchLocal: true,
  vinCode: '',
  carData: {},
  offsetTop: systemInfo().RightBtnRect.h + systemInfo().RightBtnRect.t + 10,
});
let searchValue = ref('');
let emits = defineEmits([
  'search',
  'update:fullList',
  'update:show',
  'update:currentVal',
  'update:vinCode',
  'update:carData',
  'success',
]);

let innerList = ref<any[]>();
let fullList = ref<any[]>([]);
let searchLocal = (v) => {
  if (v) {
    innerList.value = fullList.value.filter((item) => {
      return item?.licensePlateNumber.includes(v);
    });
  } else {
    innerList.value = fullList.value;
  }
};
function search(v) {
  if (props.searchLocal) {
    searchLocal(v.detail?.value);
    return;
  }
  emits('search', v.detail?.value);
}
function handleItem(item) {
  emits('update:currentVal', item.val);
  emits('update:vinCode', item.vinCode);
  emits('update:carData', item);
  emits('update:show', false);
}
function handleOverLay() {
  emits('update:show', false);
}
onBeforeMount(() => {
  getFleetVehList().then((res) => {
    if (res?.code !== 200) return useToast(res?.msg);
    fullList.value = res?.data?.map((item) => {
      return {
        ...item,
        val: item?.licensePlateNumber,
      };
    });
    innerList.value = fullList.value;
    emits('update:fullList', fullList.value);
    emits('success', fullList.value?.[0]);
  });
});
</script>
<style>
.slide_down {
  transform: translateY(-100%);
  transition: all 0.3s;
}
.slide_up {
  transform: translateY(0%);
  transition: all 0.3s;
}
</style>
