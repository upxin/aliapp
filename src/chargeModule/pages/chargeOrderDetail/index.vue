<template>
  <CustomBar class="fixed" background-color="#fff">
    <template v-if="regBillText()" #customLeft>
      <span @click="goInvoice">{{ regBillText() }}</span>
    </template>
    <template #title>充电订单详情</template>
  </CustomBar>
  <FullLoading :loading="fullLoading">
    <div
      :style="{ paddingTop: `${headerHeight}px` }"
      class="overflow-y-auto nrz-safe"
    >
      <section class="text-12px pl-14px pt-10px">
        <div
          class="border-0 border-solid h-20px leading-20px text-16px pl-4px border-l-3px border-info"
        >
          充电信息
        </div>
        <Item text="车牌" :val="detail?.plateNum"></Item>
        <Item text="充电城市" :val="detail?.city"></Item>
        <Item text="订单编号" :val="detail?.orderId" :show-copy="true"></Item>
        <Item text="电站名称" :val="detail?.stationName"></Item>
        <Item text="充电时长" :val="usedTime"></Item>
        <Item text="开始时间" :val="detail?.startTime"></Item>
        <Item text="结束时间" :val="detail?.endTime"></Item>
        <Item text="设备类型" :val="detail?.connectorTypeText"></Item>
        <Item text="充电量" :val="detail?.totalPower + '度'"></Item>
        <Item text="电费" :val="detail?.totalElecMoney + '元'"></Item>
        <Item text="服务费" :val="detail?.totalSeviceMoney + '元'"></Item>
        <Item text="超时占位" :val="detail?.stayCost + '元'"></Item>

        <Item text="合计费用" :val="detail?.totalMoney + '元'"></Item>
        <Item
          text="订单状态"
          :val="detail?.orderStatusText"
          :val-style="{ color: '#f18a30' }"
        ></Item>
        <Item
          text="支付类型"
          :val="detail?.payTypeText"
          :val-style="{ color: '#f18a30' }"
        ></Item>
        <Item
          text="实际支付"
          :val="
            detail?.payType == 1
              ? `${detail?.payAmount}元${
                  detail?.discountText ? '(' + detail?.discountText + ')' : ''
                }`
              : `${detail?.payCoin}币${
                  detail?.discountText ? '(' + detail?.discountText + ')' : ''
                }`
          "
          :val-style="{
            fontSize: '16px',
            color: detail?.payType == 1 ? 'red' : 'green',
          }"
        ></Item>
        <Item
          v-if="detail?.discount != 1"
          text="充电活动"
          :val="`${detail?.activityData?.activityName} 优惠(${detail?.reduceAmount})`"
          :val-style="{ fontSize: '16px', color: 'orangered' }"
        ></Item>
        <Item
          text="优惠券"
          :val="`${
            detail?.couponData?.useFlag ? detail?.couponData?.couponName : '--'
          }`"
          :val-style="{ fontSize: '12px', color: 'rgba(8, 190, 226, 1)' }"
        ></Item>
      </section>
      <section class="text-12px px-14px pt-10px">
        <div
          class="border-0 border-solid h-20px leading-20px text-16px pl-4px border-l-3px border-info"
        >
          评价信息
        </div>
        <section
          v-if="detail?.comments?.[0]?.commentList?.length"
          class="flex flex-wrap my-16px"
        >
          <div
            v-for="(k, index) in detail?.comments?.[0]?.commentList"
            :key="index"
            shape="square"
            class="box-border text-center w-68px h-30px leading-30px mb-10px overflow-ellipsis nr-border"
            :class="{
              'mr-16px': (index + 1) % 4 !== 0,
            }"
          >
            {{ k }}
          </div>
        </section>
        <div v-else class="nrz-safe mt-20px">
          <NrzBtn
            class="w-full mb-10px py-14px"
            plain
            round
            @click.stop="showComment = true"
          >
            评价
          </NrzBtn>
        </div>
      </section>
    </div>
  </FullLoading>
  <NrzBottomPopup v-model:show="showComment" tips="评价">
    <section class="flex flex-wrap px-26px mt-30px">
      <div
        v-for="(k, index) in commendEnumList"
        :key="index"
        shape="square"
        class="box-border text-center w-68px h-30px leading-30px mb-10px overflow-ellipsis nr-border"
        :class="{
          'mr-16px': (index + 1) % 4 !== 0,
          'bg-primary': k.checked,
          'text-fff': k.checked,
        }"
        @click="k.checked = !k.checked"
      >
        {{ k.val }}
      </div>
    </section>
    <div class="flex items-center justify-center mt-10px text-12px pr-20px">
      <NrzCheckBox
        v-model:checked="anonymity"
        color="#11264d"
        borderColor="#11264d"
        size="30rpx"
      >
        匿名评论
      </NrzCheckBox>
      <div class="opacity-42 ml-6px">对门店和其他用户隐藏用户名和头像</div>
    </div>
    <section class="box-border flex w-full px-20px my-20px">
      <NrzBtn class="w-full" plain round @click="handleCommend">评价</NrzBtn>
    </section>
  </NrzBottomPopup>
</template>
<script lang="ts" setup>
import NrzCheckBox from '@/components/nrz-checkbox/index.vue';
import { onBeforeMount, ref, computed } from 'vue';
import CustomBar from '@/components/customHeader/index.vue';
import FullLoading from '@/components/full-loading/index.vue';
import NrzBottomPopup from '@/components/nrz-bottom-popup/index.vue';
import Item from './Item.vue';
import { useRouter } from '@tarojs/taro';
import { orderDetail, commentEnum, applyComment } from '@/api/index';
import { CODE, navigateToPage, useToast } from '@/utils/index';
import { useHeaderHeight } from '@/hooks/index';
import NrzBtn from '@/components/nrz-button/index.vue';
definePageConfig({ transparentTitle: 'always',titlePenetrate: 'YES',defaultTitle: '', });

interface Detail {
  orderId: any;
  connectorId: any;
  vin: any;
  plateNum: any;
  startTime: any;
  endTime: any;
  totalPower: any;
  totalElecMoney: any;
  totalSeviceMoney: any;
  totalMoney: any;
  stayCost: any;
  payAmount: any;
  reduceAmount: any;
  createTime: any;
  updateTime: any;
  stationName: any;
  payCoin: any;
  reduceCoin: any;
  connectorTypeText: any;
  duration: any;
  payTypeText?: string;
  orderStatusText?: string;
  payType?: any;
  comments?: any;
  billFlag?: boolean;
  billStatus?: number;
  city?: string;
  discountText?: string;
  discount?: number | string;
  activityData?: any;
}
let showComment = ref(false);
let anonymity = ref(false);
let detail = ref<Detail>();
let fullLoading = ref(true);
let params = useRouter()?.params;
let commendEnumList = ref();
let { headerHeight } = useHeaderHeight();
let usedTime = computed(() => {
  let time =
    new Date(detail.value?.endTime || '')?.getTime() -
    new Date(detail.value?.startTime || '')?.getTime();
  if (!time) return '--';
  let M = parseInt(String(time / 1000 / 60));
  let S = (time / 1000) % 60;
  return `${M}分${S}秒`;
});
function _orderDetail() {
  orderDetail(params?.orderId)
    .then((res) => {
      fullLoading.value = false;
      if (res.code !== CODE) return;
      detail.value = res?.data;
    })
    .catch(() => {
      fullLoading.value = false;
    });
}
function goInvoice() {
  if (detail.value?.billFlag == true) {
    navigateToPage({
      route: 'chargeBill',
    });
    return;
  }
  if (detail.value?.billStatus == 1) {
    useToast('开票中');
    return;
  }
  if (detail.value?.billStatus == 2) {
    navigateToPage({
      route: 'invoiceList',
    });
  }
}
function handleCommend() {
  console.log(123);
  let checkedCommendList =
    commendEnumList.value?.filter((k) => k.checked).map((h) => h.val) || [];
  if (!checkedCommendList?.length) return useToast('请选择标签');
  let opts = {
    orderId: detail.value?.orderId,
    comment: checkedCommendList?.join(','),
    anonymous: anonymity.value,
  };
  applyComment(opts).then((res) => {
    if (res?.code == CODE) {
      commendEnumList.value = commendEnumList.value?.map((item) => {
        return {
          val: item,
          checked: false,
        };
      });
      showComment.value = false;
      _orderDetail();
    }
  });
}
function regBillText() {
  if (detail.value?.billFlag == true) {
    return '开发票';
  }
  if (detail.value?.billStatus == 1) {
    return '开票中';
  }
  if (detail.value?.billStatus == 2) {
    return '查看发票';
  }
  return '';
}
function _commentEnum() {
  commentEnum().then((res) => {
    if (res?.code == CODE) {
      commendEnumList.value = res?.data?.map((item) => {
        return {
          val: item,
          checked: false,
        };
      });
    }
  });
}
onBeforeMount(() => {
  _orderDetail();
  _commentEnum();
});
// bottom
</script>
<style lang="scss">
page {
  background-color: #fff;
}
</style>
