<template>
  <CustomBar :pad-x="80" background-color="#fff" :border="false">
    <template #title>
      <div
        class="flex items-center justify-between border border-solid text-12px leading-28px h-28px border-primary"
      >
        <div
          class="flex-1 h-full text-center px-10px"
          :class="{
            'bg-primary': type === 1,
            'text-light-50': type === 1,
          }"
          @click="
            () => {
              changeType(1);
            }
          "
        >
          常去电站
        </div>
        <div
          class="flex-1 h-full text-center px-10px"
          :class="{
            'bg-primary': type === 2,
            'text-light-50': type === 2,
          }"
          @click="
            () => {
              changeType(2);
            }
          "
        >
          收藏电站
        </div>
      </div>
    </template>
  </CustomBar>
  <MainScroll
    loading-pos="bottom"
    :has-more="hasMore"
    :init-loading="initl"
    :has-data="!!list?.length"
    :placeholder-empty="placeholderEmpty"
    @scroll-reach-bottom="loadMore"
    @end-pull-down="refresh"
  >
    <div class="overflow-y-auto">
      <section class="px-14px pt-16px">
        <ChargeListItem :list="list || []"> </ChargeListItem>
      </section>
    </div>
  </MainScroll>
</template>
<script lang="ts" setup>
import MainScroll from '@/components/scroll-main/index.vue';
import { onBeforeMount, ref, computed } from 'vue';
import CustomBar from '@/components/customHeader/index.vue';
import ChargeListItem from '../../components/chargeListItem/ChargeListItem.vue';

import { store } from '@/stores/index';
import { collectStationList } from '@/api/index';
import { CODE, pageHasMore } from '@/utils/index';

import Taro, { useRouter } from '@tarojs/taro';

definePageConfig({ navigationStyle: 'custom' });
let list = ref<any[]>([]);
const searchKey = ref('');
const initl = ref(true);
let type = ref(1);
let hasMore = ref(false);
let pageNum = 1;
let pageSize = 20;
let longitude: any = store().cityInfo?.longitude;
let latitude: any = store().cityInfo?.latitude;

const placeholderEmpty = computed(() => !searchKey.value);

function _queryEvaluation() {
  collectStationList({
    stationType: type.value,
    pageSize,
    pageNum,
    latitude,
    longitude,
  }).then((res) => {
    if (res?.code == CODE) {
      setTimeout(() => {
        initl.value = false;
      }, 1000);
      if (!list.value) return;
      list.value = [...list.value, ...res?.data?.list];
      pageNum = res.data?.nextPage == 0 ? pageNum : res.data?.nextPage;
      hasMore.value = pageHasMore(res.data?.pages, res.data?.pageNum);
    }
  });
}
function _initQqueryEvaluation() {
  collectStationList({
    stationType: type.value,
    pageSize,
    pageNum,
    latitude,
    longitude,
  }).then((res) => {
    setTimeout(() => {
      initl.value = false;
    }, 1000);
    if (res?.code == CODE) {
      if (!list.value) return;
      list.value = [...res?.data?.list];
      pageNum = res.data?.nextPage == 0 ? pageNum : res.data?.nextPage;
      hasMore.value = pageHasMore(res.data?.pages, res.data?.pageNum);
    }
  });
}
function changeType(v) {
  type.value = v;
  initl.value = true;

  refresh();
}
function loadMore() {
  _queryEvaluation();
}
function refresh() {
  pageNum = 1;
  _initQqueryEvaluation();
}
onBeforeMount(() => {
  let params = useRouter().params;
  if (params?.type) {
    type.value = Number(params.type);
  }
  setTimeout(() => {
    _initQqueryEvaluation();
  }, 0);
});
// bottom
</script>

<style lang="scss">
.nr-shadow {
  box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.4);
}
</style>
