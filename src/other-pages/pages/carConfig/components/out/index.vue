<template>
  <view class="flex justify-center w-full py-20px">
    <LazyImg :src="imgUrl" :height="210" :width="270" mode="aspectFit" />
  </view>
  <div class="w-full text-center text-primary h-22px">{{ colorName }}</div>
  <div class="w-full text-center mt-8px text-primary text-12px text-opacity-77">
    ￥{{ ' ' }}{{ currentPrice + carConfig.basePrice }}
  </div>
  <div class="flex justify-between px-78px mt-50px">
    <div
      v-for="(item, i) in colorList"
      :key="i"
      @click="
        () => {
          handleCar(item);
        }
      "
    >
      <div
        :style="{ backgroundColor: `#${item?.accessoryTypeParam}` }"
        class="rounded-full w-50px h-50px nr-shadow box-border"
        :class="{
          choosed:
            item?.accessoryTypeParam === currentChooseColor?.accessoryTypeParam,
        }"
      ></div>
      <div class="text-center mt-10px">{{ item.description }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { CarConf, type Part } from '@/stores/index';
import LazyImg from '@/components/nrz-img/index.vue';
import { watch } from 'vue';

interface Props {
  carConfig: any;
}

const CarConfStore = CarConf();

const currentChooseColor = ref<Part>({});
const currentPrice = computed(() => {
  return currentChooseColor.value?.price;
});

const imgUrl = computed(() => {
  const color = currentChooseColor.value?.accessoryTypeParam;
  const name = props.carConfig?.typeText;
  const url = `https://nrz-app.su.bcebos.com/vehicle/${name ?? ''}/reserve/${
    color ?? ''
  }.png`;
  if (name && color) {
    return url;
  }
  return '';
});

const colorName = computed(() => {
  return currentChooseColor.value?.description;
});

const colorList = computed(() => {
  return props.carConfig.config?.find((item) => {
    return item.accessoryType === 'color';
  })?.list;
});

const props = withDefaults(defineProps<Props>(), {
  carConfig: {},
});

function handleCar(item) {
  currentChooseColor.value = item;
  CarConfStore.setState('color', currentChooseColor.value);
}

watch(
  () => colorList.value,
  (v) => {
    handleCar(v?.[0]);
    CarConfStore.setState('basePrice', props.carConfig?.basePrice);
    CarConfStore.setState('type', props.carConfig?.type);
    CarConfStore.setState('deposit', props.carConfig?.deposit);
    CarConfStore.setState('name', `前晨${props.carConfig?.typeText}`);
    CarConfStore.setState('typeText', props.carConfig?.typeText);
    CarConfStore.setState('extra', props.carConfig?.extra);
  },
  { deep: true, immediate: true }
);
watch(
  () => imgUrl.value,
  (v) => {
    console.log(v, 'out imgUrl===================');
    CarConfStore.setState('imgUrl', v);
  },
  {
    deep: true,
    immediate: true,
  }
);
</script>
<style>
.nr-shadow {
  box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.4);
}
.choosed {
  border: 2px solid #11264d;
}
</style>
