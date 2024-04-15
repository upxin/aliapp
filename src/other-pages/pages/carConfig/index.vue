<template>
  <FullLoading :loading="loading">
    <section class="flex flex-col hw">
      <CustomBar
        class="fixed"
        background-color="#fff"
        :bind-back="true"
        :border="false"
        position="relative"
        @back="backHome"
      >
        <template #title>{{ carConfig?.typeText }}</template>
      </CustomBar>

      <div
        class="w-full bg-fff"
        @click="
          () => {
            jGcustomCount(JG.BOOK_002);
          }
        "
      >
        <div style="width: 70%">
          <NrzTabs
            :tabs="tabsList"
            :current="state.currentTab"
            sliderBgColor="#11264d"
            selectedColor="#11264d"
            :sliderHeight="4"
            :unlined="true"
            @change="(v) => (state.currentTab = v.index)"
          ></NrzTabs>
        </div>
      </div>

      <div class="box-border flex-1 overflow-auto bg-fff">
        <div class="pt-30px">
          <!-- 组件v-show必须包一层标签否则有bug -->
          <div v-show="currentTabKey === 'color'">
            <Color :car-config="carConfig"></Color>
          </div>
          <div v-show="currentTabKey === 'box'">
            <Box :car-config="carConfig"></Box>
          </div>
          <div v-show="currentTabKey === 'optional'">
            <Parts :car-config="carConfig"></Parts>
          </div>
        </div>
        <div
          class="w-full text-center text-12px text-hex-000 opacity-36 mt-20px mb-40px"
        >
          车型配置及图片等信息仅供参考 具体以实车为准
        </div>
      </div>

      <div
        class="box-border flex justify-between w-full nrz-safe bg-hex-fff px-12px nr-shadow relative z-1"
      >
        <div class="flex justify-between w-full py-12px">
          <section class="h-20px">
            <div class="flex items-center" @click="state.showPrice = true">
              <div class="font-bold mr-4px">
                {{ formatThousands(totalPrice, 2) }}
              </div>
              <span
                class="icon-down iconfont text-16px font-bold"
                style="transform: rotateZ(180deg)"
              ></span>
            </div>
            <div class="flex items-center opacity-50 text-10px pt-6px">
              <span class="mr-4px pl-4px">已减去</span>
              <span>￥{{ formatThousands(extraMoney) }}</span>
            </div>
          </section>

          <section
            class="flex items-center justify-around px-8px w-108px h-39px leading-39px bg-primary"
            @click="handleStep"
          >
            <div class="text-light-50">
              {{ chooseText }}
            </div>
            <span
              class="iconfont icon-right h-20px text-light-50 text-size-24px leading-20px"
            ></span>
          </section>
        </div>
      </div>
    </section>
  </FullLoading>
  <NrzBtmPop v-model:show="state.showPrice">
    <OverViewChoosed></OverViewChoosed>
  </NrzBtmPop>
</template>
<script lang="ts">
import { onShareAppMessage, onShareTimeline } from '@/utils/index';
export default {
  onShareAppMessage,
  onShareTimeline,
};
</script>
<script lang="ts" setup>
import { reactive, ref, onMounted, computed, watch } from 'vue';
import Color from './components/out/index.vue';
import Parts from './components/parts/index.vue';
import Taro, { useRouter } from '@tarojs/taro';
import FullLoading from '@/components/full-loading/index.vue';
import NrzBtmPop from '@/components/nrz-bottom-popup/index.vue';

import {
  formatThousands,
  CODE,
  nrNavigateTo,
  jGcustomCount,
  JG,
  useToast,
  setStore,
  CAR_CONF,
} from '@/utils/index';
import { CarConf } from '@/stores/index';
import CustomBar from '@/components/customHeader/index.vue';
import OverViewChoosed from '@/other-pages/comp/OverViewChoosed/index.vue';
import { getCarConfig } from '@/api/index';
import NrzTabs from '@/components/nrz-tabs/index.vue';
import Box from './components/box/index.vue';

definePageConfig({
  transparentTitle: 'always',
  titlePenetrate: 'YES',
  defaultTitle: '',
});
const tabsList = computed<any[]>(() => {
  return carConfig.value?.config?.map((item) => {
    return {
      ...item,
    };
  });
});

const CarConfStore = CarConf();

const loading = ref(true);
const Params = useRouter().params;
const extraMoney = computed(() => {
  const extra =
    (CarConfStore.state.extra ?? []).reduce((p, c) => {
      const c1 = c?.price ?? 0;
      return p + c1 * 10000;
    }, 0) / 10000;
  return extra;
});

const totalPrice = computed(() => CarConfStore.state.amount);
const state = reactive({
  currentTab: 0,
  showPrice: false,
});
const currentTabKey = computed(() => {
  return tabsList?.value?.[state.currentTab]?.accessoryType;
});

const carConfig = ref<any>();
const backHome = () => {
  // goPages('index');
  Taro.navigateBack();
};

function saveCarConfLocal() {
  const optional = CarConfStore.state?.optional ?? [];
  const box = CarConfStore.state.box ? [CarConfStore.state.box] : []; // ec1 have no box
  const data = {
    type: CarConfStore.state.type,
    typeText: CarConfStore.state.typeText,
    amount: CarConfStore.state.amount,
    imgUrl: CarConfStore.state.imgUrl,
    extra: CarConfStore.state.extra,
    options: [CarConfStore.state.color, ...box, ...optional],
  };
  setStore(CAR_CONF, data);
}

const handleStep = () => {
  state.currentTab = state.currentTab + 1;
  if (state.currentTab === tabsList.value?.length) {
    nrNavigateTo('overview-parts');
    saveCarConfLocal();
    state.currentTab = state.currentTab - 1;
    return;
  }
};
const chooseText = computed(() => {
  return tabsList?.value?.[state.currentTab + 1]?.title ?? '预览配置';
});

function _getCarConfig(p) {
  getCarConfig(p)
    .then((res) => {
      loading.value = false;
      if (res.code !== CODE) {
        Taro.navigateBack({
          success() {
            useToast(res?.msg);
          },
        });
        return;
      }
      carConfig.value = res.data;
    })
    .catch(() => {
      loading.value = false;
    });
}
onMounted(() => {
  jGcustomCount(JG.BOOK_001);
  _getCarConfig({ type: Params.type?.toLowerCase() || 'ic1' });
});

watch(
  () => tabsList?.value,
  (v) => {
    console.log(v, 'tabsList');
  },
  { deep: true }
);
</script>

<style lang="scss">
.nr-shadow {
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.2);
}
</style>
