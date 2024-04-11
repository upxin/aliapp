<template>
  <CustomBar :z="10" :border="false" background-color="#fff">
    <template #title>服务订单</template>
  </CustomBar>
  <nut-noticebar
    :style="{ position: 'absolute', width: '100%', top: `${CalcPt}px` }"
    background="#eaeaea"
    :color="`#101010`"
    :close-mode="true"
    right-icon="circle-close"
    @close="closeNoticebar = 0"
  >
    <template #default>
      温馨提示：有未评价服务订单时无法发起新的服务订单！
    </template>
  </nut-noticebar>
  <MainScroll
    :other-fixed="40"
    :pt="CalcPt + closeNoticebar"
    :has-more="hasMore"
    :has-data="!!list?.length"
    :init-loading="fl"
    :model-value="isRefresh"
    @scroll-reach-bottom="loadMore"
    @end-pull-down="refresh"
  >
    <div class="overflow-y-auto text-14px text-normal min-h-200px">
      <section
        v-for="k in list"
        :key="k?.id"
        class="px-12px"
        @click="
          () => {
            goDetail(k.id);
          }
        "
      >
        <div
          class="box-border w-full rounded shadow bg-hex-fff px-14px pt-16px pb-18px my-12px"
        >
          <div class="flex items-center">
            <div class="w-16px h-16px mr-4px">
              <img :src="k?.icon" alt="" class="w-full h-full" />
            </div>
            <div>{{ k?.typeName }}</div>
          </div>
          <div class="leading-normal my-8px text-14px">
            {{ k?.shopName }}
          </div>
          <div class="flex items-center justify-between overflow-hidden h-24px">
            <div class="text-hex-11264d text-opacity-33 text-12px">
              {{ k?.time }}
            </div>
            <div v-if="k?.status === 1" class="flex items-baseline">
              <span class="font-bold text-blue-500 mr-2px text-20px">{{
                k?.score?.toFixed(1)
              }}</span>
              <span class="text-info text-12px">{{ regScore(k?.score) }}</span>
            </div>
            <nut-button
              v-else
              size="mini"
              class="text-primary border-primary px-10px"
              @click.stop="
                () => {
                  showCommnet(k?.id);
                }
              "
            >
              评论得积分
            </nut-button>
          </div>
        </div>
      </section>
    </div>
  </MainScroll>
  <NrzBtmPop v-model:show="showComment">
    <div
      class="rounded-xl mt-13px bg-hex-fff px-22px pt-40px pb-16px text-normal"
    >
      <div class="flex">
        <div>
          <nut-rate
            v-model="state.rate"
            active-color="#EF8A3C"
            icon-size="24"
          />
          <div class="flex justify-between text-12px opacity-34 pr-14px mt-8px">
            <span>很差</span>
            <span>差</span>
            <span>一般</span>
            <span>好</span>
            <span>很好</span>
          </div>
        </div>
        <div class="ml-10px">{{ state.rate }}/5</div>
      </div>
      <div class="flex items-center justify-end mt-20px text-12px">
        <NrzCheckBox
          v-model:checked="state.anonymity"
          color="#11264d"
          borderColor="#11264d"
          size="28rpx"
        >
          匿名评论
        </NrzCheckBox>
        <div class="opacity-42 ml-6px">对门店和其他用户隐藏用户名和头像</div>
      </div>
      <div class="flex justify-center my-20px px-26px">
        <nut-button
          class="w-full border-hex-11264d text-hex-11264d"
          @click="_postComment"
          >评价服务</nut-button
        >
      </div>
    </div>
  </NrzBtmPop>
</template>
<script lang="ts">
import { onShareAppMessage, onShareTimeline } from '@/utils/index';
export default {
  onShareAppMessage,
  onShareTimeline,
};
</script>
<script lang="ts" setup>
import NrzBtmPop from '@/components/nrz-bottom-popup/index.vue';
import NrzCheckBox from '@/components/nrz-checkbox/index.vue';
import CustomBar from '@/components/customHeader/index.vue';
import { systemInfo } from '@/stores/systemInfo';
import { onBeforeMount, ref, computed, reactive } from 'vue';

import { serverOrderList, postComment } from '@/api/index';
import { CODE, regScore, nrNavigateTo, useToast } from '@/utils/index';
import MainScroll from '@/components/scroll-main/index.vue';

definePageConfig({
  transparentTitle: 'always',
  titlePenetrate: 'YES',
  defaultTitle: '',
});
let closeNoticebar = ref(40);
let state = reactive({
  rate: 0,
  anonymity: false,
});
let hasMore = ref(false);
let showComment = ref(false);
let list = ref<any[]>([]);
let fl = ref(true);
let pt = null;
let nt = null;
let currentOrderId = '';
async function _postComment() {
  const { code } = await postComment({
    id: currentOrderId,
    score: state.rate,
    anonymous: state.anonymity,
  });
  if (code === CODE) {
    useToast('评论成功');
  }
}
async function _serverOrderList() {
  try {
    const { code, data } = await serverOrderList({ pt, nt });
    fl.value = false;
    if (code === CODE) {
      list.value = [...list.value, ...data.list];
      hasMore.value = !!data?.list?.length;
      nt = data?.nt;
      pt = data?.pt;
    }
  } catch (error) {
    console.log(error);
    fl.value = false;
  }
}

let CalcPt = computed(
  () => systemInfo().RightBtnRect.h + systemInfo().RightBtnRect.t + 10
);

async function goDetail(id) {
  nrNavigateTo('servicesOrderDetail', { id });
}
function showCommnet(id) {
  showComment.value = true;
  currentOrderId = id;
}
function loadMore() {
  console.log('haseMore', hasMore.value);
  if (hasMore.value) {
    _serverOrderList();
  }
}
let isRefresh = ref(false);
async function refresh() {
  try {
    nt = null;
    pt = null;
    isRefresh.value = true;

    const { code, data } = await serverOrderList({ pt, nt });
    setTimeout(() => {
      isRefresh.value = false;
    }, 500);
    if (code === CODE) {
      list.value = [...data.list];
      hasMore.value = !!data?.list?.length;
      nt = data?.nt;
      pt = data?.pt;
    }
  } catch (error) {
    console.log(error);
  }
}
onBeforeMount(() => {
  _serverOrderList();
});
</script>
<style></style>
