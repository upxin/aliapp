<template>
  <div class="box-border overflow-hidden px-16px nrz-extra text-primary">
    <view class="flex justify-center py-20px">
      <LazyImg
        :src="conf?.imgUrl"
        :height="210"
        :width="270"
        mode="aspectFit"
      />
    </view>
    <div class="w-full text-center text-normal text-18px mb-27px">
      <div class="py-20px">￥{{ formatThousands(totalPrice, 2) }}</div>
      <div class="w-full text-center text-normal opacity-50 text-10px mt-6px">
        * 实际价格以支付定金时刻为准，此处为选配时的参考价格。
      </div>
    </div>

    <div class="flex justify-between text-12px px-28px nrz-thin text-normal">
      <div class="overflow-hidden w-200px overflow-ellipsis whitespace-nowrap">
        {{ description }}
      </div>
      <div class="flex items-center" @click="reSelect">
        <div class="mr-4px">重选配置</div>
        <span
          class="iconfont text-normal icon-arrow-right-bold text-10px"
        ></span>
      </div>
    </div>
    <div class="flex items-center justify-center px-26px py-16px">
      <nut-button
        v-if="store().openPrepay"
        class="w-full border-none rounded-none px-26px bg-primary text-light-50"
        @click="prePay"
      >
        即刻预定
      </nut-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { onBeforeMount, ref, computed } from 'vue';
import LazyImg from '@/components/nrz-img/index.vue';
import {
  getStore,
  formatThousands,
  getStorage,
  USER_INFO,
  nrNavigateTo,
  setStore,
  CODE,
  CAR_CONF,
} from '@/utils/index';
import Taro from '@tarojs/taro';
import { store, systemInfo, homeStore } from '@/stores/index';
import { delRemoteConf, getCarConfig } from '@/api/index';
import { watch } from 'vue';

const CarConfStore = CarConf();
const HomeStore = homeStore();

const conf = ref<any>({});
const choosedParts = ref<any[]>([]);
const totalPrice = computed(() => {
  return conf.value.totalPrice;
});

const description = computed(() => {
  return choosedParts?.value
    .filter((item) => item?.description)
    .map((item) => item.description)
    ?.join(' 丨 ');
});

function reSelect() {
  nrNavigateTo('carConfig', {
    fromWithParts: true,
    type: conf.value.type,
  });
}
function _delConf() {
  delRemoteConf()
    .then(() => {
      Taro.reLaunch({
        url: '/pages/index/index',
      });
    })
    .catch((err) => {
      console.log(err);
    });
}
function delConf() {
  Taro.showModal({
    title: '提醒',
    content: '是否删除该配置?',
    success(res) {
      if (res.confirm) {
        CarConfStore.setType({});
        CarConfStore.setLeadTime({});
        CarConfStore.setSelection([]);
        CarConfStore.setBasePrice(0);
        CarConfStore.setDeposit(0);
        CarConfStore.setImgUrl('');
        CarConfStore.setName('');
        CarConfStore.setOptional([]);
        CarConfStore.setDiscount([]);
        setStore(CAR_CONF, null);

        if (getStore(USER_INFO)) {
          _delConf();
        } else {
          setStore(CAR_CONF, null);
          Taro.reLaunch({
            url: '/pages/index/index',
          });
        }
      } else if (res.cancel) {
        console.log('用户点击取消');
      }
    },
  });
}
function prePay() {
  if (!getStore(USER_INFO)) {
    nrNavigateTo('login');
    return;
  }
  // 去预定页面再更新一次配置
  // 历史遗留 props.data 缺失basePrice deposit
  getStorage(CAR_CONF).then((res: any) => {
    getCarConfig({ type: res.type }).then((ret) => {
      if (ret.code === CODE) {
        CarConfStore.setBasePrice(ret.data?.base_price);
        nrNavigateTo('bookCar');
      }
    });
  });
}

function initChooseParts() {
  getStorage(CAR_CONF).then((res) => {
    console.log(111199999999, res);
    if (res) {
      conf.value = res;
      choosedParts.value = [
        {
          description: conf.value?.typeText,
          price: conf.value?.basePrice,
        },
        conf.value?.color,
        conf.value?.selection,
        ...(conf?.value?.optional ?? []),
      ];
      // CarConfStore.setColor(conf.value?.color);
      // CarConfStore.setName(conf.value?.name);
      // CarConfStore.setOptional(conf?.value?.optional ?? []);
      // CarConfStore.setSelection(conf.value?.selection);
      // CarConfStore.setTotallPrice(1);
      // CarConfStore.setImgUrl(conf.value?.imgUrl);
      // CarConfStore.setDeposit(conf.value?.deposit);
      // CarConfStore.setDiscount(conf.value?.discount);
      console.log(CarConfStore.state, '==================store carconf');
    }
  });
}

onBeforeMount(() => {
  initChooseParts();
});

defineExpose({
  initChooseParts,
});
</script>
