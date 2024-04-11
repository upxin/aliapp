<template>
  <view
    class="box-border flex items-center justify-between w-full px-15px bg-fff pb-16px"
    @click.stop="() => {}"
  >
    <nut-popover
      v-if="detailItem?.logisticsNumber || detailItem?.payMoney > 0"
      v-model:visible="showTooltip"
      location="bottom-start"
    >
      <template #reference>
        <div class="font-bolder">更多</div>
      </template>
      <template #content>
        <div
          v-if="detailItem?.logisticsNumber"
          class="flex items-center justify-between p-8px w-90px"
          @click.stop="
            () => {
              naviToLogistics(detailItem);
            }
          "
        >
          <span class="icon-wuliu iconfont"></span>
          <div class="text-left w-60px">查看物流</div>
        </div>
        <div
          v-if="detailItem?.payMoney > 0 && !detailItem?.hasBill"
          class="flex items-center justify-between p-8px w-90px"
          @click.stop="
            () => {
              naviToBill(detailItem);
            }
          "
        >
          <span class="icon-order iconfont"></span>
          <div class="text-left w-60px">申请发票</div>
        </div>
      </template>
    </nut-popover>
    <div v-else></div>
    <section class="flex items-center justify-end">
      <nut-button
        v-if="detailItem?.noVerifyNum > 0"
        class="nr-button-plain"
        size="small"
        @click="goDetail"
        >即刻使用
      </nut-button>
      <template v-else>
        <nut-button
          v-if="detailItem?.orderStatus == 2"
          type="primary"
          :round="true"
          class="nr-button-plain"
          size="small"
          @click.stop="
            () => {
              receive(detailItem);
            }
          "
        >
          {{ orderStatusMap[detailItem?.orderStatus] }}
        </nut-button>

        <template v-if="detailItem?.orderStatus == 3">
          <div
            v-if="detailItem?.hasComment == 'true'"
            class="min-w-90px text-center"
          >
            已完成
          </div>
          <nut-button
            v-else
            class="nr-button-plain"
            :round="true"
            type="primary"
            size="small"
            @click.stop="emitComment"
          >
            评价商品
          </nut-button>
        </template>

        <nut-button
          v-if="detailItem?.orderStatus == 1"
          class="nr-button-plain"
          type="primary"
          :round="true"
          size="small"
          @click.stop="
            _reminder({
              orderId: detailItem?.orderId,
            })
          "
        >
          催发货
        </nut-button>
      </template>
    </section>
  </view>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { nrNavigateTo, navigateToPage, OrderType } from '@/utils/index';
import { store } from '@/stores/index';
import { finishOrder, reminder } from '@/api/index';
import { useRequest } from '@/hooks';
let showTooltip = ref(false);
let props = withDefaults(defineProps<{ detailItem: any }>(), {
  detailItem: {},
});
let emits = defineEmits(['update', 'comment', 'goDetail']);

let orderStatusMap = {
  0: '待支付',
  1: '待发货',
  2: '确认收货',
  3: '已完成',
  4: '订单关闭',
};

let { run: _finishOrder } = useRequest(finishOrder, {
  showToast: true,
  showLoading: true,
  onSuccess: () => {
    emits('update');
  },
});

let { run: _reminder } = useRequest(reminder, {
  showToast: true,
  showLoading: true,
  onSuccess: () => {
    emits('update');
  },
});
function goDetail() {
  console.log(123);
  emits('goDetail');
}
function emitComment() {
  emits('comment', props?.detailItem?.orderId);
}
function receive({ orderId }) {
  _finishOrder({ orderId });
}

function naviToLogistics({ logisticsNumber, logisticsType }) {
  showTooltip.value = false;
  nrNavigateTo('mallLogisticsInfo', {
    logisticsNumber,
    type: logisticsType,
  });
}
function naviToBill({ orderId, payMoney }) {
  showTooltip.value = false;
  store().setCheckedInvoice([orderId]);
  navigateToPage({
    route: 'applyInvoice',
    params: {
      totalPrice: payMoney,
      orderType: OrderType.GOODS,
    },
  });
}
</script>
<style>
.nr-button-plain {
  padding: 0 10px;
  font-size: 12px;
  height: 28px;
  min-width: 90px;
  line-height: 28px;
  border-radius: 100px;
  background-color: rgba(255, 255, 255, 1);
  text-align: center;
  border: 1px solid rgba(16, 16, 16, 0.51);
}
</style>
