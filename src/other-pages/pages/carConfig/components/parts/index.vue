<template>
  <section class="px-14px">
    <div
      v-for="item in optionalListSelectable"
      :key="item.kind"
      class="w-full shadow h-224px shadow-gray-300 mt-16px"
    >
      <div
        class="w-full bg-center bg-no-repeat bg-cover h-160px"
        :style="{
          backgroundImage: `url(${item.imgUrl || ''})`,
        }"
      ></div>
      <div class="flex items-center justify-between h-63px px-20px">
        <div>
          <div>{{ item.description }}</div>
          <span>￥{{ ' ' }}{{ item.price }}</span>
        </div>
        <NrzCheckBox
          v-model:checked="item.checked"
          color="#11264d"
          borderColor="#11264d"
          @change="
            (v) => {
              choose(v.checked, item);
            }
          "
        >
        </NrzCheckBox>
      </div>
    </div>
  </section>
</template>
<script lang="ts" setup>
import { ref, watch, computed, nextTick } from 'vue';
import { CarConf, type Part } from '@/stores/index';
import Taro from '@tarojs/taro';
import NrzCheckBox from '@/components/nrz-checkbox/index.vue';

interface Props {
  carConfig: any;
}

const CarConfStore = CarConf();
const optionalListSelectable = ref<(Part & { checked: boolean })[]>([]);

const props = withDefaults(defineProps<Props>(), {
  carConfig: () => {
    return {};
  },
});
// 钢货箱换铝货箱未选  换侧裙板不可选
function choose(v, item) {
  nextTick(() => {
    if (item.kind === 7) {
      // kind7 换侧裙板
      let isChoosedBox = optionalListSelectable.value.find(
        (k) => k.kind === 4
      )?.checked;
      if (!isChoosedBox) {
        item.checked = false;
        Taro.showToast({
          title: '请选择货箱类型',
          icon: 'none',
        });
        return;
      }
    }
    if (item.kind === 4 && v === false) {
      // kind4 钢货箱换铝货
      let arr = optionalListSelectable?.value?.map((k) => {
        return {
          ...k,
          checked: k.kind === 7 ? false : k.checked,
        };
      });
      optionalListSelectable.value = [...arr];
    }

    const choosed = optionalListSelectable.value?.filter(
      (item) => item.checked
    );
    CarConfStore.setState('optional', choosed);
  });
}

const optionalList = computed(() => {
  return props.carConfig.config?.find((item) => {
    return item.accessoryType === 'optional';
  })?.list;
});

watch(
  () => optionalList.value,
  (v) => {
    if (v?.length) {
      optionalListSelectable.value = v?.map((k) => {
        return { ...k, checked: false };
      });
    }
  },
  {
    deep: true,
    immediate: true,
  }
);
</script>
