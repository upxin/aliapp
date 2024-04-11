<template>
  <CustomBar class="fixed" background-color="#fff"
    ><template #title>交车确认</template></CustomBar
  >
  <FullLoading :loading="fullLoading">
    <MainScroll
      :init-loading="fullLoading"
      :has-more="hasMore"
      :has-data="!!list?.length"
      ><div class="overflow-y-auto nrz-safe">
        <div
          v-for="item in list"
          :key="item?.type"
          class="box-border flex items-center justify-between bg-hex-fff pt-26px pb-21px h-125px px-18px text-14px text-normal"
          @click="
            () => {
              handleOver(item?.router);
            }
          "
        >
          <section class="flex flex-col">
            <div class="pb-18px">{{ item?.title }}</div>
            <div class="text-12px pb-6px text-hex-555 text-opacity-60">
              确认渠道：{{ item?.platform }}
            </div>
            <div class="text-12px text-hex-555 text-opacity-60">
              确认时间：{{ item?.confirm_time }}
            </div>
          </section>
          <div class="text-12px text-hex-555 text-opacity-60">{{ '>>' }}</div>
        </div>
      </div>
    </MainScroll>
  </FullLoading>
</template>

<script lang="ts">
import { onShareAppMessage, onShareTimeline } from '@/utils/index';
import { useRouter } from '@tarojs/taro';
export default {
  onShareAppMessage,
  onShareTimeline,
};
</script>

<script lang="ts" setup>
import MainScroll from '@/components/scroll-main/index.vue';
import { onBeforeMount, ref } from 'vue';
import CustomBar from '@/components/customHeader/index.vue';
import { deliverProcessList } from '@/api/index';
import { CODE, nrNavigateTo } from '@/utils/index';
import FullLoading from '@/components/full-loading/index.vue';

definePageConfig({ transparentTitle: 'always',titlePenetrate: 'YES',defaultTitle: '', });

// let TYPE_MAP = {
//   1: '《前晨汽车交付流程》',
//   2: '《前晨汽车使用说明书》',
//   3: '《前晨汽车危险告知书》',
// };
let list = ref<any[]>([]);
let nt = null;
let pt = null;
let hasMore = ref(false);
let fullLoading = ref(true);

async function _deliverProcessList(type) {
  const { data, code } = await deliverProcessList({ nt, pt });
  fullLoading.value = false;
  if (code !== CODE) return;
  list.value = [...data?.list].filter((k) => k?.type == type);
}
function handleOver(route) {
  nrNavigateTo(route);
}

onBeforeMount(() => {
  let params = useRouter().params;
  let type = params?.type;
  _deliverProcessList(type);
  setTimeout(() => {
    fullLoading.value = false;
  }, 3000);
});
// bottom
</script>
