<template>
  <CustomBar
    class="fixed"
    background-color="#fff"
    :bind-back="true"
    @back="back"
    ><template #title>司机列表</template></CustomBar
  >
  <MainScroll
    :pt="CalcPt"
    :init-loading="initLg"
    :has-data="!!list?.length"
    @scroll-reach-bottom="loadMore"
    @end-pull-down="refresh"
  >
    <section class="overflow-y-auto">
      <div class="box-border px-12px">
        <div
          v-for="item in list"
          :key="item.id"
          class="m-auto shadow my-16px text-101010 bg-hex-fff py-16px px-12px shadow-gray-300 h-77px rounded-xl"
        >
          <div class="flex items-center">
            <div class="rounded-full w-50px h-50px mr-16px">
              <img
                :src="item.avatar"
                alt=""
                class="w-full h-full rounded-full"
              />
            </div>
            <div class="flex flex-col justify-center flex-1">
              <div class="text-14px">{{ item.nick_name }}</div>
              <div
                v-if="item?.create_time"
                class="pt-10px text-normal opacity-34 text-12px"
              >
                {{ dayjs(item?.create_time).format(YMDHMS_EN) }}
              </div>
            </div>
          </div>
          <div id="driverList" class="flex justify-end w-full">
            <nut-button
              size="mini"
              class="border-hex-101010 text-normal opacity-53 mr-8px text-12px"
              @click="
                () => {
                  removeDriver(item);
                }
              "
              >解绑司机</nut-button
            >
            <nut-button
              size="mini"
              class="border-hex-EF8A3c text-hex-EF8A3c text-12px"
              @click="
                () => {
                  makePhoneCall(item?.mobile);
                  jGcustomCount(JG.CV_017);
                }
              "
              >联系司机</nut-button
            >
          </div>
        </div>
      </div>
    </section>
  </MainScroll>
</template>

<script lang="ts">
import { onShareAppMessage, onShareTimeline } from '@/utils/index';
export default {
  onShareAppMessage,
  onShareTimeline,
};
</script>

<script lang="ts" setup>
import { ref, computed, onBeforeMount } from 'vue';
import CustomBar from '@/components/customHeader/index.vue';
import { systemInfo, store } from '@/stores/index';
import Taro from '@tarojs/taro';
import { getDriverList, unbindDriver } from '@/api/index';
import {
  makePhoneCall,
  CODE,
  useToast,
  goPages,
  YMDHMS_EN,
  jGcustomCount,
  JG,
} from '@/utils/index';
import MainScroll from '@/components/scroll-main/index.vue';
import * as dayjs from 'dayjs';

definePageConfig({ transparentTitle: 'auto',titlePenetrate: 'YES',defaultTitle: '', });
const Store = store();

let list = ref<any[]>();
let hasMore = ref(false);
let _nt = null;
let _pt = null;
let initLg = ref(true);
let CalcPt = computed(
  () => systemInfo().RightBtnRect.h + systemInfo().RightBtnRect.t + 10
);
function back() {
  Taro.navigateBack();
}
function _getDriverList(backHome?) {
  let vin = Store.ownerCarInfo.vin;
  getDriverList({ vin, nt: _nt, pt: _pt })
    .then((res) => {
      initLg.value = false;
      if (res.code !== CODE) return;
      if (res?.data?.list === 0 && backHome) {
        goPages('index');
        return;
      }
      list.value = res?.data?.list;
      hasMore.value = !!res.data?.length;
      _nt = res.data.nt;
      _pt = res.data.pt;
    })
    .catch(() => {
      initLg.value = false;
    });
}
function _getDriverListReset() {
  let vin = Store.ownerCarInfo.vin;
  getDriverList({ vin, nt: _nt, pt: _pt }).then((res) => {
    if (res.code !== CODE) return;
    if (res?.data?.list === 0) {
      goPages('index');
      return;
    }
    list.value = res?.data?.list;
    hasMore.value = !!res.data?.length;
    _nt = res.data.nt;
    _pt = res.data.pt;
  });
}

function removeDriver(item) {
  Taro.showModal({
    title: '提醒',
    content: `确定解除司机【${item?.nick_name}】?`,
    success: async function (res) {
      if (res.confirm) {
        unbindDriver({
          vin: item?.vin_code,
          member_id: item?.member_id,
        }).then((res) => {
          if (res.code === CODE) {
            useToast('解绑成功');
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            _getDriverList(true);
          } else {
            useToast('解绑失败');
          }
        });
      } else if (res.cancel) {
        console.log('用户点击取消');
      }
    },
  });
}

onBeforeMount(() => {
  _getDriverList();
});

function loadMore() {
  console.log('haseMore', hasMore.value);
  if (hasMore.value) {
    _getDriverList();
  }
}
function refresh() {
  _getDriverListReset();
}
</script>
<style>
page {
  background-color: #f5f5f5;
}
</style>
