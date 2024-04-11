<template>
  <MainScroll
    :height="scrollH"
    :has-more="hasMore"
    :init-loading="initLg"
    :pt="0"
    @scroll-reach-bottom="loadMore"
    @end-pull-down="refresh"
  >
    <div class="flex flex-col items-center">
      <div
        class="relative w-full h-200px px-10px"
        @click="
          () => {
            handleVideo(list?.[0]);
          }
        "
      >
        <img class="w-full h-full" :src="list?.[0]?.imgUrl" />
        <span
          class="iconfont icon-list-start text-fff absolute center text-40px"
        ></span>
      </div>
      <div class="my-20px">更多</div>
      <section class="box-border flex flex-wrap w-full px-10px">
        <div
          v-for="item in list?.slice(1)"
          :key="item?.imgUrl"
          class="box-border shadow-sm shadow-light-900 w-1_2 p-2px"
        >
          <div class="w-full h-120px">
            <div
              class="relative w-full h-full"
              @click="
                () => {
                  handleVideo(item);
                }
              "
            >
              <img class="w-full h-full" :src="item?.imgUrl || ''" />
              <span
                class="iconfont icon-list-start text-fff absolute center text-40px"
              ></span>
            </div>
          </div>
        </div>
      </section>
    </div>
  </MainScroll>
</template>
<script lang="ts" setup>
import MainScroll from '@/components/scroll-main/index.vue';
import { onBeforeMount, ref, watch } from 'vue';
import { getVideos } from '@/api/index';
import { CODE } from '@/utils/index';

let nt = null;
let pt = null;
let list = ref<any[]>([]);
let hasMore = ref(false);
let initLg = ref(true);

interface Props {
  scrollH: string | number;
  carType: string | number;
}
let props = withDefaults(defineProps<Props>(), {
  carType: 1,
  scrollH: 0,
});
let emits = defineEmits(['handleVideo']);

function _getVideos() {
  let params: any = {
    vehType: props.carType === 1 ? 'ec1' : 'ic1',
    isVideo: 0, // 0代表视频，1代表图片
    // imgType: '', // 0：外观，1：货箱，2：中控，3：细节
    nt: nt,
    pt: pt,
  };
  getVideos(params)
    .then((res) => {
      initLg.value = false;
      if (res.code !== CODE) return;
      if (res.data?.list && !res.data?.list?.length) return;
      list.value = [...list.value, ...res.data?.list];
      nt = res.data.nt;
      pt = res.data.pt;
      hasMore.value = res.data?.list?.length == res.data?.pageSize;
    })
    .catch(() => {
      initLg.value = false;
    });
}
function handleVideo(url) {
  emits('handleVideo', url);
}
function loadMore() {
  if (hasMore.value) {
    _getVideos();
  }
}

function refresh() {
  nt = null;
  pt = null;
  let params: any = {
    vehType: props.carType === 1 ? 'ec1' : 'ic1',
    isVideo: 0, // 0代表视频，1代表图片
    // imgType: props.imgType, // 0：外观，1：货箱，2：中控，3：细节
    nt: nt,
    pt: pt,
  };

  getVideos(params).then((res) => {
    if (res.code !== CODE) return;
    if (res.data?.list && !res.data?.list?.length) return;
    list.value = [...res.data?.list];
    nt = res.data.nt;
    pt = res.data.pt;
    hasMore.value = res.data?.list?.length == res.data?.pageSize;
  });
}
onBeforeMount(() => {
  nt = null;
  pt = null;
  _getVideos();
});

watch(
  () => props.carType,
  () => {
    setTimeout(() => {
      refresh();
    }, 0);
  }
);
// bottom
</script>
