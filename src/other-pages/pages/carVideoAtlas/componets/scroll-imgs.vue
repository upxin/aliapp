<template>
  <MainScroll
    :height="scrollH"
    :has-more="hasMore"
    :init-loading="initLg"
    :pt="0"
    @scroll-reach-bottom="loadMore"
    @end-pull-down="refresh"
  >
    <section id="fixed-taro" class="box-border w-full px-10px flex">
      <div class="flex-1">
        <div
          v-for="item in list?.slice(0, list?.length / 2)"
          :key="item.imgUrl"
          class="px-4px box-border"
        >
          <img
            :src="item.imgUrl || ''"
            class="w-full shadow-sm my-2px shadow-light-900"
            alt=""
            mode="widthFix"
            @click="
              () => {
                handleImg(item.imgUrl);
              }
            "
          />
        </div>
      </div>
      <section class="flex-1">
        <div
          v-for="item in list?.slice(list?.length / 2)"
          :key="item.imgUrl"
          class="px-4px flex-1 box-border"
        >
          <img
            :src="item.imgUrl || ''"
            class="w-full shadow-sm my-2px shadow-light-900"
            alt=""
            mode="widthFix"
            @click="
              () => {
                handleImg(item.imgUrl);
              }
            "
          />
        </div>
      </section>
    </section>
  </MainScroll>
</template>
<script lang="ts" setup>
import MainScroll from '@/components/scroll-main/index.vue';
import { onBeforeMount, ref, watch } from 'vue';
import { getVideos } from '@/api/index';
import { CODE } from '@/utils/index';

let nt: any = null;
let pt: any = null;
let list = ref<any[]>([]);
let hasMore = ref(false);
let initLg = ref(true);
interface Props {
  imgType: string | number;
  scrollH: string | number;
  carType: string | number;
}
let props = withDefaults(defineProps<Props>(), {
  imgType: 0,
  carType: 1,
  scrollH: 0,
});
let emits = defineEmits(['handleImg']);

function _getImgs() {
  let params: any = {
    vehType: props.carType === 1 ? 'ec1' : 'ic1',
    isVideo: 1, // 0代表视频，1代表图片
    imgType: props.imgType, // 0：外观，1：货箱，2：中控，3：细节
    nt: nt,
    pt: pt,
  };
  getVideos(params)
    .then((res) => {
      setTimeout(() => {
        initLg.value = false;
      }, 1000);
      if (res.code !== CODE) return;
      if (!res.data?.list) return;
      list.value = [...list.value, ...res.data?.list];
      nt = res.data.nt;
      pt = res.data.pt;
      hasMore.value = res.data?.list?.length == res.data?.pageSize;
    })
    .catch(() => {
      initLg.value = false;
    });
}
function handleImg(url) {
  emits('handleImg', url);
}

function loadMore() {
  if (hasMore.value) {
    console.log(hasMore.value);
    _getImgs();
  }
}
function refresh() {
  nt = null;
  pt = null;
  let params: any = {
    vehType: props.carType === 1 ? 'ec1' : 'ic1',
    isVideo: 1, // 0代表视频，1代表图片
    imgType: props.imgType, // 0：外观，1：货箱，2：中控，3：细节
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
  _getImgs();
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
