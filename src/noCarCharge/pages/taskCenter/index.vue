<template>
  <section class="w-full h-full">
    <MainScroll
      :pt="0"
      :has-more="hasMore"
      height="100%"
      :end-img="LOGO_IMG_BOTTOM"
      :refresher-enabled="false"
      :init-loading="initLoading"
    >
      <div class="overflow-y-auto">
        <div
          style="background-color: rgba(2, 115, 240, 0.8)"
          class="py-24px px-30px text-fff nrz-thin"
        >
          <view class="pb-12px">做任务赚积分</view>
          <view class="opacity-70 text-12px">
            新手任务和日常任务都可赚取积分
          </view>
        </div>
        <view v-for="item in list" :key="item.key">
          <view class="px-24px pb-10px pt-20px">{{ item.value }}</view>
          <Item
            v-for="child in item.data"
            :key="child.router"
            class="px-24px"
            :item="child"
            :type="item?.key"
            @tapItem="tapItem"
          ></Item>
        </view>
      </div>
    </MainScroll>
  </section>
  <Repair v-model:show="repairShow"></Repair>
</template>
<script lang="ts">
import { onShareAppMessage, onShareTimeline } from '@/utils/index';
export default {
  onShareAppMessage,
  onShareTimeline,
};
</script>
<script lang="ts" setup>
import MainScroll from '@/components/scroll-main/index.vue';
import { onMounted, ref } from 'vue';
import { getTaskList } from '@/api/index';
import { CODE, LOGO_IMG_BOTTOM, nrNavigateTo } from '@/utils/index';
import Item from './Item.vue';
import Repair from '@/components/repair/index.vue';
import Taro from '@tarojs/taro';
definePageConfig({
  navigationStyle: 'custom',
  navigationBarTitleText: '任务中心',
});

let repairShow = ref(false);
let list = ref<any[]>([]);
let hasMore = ref(false);
let initLoading = ref(false);
function tapItem(route: string) {
  if (route.includes('selectMr')) {
    repairShow.value = true;
    return;
  }
  if (route?.includes('messageTipDialog')) {
    let msg = route?.split('msg=')[1];
    Taro.showModal({
      title: '提示',
      content: msg,
      confirmColor: '#cc463d',
    });
    return;
  }
  nrNavigateTo(route);
}
onMounted(() => {
  console.log(9999);
  getTaskList().then((res) => {
    if (res?.code === CODE) {
      list.value = res?.data;
    }
  });
});
// bottom
</script>
<style lang="scss">
page {
  background-color: #fff;
}
.wrapper {
  display: flex;
  height: 100%;
  align-items: center;
  flex-direction: column;
  overflow: hidden;
  justify-content: center;
  .content {
    display: flex;
    flex-direction: column;
    width: 240px;
    height: 360px;
    background: #fff;
    border-radius: 8px;
    overflow: hidden;
    align-items: center;
  }
}

.arc {
  width: 110%;
  height: 60px;
  background: #fff;
  border-radius: 0 0 100% 100%;
  margin-bottom: 40px;
  line-height: 60px;
}
</style>
