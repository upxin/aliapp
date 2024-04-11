<script lang="tsx">
import { defineComponent, onBeforeMount, reactive, ref } from 'vue';
import CustomBar from '@/components/customHeader/index.vue';
import WalletModal from '../../components/walletModal/index.vue';
import {
  CODE,
  formatThousands,
  JG,
  jGcustomCount,
  navigateToPage,
  useToast,
} from '@/utils/index';
import { isOpenWallet, openWallet, walletDetail } from '@/api/index';
import Taro, { useDidShow } from '@tarojs/taro';
import Fl from '@/components/full-loading/index.vue';
definePageConfig({
 transparentTitle: 'always',
  titlePenetrate: 'YES',
  defaultTitle: '',});
interface Detail {
  freezeCoin?: number;
  totalAvailableCoin?: number;
  coin?: number;
  id?: string;
  memberId?: string;
  mobile?: string;
}

export default defineComponent({
  emits: [],
  setup() {
    let isShowModal = ref(false);
    let floading = ref(true);
    let state = reactive<{ detail: Detail }>({
      detail: { freezeCoin: 0 },
    });
    function goDetail() {
      navigateToPage({
        route: 'chargeWalletBillDetails',
      });
    }
    let slots = {
      customLeft: () => <div onClick={goDetail}>明细</div>,
    };
    function onCancel() {
      Taro.navigateBack({});
    }
    function _walletDetail() {
      walletDetail({}).then((res) => {
        if (res.code !== CODE) return useToast(res?.msg);
        state.detail = res.data;
      });
    }
    function onOk(checked) {
      if (!checked) {
        return useToast('请勾选并阅读相关协议');
      }
      openWallet().then((res) => {
        if (res.code !== CODE) return useToast(res?.msg);
        if (!res?.data) return useToast(res?.msg);
        isShowModal.value = false;
        jGcustomCount(JG.CHARGE_008);
      });
    }
    function handleBuy() {
      navigateToPage({
        route: 'chargeWalletCoinBuy',
      });
    }
    useDidShow(() => {
      isOpenWallet({}).then((res) => {
        setTimeout(() => {
          floading.value = false;
        }, 100);
        if (res.code !== CODE) return useToast(res?.msg);
        if (res.data) {
          _walletDetail();
        } else {
          isShowModal.value = true;
        }
      });
    });
    return () => {
      return (
        <div>
          <CustomBar
            vSlots={slots}
            border={false}
            title={'充电钱包'}
          ></CustomBar>
          <Fl loading={floading.value}>
            <div class=" wallet-top"></div>

            <section class="wallet-main">
              <div class="wallet-main__box">
                <div class="wallet-main__money--text">充电币余额</div>
                <div class="wallet-main__money">
                  {formatThousands(state.detail?.coin)}
                </div>

                <div class="wallet-main__use ">
                  <div
                    class="wallet-main__use--item"
                    onClick={() => {
                      navigateToPage({
                        route: 'chargeWalletBalance',
                      });
                    }}
                  >
                    <span class="item-large">
                      {formatThousands(state.detail?.totalAvailableCoin)}
                    </span>
                    <span class="item-mini">可用充电币</span>
                  </div>
                  <div class="wallet-main__use--item">
                    <span class="item-large">
                      {formatThousands(state.detail?.freezeCoin)}
                    </span>
                    <span class="item-mini">冻结充电币</span>
                  </div>
                </div>
                <div class="wallet-buy">
                  <nut-button
                    color={'#33f065'}
                    shape="square"
                    class="wallet-buy--btn"
                    onClick={handleBuy}
                  >
                    购买
                  </nut-button>
                </div>

                <section class="wallet-footer">
                  <div class="wallet-footer__item">
                    <span class="order">1.</span>
                    <span>前晨充电币：</span>
                    <span>100=0.1</span>
                  </div>
                  <div class="wallet-footer__item">
                    <span class="order">2.</span>
                    <span>可用余额：</span>
                    <span>可使用或可请退的余额；</span>
                  </div>
                  <div class="wallet-footer__item">
                    <span class="order">3.</span>
                    <span>冻结余额：</span>
                    <span>充电中被冻结的余额；</span>
                  </div>
                </section>
              </div>
            </section>
          </Fl>
          <WalletModal
            show={isShowModal.value}
            onCancel={onCancel}
            onOk={onOk}
          ></WalletModal>
        </div>
      );
    };
  },
});
</script>
<style lang="scss">
.wallet-top {
  background-image: linear-gradient(var(--nr-fff), var(--nr-wallet));
  height: 264px;
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
    margin-top: -120px;
  }
  &__money {
    font-size: 28px;
    font-weight: bold;
    &--text {
      color: var(--color-normal);
      opacity: 0.38;
      font-size: 12px;
      margin-top: 56px;
      margin-bottom: 18px;
    }
  }
  &__use {
    padding: 0 38px;
    display: flex;
    justify-content: space-between;
    &--item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin: 50px 0;
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

.wallet-buy {
  padding: 0 20px;
  &--btn {
    width: 100%;
    border: 0;
  }
}
.wallet-footer {
  margin-top: 40px;
  padding: 0 70px;
  &__item {
    display: flex;
    opacity: 0.38;
    font-size: 12px;
    line-height: 1.5;
    margin: 6px 0;
    .order {
      width: 10px;
    }
  }
}
</style>
