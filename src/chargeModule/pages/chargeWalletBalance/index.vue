<template>
  <CustomBar class="fixed" background-color="#fff"
    ><template #title>充电钱包可用余额</template></CustomBar
  >
  <FullLoading :loading="initLg">
    <section class="box" :style="{ paddingTop: `${headerHeight}px` }">
      <div :class="{ balance: true }">
        <div class="wallet-main__money--text">充电币余额</div>

        <div class="wallet-main__money">
          {{ formatThousands(state.detail?.coin) }}
        </div>

        <div class="wallet-main__use">
          <div class="wallet-main__use--item">
            <span class="item-large">{{
              formatThousands(state.detail?.totalAvailableCoin)
            }}</span>
            <span class="item-mini">可用充电币</span>
          </div>
          <span class="h-52px w-1px bg-fleet"></span>
          <div class="wallet-main__use--item">
            <span class="item-large">{{
              formatThousands(state.detail?.freezeCoin)
            }}</span>
            <span class="item-mini">冻结充电币</span>
          </div>
        </div>
      </div>
    </section>
    <div class="flex justify-around mt-60px">
      <NrzBtn
        class="py-12px px-60px"
        style="background-color: #999"
        @click="backCoin"
      >
        退币
      </NrzBtn>
      <NrzBtn
        class="py-12px px-60px"
        style="background-color: #33f065"
        @click="buyCoin"
      >
        购币
      </NrzBtn>
    </div>
  </FullLoading>
</template>
<script lang="ts" setup>
import { onBeforeMount, reactive, ref } from 'vue';
import CustomBar from '@/components/customHeader/index.vue';
import { useHeaderHeight } from '@/hooks/index';
import { formatThousands, navigateToPage, CODE, useToast } from '@/utils/index';
import { walletDetail } from '@/api/index';
import FullLoading from '@/components/full-loading/index.vue';
import NrzBtn from '@/components/nrz-button/index.vue';
definePageConfig({ transparentTitle: 'always',titlePenetrate: 'YES',defaultTitle: '', });

interface Detail {
  freezeCoin?: number;
  totalAvailableCoin?: number;
  coin?: number;
  id?: string;
  memberId?: string;
  mobile?: string;
}
const { headerHeight } = useHeaderHeight();
const state = reactive<{ detail: Detail }>({
  detail: {},
});
const initLg = ref(true);

function _walletDetail() {
  walletDetail({})
    .then((res) => {
      if (res.code !== CODE) return useToast(res?.msg);
      initLg.value = false;
      state.detail = res.data;
    })
    .catch(() => {
      initLg.value = false;
    });
}
function backCoin() {
  navigateToPage({
    route: 'drawbackCoin',
  });
}
function buyCoin() {
  navigateToPage({
    route: 'chargeWalletCoinBuy',
  });
}
onBeforeMount(() => {
  _walletDetail();
});
// bottom
</script>
<style lang="scss">
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
    margin-top: -20px;
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
      }
    }
  }
}

.box {
  padding: 0 18px;
  .balance {
    background-image: linear-gradient(var(--nr-fff), var(--nr-wallet));
    height: 218px;
    border-radius: 10px;
    overflow: hidden;
    box-sizing: border-box;
    padding: 0 22px;
    margin-top: 60px;
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
</style>
