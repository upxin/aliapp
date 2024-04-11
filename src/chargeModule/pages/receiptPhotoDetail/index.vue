<template>
  <CustomBar class="fixed" background-color="#fff">
    <template #title>充电订单开发票</template>
  </CustomBar>
  <section
    class="fixed w-full h-24px bg-hex-F18A30 bg-opacity-14 text-10px leading-24px pl-16px text-normal text-opacity-46"
    :style="{ top: `${headerHeight}px` }"
  >
    近3个月以内的非充电币充电订单可选择单个或多个开电子发票。
  </section>
  <FullLoading :loading="fullLoading">
    <MainScroll
      :has-more="hasMore"
      bg="#fff"
      :pt="headerHeight + 24"
      :pb="100"
      :init-loading="initLg"
      :has-data="!!list?.length"
      @scroll-reach-bottom="loadMore"
      @end-pull-down="refresh"
    >
      <div class="overflow-y-auto">
        <main class="overflow-y-auto text-12px">
          <section
            v-for="(item, i) in list"
            :key="item.orderId"
            class="p-16px"
            :class="{
              'nr-border-b': list.length !== i + 1,
            }"
          >
            <div class="flex justify-between text-16px mb-16px">
              <span>沪ADD98</span>
            </div>

            <div class="flex items-center justify-between my-16px">
              <section class="flex items-center">
                <div class="opacity-48 text-14px">订单编号：</div>
                <span class="">{{ item.orderId }}</span>
                <span
                  class="text-primary icon iconfont icon-copy ml-8px"
                  @click="
                    () => {
                      copyText(item.orderId);
                    }
                  "
                ></span>
              </section>
              <aside>
                <NrzCheckBox
                  v-model:checked="item.checked"
                  color="#11264d"
                  borderColor="#11264d"
                  size="30rpx"
                >
                </NrzCheckBox>
              </aside>
            </div>

            <span class="flex items-center justify-between w-full">
              <section class="flex items-center">
                <span class="flex items-center text-danger mr-6px">
                  <div class="text-16px">
                    {{ formatThousands(item.price, 2) }}
                  </div>
                  <span class="text-12px">元</span>
                </span>
                <span class="">
                  <div class="flex bg-main rounded-4px p-6px">
                    <span class="mr-6px opacity-40">
                      电费：{{ formatThousands(23.56, 2) }}
                    </span>
                    <span class="opacity-40"
                      >服务费：{{ formatThousands(23.56, 2) }}</span
                    >
                  </div>
                </span>
              </section>
            </span>
          </section>
        </main>
      </div>
    </MainScroll>
    <div
      class="fixed bottom-0 w-full nrz-safe bg-fff"
      :style="{ 'box-shadow': '0px -2px 10px 0px rgba(0, 0, 0, 0.4)' }"
    >
      <div class="box-border flex items-center w-full px-16px h-62px text-12px">
        <NrzCheckBox
          v-model:checked="isAll"
          color="#11264d"
          borderColor="#11264d"
          size="30rpx"
          @change="chooseAll"
        >
          全选
        </NrzCheckBox>
        <section class="flex justify-center flex-1">
          <div class="flex flex-col items-center justify-center mr-6px">
            <span class="text-wallet mb-4px">{{ totalLen }}</span>
            <span class="opacity-40">已选订单数</span>
          </div>
          <div class="flex flex-col items-center justify-center">
            <span class="text-danger mb-4px">{{ totalPrice }}</span>
            <span class="opacity-40">开票总金额</span>
          </div>
        </section>
        <nut-button
          shape="square"
          class="border-0 w-100px text-fff bg-primary"
          @click="toStartInvoice"
        >
          开发票
        </nut-button>
      </div>
    </div>
  </FullLoading>
</template>
<script lang="ts" setup>
import NrzCheckBox from '@/components/nrz-checkbox/index.vue';

import MainScroll from '@/components/scroll-main/index.vue';
import { computed, onBeforeMount, ref, watch } from 'vue';
import CustomBar from '@/components/customHeader/index.vue';
import FullLoading from '@/components/full-loading/index.vue';
import { chargeOrderCanApllyInvoice } from '@/api/index';
import {
  CODE,
  copyText,
  formatThousands,
  navigateToPage,
  useToast,
} from '@/utils/index';
import { useHeaderHeight } from '@/hooks/index';
import { store } from '@/stores/index';

definePageConfig({ navigationStyle: 'custom' });

let pageNum = 1;
let pageSize = 20;
let list = ref<any[]>([]);
let isAll = ref(false);
let fullLoading = ref(false);
let hasMore = ref(false);
let initLg = ref(true);

let baseNumber = 10000000;
let checkedList = computed(() => {
  return list.value?.filter((k) => {
    return k?.checked;
  });
});
let totalPrice = computed(() => {
  let pce = checkedList.value?.reduce((p, c) => {
    return (p * baseNumber + c.price * baseNumber) / baseNumber;
  }, 0);
  return pce;
});
let totalLen = computed(() => {
  return checkedList.value?.length;
});

const { headerHeight } = useHeaderHeight();

function toStartInvoice() {
  if (!checkedList.value?.length) return useToast('请选择发票');
  store().setCheckedInvoice(checkedList.value.map((item) => item.orderId));
  navigateToPage({
    route: 'applyInvoice',
    params: {
      content: '充电服务',
      totalPrice: totalPrice.value,
    },
  });
}
function chooseAll(v) {
  list.value = list.value?.map((item) => {
    return {
      ...item,
      checked: v,
    };
  });
}
function regCheckList(data) {
  return data?.map((item) => {
    return {
      ...item,
      checked: false,
    };
  });
}
function _chargeOrder() {
  pageNum = 1;
  chargeOrderCanApllyInvoice({ pageNum, pageSize })
    .then((res) => {
      initLg.value = false;
      if (res.code !== CODE) return;
      list.value = regCheckList(res?.data?.list);
      pageNum = res.data?.nextPage == 0 ? pageNum : res.data?.nextPage;
      hasMore.value = Number(res.data?.pages) !== Number(res.data?.pageNum);
    })
    .catch(() => {
      initLg.value = false;
    });
}
function _chargeOrderMore() {
  chargeOrderCanApllyInvoice({ pageNum, pageSize }).then((res) => {
    if (res.code !== CODE) return;
    list.value = regCheckList([...list.value, ...res?.data?.list]);
    pageNum = res.data?.nextPage == 0 ? pageNum : res.data?.nextPage;
    hasMore.value = Number(res.data?.pages) !== Number(res.data?.pageNum);
  });
}
function loadMore() {
  if (hasMore.value) {
    _chargeOrderMore();
  }
}
function refresh() {
  _chargeOrderMore();
}
onBeforeMount(() => {
  _chargeOrder();
});

watch(
  () => totalLen.value,
  (v) => {
    if (v === list.value?.length) {
      isAll.value = true;
    } else {
      isAll.value = false;
    }
  }
);
// bottom
</script>
<style lang="scss">
page {
  background-color: #fff;
}
</style>
