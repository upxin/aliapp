<template>
  <FullLoading :loading="loading">
    <div
      v-for="item in list"
      :key="item.id"
      class="flex items-center justify-between pl-15px pr-5px py-20px nr-border-b"
    >
      <div
        class="flex-1"
        @click="
          () => {
            choose_addr(item);
          }
        "
      >
        <div class="mb-10px text-12px opacity-80">
          {{ `${item.province}${item.city}${item.district}` }}
        </div>
        <div class="font-bold text-16px my-8px">{{ item.address }}</div>
        <div class="flex items-center">
          <span class="mr-8px opacity-80">{{ item.name }}</span>
          <span class="opacity-50 mr-8px">{{ item?.contact }}</span>
          <span
            v-show="item?.is_default == '1'"
            class="border-solid rounded p-6px text-info border-1px border-info text-10px"
            >默认</span
          >
        </div>
      </div>
      <div class="flex items-center justify-center w-40px h-40px">
        <span
          class="icon-edit iconfont text-20px text-second"
          @click="
            () => {
              handle_edit(item);
            }
          "
        ></span>
      </div>
    </div>
    <div class="h-80px"></div>
    <div class="box-border fixed bottom-0 w-full px-40px py-20px">
      <nut-button color="#11264d" shape="square" class="w-full" @click="goAddr"
        >添加收货地址</nut-button
      >
      <div class="nrz-safe"></div>
    </div>
  </FullLoading>
</template>
<script lang="ts" setup>
//
import { useNavigateBackSetData, useRequest } from '@/hooks/index';
import { nrNavigateTo } from '@/utils/index';
import { get_addr_list } from '@/api/mall';
import FullLoading from '@/components/full-loading/index.vue';
import { useDidShow, usePullDownRefresh } from '@tarojs/taro';
definePageConfig({
  navigationBarTitleText: '我的收货地址',
});
let {
  data: list,
  loading,
  run: _get_addr_list,
} = useRequest(get_addr_list, {
  immediate: false,
});
let choose_addr = (item) => {
  useNavigateBackSetData({
    addrInfo: item,
  });
};

let handle_edit = ({
  name,
  city,
  address,
  contact,
  district,
  province,
  is_default,
  adcode,
  adcode1,
  adcode2,
  id,
}) => {
  nrNavigateTo('mallReceiveAddressEdit', {
    name,
    city,
    address,
    contact,
    district,
    province,
    is_default,
    id,
    adcode,
    adcode1: adcode1 ?? '',
    adcode2: adcode2 ?? '',
  });
};
function goAddr() {
  nrNavigateTo('mallReceiveAddressEdit', { title: '添加收货地址' });
}
useDidShow(() => {
  _get_addr_list();
});
usePullDownRefresh(() => {
  _get_addr_list();
});
</script>
<style>
page {
  background-color: #fff;
}
</style>
