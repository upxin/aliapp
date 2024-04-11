<template>
  <view class="flex w-full justify-center py-20px">
    <LazyImg :src="imgUrl" :height="210" :width="270" mode="aspectFit" />
  </view>

  <!-- <div class="w-full bg-yellow-500 h-43px mb-18px"></div> -->
  <section class="px-14px">
    <div
      v-for="item in selectionWithImgFixed"
      :key="item.kind"
      class="flex px-14px border-1 border-solid py-20px mb-14px"
      :style="{ borderColor: item.checked ? '#11264d' : '#f5f5f5' }"
      @click="handleItem(item)"
    >
      <LazyImg
        :src="item.imgUrl"
        height="80rpx"
        width="160rpx"
        mode="aspectFit"
      />

      <div class="flex flex-col pl-20px">
        <div>{{ item.description }}</div>
        <div v-if="item.price <= 0" class="nrz-thin text-10px py-4px">
          价格已包含
        </div>
        <div v-else class="text-12px opacity-77 py-4px">
          ￥{{ formatThousands(item.price, 2) }}
        </div>
      </div>
    </div>
  </section>
</template>
<script lang="ts" setup>
import { CarConf, type Part } from '@/stores/index';
import { computed, watch, ref } from 'vue';
import LazyImg from '@/components/nrz-img/index.vue';
import { formatThousands } from '@/utils';
import { nextTick } from '@tarojs/taro';

const CarConfStore = CarConf();

const props = withDefaults(defineProps<{ carConfig: any }>(), {
  carConfig: {},
});

const selectionList = computed(() => {
  return props.carConfig.config?.find((item) => {
    return item.accessoryType === 'box';
  })?.list;
});

const selectionWithImgFixed = ref<(Part & { checked: boolean })[]>([{}]);

const currentBox = ref<Part>({});

const color = computed(() => {
  return CarConfStore.state.color?.accessoryTypeParam;
});

const imgUrl = computed(() => {
  const name = props.carConfig.typeText;
  const url = `https://nrz-app.su.bcebos.com/vehicle/${name ?? ''}/reserve/${
    color.value ?? ''
  }${currentBox.value?.accessoryTypeParam ?? ''}.png`;
  if (name) {
    return url;
  }
  return '';
});

function handleItem(part) {
  currentBox.value = part;

  selectionWithImgFixed.value = selectionWithImgFixed.value?.map((item) => {
    if (item.accessoryTypeParam === part.accessoryTypeParam) {
      return {
        ...item,
        checked: true,
      };
    }
    return {
      ...item,
      checked: false,
    };
  });
  CarConfStore.setState('box', currentBox.value);
}

watch(
  () => imgUrl.value,
  (v) => {
    console.log(v, 'box----imgUrl==============================');

    CarConfStore.setState('imgUrl', v);
  },
  {
    deep: true,
    immediate: true,
  }
);

watch(
  () => color.value,
  (v) => {
    selectionWithImgFixed.value = selectionList.value?.map((item) => {
      const url = `https://nrz-app.su.bcebos.com/vehicle/${props.carConfig.typeText}/reserve/${v}${item.accessoryTypeParam}${item.accessoryType}.png`;
      return {
        ...item,
        checked: false,
        imgUrl: url,
      };
    });
    nextTick(() => {
      handleItem(selectionWithImgFixed.value?.[0]);
    });
  },
  {
    immediate: true,
    deep: true,
  }
);
watch(
  () => selectionList.value,
  (v) => {
    if (v) {
      selectionWithImgFixed.value = selectionList.value?.map((item) => {
        const url = `https://nrz-app.su.bcebos.com/vehicle/${props.carConfig.typeText}/reserve/${color.value}${item.accessoryTypeParam}${item.accessoryType}.png`;
        return {
          ...item,
          checked: false,
          imgUrl: url,
        };
      });
      nextTick(() => {
        handleItem(selectionWithImgFixed.value?.[0]);
      });
    }
    console.log(
      'selectionList-===============',
      v,
      selectionWithImgFixed.value
    );
  },
  { deep: true, immediate: true }
);
</script>
