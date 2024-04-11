<template>
  <CustomBar background-color="#fff" bind-back @back="back">
    <template #title>摸桩记录</template>
    <template #customLeft>
      <span @click="show = true">筛选</span>
    </template>
  </CustomBar>

  <FullLoading :loading="fullLoading">
    <MainScroll
      :has-more="hasMore"
      :bg="'#fff'"
      @scroll-reach-bottom="loadMore"
      @end-pull-down="refresh"
    >
      <div class="overflow-y-auto">
        <section
          v-for="(k, i) in list"
          :key="k?.submitTime"
          class="box-border flex w-full border-0 border-solid py-16px border-b-1px border-main pl-10px"
          :class="{
            'border-b-0px': list.length == i + 1,
          }"
        >
          <div
            :style="{ backgroundColor: regColor(k.status) }"
            class="box-border flex items-center justify-center w-20px px-12px"
          >
            <span :style="{ color: regColor(k.status, 1) }">{{
              StatusMap[k.status]
            }}</span>
          </div>

          <section>
            <div class="flex-1 pb-16px ml-14px nr-border-b--dashed">
              <div class="box-border flex flex-col justify-between">
                <div class="flex text-12px mb-10px">
                  <span class="text-hex-555 text-opacity-44">提交时间：</span>
                  <span>{{ k?.submitTime }}</span>
                </div>
                <div class="flex text-12px mb-10px">
                  <span class="text-hex-555 text-opacity-44">电站名称：</span>
                  <span>{{ k?.name }}</span>
                </div>
                <div class="flex text-12px mb-10px">
                  <span class="text-hex-555 text-opacity-44">桩企名称：</span>
                  <span>{{ k?.operator }}</span>
                </div>
                <div class="flex text-12px">
                  <span class="text-hex-555 text-opacity-44">电站地址：</span>
                  <span>{{ k?.address }}</span>
                </div>
              </div>
            </div>

            <aside class="flex flex-wrap flex-1 pt-10px ml-14px">
              <span
                v-for="child in k.list"
                :key="child.id"
                class="text-center mr-10px mt-6px rounded-20px text-12px bg-main text-second w-100px py-6px"
              >
                {{ child }}
              </span>
            </aside>
          </section>
        </section>
      </div>
    </MainScroll>
  </FullLoading>
  <NrzAction
    v-model:show="show"
    tips="筛选"
    :item-list="filterList"
    @choose="filterRecord"
  >
  </NrzAction>
</template>
<script lang="ts">
import { onShareAppMessage, onShareTimeline } from '@/utils/index';
export default {
  onShareAppMessage,
  onShareTimeline,
};
</script>
<script lang="ts" setup>
import MainScroll from '@/components/scroll-main/index.vue';
import { onBeforeMount, ref } from 'vue';
import CustomBar from '@/components/customHeader/index.vue';
import FullLoading from '@/components/full-loading/index.vue';
import NrzAction from '@/components/nrz-action/index.vue';

import { queryEvaluation } from '@/api/index';
import { CODE, pageHasMore } from '@/utils/index';
import { useNavigateBackSetData } from '@/hooks/index';

definePageConfig({
 transparentTitle: 'auto',
  titlePenetrate: 'YES',
  defaultTitle: '',});

let show = ref(false);
let status = ref(0);
let fullLoading = ref(true);
let list = ref<any[]>([]);
let filterList = [
  { key: 0, name: '全部' },
  { key: 1, name: '审核中' },
  { key: 2, name: '已通过' },
  { key: 3, name: '已驳回' },
];
let StatusMap = {
  2: '已通过',
  1: '审核中',
  3: '已驳回',
};
let hasMore = ref(false);
let pageNum = 1;
let pageSize = 20;

function regColor(type, opacity = 0.28) {
  if (type == 3) {
    return `rgba(3, 149, 41, ${opacity})`;
  }
  if (type == 1) {
    return `rgba(3, 149, 41, ${opacity})`;
  }
  if (type == 2) {
    return `rgba(3, 149, 41, ${opacity})`;
  }
  return '';
}
function _queryEvaluation() {
  queryEvaluation({ status: status.value, pageSize, pageNum }).then((res) => {
    if (res?.code == CODE) {
      list.value = [...list.value, ...res?.data?.list];
      pageNum = res.data?.nextPage == 0 ? pageNum : res.data?.nextPage;
      hasMore.value = pageHasMore(res.data?.pages, res.data?.pageNum);
    }
  });
}
function _initQqueryEvaluation() {
  queryEvaluation({ status: status.value, pageSize, pageNum })
    .then((res) => {
      fullLoading.value = false;
      if (res?.code == CODE) {
        list.value = [...list.value, ...res?.data?.list];
        pageNum = res.data?.nextPage == 0 ? pageNum : res.data?.nextPage;
        hasMore.value = pageHasMore(res.data?.pages, res.data?.pageNum);
      }
    })
    .catch(() => {
      fullLoading.value = false;
    });
}
function filterRecord(res) {
  status.value = res.key;
  _initQqueryEvaluation();
}
function back() {
  useNavigateBackSetData({ hhh: '上级页面返回的值' });
}
function loadMore() {
  _queryEvaluation();
}
function refresh() {
  pageNum = 1;
  list.value = [];
  _initQqueryEvaluation();
}
onBeforeMount(() => {
  _initQqueryEvaluation();
});
// bottom
</script>
<style>
page {
  background-color: #fff;
}
</style>
