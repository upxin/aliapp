<template>
  <CustomBar class="fixed" background-color="#fff" :border="true">
    <template #title>退充电币</template>
  </CustomBar>
  <FullLoading :loading="fl">
    <section
      :class="['box', 'nrz-safe']"
      :style="{ paddingTop: `${headerHeight}px` }"
    >
      <div :class="{ balance: true }" style="background: #f6f6f6">
        <div class="wallet-main__money--text">充电币余额</div>

        <div class="wallet-main__money">
          {{ formatThousands(state.detail?.coin) }}
        </div>

        <div class="wallet-main__use">
          <div class="wallet-main__use--item">
            <span class="item-large">{{
              formatThousands(state.detail?.availableCoin)
            }}</span>
            <span class="item-mini">可退充电币</span>
          </div>
          <span class="line"></span>
          <div class="wallet-main__use--item" @click="reason">
            <span class="item-large">{{
              formatThousands(state.detail?.nonRefundableCoin)
            }}</span>
            <span class="item-mini">
              <span style="margin-right: 4px">不可退充电币</span>
              <span class="icon-icon-question iconfont text-16px"></span>
            </span>
          </div>
        </div>
      </div>

      <div class="apply">
        <span class="text-16px">申请退币数量</span>
        <span class="text-12px opacity-30">（最小支持退币数量为100）</span>
      </div>

      <div class="text-12px opacity-30 mt-20px mb-7px">
        退币可得积分：{{ state.detail?.availableCoin }}
      </div>

      <div
        class="flex items-center w-full mb-60px bg-hex-f5f5f5 h-45px rounded-5px mt-72px"
      >
        <span class="text-center text-hex-11264d w-40px">#</span>
        <input
          v-model="state.nums"
          placeholder="请输要退币的数量"
          class="bg-hex-f5f5f5"
        />
      </div>

      <div class="text-12px text-normal text-opacity-38">
        <span>*申请退币成功后，会退还到个人【前晨】积分账户中。 </span>
        <span class="pl-8px mt-10px">根据转换规则，1充电币=1 积分。</span>
      </div>

      <div class="flex justify-center py-60px">
        <nut-button class="w-290px" @click="_backCoin">申请退币</nut-button>
      </div>
    </section>
  </FullLoading>
</template>
<script lang="ts" setup>
import { onBeforeMount, reactive, ref } from 'vue';
import CustomBar from '@/components/customHeader/index.vue';
import { useHeaderHeight } from '@/hooks/index';
import { formatThousands, CODE, useToast } from '@/utils/index';
import { walletDetail, backCoin } from '@/api/index';
import Taro from '@tarojs/taro';
import FullLoading from '@/components/full-loading/index.vue';
definePageConfig({ transparentTitle: 'auto',titlePenetrate: 'YES',defaultTitle: '', });

interface Detail {
  freezeCoin?: number;
  availableCoin?: number;
  coin?: number;
  id?: string;
  memberId?: string;
  mobile?: string;
  nonRefundableCoin?: number;
}
const { headerHeight } = useHeaderHeight();
const fl = ref(true);
const state = reactive<{ detail: Detail; nums: number | string }>({
  detail: {},
  nums: '',
});
function _walletDetail() {
  walletDetail({})
    .then((res) => {
      fl.value = false;
      if (res.code !== CODE) return useToast(res?.msg);
      state.detail = res.data;
    })
    .catch(() => {
      fl.value = false;
    });
}

function _backCoin() {
  if (Number(state.nums) < 100) return useToast('最少退币个数为100');
  backCoin(state.nums).then((res) => {
    if (res.code !== CODE) return useToast(res?.msg);
    _walletDetail();
    Taro.navigateBack({
      success: () => {
        useToast(res?.msg);
      },
    });
  });
}
function reason() {
  Taro.showModal({
    title: '提示',
    showCancel: false,
    content:
      '开启充电时会冻结充电钱包账户所有充电币，但在充电过程中购买的充电币不受影响。活动获得的充电币不支持退币，在充电时会被优先扣除。',
    success(res) {
      if (res.confirm) {
        console.log('用户点击确定');
      } else if (res.cancel) {
        console.log('用户点击取消');
      }
    },
  });
}

onBeforeMount(() => {
  _walletDetail();
});
// bottom
</script>
<style lang="scss">
page {
  background: #fff;
}
.wallet-main {
  padding: 0 14px;
  &__box {
    height: 480px;
    box-sizing: border-box;
    border-radius: 10px;
    width: 100%;
    background-color: var(--nr-fff);
    text-align: center;
    overflow: hidden;
  }
  &__money {
    font-size: 28px;
    font-weight: bold;
    &--text {
      color: var(--color-normal);
      opacity: 0.38;
      font-size: 12px;
      margin-top: 18px;
      margin-bottom: 18px;
    }
  }
  &__use {
    display: flex;
    justify-content: space-between;
    margin-top: 40px;
    &--item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .item-large {
        font-size: 18px;
      }
      .item-mini {
        color: var(--color-normal);
        opacity: 0.38;
        font-size: 12px;
        margin: 10px 0;
        display: flex;
        align-items: center;
      }
    }
  }
}
.input-placeholder {
  color: rgba(16, 16, 16, 0.38);
  font-size: 12px;
}

.box {
  padding: 0 18px;
  .balance {
    background-color: var(--nr-main-bg);
    height: 218px;
    border-radius: 10px;
    overflow: hidden;
    box-sizing: border-box;
    padding: 0 22px;
    margin-top: 17px;
  }
}

.btn {
  width: 150px;
  color: var(--nr-fff);
}

.back {
  background-color: rgba(187, 187, 187, 37);
}
.buy {
  background-color: var(--nr-wallet);
  border: 0;
}
.line {
  height: 52px;
  width: 1px;
  border-right: 1px dashed rgba(187, 187, 187, 37);
}
.apply {
  display: flex;
  align-items: center;
  margin-top: 20px;
}
</style>
