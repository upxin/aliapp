<template>
  <Loading :loading="loading">
    <div
      v-for="(item, i) in steps"
      :key="item.time"
      class="box-border flex w-full px-14px py-10px"
    >
      <div class="flex flex-col items-center px-10px">
        <div class="rounded-full w-10px h-10px bg-second"></div>
        <div
          v-if="i != steps?.length - 1"
          class="flex-1 w-1px bg-second mt-4px"
        ></div>
      </div>
      <div class="flex-1 pb-20px">
        <div class="opacity-60 text-12px mb-4px">{{ item?.time }}</div>
        <div v-if="!getPhone(item?.status)">
          {{ item?.status }}
        </div>
        <div v-else>
          {{ regText(item?.status)?.[0] }}
          <span
            class="inline-block text-blue-500"
            @click="
              () => {
                handleInfo(item?.status);
              }
            "
            >{{ getPhone(item?.status) }}</span
          >
          {{ regText(item?.status)?.[1] }}
        </div>
      </div>
    </div>
    <div class="nrz-safe"></div>
  </Loading>
</template>
<script lang="ts" setup>
import { mallExpressInfo } from '@/api/index';
import { useRequest } from '@/hooks';
import { useRouter } from '@tarojs/taro';
import Loading from '@/components/full-loading/index.vue';
import { makePhoneCall } from '@/utils/index';
import { computed } from 'vue';

let route = useRouter().params;
let { initLoading: loading, data } = useRequest(mallExpressInfo, {
  immediate: true,
  params: {
    no: route?.logisticsNumber,
    type: route?.type,
  },
});
let steps = computed(() => {
  return data?.value?.result?.list;
});
function getPhone(info) {
  let regExp = /(\d{1,}-{0,}\d{1,})/;
  let phone = regExp.exec(info)?.[0];
  return phone;
}

function handleInfo(info) {
  let phone = getPhone(info);
  if (phone) {
    makePhoneCall(phone);
  }
}

function regText(info) {
  let phone = getPhone(info);
  let text = info.split(phone);
  return text;
}
</script>
