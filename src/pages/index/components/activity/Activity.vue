<template>
  <van-overlay :show="show" :z-index="999">
    <div class="flex flex-col items-center justify-center w-full h-full">
      <swiper :circular="true" :current="current" @change="swiperChange">
        <swiper-item
          v-for="k in activityList"
          :key="k?.router"
          class="flex justify-center"
        >
          <NrzImg
            :url="k?.imageUrl"
            class="active-img"
            only-img
            mode="aspectFit"
            @click.stop="
              () => {
                handleActivity(k);
              }
            "
          />
        </swiper-item>
      </swiper>
      <div
        v-if="activityList?.length > 1"
        class="flex justify-center w-full text-light-50 my-20px"
      >
        <span
          v-for="(_, index) in activityList"
          :key="index"
          :class="`inline-block w-40px h-3px ml-4px rounded-lg ${
            index !== current ? 'bg-gray-500' : 'bg-hex-fff'
          }`"
        ></span>
      </div>
      <div v-if="activityList?.length <= 1" class="h-10px"></div>
      <span
        class="icon-close1 iconfont mt-10px text-40px text-fff"
        @click.stop="
          () => {
            show = false;
          }
        "
      ></span>
    </div>
  </van-overlay>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import NrzImg from '@/components/img/img.vue';
import { activity, closeActivity } from '@/api/index';
import { fetch } from '@/utils/request';
import { useReady } from '@tarojs/taro';
import { nrNavigateTo, getStore, USER_INFO, useToast } from '@/utils/index';
import qs from 'query-string';

let activityList = ref<any[]>([]);
let show = ref(false);
let current = ref(0);
useReady(() => {
  runActive();
});

function runActive(cb?) {
  activity().then((res) => {
    if (!res.data?.length) return;
    activityList.value = res?.data;
    show.value = true;
    cb && cb();
  });
}
function swiperChange(res) {
  let i = res?.detail?.current;
  current.value = i * 1;
}
function removeHandle(router) {
  activityList.value = activityList.value?.filter(
    (item) => item.router !== router
  );
  setTimeout(() => {
    if (activityList.value?.length == 0) {
      show.value = false;
    }
  }, 0);
}
let handleActivity = ({ router, id }) => {
  // 需要登录
  let user = getStore(USER_INFO);
  if (router?.includes('isNeedLogin=true') && !user) {
    nrNavigateTo('login');
    return;
  }

  // 登录了 才处理活动是否只显示一次
  closeActivity(id);

  // 点击发请求的
  if (router?.includes('initiateRequest')) {
    let pStr = router?.split('nrz://com.qianchen/app/initiateRequest')?.[1];
    let pObj = qs.parse(pStr);
    let restP = {};
    Object.keys(pObj).forEach((item) => {
      if (!['method', 'path', 'isNeedLogin'].includes(item)) {
        restP[item] = pObj[item];
      }
    });

    fetch(pObj.method, '/' + pObj.path, restP).then((res) => {
      if (res?.code == 200) {
        useToast(res?.msg);
      }
    });
    removeHandle(router);
    return;
  }
  nrNavigateTo(router, {});
  removeHandle(router);
};
</script>
<style>
swiper {
  width: 100%;
  height: calc(100vw * 2 / 3);
}
.active-img {
  width: 80%;
  height: calc(100vw * 2 / 3);
}
</style>
