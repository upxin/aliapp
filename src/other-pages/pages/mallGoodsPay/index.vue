<template>
  <FullLoading :loading="loading">
    <div
      v-if="spuData.goodsType != 2"
      class="flex items-center justify-between bg-hex-c9f3ff bg-opacity-12 px-15px py-20px"
      @click="goAddr"
    >
      <template v-if="!addrInfo">
        <span>添加收货地址</span>
        <span class="iconfont icon-arrow-right-bold"></span>
      </template>
      <template v-else>
        <div>
          <div class="text-12px opacity-40">
            {{ `${addrInfo?.province}${addrInfo?.city}${addrInfo?.district}` }}
          </div>
          <div class="font-bold text-16px my-8px">{{ addrInfo?.address }}</div>
          <div class="flex items-center">
            <span class="mr-8px opacity-80">{{ addrInfo?.name }}</span>
            <span class="opacity-50 mr-8px">{{ addrInfo?.contact }}</span>
          </div>
        </div>
        <span class="iconfont icon-arrow-right-bold"></span>
      </template>
    </div>
    <view class="flex px-15px pt-16px">
      <BgImg
        class="bg-center bg-cover w-120px h-120px"
        only-img
        :url="params?.img_url"
      >
      </BgImg>
      <view class="flex flex-col justify-between px-15px py-8px">
        <div class="">
          <view class="pb-20px text-16px">{{ params?.title }}</view>
          <view class="flex opacity-40 text-12px">
            <span> {{ params?.name }}</span>
            <span class="ml-10px">x</span>
            <span>{{ params?.num }}</span>
          </view>
        </div>
        <view class="flex pt-20px">
          <view class="flex items-center mr-30px">
            <view class="mr-6px nrz-thin">￥</view>
            <view>
              {{ (Number(params?.price) * BASE * Number(params?.num)) / BASE }}
            </view>
          </view>
          <view class="flex items-center">
            <view class="icon-jinbi iconfont text-14px mr-6px nrz-thin"></view>
            <view>{{ Number(params?.price) * 100 * Number(params?.num) }}</view>
          </view>
        </view>
      </view>
    </view>
    <div class="flex justify-between px-15px my-25px">
      <span class="opacity-50">商品金额</span>
      <span
        >￥{{
          (Number(params?.price) * BASE * Number(params?.num)) / BASE
        }}</span
      >
    </div>
    <div
      v-if="spuData.goodsType != 2"
      class="flex justify-between px-15px my-25px"
    >
      <span class="opacity-50">运费金额</span>
      <span>￥{{ carriage }}</span>
    </div>
    <div class="flex justify-between px-15px my-25px items-center nr-border-b">
      <span class="opacity-50">备注信息</span>
      <nut-input
        v-model="marks"
        class="flex-1"
        placeholder="可输入订单备注信息（50字内）"
      />
    </div>

    <div class="flex items-center justify-between px-15px">
      <span class="opacity-70">积分抵扣</span>
      <div class="flex items-center justify-end flex-1">
        <div
          class="flex flex-col items-center mr-18px"
          @click="
            () => {
              if (checked) {
                use_points(true);
              }
            }
          "
        >
          <span
            v-if="score"
            class="w-full text-center text-normal text-opacity-40 p-4px bg-main"
            >{{ score }}</span
          >
          <span
            v-else
            class="w-full text-center text-normal text-opacity-40 p-4px bg-main"
          >
            {{ `总积分${statistics?.scoreNum || '--'}` }}
          </span>

          <span class="mr-6px opacity-40"
            >最多可用￥{{
              Number(params?.price) *
              Number(params?.scoreLimit) *
              Number(params?.num)
            }}</span
          >
        </div>
        <NrzSwitch
          v-model:checked="checked"
          scaleRatio="0.8"
          @change="use_points"
        ></NrzSwitch>
      </div>
    </div>

    <div class="box-border fixed bottom-0 w-full bg-fff px-15px nr-shadow">
      <div class="flex items-center justify-between h-50px">
        <div class="flex items-center">
          <span>总计</span>
          <span class="ml-6px text-primary">￥{{ total / BASE }}</span>
        </div>
        <button
          class="rounded-none bg-primary text-fff h-32px px-10px leading-32px"
          @click="pay"
        >
          下单结算
        </button>
      </div>
      <div class="nrz-safe"></div>
    </div>
  </FullLoading>
  <nrz-modal v-model:show="show" title="使用积分" @cancel="cancel" @ok="ok">
    <template #content>
      <input
        v-model.number="input_score"
        class="bg-main py-10px text-14px"
        placeholder="请输入使用积分数"
      />
    </template>
  </nrz-modal>
</template>
<script lang="ts" setup>
import { computed, ref } from 'vue';
import {
  nrNavigateTo,
  getStore,
  USER_INFO,
  useToast,
  CODE,
  jGcustomCount,
  JG,
} from '@/utils/index';
import { useDidShow, useRouter } from '@tarojs/taro';
import NrzModal from '@/components/nrz-modal/index.vue';
import BgImg from '@/components/bg-img/bg-img.vue';
import {
  getMinePageData,
  get_addr_list,
  get_spu,
  createMallOrder,
  pay_only_points,
} from '@/api/index';
import { useRequest, useGetNavigateBackParams } from '@/hooks/index';
import FullLoading from '@/components/full-loading/index.vue';
import Taro from '@tarojs/taro';
import NrzSwitch from '@/components/nrz-switch/index.vue';
import { onBeforeMount } from 'vue';

definePageConfig({
  navigationBarTitleText: '结算',
});
const spuData = ref<any>({});
const marks = ref('');
let score = ref<string | number>(0);
let checked = ref(false);
let show = ref(false);
let input_score = ref();
let carriage = ref('');
let params = useRouter().params || {};
let BASE = 100000;
let total = computed(() => {
  return (
    Number(params?.price) * Number(params?.num) * BASE -
    (Number(score.value) / 100) * BASE
  );
});
function getCarriage(data, adcode) {
  let temp = data?.find((item) => {
    return item?.adcode === adcode;
  })?.money;
  carriage.value = temp;
}
let use_points = (val) => {
  input_score.value = '';
  if (val) {
    show.value = true;
  }
  if (!val) {
    score.value = '';
  }
};
let cancel = () => {
  show.value = false;
  input_score.value = '';
};
let ok = () => {
  if (String(input_score.value).includes('.')) {
    return useToast('请使用整数');
  }
  if (input_score.value < 0) return useToast('不得小于0');

  show.value = false;
  if (
    input_score.value >
    Number(params?.price) * Number(params?.scoreLimit) * Number(params?.num)
  ) {
    score.value =
      Number(params?.price) * Number(params?.scoreLimit) * Number(params?.num);
    return;
  }
  score.value = input_score.value;
};

let user = getStore(USER_INFO);
const { data: statistics } = useRequest(getMinePageData, {
  immediate: true,
  params: { member_id: user?.member_id },
});
function goAddr() {
  let title = addrInfo.value ? '编辑收货地址' : '添加收货地址';
  let path = !addrInfo.value ? 'mallReceiveAddressEdit' : 'mall-addr';
  nrNavigateTo(path, { title });
}
let addrInfo = ref<any>();
let { run: getAddrList, loading } = useRequest(get_addr_list, {
  onSuccess: (data) => {
    let temp = data?.find((item) => item.is_default == '1');
    const backData = useGetNavigateBackParams('addrInfo');
    if (backData) {
      addrInfo.value = backData;
    } else {
      addrInfo.value = temp;
    }
    getCarriage(
      spuData.value?.freight,
      backData ? backData?.adcode : temp?.adcode
    );
  },
});

function pay() {
  let user = getStore(USER_INFO);
  if (!user) {
    return nrNavigateTo('login');
  }
  if (!addrInfo.value && spuData.value?.goodsType != 2) {
    return useToast('请选择收货地址');
  }
  if (score.value > statistics.value?.scoreNum) {
    return useToast('积分不足');
  }
  let opts = {
    goods: {
      spuId: params?.spuId,
      skuId: params?.skuId,
      num: params?.num,
    },
    memberId: user?.member_id,
    addressId: String(addrInfo.value?.id),
    pointNum: String(score.value) || 0,
    adcode: addrInfo.value?.adcode,
    openId: user?.bindBean[0]?.open_id,
    platform: 2,
    memo: marks.value,
  };
  Taro.showLoading();
  createMallOrder(opts).then((orderRes) => {
    Taro.hideLoading();
    if (orderRes.code !== CODE) return useToast(orderRes?.msg, 5000);
    const wepay = orderRes.data.wepay;

    if (orderRes?.data.money == 0) {
      Taro.showModal({
        confirmColor: '#cc463d',
        title: '积分支付',
        content: `确认使用纯积分支付吗？共使用积分（${score.value}）`,
        success: async function (ret) {
          if (ret.confirm) {
            Taro.showLoading();
            pay_only_points({ orderId: orderRes?.data?.order_id }).then(
              (payRes) => {
                Taro.hideLoading();
                if (payRes?.code !== 200) return;
                nrNavigateTo('mallOrderDetail', {
                  orderId: orderRes?.data?.order_id,
                  orderStatus:
                    spuData.value?.goodsType != 2 ? '已完成' : '已付款',
                });
              }
            );
          } else if (ret.cancel) {
          }
        },
      });
      return;
    }

    if (!wepay) {
      Taro.showToast({
        title: '订单生成失败',
        icon: 'none',
      });
      return;
    }
    Taro.requestPayment({
      timeStamp: wepay.timestamp,
      nonceStr: wepay.noncestr,
      package: wepay.packager,
      signType: 'MD5',
      paySign: wepay.sign,
      success: function () {
        jGcustomCount(JG.MALL_002, {
          pointNum: String(score.value) || 0,
          type: '微信',
          money: orderRes?.data.money,
        });
        nrNavigateTo('mallOrderDetail', {
          orderId: orderRes?.data?.order_id,
        });
      },
      fail: function (err) {
        let msg = '支付失败';
        if ((err.errMsg = 'requestPayment:fail cancel')) {
          msg = '支付取消';
        }
        Taro.showToast({
          title: msg,
          icon: 'none',
        });
      },
    });
  });
}

onBeforeMount(() => {
  get_spu({
    spuId: params?.spuId,
  }).then((res) => {
    if (res.code != 200) return;
    spuData.value = res.data;
  });
});

useDidShow(() => {
  getAddrList();
});
</script>
<style>
page {
  background-color: #fff;
}
.nr-shadow {
  box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.4);
}
.nut-input.nut-input-border {
  border-bottom: 0px;
}
</style>
