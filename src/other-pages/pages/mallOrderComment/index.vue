<template>
  <CustomBar background-color="#fff"
    ><template #title>商品评论</template></CustomBar
  >
  <MainScroll
    :has-more="hasMore"
    :init-loading="initLg"
    @scroll-reach-bottom="loadMore"
    @end-pull-down="refresh"
  >
    <div class="overflow-y-auto">
      <div
        v-for="k in list"
        :key="k.userId"
        class="text-12px bg-fff px-14px nr-border-b py-20px"
      >
        <div class="flex">
          <NrzImg
            only-img
            mode="scaleToFill"
            class="overflow-hidden rounded-full w-40px h-40px mr-10px"
            :url="k?.avatar"
          ></NrzImg>
          <section class="flex flex-col justify-between flex-1">
            <span>{{ k?.username }}</span>
            <span class="opacity-60 text-16px">{{ k?.commentTime }}</span>
          </section>
        </div>
        <div class="py-10px">
          <nut-rate
            active-color="#FFC800"
            :model-value="k?.commentScore"
            readonly
          />
        </div>
      </div>
    </div>
  </MainScroll>
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
import Taro, { useRouter } from '@tarojs/taro';
import { useHeaderHeight } from '@/hooks/index';
import { getCommentList } from '@/api/index';
import NrzImg from '@/components/img/img.vue';

definePageConfig({ navigationStyle: 'custom' });

let params = useRouter().params;

let list = ref<any[]>([]);
let initLg = ref(true);
let hasMore = ref(false);
let pageNum = 1;
let pageSize = 20;
function _getCommentList(more?) {
  getCommentList({ spuId: params?.spuId, pageSize, pageNum })
    .then((res) => {
      initLg.value = false;
      if (res.code !== 200) return;
      if (more) {
        list.value = [...list.value, ...res?.data?.list];
      } else {
        list.value = res?.data?.list;
      }
      hasMore.value = res?.data?.total > pageNum * pageSize;
      pageNum = pageNum + 1;
    })
    .catch(() => {
      initLg.value = false;
    });
}
async function refresh(finished?) {
  pageNum = 1;
  await _getCommentList();
  finished && finished();
}
function loadMore() {
  if (hasMore.value) {
    _getCommentList(true);
  }
}
onBeforeMount(() => {
  refresh();
});
// bottom
</script>
