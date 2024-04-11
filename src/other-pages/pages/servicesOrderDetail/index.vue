<template>
  <CustomBar background-color="#fff">
    <template #title> {{ title }} </template>
  </CustomBar>
  <FullLoading :loading="fl">
    <section
      class="overflow-y-auto nrz-safe"
      :style="{ paddingTop: `${CalcPt}px` }"
    >
      <div class="min-h-200px pb-75px">
        <section class="text-14px text-normal bg-hex-fff pb-10px mb-5px">
          <aside class="px-16px mt-12px">
            <div
              class="flex items-center justify-between pt-15px mb-20px opacity-62"
            >
              <div class="flex items-center">
                <span class="rounded-full w-16px h-16px mr-6px">
                  <img
                    :src="orderDetailData?.order?.icon"
                    alt=""
                    class="w-full h-full rounded-full"
                  />
                </span>
                <span>{{ orderDetailData?.order?.typeName }}</span>
              </div>
              <div
                @click="
                  () => {
                    goShopeDetail(
                      orderDetailData?.shop?.shopId,
                      orderDetailData?.shop?.name
                    );
                  }
                "
              >
                {{ '门店详情' }}{{ ' >> ' }}
              </div>
            </div>
            <div class="my-16px opacity-62">
              门店名称：{{ orderDetailData?.shop?.name }}
            </div>
            <div class="my-16px opacity-62">
              门店地址：{{ orderDetailData?.shop?.address }}
            </div>
            <div class="my-16px opacity-62">
              门店电话：<span
                class="inline-block text-blue-500 nr-dec"
                @click="
                  () => {
                    makePhoneCall(orderDetailData?.shop?.tel);
                  }
                "
                >{{ orderDetailData?.shop?.tel }}</span
              >
            </div>
          </aside>
        </section>
        <!-- 订单信息 -->
        <section
          class="overflow-hidden text-14px text-normal bg-hex-fff pb-10px mb-5px"
        >
          <aside class="px-16px mt-14px">
            <div
              class="font-bold border-0 border-orange-400 border-solid leading-17px h-17px pl-10px border-l-3px mb-20px"
            >
              订单信息
            </div>
            <div class="my-16px opacity-62">
              订单类型：{{ orderDetailData?.order?.typeName }}
            </div>
            <div class="my-16px opacity-62">
              提交时间：{{ orderDetailData?.order?.time }}
            </div>
            <div class="flex items-center my-16px opacity-62">
              <div>车架编码：{{ orderDetailData?.order?.vin }}</div>
            </div>
            <div class="flex items-center my-16px opacity-62">
              <div>订单编号：{{ orderDetailData?.order?.id }}</div>
              <span
                class="text-primary icon iconfont icon-copy ml-8px"
                @click="
                  () => {
                    copyText(orderDetailData?.order?.id);
                  }
                "
              ></span>
            </div>
            <div
              v-if="orderDetailData?.order?.intro"
              class="flex items-center my-16px opacity-62"
            >
              <div>问题描述：{{ orderDetailData?.order?.intro }}</div>
            </div>
          </aside>
        </section>
        <!-- 联系信息 -->
        <section
          class="overflow-hidden text-14px text-normal bg-hex-fff pb-10px mb-5px"
        >
          <aside class="px-16px mt-14px">
            <div
              class="font-bold border-0 border-orange-400 border-solid leading-17px h-17px pl-10px border-l-3px mb-20px"
            >
              用户信息
            </div>
            <div class="my-16px opacity-62">
              名称：{{ orderDetailData?.order?.user?.nickName }}
            </div>
            <div class="my-16px opacity-62">
              电话：{{ orderDetailData?.order?.user?.mobile }}
            </div>
          </aside>
        </section>
        <!-- 评论信息 -->
        <section
          v-if="orderDetailData?.comment"
          class="overflow-hidden text-12px text-normal bg-hex-fff pb-10px mb-5px"
        >
          <aside class="px-16px mt-14px">
            <div
              class="font-bold border-0 border-orange-400 border-solid leading-17px h-17px pl-10px border-l-3px"
            >
              用户评价
            </div>
          </aside>
          <div
            class="flex items-center justify-between bg-hex-fff py-12px px-14px"
          >
            <aside class="flex items-center text-12px">
              <div class="rounded-full w-40px h-40px mr-10px">
                <img
                  :src="orderDetailData?.comment?.user?.avatar"
                  alt=""
                  class="w-full h-full rounded-full"
                />
              </div>
              <div class="flex flex-col justify-around h-40px">
                <span>{{ orderDetailData?.comment?.user?.nickName }}</span>
                <div class="flex opacity-34">
                  <span>{{ orderDetailData?.comment?.time }}</span>
                  <span class="mx-4px">|</span>
                  <span>{{ orderDetailData?.comment?.typeName }}</span>
                </div>
              </div>
            </aside>
            <span class="flex items-center my-10px">
              <div class="flex items-center">
                <span class="text-hex-1990FF mr-6px text-16px">{{
                  (orderDetailData?.comment?.score || 0).toFixed(1)
                }}</span>
                <span class="text-hex-ef8a3c text-10px mt-3px">{{
                  regScore(orderDetailData?.comment?.score || 0)
                }}</span>
              </div>
            </span>
          </div>
        </section>
      </div>
    </section>
    <div
      class="fixed bottom-0 flex justify-between w-full h-50px bg-hex-fff shadow-top nrz-safe"
    >
      <nut-button
        class="flex-1 h-full"
        shape="square"
        @click="
          () => {
            onlineKefu('');
          }
        "
      >
        <div class="flex items-center justify-center">
          <span class="iconfont icon-message"></span>
          <div class="h-20px leading-20px ml-10px">在线客服</div>
        </div>
      </nut-button>
      <div class="h-full bg-gray-300 w-1px"></div>
      <nut-button
        class="flex-1 h-full"
        shape="square"
        @click="
          () => {
            makePhoneCall(NEWRIZON_TEL);
          }
        "
      >
        <div class="flex items-center justify-center animate-flip">
          <span class="iconfont icon-phone text-primary"></span>
          <div class="h-20px leading-20px ml-10px">极速咨询</div>
        </div>
      </nut-button>
    </div>
  </FullLoading>
</template>
<script lang="ts">
import { onShareAppMessage, onShareTimeline } from '@/utils/index';
export default {
  onShareAppMessage,
  onShareTimeline,
};
</script>

<script lang="ts" setup>
import { ref, onBeforeMount } from 'vue';
import CustomBar from '@/components/customHeader/index.vue';
import { loveCarStore } from '@/stores/index';
import FullLoading from '@/components/full-loading/index.vue';
import {
  copyText,
  makePhoneCall,
  NEWRIZON_TEL,
  CODE,
  regScore,
  nrNavigateTo,
  onlineKefu,
} from '@/utils/index';
import { useRouter } from '@tarojs/taro';
import { getAllOrderList } from '@/api/index';
import { computed } from 'vue';
import { systemInfo } from '@/stores/index';

definePageConfig({ transparentTitle: 'always',titlePenetrate: 'YES',defaultTitle: '', });
let title = ref('服务订单详情');
let orderDetailData = ref<{ order: any; comment: any; shop: any; user: any }>({
  order: {},
  comment: {},
  shop: {},
  user: {},
});
let fl = ref(false);
let CalcPt = computed(
  () => systemInfo().RightBtnRect.h + systemInfo().RightBtnRect.t + 10
);
async function _orderDetail() {
  let id = useRouter().params?.id;
  let { data, code } = await getAllOrderList({ id });
  if (code === CODE) {
    orderDetailData.value = data;
  }
}
function goShopeDetail(shopId, shopName) {
  loveCarStore().setShopInfo({
    shopId,
    shopName,
  });
  nrNavigateTo('shopeDetail', {
    shopId,
    shopName,
  });
}
onBeforeMount(() => {
  _orderDetail();
  setTimeout(() => {
    fl.value = false;
  }, 1500);
});
</script>
<style>
.comment {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  overflow: hidden;
  /*! autoprefixer: off */
  -webkit-box-orient: vertical;
}
.tran {
  transform: rotateZ(180deg);
}
.nut-rate-item {
  margin-right: 4px !important;
  margin-top: -11px;
}
.nr-dec {
  text-decoration: underline;
}
</style>
