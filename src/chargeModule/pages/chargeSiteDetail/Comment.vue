<template>
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
  <div
    v-if="hasMore"
    class="text-center text-hex-aaa mt-20px"
    @click="toCommendList"
  >
    查看更多评论
  </div>
  <div v-if="!list.length" class="text-center text-hex-aaa py-20px">
    暂无评论
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue';
import { chargeCommentList } from '@/api/index';
import NrzImg from '@/components/img/img.vue';
import { CODE, navigateToPage, pageHasMore } from '@/utils';
let list = ref<any[]>([]);

interface Props {
  stationId: string;
}

let props = withDefaults(defineProps<Props>(), {
  stationId: '',
});
let hasMore = ref(false);
let pageNum = 1;
let pageSize = 20;
function _chargeCommentList(stationId) {
  chargeCommentList({ stationId, pageNum, pageSize }).then((res) => {
    if (res?.code == CODE) {
      list.value = res?.data?.list;
      hasMore.value = pageHasMore(res.data?.pages, res.data?.pageNum);
    }
  });
}

function toCommendList() {
  navigateToPage({
    route: 'commendList',
    params: {
      stationId: props?.stationId,
    },
  });
}
watch(
  () => props.stationId,
  (v) => {
    _chargeCommentList(v);
  }
);
</script>
