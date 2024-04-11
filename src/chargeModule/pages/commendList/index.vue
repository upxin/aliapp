<template>
  <CustomBar background-color="#fff"
    ><template #title>电站评论</template></CustomBar
  >
  <FullLoading :loading="fullLoading">
    <MainScroll
      :init-loading="initLg"
      :has-more="hasMore"
      @scroll-reach-bottom="loadMore"
      @end-pull-down="refresh"
    >
      <div class="overflow-y-auto">
        <div
          v-for="k in list"
          :key="k.userId"
          class="flex text-12px bg-fff px-14px nr-border-b py-20px"
        >
          <NrzImg
            only-img
            mode="scaleToFill"
            class="overflow-hidden rounded-full w-40px h-40px mr-10px"
            :url="k?.avatar"
          ></NrzImg>
          <section class="flex flex-col justify-between flex-1">
            <div class="flex justify-between">
              <span class="opacity-60">{{ k?.nickname }}</span>
              <span>{{ k?.createTime }}</span>
            </div>
            <div class="flex flex-wrap mt-10px">
              <span
                v-for="child in k?.commentList"
                :key="child"
                class="px-10px py-4px bg-main opacity-60 mr-10px mb-10px"
                >{{ child }}</span
              >
            </div>
          </section>
        </div>
      </div>
    </MainScroll>
  </FullLoading>
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
import { useRouter } from '@tarojs/taro';
import { CODE, pageHasMore } from '@/utils/index';
import { chargeCommentList } from '@/api/index';
import NrzImg from '@/components/img/img.vue';

definePageConfig({ transparentTitle: 'auto',titlePenetrate: 'YES',defaultTitle: '', });

let params = useRouter().params;
let initLg = ref(true);
let list = ref<any[]>([]);
let fullLoading = ref(false);

let hasMore = ref(false);
let pageNum = 2;
let pageSize = 20;
function _chargeCommentList() {
  chargeCommentList({ stationId: params?.stationId, pageNum, pageSize })
    .then((res) => {
      if (res?.code == CODE) {
        initLg.value = false;
        list.value = [...list.value, ...res?.data?.list];
        pageNum = res.data?.nextPage == 0 ? pageNum : res.data?.nextPage;
        hasMore.value = pageHasMore(res.data?.pages, res.data?.pageNum);
      }
    })
    .catch(() => {
      initLg.value = false;
    });
}
function loadMore() {
  _chargeCommentList();
}
function refresh() {
  pageNum = 2;
  list.value = [];
  setTimeout(() => {
    _chargeCommentList();
  }, 0);
}
onBeforeMount(() => {
  _chargeCommentList();
});
// bottom
</script>
