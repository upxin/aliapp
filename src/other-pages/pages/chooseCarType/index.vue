<script lang="ts" setup>
import { onBeforeMount, ref } from 'vue';
import FullLoading from '@/components/full-loading/index.vue';
import Header from '@/components/customHeader/index.vue';
import LazyImg from '@/components/nrz-img/index.vue';
import { nrNavigateTo, CODE } from '@/utils';
import { getCarTypeList } from '@/api/index';

definePageConfig({
  titlePenetrate: 'YES',
  defaultTitle: '',
  transparentTitle: 'auto',
});

interface Cars {
  benefitDescUrl: string;
  imgUrl: string;
  intro: string;
  name: string;
  price: number;
  router: string;
  type: string;
}

function handleCarType(router) {
  nrNavigateTo(router);
}
const loading = ref(false);
const carList = ref<Cars[]>([]);
function _getCarTypeList() {
  // 车列表
  getCarTypeList({}).then((res) => {
    if (res.code !== CODE) return;
    carList.value = res.data.vehicleTypes;
  });
}

onBeforeMount(() => {
  _getCarTypeList();
});
</script>
<template>
  <FullLoading :loading="loading">
    <section class="flex flex-col hw">
      <Header position="unset"><template #title> 所有车系 </template></Header>

      <section class="px-20px box-border">
        <view
          v-for="item in carList"
          :key="item.type"
          class="bg-fleet pl-20px pr-10px overflow-auto mt-20px"
          @click="handleCarType(item.router)"
        >
          <view class="text-28px mt-11px font-bold mb-5px h-40px leading-40px">
            {{ item.name }}
          </view>
          <view class="flex justify-between">
            <view class="nrz-thin text-14px flex-1">{{ item.intro }}</view>
            <LazyImg
              :src="item.imgUrl"
              :width="`${178 * 2}rpx`"
              :height="`${109 * 2}rpx`"
              mode="aspectFit"
            />
          </view>
          <LazyImg
            v-if="item.benefitDescUrl"
            :src="item.benefitDescUrl"
            class="w-full"
            width="100%"
            height="auto"
          />
        </view>
      </section>
    </section>
  </FullLoading>
</template>
<style>
page {
  background-color: #fff;
}
</style>
