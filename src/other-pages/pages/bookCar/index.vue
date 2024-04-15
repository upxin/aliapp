<template>
  <Full :loading="loading" :err="pageErr" @re-load="_checkChoosedParts">
    <section class="w-full h-full flex flex-col">
      <CustomBar :border="false" background-color="#fff" position="relative">
        <template #title>{{ currentType }}预定</template>
      </CustomBar>
      <NrzNoticeBar background="#f5f5f5" color="#101010">
        <template #left>
          <span class="iconfont icon-notice pr-10px"></span>
        </template>
        <template #default>
          <view class="text-12px">
            正在使用【{{ userName }}({{ mobile }})】预定，请核实。
          </view>
        </template>
      </NrzNoticeBar>
      <view class="nrz-safe bg-hex-fff flex-1 overflow-y-auto">
        <section class="overflow-y-auto text-primary">
          <view class="px-16px">
            <view class="box-border relative h-142px pt-45px mt-23px">
              <view class="absolute top-0 x-center w-123px h-90px">
                <img :src="carConfig?.imgUrl" alt="" class="w-full h-full" />
              </view>

              <section
                class="box-border w-full nrz-border h-97px pt-14px px-18px"
              >
                <view class="flex justify-between mb-27px">
                  <span>前晨{{ carConfig?.typeText }}</span>
                  <span>￥{{ formatThousands(carConfig?.amount, 2) }}</span>
                </view>
                <view
                  class="flex justify-between text-12px nrz-thin text-normal"
                >
                  <view
                    class="overflow-hidden w-200px overflow-ellipsis whitespace-nowrap"
                  >
                    {{ currentChoose }}
                  </view>
                  <view class="flex items-center" @click="showList = true">
                    <view class="mr-4px">配置清单</view>
                    <span
                      class="iconfont text-normal icon-arrow-right-bold text-10px"
                    ></span>
                  </view>
                </view>
              </section>
            </view>
            <view class="mt-30px mb-20px nrz-thin">预定方式</view>
            <view
              class="box-border w-full border-solid h-69px pt-14px payImg border-hex-f5f5f5 border-1 px-18px relative"
            >
              <img
                class="w-140px h-38px absolute opacity-10 z-20 center"
                :src="dImg"
                mode="scaleToFill"
                alt=""
              />
              <view class="relative">
                <view class="flex justify-between mb-10px z-20">
                  <span>定金</span>
                  ￥{{ formatThousands(carConfig?.deposit, 2) }}
                </view>
                <view
                  class="flex justify-between text-10px nrz-thin opacity-70 z-1"
                >
                  {{ carConfig?.plan }}
                </view>
              </view>
            </view>
          </view>
          <ReserveForm ref="FormRef" :car-config="carConfig"></ReserveForm>
          <view class="flex justify-center mb-40px">
            <nut-button
              shape="square"
              class="w-324px bg-primary text-light-50"
              @click="pay"
            >
              支付定金￥{{ carConfig?.deposit }}
            </nut-button>
          </view>
        </section>
      </view>
    </section>
  </Full>
  <NrzBtmPop v-model:show="showList">
    <OverViewChoosed></OverViewChoosed>
  </NrzBtmPop>
</template>
<script lang="ts" setup>
import ReserveForm from './form/index.vue';
import { onBeforeMount, ref, computed } from 'vue';
import { checkChoosedParts } from '@/api/index';
import OverViewChoosed from '@/other-pages/comp/OverViewChoosed/index.vue';
import CustomBar from '@/components/customHeader/index.vue';
import dImg from '@/assets/imgs/d.png';
import {
  CODE,
  getStore,
  USER_INFO,
  jGcustomCount,
  JG,
  formatThousands,
  nrNavigateTo,
  Routes,
  CAR_CONF,
  getStorage,
} from '@/utils/index';
import Taro, { useShareAppMessage } from '@tarojs/taro';
import NrzBtmPop from '@/components/nrz-bottom-popup/index.vue';
import NrzNoticeBar from '@/components/nrz-notice-bar/index.vue';
import Full from '@/components/full-loading/index.vue';
definePageConfig({
  transparentTitle: 'always',
  titlePenetrate: 'YES',
  defaultTitle: '',
  enableShareAppMessage: true,
});

useShareAppMessage(() => {
  jGcustomCount(JG.MALL_003, { name: '线上购车' });
  return {
    title: '线上预定前晨汽车',
    path: `/other-pages/pages/bookCar/index`,
    imageUrl: 'https://nrz-app.su.bcebos.com/resources/iC1_detail_share.jpg',
  };
});
const loading = ref(true);
const pageErr = ref(false);

const currentType = ref('');
let carConfig = ref();
let userName = ref();
let mobile = ref();
let showList = ref(false);

onBeforeMount(() => {
  userName.value = getStore(USER_INFO)?.nickName || '';
  mobile.value = getStore(USER_INFO)?.mobile || '';
  getStorage(CAR_CONF).then((local) => {
    if (local) {
      _checkChoosedParts(local);
    } else {
      _checkChoosedParts();
    }
  });
});

function _checkChoosedParts(local?) {
  const params = {
    type: local.type,
    typeText: local.typeText,
    amount: local.amount,
    imgUrl: local.imgUrl,
    extra: local.extra,
    options: local.options,
  };
  pageErr.value = false;

  checkChoosedParts(params)
    .then((res) => {
      loading.value = false;
      if (res.code == CODE) {
        if (!res.data.available) {
          Taro.showModal({
            title: '提示',
            content: res.data.remark ?? '当前车型参数发生变化',
            confirmText: '继续下单',
            cancelText: '重新选配',
            success(ret) {
              if (ret.confirm) {
              } else if (ret.cancel) {
                nrNavigateTo(
                  Routes.carConfig,
                  { type: res.data?.type },
                  { redirect: true }
                );
              }
            },
          });
        }
        carConfig.value = res.data;
      } else {
        Taro.showModal({
          title: '提示',
          content: res.msg,
          success(ret) {
            if (ret.confirm) {
              nrNavigateTo(
                Routes.carConfig,
                { ype: res.data?.type },
                { redirect: true }
              );
            } else if (ret.cancel) {
              Taro.navigateBack();
            }
          },
        });
      }
    })
    .catch(() => {
      loading.value = false;
      pageErr.value = true;
    });
}

const FormRef = ref<any>(null);
const pay = () => {
  FormRef.value.valiteForm();
};
const currentChoose = computed(() => {
  const list = [
    {
      description: '前晨' + carConfig?.value?.typeText,
    },
    ...(carConfig?.value?.options ?? []),
  ].filter((item) => item?.description);
  return list.map((item) => item?.description)?.join(' 丨 ');
});
</script>
