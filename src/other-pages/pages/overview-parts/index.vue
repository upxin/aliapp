<template>
  <section class="flex flex-col hw bg-fff">
    <custom-bar
      :border="true"
      background-color="#fff"
      :show-icon="false"
      position="relative"
    >
      <template #left>
        <div
          class="flex items-center border border-gray-200 border-solid rounded-3xl text-hex-555 h-26px px-8px"
        >
          <span
            class="iconfont text-hex-aaa nz-rot180 icon-arrow-right-bold text-14px"
            @click="backHome"
          ></span>
          <div class="bg-hex-aaa h-12px w-1px opacity-80 mx-8px"></div>
          <div class="text-hex-aaa text-12px" @click="reSelect">重选配置</div>
        </div>
      </template>
      <template #title>{{ query.type }}配置预览</template>
    </custom-bar>
    <section class="overflow-auto text-primary text-14px w-full flex-1">
      <div
        class="m-auto bg-center bg-no-repeat bg-contain w-266px h-190px mt-20px mb-40px"
        :style="{
          backgroundImage: `url(${CarConfStore.state?.imgUrl || ''})`,
        }"
      ></div>
      <template v-if="CarConfStore.state?.color?.description">
        <div class="pl-28px nrz-thin">外观</div>
        <section class="box-border flex px-20px mb-20px py-14px">
          <div
            style="background-color: #eaeaea"
            class="flex items-center justify-center w-108px h-74px mr-33px"
          >
            <span
              class="rounded-full w-50px h-50px"
              :style="{
                backgroundColor: `#${CarConfStore.state?.color?.accessoryTypeParam}`,
              }"
            ></span>
          </div>
          <div class="flex flex-col justify-center">
            <div class="mb-6px">
              {{ CarConfStore.state?.color?.description }}
            </div>
            <div class="text-12px opacity-77">
              ￥ {{ formatThousands(CarConfStore.state?.color?.price, 2) }}
            </div>
          </div>
        </section>
      </template>

      <template v-if="CarConfStore.state?.box?.description">
        <div class="pl-28px nrz-thin">货箱</div>
        <section class="box-border flex px-20px mb-20px py-14px">
          <div
            class="bg-center bg-no-repeat bg-contain w-108px h-74px mr-33px"
            :style="{
              backgroundImage: `url(${CarConfStore.state?.box?.imgUrl || ''})`,
            }"
          ></div>
          <div class="flex flex-col justify-center">
            <div class="mb-6px">
              {{ CarConfStore.state?.box?.description }}
            </div>
            <div class="text-12px opacity-77">
              ￥ {{ formatThousands(CarConfStore.state?.box?.price, 2) }}
            </div>
          </div>
        </section>
      </template>

      <template v-if="CarConfStore.state.optional?.length">
        <div class="pl-28px nrz-thin">选装包</div>
        <div v-for="(item, index) in CarConfStore.state.optional" :key="index">
          <section
            :class="{
              'border-main': index + 1 < CarConfStore.state?.optional?.length,
              'border-transparent':
                index + 1 >= CarConfStore.state?.optional?.length,
            }"
            class="box-border flex mx-20px py-14px border-0 border-solid border-b-1px"
          >
            <div
              class="bg-center bg-no-repeat bg-contain w-108px h-74px mr-33px"
              :style="{
                backgroundImage: `url(${item?.imgUrl || ''})`,
              }"
            ></div>
            <div class="flex flex-col justify-center">
              <div class="mb-6px">{{ item?.description }}</div>
              <div class="text-12px opacity-77">
                ￥ {{ formatThousands(item?.price, 2) }}
              </div>
            </div>
          </section>
        </div>
      </template>

      <div>
        <OverViewChoosed :show-type="false"></OverViewChoosed>
      </div>
      <div
        class="py-26px text-10px text-primary text-left leading-normal nrz-thin px-20px"
      >
        *购车价格请参考以上内容。国家补贴具体金额由定金支付时间和上牌时补贴政策等决定。
      </div>
      <div
        class="leading-normal text-left bg-hex-f5f5f5 py-10px text-10px text-primary px-20px mt-10px"
      >
        {{
          ' 购车流程：支付定金 -> 支付尾款/办理分期 -> 提车。具体提车细节会有专属VIP客服与您联系。支付成功后，如变更购车计划，请联系VIP客服咨询。'
        }}
      </div>
    </section>
    <div
      class="relative bottom-0 w-full bg-hex-fff nrz-safe"
      style="box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.4)"
    >
      <div
        class="box-border flex items-center justify-between w-full h-72px bg-hex-fff px-12px"
      >
        <div class="flex">
          <span class="nrz-thin">总价：</span>
          <span>￥ {{ formatThousands(totalPrice, 2) }}</span>
        </div>
        <section
          class="flex items-center justify-around w-108px h-39px leading-39px bg-primary"
          @click="handlePrePay"
        >
          <div class="text-light-50 red">即刻预定</div>
        </section>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { onShareAppMessage, onShareTimeline } from '@/utils/index';
export default {
  onShareAppMessage,
  onShareTimeline,
};
</script>

<script lang="ts" setup>
import { computed } from 'vue';
import { useRouter } from '@tarojs/taro';
import { store, CarConf } from '@/stores/index';
import CustomBar from '@/components/customHeader/index.vue';
import OverViewChoosed from '@/other-pages/comp/OverViewChoosed/index.vue';
import {
  nrNavigateTo,
  goPages,
  USER_INFO,
  getStore,
  formatThousands,
} from '@/utils';
import { saveCarConf } from '@/api/index';

definePageConfig({
  transparentTitle: 'always',
  titlePenetrate: 'YES',
  defaultTitle: '',
});
const CarConfStore = CarConf();

const query = useRouter().params;
const Store = store();

const totalPrice = computed(() => CarConfStore.state.totalPrice);
const handlePrePay = () => {
  if (getStore(USER_INFO)) {
    reserve();
    nrNavigateTo('bookCar');
  } else {
    nrNavigateTo('login');
  }
};

const backHome = () => {
  goPages('index');
};
// https://nrz-app.su.bcebos.com/vehicle/ic1/fffbox.png

function reserve() {
  const type = CarConfStore.state.type;

  const optional = CarConfStore.state?.optional?.length
    ? CarConfStore.state?.optional
    : [];
  const box = CarConfStore.state?.box ? [CarConfStore.state?.box] : []; // 防止传null给后端
  const discount = CarConfStore.state?.discount ?? [];
  const choose = [CarConfStore.state?.color, ...box, ...optional, ...discount];

  let p = {
    type,
    title: type,
    price: CarConfStore.state.totalPrice,
    amount: CarConfStore.state.totalPrice,
    optional: choose,
    must: choose,
    color: CarConfStore.state.color,
    customerType: Store.choosedBuyType,
    imgUrl: CarConfStore.state?.imgUrl,
  };
  _saveCarConf(p); // 保存到线上
}

function _saveCarConf(p) {
  if (!getStore(USER_INFO)) {
    nrNavigateTo('login');
    return;
  }
  saveCarConf(p).then((res) => {
    console.log(res);
  });
}
const reSelect = () => {
  const type = CarConfStore.state.type;
  nrNavigateTo('carConfig', { type });
};
</script>
