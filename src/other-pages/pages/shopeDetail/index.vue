<template>
  <CustomBar class="fixed" background-color="#fff"
    ><template #title>{{ title }}</template></CustomBar
  >
  <MainScroll
    :pt="CalcPt"
    :has-more="hasMore"
    bt="60"
    :init-loading="fl"
    :model-value="isRefresh"
    @scroll-reach-bottom="loadMore"
    @end-pull-down="refresh"
  >
    <main class="bg-hex-f5f5f5">
      <div class="relative">
        <swiper
          :circular="true"
          :current="current"
          class="w-full h-230px"
          indicator-color="#999"
          indicator-active-color="#333"
          :autoplay="true"
          :indicator-dots="false"
          interval="5000"
          @change="swiperChange"
        >
          <swiper-item v-for="k in shopData?.imgUrls" :key="k">
            <NrImg only-img class="w-full h-230px" :src="k" mode="aspectFit" />
          </swiper-item>
        </swiper>
        <div
          v-if="shopData?.imgUrls?.length > 1"
          class="absolute flex justify-center w-full z-100 text-light-50 bottom-30px"
        >
          <span
            v-for="(_, index) in shopData?.imgUrls"
            :key="index"
            :class="`inline-block w-40px h-3px ml-4px rounded-lg ${
              index !== current ? 'bg-gray-500' : 'bg-hex-fff'
            }`"
          ></span>
        </div>
      </div>

      <div
        class="relative -mt-20px py-20px z-100 px-20px text-12px bg-hex-fff rounded-tl-2xl rounded-tr-2xl"
      >
        <div
          class="flex items-center justify-between overflow-hidden font-bold text-size-16px mb-18px"
        >
          <span>{{ shopData?.name }}</span>
          <div
            v-if="isCustomerServiceShop(shopData?.type)"
            class="flex items-center"
          >
            <span class="text-hex-1990FF mr-6px text-24px">{{
              (shopData?.score || 0).toFixed(1)
            }}</span>
            <span class="text-hex-ef8a3c text-12px mt-3px">{{
              regScore(shopData?.score)
            }}</span>
          </div>
        </div>
        <div class="flex items-start mr-12px opacity-62 my-10px">
          <span class="icon-weizhi iconfont pr-6px text-15px pt-2px"></span>
          <div class="leading-normal">
            {{ shopData?.address }}
          </div>
        </div>
        <div
          v-if="shopData?.time || shopData?.after_business_hours"
          class="flex items-start mr-12px opacity-62 my-10px"
        >
          <span class="icon-clock iconfont text-15px pr-6px pt-2px"></span>
          <div
            v-if="shopData?.tel === shopData?.after_telephone"
            class="h-20px leading-20px"
          >
            {{ shopData?.time }}
          </div>
          <div v-else class="leading-normal">
            <div v-if="shopData?.time">销售：{{ shopData?.time }}</div>
            <div v-if="shopData?.after_business_hours">
              售后：{{ shopData?.after_business_hours }}
            </div>
          </div>
        </div>
        <div class="flex items-center text-size-12px mt-10px">
          <NrzBtn
            class="px-8px text-size-14px mr-6px text-g"
            round
            plain
            @click="
              () => {
                goMap(shopData?.address, shopData?.name);
              }
            "
          >
            <span class="icon-daohang iconfont mr-6px"></span>
            <span>{{ shopData?.km }}km</span></NrzBtn
          >
          <template
            v-if="
              isPreSalesShop(shopData?.type) &&
              !isCustomerServiceShop(shopData?.type)
            "
          >
            <NrzBtn
              class="px-8px py-10px text-size-14px mr-6px text-g"
              round
              plain
              @click="
                () => {
                  call(shopData?.tel);
                }
              "
            >
              <span>快速咨询</span>
            </NrzBtn>
          </template>
          <template
            v-if="
              !isPreSalesShop(shopData?.type) &&
              isCustomerServiceShop(shopData?.type)
            "
          >
            <NrzBtn
              class="px-8px py-10px text-size-14px mr-6px text-g"
              round
              plain
              @click="
                () => {
                  call(shopData?.after_telephone);
                }
              "
            >
              <span class="iconfont icon-phone"></span>
              <span>售后热线</span>
            </NrzBtn>
          </template>
          <template
            v-if="
              isPreSalesShop(shopData?.type) &&
              isCustomerServiceShop(shopData?.type)
            "
          >
            <NrzBtn
              v-if="shopData?.tel"
              round
              plain
              class="px-8px py-10px text-size-14px mr-6px text-g"
              @click="
                () => {
                  call(shopData?.tel);
                }
              "
            >
              <span class="iconfont icon-phone"></span>
              <span>销售热线</span>
            </NrzBtn>
            <NrzBtn
              v-if="shopData?.after_telephone"
              round
              plain
              class="px-8px py-10px text-size-14px mr-6px text-g"
              @click="
                () => {
                  call(shopData?.after_telephone);
                }
              "
            >
              <span class="iconfont icon-phone"></span>
              <span>售后热线</span>
            </NrzBtn>
          </template>
        </div>
      </div>
      <section
        v-if="shopData?.vehicles?.length && isPreSalesShop(shopData?.type)"
        class="overflow-hidden text-normal bg-hex-fff text-14px pt-18px my-10px"
      >
        <div class="font-bold text-size-16px mb-18px px-20px">
          {{ regTypeText() }}
        </div>
        <aside
          v-for="k in shopData?.vehicles"
          :key="k.type"
          class="flex items-center justify-between px-20px mb-10px"
        >
          <div class="flex">
            <div class="w-108px h-68px mr-18px">
              <NrImg :src="k.imgUrl" class="w-full h-full" mode="aspectFit" />
            </div>
            <div class="flex flex-col justify-around">
              <span>前晨{{ k.name }} </span>
              <span class="opacity-42 text-12px">{{ k.intro }}</span>
              <span class="text-red-500 text-12px"
                >￥{{ formatThousands(k.price / 100, 2) }}起</span
              >
            </div>
          </div>
          <NrzBtn
            v-if="store().openPrepay"
            class="bg-primary text-hex-fff px-10px py-10px text-size-14px border-0"
            @click="
              () => {
                goToPrePay(k?.router);
              }
            "
          >
            即刻预定
          </NrzBtn>
        </aside>
        <div class="px-20px mt-36px mb-30px h-44px">
          <NrzBtn
            class="w-full h-full border-primary text-primary py-10px text-size-14px"
            @click="
              () => {
                appointment(shopData?.shopId, shopData?.name);
              }
            "
          >
            预约试驾
          </NrzBtn>
        </div>
      </section>
      <section v-if="commentList?.length" class="my-12px bg-hex-fff">
        <div class="font-bold text-center pb-10px pt-20px">
          用户评价({{ useRouter()?.params?.commentNum || '' }})
        </div>
        <div
          v-for="(k, index) in commentList"
          :key="k.id"
          :class="{
            'nr-boder-b': index < commentList?.length - 1,
          }"
          class="flex items-center justify-between bg-hex-fff py-12px px-14px"
        >
          <aside class="flex items-center text-12px">
            <div class="rounded-full w-40px h-40px mr-10px">
              <NrImg
                :src="k?.user?.avatar"
                class="w-full h-full rounded-full"
              />
            </div>
            <div class="flex flex-col justify-around h-40px">
              <span>{{ k?.user?.nickName }}</span>
              <div class="flex opacity-34">
                <span>{{ k?.time }}</span>
                <span class="mx-4px">|</span>
                <span>{{ k?.typeName }}</span>
              </div>
            </div>
          </aside>
          <span class="flex items-center my-10px">
            <div class="flex items-center">
              <span class="text-hex-1990FF mr-6px text-16px">{{
                (k?.score || 0).toFixed(1)
              }}</span>
              <span
                class="text-center text-hex-ef8a3c min-w-16px text-10px mt-3px"
                >{{ regScore(k?.score) }}</span
              >
            </div>
          </span>
        </div>
      </section>
    </main>
  </MainScroll>
  <div
    v-if="isDiaplayCsBtn(shopData?.type)"
    class="fixed flex flex-col items-center justify-center rounded-full shadow shadow-gray-300 bg-hex-fff text-12px z-999 bottom-40px right-30px w-50px h-50px"
    @click="showRepair = true"
  >
    <div class="pb-4px">预约</div>
    <div class="pt-4px">维保</div>
  </div>
  <Repair
    :show="showRepair"
    :shop-id="shopData?.shopId"
    :shop-name="shopData?.name"
    :before-time="shopData?.time"
    :after-time="shopData?.after_business_hours"
    @close="
      () => {
        showRepair = false;
      }
    "
  ></Repair>
</template>

<script lang="ts" setup>
import CustomBar from '@/components/customHeader/index.vue';
import { systemInfo, store } from '@/stores/index';
import { useRouter, useShareAppMessage } from '@tarojs/taro';
import MainScroll from '@/components/scroll-main/index.vue';
import Repair from '@/components/repair/index.vue';
import NrImg from '@/components/nrz-img/index.vue';
import {
  formatThousands,
  CODE,
  regScore,
  makePhoneCall,
  nrNavigateTo,
  isCustomerServiceShop,
  isPreSalesServiceCenter,
  isDiaplayCsBtn,
  isPreSalesShop,
  useLocation,
} from '@/utils/index';
import { computed, onBeforeMount, ref } from 'vue';
import { shopDetail, shopComment } from '@/api/index';
import NrzBtn from '@/components/nrz-button/index.vue';

definePageConfig({ transparentTitle: 'always',titlePenetrate: 'YES',defaultTitle: '', enableShareAppMessage: true });

function appointment(id, name) {
  //
  nrNavigateTo('testDrive', { shopId: id, shopName: name });
}

let nt = null;
let pt = null;
let current = ref(0);
let showRepair = ref(false);
const title = '门店详情';
let fl = ref(true);
console.log(123, useRouter().params);
let CalcPt = computed(
  () => systemInfo().RightBtnRect.h + systemInfo().RightBtnRect.t + 10
);

let lat = store().location?.latitude;
let lnt = store().location?.longitude;
let hasMore = ref(false);
let commentList = ref<any[]>([]);
let shopData = ref<{ [key: string]: any }>({});

let Params = useRouter().params;
function goToPrePay(router) {
  nrNavigateTo(router);
}

function _shopDetail() {
  if (!lat) {
    useLocation().then((lRes) => {
      if (lRes.errMsg !== 'getLocation:ok') return;
      lat = lRes.latitude;
      lnt = lRes.longitude;
      shopDetail({ shopId: Params.id || Params.shopId, lat, lnt }).then(
        (res) => {
          if (res.code !== CODE) return;
          shopData.value = res.data;
        }
      );
    });
    return;
  }
  shopDetail({ shopId: Params.id || Params.shopId, lat, lnt }).then((res) => {
    if (res.code !== CODE) return;
    shopData.value = res.data;
  });
}
function regTypeText() {
  let str = '';
  if (isPreSalesServiceCenter(shopData.value?.type)) {
    str = '在售车型';
  } else {
    str = '在展车型';
  }
  return str;
}
function goMap(addr, title) {
  nrNavigateTo('shopMap', { addr, title });
}
function call(tel) {
  makePhoneCall(tel);
}
function _shopComment() {
  shopComment({ shopId: Params.id || Params.shopId, nt, pt }).then((res) => {
    if (res.code !== CODE) return;
    commentList.value = [...commentList.value, ...res.data.list];
    nt = res?.data?.nt;
    pt = res?.data?.pt;
    hasMore.value = !!res.data?.list?.length;
  });
}
function loadMore() {
  if (hasMore.value) {
    _shopComment();
  }
}
let isRefresh = ref(false);
function refresh() {
  nt = null;
  pt = null;
  isRefresh.value = true;
  _shopDetail();
  shopComment({ shopId: Params.id || Params.shopId, nt, pt }).then((res) => {
    setTimeout(() => {
      isRefresh.value = false;
    }, 500);
    if (res.code !== CODE) return;
    commentList.value = [...res.data.list];
    nt = res?.data?.nt;
    pt = res?.data?.pt;
    hasMore.value = !!res.data?.list?.length;
  });
}
const swiperChange = (res) => {
  let i = res?.detail?.current;
  current.value = i * 1;
};
onBeforeMount(() => {
  _shopDetail();
  _shopComment();
  setTimeout(() => {
    fl.value = false;
  }, 2000);
});

useShareAppMessage(() => {
  return {
    title: '前晨汽车-门店名称',
    path: `other-pages/pages/shopeDetail/index?id=${Params.id}`,
    imageUrl: shopData?.value.imgUrls?.[0],
  };
});
</script>
<style lang="scss">
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
.nr-boder-b {
  border-bottom: 1px solid #f8f8f8;
}
</style>
