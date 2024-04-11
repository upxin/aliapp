<template>
  <CustomHeader title="我的发票抬头"> </CustomHeader>
  <div :style="{ paddingTop: `${headerHeight}px` }">
    <section
      class="box-border flex items-center w-full h-62px pl-20px bg-fff mb-20px"
      @click="toAddTitle"
    >
      <span class="invoice-title">
        <span class="iconfont icon-jia text-8px"></span>
      </span>
      <span class="ml-14px">添加发票抬头</span>
    </section>

    <section
      v-for="k in list"
      :key="k?.id"
      class="box-border flex items-center justify-between w-full py-18px bg-fff px-20px nr-border-b"
      @click="
        () => {
          choosTitle(k);
        }
      "
    >
      <section>
        <div class="flex items-center">{{ k?.invoiceTitle }}</div>
        <div class="mt-10px opacity-40 text-12px">
          {{ titleTypeMap[k?.titleType] }}
        </div>
      </section>
      <div
        v-if="params.edit == '1'"
        class="flex items-center justify-center w-40px h-40px"
      >
        <span class="iconfont icon-arrow-right-bold"></span>
      </div>
    </section>
  </div>
</template>
<script lang="ts" setup>
//
import CustomHeader from '@/components/customHeader/index.vue';

import { useHeaderHeight, useNavigateBackSetData } from '@/hooks/index';
import { navigateToPage, SET_INVOICE_TITLE } from '@/utils';
import { useDidShow, useRouter } from '@tarojs/taro';
import { getInvoiceList } from '@/api/invoice';
import { onBeforeMount, ref } from 'vue';

definePageConfig({
 transparentTitle: 'auto',
  titlePenetrate: 'YES',
  defaultTitle: '',});

let titleTypeMap = {
  1: '个人',
  2: '单位',
};
let { params } = useRouter();
const { headerHeight } = useHeaderHeight();
let list = ref<any[]>();
function toAddTitle() {
  navigateToPage({
    route: 'addInvoiceTitle',
  });
}
function _getInvoiceList() {
  getInvoiceList({}).then((res) => {
    list.value = res.data?.list;
  });
}
function choosTitle(k) {
  if (params.edit == '1') {
    navigateToPage({
      route: 'editInvoiceTitle',
      params: k,
    });
    return;
  }
  useNavigateBackSetData({ [SET_INVOICE_TITLE]: k });
}
useDidShow(() => {
  _getInvoiceList();
});
</script>
<style>
.invoice-title {
  border: 2px solid #101010;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-weight: bolder;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
}
.invoice-tag {
  border: 1px solid #f18a30;
  color: #f18a30;
  padding: 2px 4px;
}
</style>
