<template>
  <web-view :src="src" />
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useRouter, useDidShow, useShareAppMessage } from '@tarojs/taro';
import {
  getStore,
  JG,
  jGcustomCount,
  USER_INFO,
  nrNavigateTo,
} from '@/utils/index';
import qs from 'query-string';

definePageConfig({
  enableShareAppMessage: true,
});

function deCode(val: string) {
  return decodeURIComponent(val);
}
const params = useRouter()?.params || { info: '' };
let infoObj = qs.parse(deCode(params.info!));

const platform = 'weapp';
const title = (infoObj?.title ? infoObj?.title : '前晨') as string;
const shareImg = infoObj?.shareImg as string;
const imageUrl = infoObj?.imageUrl as string;
const isNeedLogin = infoObj?.isNeedLogin;

console.log('infoObj=============', deCode(params.info!), infoObj);

const src = computed(() => {
  if (!infoObj) return '';

  const memberId = getStore(USER_INFO)?.member_id;
  let webviewUrl = infoObj?.url as string;

  for (const key in infoObj) {
    if (Object.prototype.hasOwnProperty.call(infoObj, key)) {
      if (!['$taroTimestamp', 'url']?.includes(key)) {
        webviewUrl += `&${key}=${infoObj[key]}`;
      }
    }
  }

  if (webviewUrl?.includes('?')) {
    return `${webviewUrl}&memberId=${memberId}&platform=${platform}`;
  }

  return `${webviewUrl}&memberId=${memberId}&platform=${platform}`?.replace(
    '&',
    '?'
  );
});

function init() {
  //  这里应该分享去首页  首页拦截是否去登录  否则用户再登录页返回不了只能杀进程
  const user = getStore(USER_INFO);
  if (user) return;
  if (isNeedLogin === 'true') {
    nrNavigateTo('login');
  }
}
useDidShow(() => {
  init();
});
useShareAppMessage(() => {
  jGcustomCount(JG.NEWS_003);

  let tep = qs.parse(deCode(params.info!));

  if (!tep.forbidSubmit) {
    tep.forbidSubmit = '1';
  }
  delete tep.memberId;

  let shareInfo = encodeURIComponent(qs.stringify(tep));
  const path = `/other-pages/pages/webview/index?info=${shareInfo}`;

  console.log('sharePath8888888', tep);
  console.log('sharePath=====', shareInfo);

  return {
    title,
    imageUrl: shareImg || imageUrl,
    path,
  };
});
</script>
