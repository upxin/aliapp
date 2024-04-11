<template>
  <section class="flex flex-col justify-between w-full h-full">
    <div class="box-border flex-1 w-full overflow-y-scroll px-16px py-20px">
      <ChooseItem
        class="mb-14px"
        :list="state.chargeType"
        title="电桩"
        :wrap-len="3"
      ></ChooseItem>
      <ChooseItem
        class="mb-14px"
        title="位置"
        :list="state.location"
        :wrap-len="3"
      ></ChooseItem>
      <div class="font-bold mb-40px">距离</div>
      <div class="relative w-full mb-14px h-24px">
        <van-slider
          :value="rangeVal"
          active-color="#f18a30"
          :use-button-slot="true"
          bar-height="4px"
          @drag="changeRangeVal"
        >
          <slot-view :name="'button'">
            <view class="custom-button">{{ rangeVal }}km</view>
          </slot-view>
        </van-slider>
        <div class="absolute bottom-0 flex justify-between w-full">
          <span>1km</span>
          <span>100km</span>
        </div>
      </div>
      <ChooseItem
        class="mb-14px"
        title="停车费"
        :list="state.parking"
        :wrap-len="3"
      ></ChooseItem>
      <ChooseItem
        class="mb-14px"
        title="站点设施"
        :list="state.facility"
        :wrap-len="3"
      ></ChooseItem>
    </div>
    <div class="flex justify-between px-16px py-14px">
      <nut-button
        shape="square"
        class="flex-1 mr-10px text-primary border-primary"
        @click="reset"
      >
        重置
      </nut-button>
      <nut-button
        shape="square"
        class="flex-1 border-0 bg-info text-fff"
        @click="handleOk"
      >
        确定
      </nut-button>
    </div>
  </section>
</template>
<script lang="ts" setup>
import { ref, reactive, onBeforeMount } from 'vue';
import ChooseItem from './ChooseItem.vue';
import { getAllEnum } from '@/api/index';
import { CODE, useToast } from '@/utils/index';
import { regDataList } from './siteListHooks';

let rangeVal = ref(50);
let originData = ref([]);
const state = reactive({
  showMore: false,
  chargeType: [],
  parking: [],
  sort: [],
  location: [],
  facility: [],
  sortVal: null,
  chargeTypeVal: null,
  parkingVal: null,
  facilityVal: null,
  locationVal: null,
});

const emits = defineEmits(['handleOk', 'reset']);

function changeRangeVal(ret) {
  rangeVal.value = ret.detail?.value;
}

function reset() {
  rangeVal.value = 50;
  setItemData(originData.value);
}
function getKeys(data) {
  if (!data) return [];
  let arr = data?.filter((item) => item.active).map((item) => item.key);
  return arr;
}
function handleOk() {
  const tagIds: string[] = [
    ...getKeys(state.parking),
    ...getKeys(state.location),
    ...getKeys(state.facility),
  ]; //(parking、location、facility)的 keys
  const type: string[] = [...getKeys(state.chargeType)];
  emits('handleOk', { tagIds, type, km: rangeVal.value }, reset);
}
function setItemData(data) {
  state.chargeType = regDataList(data?.type);
  state.location = regDataList(data?.location);
  state.sort = regDataList(data?.sortType);
  state.parking = regDataList(data?.parking);
  state.facility = regDataList(data?.facility);
}
function getEnum() {
  getAllEnum().then((res) => {
    if (res?.code !== CODE) return useToast(res?.msg);
    originData.value = res?.data;
    setItemData(res.data);
  });
}

onBeforeMount(() => {
  getEnum();
});
// bottom
</script>
<style lang="scss">
.custom-button {
  color: #f18a30;
  font-size: 10px;
  padding: 4px 12px;
  margin-top: -32px;
  text-align: center;
  background-color: rgba(241, 138, 48, 0.2);
  border-radius: 4px;
  position: relative;
}
.custom-button::after {
  position: absolute;
  transform: translateY(100%) translateX(-50%);
  bottom: 0;
  content: '';
  width: 0;
  left: 50%;
  height: 0;
  border-top: 6px solid rgba(241, 138, 48, 0.2);
  border-right: 6px solid transparent;
  border-left: 6px solid transparent;
}
</style>
