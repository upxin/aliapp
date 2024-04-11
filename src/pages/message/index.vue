<template>
  <custom-bar :show-icon="false" background-color="#fff">
    <template #title>消息</template>
  </custom-bar>
  <div
    v-if="showLogin"
    style="z-index: 99999"
    class="fixed top-0 left-0 w-full h-full"
  >
    <Login @success="refresh" @back="closeLogin"></Login>
  </div>
  <template v-else>
    <MainScroll
      ref="MainScrollRef"
      :has-data="!!list?.length"
      :init-loading="initLoading"
      :has-more="hasMore"
      @scroll-reach-bottom="loadMore"
      @end-pull-down="refresh"
    >
      <section class="overflow-auto">
        <div
          v-for="(item, index) in list"
          :key="index"
          :class="{ 'nr-border-b': index < list?.length - 1 }"
          class="flex items-center px-14px bg-hex-fff py-20px"
          @click="
            () => {
              handelMsg(item);
            }
          "
        >
          <div class="text-normal mr-10px">
            <NrImg :url="item?.imgUrl" class="w-50px h-50px"></NrImg>
          </div>
          <div class="text-normal">
            <div class="leading-normal break-words break-all text-14px">
              {{ item?.title }}
            </div>
            <div v-if="item.type === 1" class="mt-8px text-12px opacity-62">
              {{ item?.time }}
            </div>
            <div v-else class="flex justify-between mt-10px">
              <div class="mt-8px text-12px min-w-140px opacity-62">
                {{ item?.time }}
              </div>
              <span class="flex justify-end flex-1">
                <nut-button
                  v-if="item?.type != 3"
                  class="h-30px w-70px text-primary border-primary"
                  @click="
                    () => {
                      _agree(item, 2);
                    }
                  "
                  >拒绝</nut-button
                >
                <nut-button
                  class="h-30px w-70px ml-10px border-info text-info"
                  @click="
                    () => {
                      _agree(item, 1);
                    }
                  "
                  >同意</nut-button
                >
              </span>
            </div>
          </div>
        </div>
      </section>
    </MainScroll>
  </template>
</template>
<!-- <script lang="ts">
import { onShareAppMessage, onShareTimeline } from '@/utils/index';
export default {
  onShareAppMessage,
  onShareTimeline,
};
</script> -->
<script lang="ts" setup>
import { ref } from 'vue';
import {
  CODE,
  getStore,
  USER_INFO,
  goPages,
  nrNavigateTo,
  regErr,
  sleep,
  jGcustomCount,
  JG,
  BTN_SHARE,
} from '@/utils/index';
import {
  useDidShow,
  useReady,
  useShareAppMessage,
  useRouter,
} from '@tarojs/taro';
import CustomBar from '@/components/customHeader/index.vue';
import Login from '@/components/login/index.vue';
import { getMessage, agree } from '@/api/index';
import MainScroll from '@/components/scroll-main/index.vue';
import NrImg from '@/components/img/img.vue';

useShareAppMessage(() => {
  return {
    title: '前晨汽车 智能网联商用车引领者',
    path: `/pages/index/index`,
    imageUrl: BTN_SHARE,
  };
});

definePageConfig({
  transparentTitle: 'always',
  titlePenetrate: 'YES',
  defaultTitle: '',
  enableShareAppMessage: true,
});
let router = useRouter();
let errorMsg = ref('');

let initLoading = ref(true);
let MainScrollRef = ref<any>(null);
let showLogin = ref(true);
let list = ref<any[]>([]);
let nt = null;
let pt = null;
let hasMore = ref(false);

function closeLogin() {
  showLogin.value = false;
  goPages('index');
}
function handelMsg({ router }) {
  if (!router || router == 'null') return;
  jGcustomCount(JG.MSG_002);
  nrNavigateTo(router);
}
function _getMessage() {
  let member_id = getStore(USER_INFO)?.member_id;
  if (!member_id) {
    showLogin.value = true;
    return;
  }
  getMessage({ member_id, nt, pt }).then((res) => {
    if (res.code !== CODE) return;
    list.value = [...list.value, ...res.data?.list];
    hasMore.value = res.data?.list?.length == res.data?.pageSize;
    nt = res.data.nt;
    pt = res.data.pt;
  });
}

function _agree({ id, type }, status) {
  nt = null;
  pt = null;
  agree({ id, type, status }).then((res) => {
    jGcustomCount(JG.MSG_001);
    if (res.code === CODE) {
      list.value = [];
      setTimeout(() => {
        _getMessage();
      }, 0);
    }
  });
}

function loadMore() {
  if (hasMore.value) {
    _getMessage();
  }
}

async function refresh(done?) {
  let member_id = getStore(USER_INFO)?.member_id;
  if (!member_id) return;
  showLogin.value = false;
  await sleep(1000);
  getMessage({ member_id, nt: null, pt: null })
    .then((res) => {
      initLoading.value = false;
      done && done();
      if (res.code !== CODE) return;
      list.value = [...res.data?.list];
      hasMore.value = res.data?.list?.length == res.data?.pageSize;
      nt = res.data.nt;
      pt = res.data.pt;
    })
    .catch((err) => {
      done && done();
      initLoading.value = false;
      errorMsg.value = regErr(err);
    });
}
useReady(() => {
  console.log('router', router);
  refresh();
});

let first = true;
useDidShow(() => {
  nt = null;
  pt = null;
  let member_id = getStore(USER_INFO)?.member_id;
  if (!member_id) {
    showLogin.value = true;
    return;
  } else {
    showLogin.value = false;
  }

  if (first) {
    first = false;
    return;
  }

  MainScrollRef?.value?.scrollToTop?.();
});
</script>
<style>
page {
  background-color: #fff;
}
</style>
