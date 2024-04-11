<template>
  <div>share</div>
  <Login
    v-if="!getStore(USER_INFO)"
    class="absolute top-0 left-0 h-full w-full"
    @back="closeLogin"
    @success="refresh"
  ></Login>
</template>
<script lang="ts" setup>
import { useDidShow, useReady, useRouter } from '@tarojs/taro';
import { getStore, goPages, nrNavigateTo, USER_INFO } from '@/utils';
import Login from '@/components/login/index.vue';
import qs from 'query-string';
import Taro from '@tarojs/taro';
const params = useRouter()?.params;

function closeLogin() {
  goPages('index');
}
function refresh() {
  init();
}
function init() {
  const user = getStore(USER_INFO);

  if (!user) {
    return;
  }
  if (params?.info) {
    let temp = decodeURIComponent(params?.info);
    console.log('temp', temp);

    console.log('temp====', qs.parseUrl(temp));

    nrNavigateTo(temp, { redirect: true });
  }
}
useDidShow(() => {
  init();
});
//分享后分发  用户返回后回回到这个 空白页
</script>
