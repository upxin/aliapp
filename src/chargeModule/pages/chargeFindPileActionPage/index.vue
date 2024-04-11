<template>
  <CustomBar background-color="#fff">
    <template #customLeft>
      <span @click="navigateToRecord">摸桩记录</span>
    </template>
    <template #title>摸桩行动</template>
  </CustomBar>
  <FullLoading :loading="fullLoading">
    <section :style="{ paddingTop: `${headerHeight}px` }">
      <section class="overflow-auto py-20px bg-fff px-16px mb-10px">
        <div
          class="box-border flex items-center justify-between w-full rounded-md px-16px bg-main h-54px"
          @click="toSearchSite"
        >
          <span class="opacity-44">选择要摸桩的充电站</span>
          <span class="icon-arrow-right-bold iconfont opacity-44"></span>
        </div>
      </section>

      <div v-if="stationName" class="overflow-auto py-20px bg-fff px-16px">
        <span class="font-bold">{{ stationName }}</span>
        <div class="flex items-center my-10px">
          <span class="text-12px opacity-30">{{ operatorName }}</span>
        </div>
        <div class="flex items-center">
          <span class="icon-weizhi iconfont text-18px"></span>
          <span class="text-12px ml-6px opacity-60">{{ address }}</span>
        </div>
      </div>

      <div class="mt-10px bg-fff px-16px py-20px">
        <div class="font-bold mb-24px">选择标签</div>
        <div class="flex flex-wrap">
          <span
            v-for="(k, i) in enumList"
            :key="k"
            :class="{
              'bg-main': k.checked,
              'bg-primary': k.checked,
              'text-fff': k.checked,
              noChecked: !k.checked,
              'mr-20px': (i + 1) % 3 != 0,
            }"
            class="text-center rounded-30px w-100px h-36px leading-36px mb-10px overflow-ellipsis"
            @click="
              () => {
                handleTag(k);
              }
            "
          >
            {{ k.value }}
          </span>
          <!-- <span
            class="box-border font-bold text-center border-solid text-18px rounded-30px w-100px h-36px leading-36px mb-10px border-1px border-primary"
            @click="handleAddTag"
          >
            +
          </span> -->
        </div>
      </div>

      <Flow></Flow>
    </section>
  </FullLoading>
  <NrzOverlay v-model:show="addTag" :maskClosable="false">
    <div
      class="box-border flex items-center justify-center w-full h-full px-16px"
    >
      <div
        class="box-border w-full px-26px bg-hex-fff modal-shadow h-212px rounded-10px py-20px"
      >
        <div class="font-bold text-center">添加标签</div>
        <nut-input
          v-model="newTag"
          placeholder="请输入不超过八个字的自定义标签"
          class="bg-main mt-20px mb-40px"
        ></nut-input>
        <div class="flex items-center justify-between w-full">
          <nut-button
            shape="square"
            class="border-0 bg-main text-second w-134px"
            @click="onCancel"
          >
            取消
          </nut-button>
          <nut-button
            shape="square"
            class="border-0 modal-btn w-134px"
            color="#11264d"
            @click="onOk"
          >
            添加
          </nut-button>
        </div>
      </div>
    </div>
  </NrzOverlay>
  <section
    class="box-border fixed bottom-0 w-full py-20px bg-fff px-40px nrz-safe"
  >
    <nut-button
      shape="square"
      color="#11264d"
      class="w-full border-0"
      @click="_beforeSubmitEvaluation"
      >提交</nut-button
    >
  </section>
</template>
<script lang="ts">
import { onShareAppMessage, onShareTimeline } from '@/utils/index';
export default {
  onShareAppMessage,
  onShareTimeline,
};
</script>
<script lang="ts" setup>
import { onBeforeMount, ref } from 'vue';

import NrzOverlay from '@/components/nrz-overlay/index.vue';

import CustomBar from '@/components/customHeader/index.vue';
import FullLoading from '@/components/full-loading/index.vue';
import Flow from './Flow.vue';
import Taro, { useDidShow, useRouter } from '@tarojs/taro';
import { getEvaluationEnum, submitEvaluation } from '@/api/index';
import {
  CODE,
  navigateToPage,
  useToast,
  getStore,
  USER_INFO,
  useLocation,
} from '@/utils/index';
import { useHeaderHeight, useGetNavigateBackParams } from '@/hooks/index';

definePageConfig({
 transparentTitle: 'always',
  titlePenetrate: 'YES',
  defaultTitle: '',});
let params = useRouter().params;
let enumList = ref<any[]>([]);
let addTag = ref(false);
let fullLoading = ref(true);
let newTag = ref('');
let address = ref('');
let stationName = ref('');
let stationId = ref('');
let operatorName = ref('');
const { headerHeight } = useHeaderHeight();

let uid = 100;

function _getEvaluationEnum() {
  getEvaluationEnum()
    .then((res) => {
      fullLoading.value = false;
      if (res?.code !== CODE) return;
      enumList.value = res.data?.map((item) => {
        return {
          ...item,
          checked: false,
        };
      });
    })
    .catch(() => {
      fullLoading.value = false;
    });
}
function toSearchSite() {
  navigateToPage({
    route: 'chargeSearch',
    params: {
      find: '1',
    },
  });
}
let lat: any = '';
let lng: any = '';
function _beforeSubmitEvaluation() {
  if (lat) {
    _submitEvaluation();
    return;
  }
  useLocation().then((lRes) => {
    if (lRes.errMsg !== 'getLocation:ok') return;
    lat = lRes.latitude;
    lng = lRes.longitude;
    _submitEvaluation();
  });
}
function _submitEvaluation() {
  let choosedTag = enumList.value?.filter((item) => item.checked) || [];
  let ids = choosedTag?.map((item) => item?.key);
  if (!ids?.length) return useToast('请选择标签');
  if (!stationId.value) return useToast('请选择充电站');
  submitEvaluation({
    ids,
    stationId: stationId.value,
    memberId: getStore(USER_INFO)?.member_id,
    latitude: lat,
    longitude: lng,
  }).then((res) => {
    useToast(res?.msg);
    if (res.code == CODE) {
      Taro.navigateBack();
    }
  });
}
function navigateToRecord() {
  navigateToPage({
    route: 'findChargeSiteRecord',
  });
}
function handleTag(item) {
  item.checked = !item.checked;
}
function onCancel() {
  addTag.value = false;
}
function onOk() {
  enumList.value = [...enumList.value, { key: uid++, value: newTag.value }];
  addTag.value = false;
}
onBeforeMount(() => {
  _getEvaluationEnum();
});
useDidShow(() => {
  const stationInfo = useGetNavigateBackParams('findSite');
  console.log(stationInfo);
  stationId.value = stationInfo?.stationId || params?.stationId || '';
  address.value = stationInfo?.address || params?.address || '';
  stationName.value = stationInfo?.stationName || params?.stationName || '';
  operatorName.value = stationInfo?.operatorName || params?.operatorName || '';
});
// bottom
</script>
<style>
.noChecked {
  background-color: #f0f0f0;
}
</style>
