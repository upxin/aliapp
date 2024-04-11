<template>
  <div class="pt-10px">
    <Item
      v-for="{ id, text, border, mb, imgUrl } in list"
      :key="id"
      :img-url="imgUrl"
      icon-size="22"
      :text="text"
      :class="{ 'nr-border-b': border, 'mb-10px': mb }"
      @click="
        () => {
          handlItem(id);
        }
      "
    ></Item>
  </div>
  <section class="flex justify-center my-24px px-32px">
    <nut-button
      class="w-full border-0 rounded-md h-56px"
      color="#11264d"
      @click="logout"
    >
      <span class="text-14px">退出登录</span>
    </nut-button>
  </section>
</template>
<script lang="ts">
import { onShareAppMessage, onShareTimeline } from '@/utils/index';
import { useModal } from '@/hooks';
import { homeStore } from '@/stores';
export default {
  onShareAppMessage,
  onShareTimeline,
};
</script>
<script lang="ts" setup>
import Taro from '@tarojs/taro';
import { offMember } from '@/api/index';
import {
  setStore,
  USER_INFO,
  OBU_USER,
  nrNavigateTo,
  onlineKefu,
  WEBVIEW_PREFIX,
} from '@/utils/index';
import Item from './item.vue';
import { list } from './index';
definePageConfig({
  navigationStyle: 'default',
  navigationBarTitleText: '设置',
});
// bottom
const HomeStore = homeStore();
function logout() {
  useModal({
    title: '提醒',
    content: '确认退出登录？',
    success: () => {
      setStore(USER_INFO, null);
      setStore(OBU_USER, null);
      HomeStore.setState('needRefresh', true);

      Taro.switchTab({
        url: '/pages/index/index',
      });
    },
  });
}
let fns = {
  1: () => {
    nrNavigateTo('mineEditPersonalData');
  },
  2: () => {
    nrNavigateTo('mall-addr');
  },
  3: () => {
    onlineKefu();
  },
  4: () => {
    nrNavigateTo(
      `${WEBVIEW_PREFIX}?url=https://app.newrizon.cloud/privacy.html`
    );
  },
  5: () => {
    nrNavigateTo(`${WEBVIEW_PREFIX}?url=https://m.newrizon.com`);
  },
  6: () => {
    Taro.showModal({
      title: '提醒',
      content:
        '注销后您的身份信息、账号信息、车辆相关信息、交易记录、订单、积分等将被清空且无法找回，只注意是否注销',
      success: async function (res) {
        if (res.confirm) {
          await offMember();
          Taro.switchTab({
            url: '/pages/index/index',
          });
        } else if (res.cancel) {
          console.log('用户点击取消');
        }
      },
    });
  },
};
function handlItem(id) {
  fns?.[id]?.();
}
</script>
<style>
page {
  background-color: #f5f5f5;
}
</style>
