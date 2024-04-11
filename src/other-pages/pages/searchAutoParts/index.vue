<template>
  <section class="w-full h-full flex flex-col bg-fff">
    <CustomBar background-color="#fff" :border="false" position="relative"
      ><template #title>车辆配件</template></CustomBar
    >
    <NrzSearchBar
      v-model:modelValue="searchValue"
      placeholder="请输入您想搜索的内容"
      class="m-auto"
      style="width: 90%"
      @change="search"
    >
    </NrzSearchBar>
    <section class="flex-1 overflow-hidden">
      <MainScroll
        :pt="0"
        :has-more="hasMore"
        :init-loading="fl"
        :model-value="isRefresh"
        @scroll-reach-bottom="loadMore"
        @end-pull-down="refresh"
      >
        <div class="relative overflow-auto">
          <section>
            <div
              v-for="item in list"
              :key="item?.id"
              class="flex border-0 border-solid bg-hex-fff border-hex-f5f5f5 h-60px py-10px text-normal px-14px border-b-1px"
              @click="
                () => {
                  goToDetail(item);
                }
              "
            >
              <NrImg :url="item?.imgUrls?.[0] || ''" class="w-80px 60px mr-6px">
              </NrImg>
              <div class="flex flex-col justify-between flex-1 py-4px">
                <span class="text-14px">{{ item?.name }}</span>
                <span class="text-12px opacity-30"
                  >适用车型：{{ item?.vehicles?.join('') }}</span
                >
                <span class="text-12px opacity-30"
                  >零件号：{{ item?.code }}</span
                >
              </div>
            </div>
          </section>
        </div>
      </MainScroll>
    </section>
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
import CustomBar from '@/components/customHeader/index.vue';
import { autoParts } from '@/api/index';
import { CODE, nrNavigateTo } from '@/utils';
import NrImg from '@/components/img/img.vue';
import MainScroll from '@/components/scroll-main/index.vue';
import NrzSearchBar from '@/components/nrz-search-bar/index.vue';
definePageConfig({ navigationStyle: 'custom' });
const searchValue = ref('');
const list = ref<any[]>([]);
let hasMore = false;
let fl = ref(false);
let nt = null;
let pt = null;
function search(keywords?) {
  console.log(111, keywords);
  nt = null;
  pt = null;
  autoParts({ keywords, nt, pt })
    .then((res) => {
      fl.value = false;
      if (res.code !== CODE) return;
      list.value = [...res?.data?.list];
      pt = res?.data?.nt;
      nt = res?.data?.pt;
      hasMore = !!res?.data?.list?.length;
    })
    .catch(() => {
      fl.value = false;
    });
}
function goToDetail(item) {
  nrNavigateTo('partsDetail', { id: item.id });
}
function loadMore() {
  if (hasMore) {
    _loadMore();
  }
}
let isRefresh = ref(false);
function refresh(keywords = '') {
  nt = null;
  pt = null;
  isRefresh.value = true;
  autoParts({ keywords, nt, pt }).then((res) => {
    setTimeout(() => {
      isRefresh.value = false;
    }, 500);
    if (res.code !== CODE) return;
    list.value = [...res?.data?.list];
    pt = res?.data?.nt;
    nt = res?.data?.pt;
    hasMore = !!res?.data?.list?.length;
  });
}
function _loadMore(keywords = '') {
  autoParts({ keywords, nt, pt }).then((res) => {
    if (res.code !== CODE) return;
    list.value = [...list.value, ...res?.data?.list];
    pt = res?.data?.nt;
    nt = res?.data?.pt;
    hasMore = !!res?.data?.list?.length;
  });
}
onBeforeMount(() => {
  nt = null;
  pt = null;
  search();
});
</script>
