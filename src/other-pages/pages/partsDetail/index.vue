<template>
  <CustomBar class="fixed" background-color="#fff"
    ><template #title>{{ parts }}</template></CustomBar
  >
  <Full :loading="floading">
    <div
      :style="{ paddingTop: `${CalcPt}px` }"
      class="box-border h-full overflow-y-auto bg-hex-f5f5f5 pb-90px"
    >
      <swiper
        :indicator-dots="true"
        :circular="true"
        indicator-color="#426543"
        class="h-280px"
      >
        <swiper-item v-for="img in detail?.imgUrls" :key="img">
          <NrImg :url="img" class="w-full h-280px" />
        </swiper-item>
      </swiper>
      <section
        class="leading-normal py-16px px-16px mt-23px text-normal my-8px text-12px bg-hex-fff"
      >
        <div class="flex items-center mb-14px">
          <span class="opacity-62">订单编号：</span>
          <div>{{ detail?.name }}</div>
        </div>
        <div class="flex items-center mb-14px">
          <span class="opacity-62">配件价格：</span>
          <div class="text-red-500">
            ￥{{ formatThousands(detail?.price, 2) }}
          </div>
        </div>
        <div class="flex items-center mb-14px">
          <span class="opacity-62">适用车型：</span>
          <div>{{ detail?.vehicles.join('、') }}</div>
        </div>
        <div class="flex items-center mb-14px">
          <span class="opacity-62">零件号：</span>
          <div>{{ detail?.id }}</div>
        </div>
        <div class="flex items-start">
          <span class="opacity-62">配件描述：</span>
          <div class="flex-1">
            {{ detail?.intro }}
          </div>
        </div>
      </section>
      <div
        class="fixed bottom-0 flex justify-between w-full drop-shadow-lg shadow-gray-600 nrz-safe h-50px bg-hex-fff shadow-top"
      >
        <NrzBtn
          class="flex-1 h-full"
          plain
          @click="
            () => {
              makePhoneCall(NEWRIZON_TEL);
            }
          "
        >
          <div class="flex items-center justify-center">
            <span class="iconfont icon-phone text-primary"></span>
            <div class="h-20px leading-20px ml-10px">客服电话</div>
          </div>
        </NrzBtn>
        <div class="h-full bg-gray-300 w-1px"></div>
        <NrzBtn plain class="flex-1 h-full" @click="inLineServer">
          <div class="flex items-center justify-center animate-flip">
            <span class="iconfont icon-message"></span>
            <div class="h-20px leading-20px ml-10px">在线客服</div>
          </div>
        </NrzBtn>
      </div>
    </div>
  </Full>
</template>

<script lang="ts">
import { onShareAppMessage, onShareTimeline } from '@/utils/index';
export default {
  onShareAppMessage,
  onShareTimeline,
};
</script>

<script lang="ts" setup>
import { onBeforeMount, ref, computed } from 'vue';
import CustomBar from '@/components/customHeader/index.vue';
import { systemInfo } from '@/stores/systemInfo';
import { useRouter } from '@tarojs/taro';
import {
  formatThousands,
  makePhoneCall,
  onlineKefu,
  CODE,
  NEWRIZON_TEL,
} from '@/utils/index';
import { getPartsDetail } from '@/api/index';
import NrImg from '@/components/img/img.vue';
import Full from '@/components/full-loading/index.vue';
import NrzBtn from '@/components/nrz-button/index.vue';

definePageConfig({ transparentTitle: 'auto',titlePenetrate: 'YES',defaultTitle: '', });
const parts = ref('零配件详情');
let detail = ref();
let floading = ref(true);
let CalcPt = computed(
  () => systemInfo().RightBtnRect.h + systemInfo().RightBtnRect.t + 10
);
function inLineServer() {
  onlineKefu();
}
onBeforeMount(() => {
  getPartsDetail({ id: useRouter().params?.id })
    .then((res) => {
      floading.value = false;
      if (res.code === CODE) {
        detail.value = res.data;
      }
    })
    .catch(() => {
      floading.value = false;
    });
});
</script>
