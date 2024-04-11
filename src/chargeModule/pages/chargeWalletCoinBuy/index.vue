<template>
  <CustomBar class="fixed" background-color="#fff"
    ><template #title>购买充电币</template></CustomBar
  >
  <FullLoading :loading="fullLoading">
    <div :style="{ height: `${headerHeight}px` }"></div>
    <section>
      <div class="text-center text-36px mt-26px mb-10px">
        {{ coins.toFixed(0) }}
      </div>
      <div class="text-center text-normal opacity-45 nrz-thin">购币数量</div>
    </section>

    <main class="px-16px pb-100px">
      <section class="">
        <span class="text-16px mt-36px mb-22px">选择购买充电金额</span>
        <div class="flex flex-wrap text-normal">
          <span
            v-for="(k, i) in [...list, customMap]"
            :key="k.id"
            :class="{
              'chooesd-price': k?.checked,
              'mr-12px': (i + 1) % 3 !== 0,
            }"
            class="box-border flex flex-col items-center justify-between border-solid mb-20px py-8px rounded-5px w-106px h-47px border-1px border-hex-bbb border-opacity-38"
            @click="
              () => {
                handlePrice(k);
              }
            "
          >
            <span class="text-12px">
              {{ k.custom ? '自定义金额' : `${k.origPrice}元` }}
            </span>
            <span
              class="opacity-45 text-12px"
              :class="{ 'font-bold': k?.custom }"
            >
              {{ k.custom ? '+' : `售价：${k.sellPrice}` }}
            </span>
          </span>
        </div>
      </section>

      <section class="flex justify-between mt-30px">
        <span>积分抵扣</span>
        <div class="flex switchBtn">
          <div class="text-normal opacity-38 mr-6px">
            可用积分{{ '' }}{{ formatThousands(canUsePoints) }}
          </div>
          <NrzSwitch
            v-model:checked="state.checked"
            scaleRatio="0.8"
            @change="usePoints"
          ></NrzSwitch>
        </div>
      </section>

      <section
        :class="{ visible: !state.checked }"
        class="flex items-center justify-between pr-20px box-boxder mt-20px"
      >
        <span>积分抵扣</span>
        <input
          v-model.number="state.points"
          type="text"
          class="text-center bg-main buyCoinBtn"
        />
      </section>

      <section class="flex opacity-28 mt-60px">
        <span>备注：</span>
        <div>
          <span>*{{ ' ' }}1元=100充电币</span>
          <span>*{{ ' ' }}1元=100积分</span>
        </div>
      </section>
    </main>

    <div
      class="box-border fixed bottom-0 w-full buyCoinShadow bg-hex-fff px-16px z-999"
    >
      <div class="flex items-center mt-14px mb-18px text-12px">
        <section class="flex-1">
          <div class="flex items-center">
            <span class="text-danger text-14px"
              >￥{{ finalPay >= 0 ? finalPay : 0 }}</span
            >
            <span class="font-bold mx-8px text-14px">+</span>
            <span class="iconfont icon-bibijiaoyi mr-4px text-14px"></span>
            <span class="text-14px">{{ formatThousands(state.points) }}</span>
          </div>
          <div class="flex items-center mt-6px">
            <NrzCheckBox
              v-model:checked="state.agree"
              color="#11264d"
              borderColor="#11264d"
              size="30rpx"
            >
              已仔细阅读并同意
            </NrzCheckBox>
            <span class="text-hex-1990ff">《前晨汽车充电币使用协议》</span>
          </div>
        </section>
        <nut-button
          class="border-0 w-60px"
          shape="square"
          color="#11264d"
          @click="_buyCoin"
        >
          购买
        </nut-button>
      </div>
    </div>
  </FullLoading>
  <NrzOverlay v-model:show="show" :z-index="2000">
    <div class="wrapper" @click.stop="() => {}">
      <div class="content">
        <div class="font-bold text-center text-16px pt-10px">输入金额</div>
        <div class="box-border w-full px-20px">
          <nut-input
            v-model.number="state.otherPrice"
            class="bg-main my-26px"
          ></nut-input>
        </div>
        <div
          class="box-border flex items-center justify-between w-full px-16px"
        >
          <div class="flex-1 text-center p-4px" @click="onCancel">取消</div>
          <div class="bg-gray-500 w-1px h-14px"></div>
          <div class="flex-1 text-center text-info p-4px" @click="onOk">
            确认
          </div>
        </div>
      </div>
    </div>
  </NrzOverlay>
  <NrzModal
    v-model:show="showPay"
    title="支付信息"
    :buttons="buttons"
    @click="buttonTap"
  >
    <template #content>
      <view
        class="flex justify-center flex-col items-center text-12px text-normal text-left"
      >
        <view class="w-160px flex">
          <text class="pr-4px w-90px">本次购买充电币</text>
          <text class="text-info">{{ coins }}</text>
        </view>
        <view class="w-160px my-4px flex">
          <text class="pr-4px w-90px">本次购应付金额</text>
          <text class="text-info">{{ finalPay }}</text>
        </view>
        <view class="w-160px flex">
          <text class="pr-4px w-90px">本次积分抵扣</text>
          <text class="text-info">{{ state.points }}</text>
        </view>
      </view>
    </template>
  </NrzModal>
</template>
<script lang="ts" setup>
import NrzModal from '@/components/nrz-modal/index.vue';
import NrzCheckBox from '@/components/nrz-checkbox/index.vue';
import NrzSwitch from '@/components/nrz-switch/index.vue';
import NrzOverlay from '@/components/nrz-overlay/index.vue';

import { computed, nextTick, onBeforeMount, reactive, ref, watch } from 'vue';
import CustomBar from '@/components/customHeader/index.vue';
import FullLoading from '@/components/full-loading/index.vue';
import {
  coinPriceList,
  getSalePrice,
  buyCoin,
  getPayPointsAll,
} from '@/api/index';
import {
  formatThousands,
  useToast,
  CODE,
  getStore,
  USER_INFO,
  jGcustomCount,
  JG,
  getStorage,
} from '@/utils/index';
import { useHeaderHeight } from '@/hooks/index';
import Taro from '@tarojs/taro';

let buttons = [
  {
    text: '取消',
  },
  {
    text: '确定',
    color: '#586c94',
  },
];
definePageConfig({ transparentTitle: 'auto',titlePenetrate: 'YES',defaultTitle: '', });

const { headerHeight } = useHeaderHeight();
const showPay = ref(false);

let uid = 100;
let show = ref(false);
const fullLoading = ref(true);
const customMap: ListItem = { custom: true };
interface ListItem {
  coin?: number;
  id?: string | number;
  origPrice?: number;
  reduceAmount?: number;
  sellPrice?: number;
  checked?: boolean;
  custom?: boolean;
  customPrice?: string | number;
}
const list = ref<ListItem[]>([]);
let canUsePoints = ref(0);
let needPay = ref(0);
let state = reactive({
  text: '',
  checked: true,
  agree: false,
  otherPrice: 0,
  points: 0,
});

let baseNum = 1000000000;
let finalPay = computed(() => {
  let n =
    (Number(needPay.value) * baseNum - (Number(state.points) * baseNum) / 100) /
    baseNum;
  return n > 0 ? n : 0;
});
let currentSelected = ref<ListItem>({});
let finalParams = ref({});
function buttonTap({ index }) {
  if (index === 1) {
    // ok
    Taro.showLoading();
    buyCoin(finalParams.value).then((res) => {
      Taro.hideLoading();
      if (res.code !== CODE) return useToast(res?.msg);
      const order = res.data.wepay;
      if (!res.data?.needToPay) {
        useToast(res?.msg);
        setTimeout(() => {
          Taro.navigateBack();
        }, 1000);
      }
      if (res.data?.needToPay) {
        if (!order) {
          Taro.showToast({
            title: '订单生成失败',
            icon: 'none',
          });
          return;
        }
        Taro.requestPayment({
          timeStamp: order.timestamp,
          nonceStr: order.noncestr,
          package: order.packager,
          signType: 'MD5',
          paySign: order.sign,
          success: function () {
            useToast('购买成功');
            jGcustomCount(JG.CHARGE_009, {
              points: state.points,
              needToPay: true,
            });
            setTimeout(() => {
              Taro.navigateBack();
            }, 1000);
          },
          fail: function (err) {
            Taro.showToast({
              title: '支付失败',
              icon: 'none',
            });
          },
        });
      }
    });
    showPay.value = false;
  } else {
    showPay.value = false;
  }
}

function _getAllPoints() {
  let member_id = getStore(USER_INFO)?.member_id;
  getPayPointsAll({ member_id })
    .then((res) => {
      fullLoading.value = false;
      if (res.code !== CODE) return;
      canUsePoints.value = Number(res.data);
    })
    .catch(() => {
      fullLoading.value = false;
    });
}
let coins = computed(() => {
  return state.points + finalPay.value * 100;
});
async function _buyCoin() {
  try {
    if (!state.agree) {
      return useToast('请阅读并同意前晨充电币使用协议');
    }
    if (finalPay.value === 0 && state.points === 0) {
      return useToast('请选择金额或者输入积分');
    }
    let user = await getStorage(USER_INFO);
    console.log('user', user);
    let params: any = {
      platform: 2,
      deductPoints: state.points,
      openId: user?.bindBean[0]?.open_id,
    };
    if (currentSelected.value.customPrice) {
      params.amount = currentSelected.value.customPrice;
    } else {
      params.id = currentSelected.value.id;
    }

    if (finalPay.value === 0) {
      if (state.points < 100 && state.points != 0) {
        return useToast('积分抵扣不得小于100');
      }
    }

    finalParams.value = params;

    showPay.value = true;
  } catch (error) {
    useToast('支付异常，请重试');
  }
}

function usePoints(res) {
  console.log(res);
  if (!res) {
    state.points = 0;
  }
}
function handlePrice(item: ListItem) {
  if (item.custom) {
    show.value = true;
    return;
  }
  state.points = 0;
  needPay.value = Number(item.sellPrice) || 0;
  currentSelected.value = item;
  list.value = [
    ...list.value.map((k) => {
      return {
        ...k,
        checked: k.id === item.id && !item.custom,
      };
    }),
  ];
}

function onCancel() {
  show.value = false;
}
function onOk() {
  // 拉接口获取 真实的价格pay
  nextTick(() => {
    if (!state.otherPrice) {
      useToast('请输入价格');
      return;
    }
    let p = state.otherPrice;

    getSalePrice({ money: state.otherPrice }).then((res) => {
      if (res.code !== CODE) return useToast(res.msg);
      uid += 1;
      let temp = {
        origPrice: p,
        sellPrice: res.data?.sellPrice,
        id: String(uid),
        checked: true,
        customPrice: p,
      };
      list.value = [
        ...list.value.map((k) => {
          return {
            ...k,
            checked: false,
          };
        }),
        temp,
      ];
      currentSelected.value = temp;
      show.value = false;
      needPay.value = res.data?.sellPrice;
      setTimeout(() => {
        state.otherPrice = 0;
      });
    });
  });
}
function _coinPriceList() {
  coinPriceList().then((res) => {
    if (res.code !== CODE) return useToast(res?.msg);
    list.value = [...res.data.map((item) => ({ ...item, checked: false }))];
  });
}

onBeforeMount(() => {
  _coinPriceList();
  _getAllPoints();
});

watch(
  () => state.points,
  (v) => {
    let val = Number(v);
    if (canUsePoints.value <= 0) {
      state.points = 0;
      useToast('无可用积分');
      return;
    }
    if (val > canUsePoints.value) {
      state.points = canUsePoints.value;
      return;
    }

    if (
      Number(needPay.value) * 100 < val &&
      Object.keys(currentSelected.value).length
    ) {
      state.points = Number(needPay.value) * 100;
    }
  }
);
// bottom
</script>
<style lang="scss">
page {
  background-color: var(--nr-fff);
}
.chooesd-price {
  background-color: antiquewhite;
  border: 1px solid var(--info);
}
.buyCoinBtn {
  width: 110px;
  height: 40px;
}
.visible {
  visibility: hidden;
}

.buyCoinShadow {
  box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.4);
}
.wrapper {
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
  .content {
    background-color: #fff;
    width: 85%;
    border-radius: 10px;
    padding: 10px;
    box-sizing: border-box;
  }
}
</style>
