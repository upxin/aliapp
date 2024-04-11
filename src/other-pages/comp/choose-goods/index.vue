<template>
  <view :catch-move="true">
    <van-overlay
      :show="modelValue"
      :z-index="998"
      @click="close_short_buy"
    ></van-overlay>
    <view
      :catch-move="true"
      :class="{ slide_up: modelValue, slide_down: !modelValue }"
      class="box-border fixed bottom-0 w-full px-15px bg-fff z-999 ani pb-40px"
    >
      <view class="flex">
        <BgImg
          class="relative bg-center bg-cover w-120px h-120px -top-40px z-999"
          only-img
          :url="goods_info?.imageUrl?.[0]"
        >
        </BgImg>
        <view class="flex-1 px-15px pt-20px overflow-ellipsis">
          <view class="w-full pb-10px text-16px overflow-ellipsis">
            {{ goods_info?.title }}
          </view>
          <view class="flex">
            <view class="flex items-center mr-30px">
              <view class="mr-6px nrz-thin">￥</view>
              <view>{{
                regVal((goods_info?.price * BASE * choosed_num) / BASE)
              }}</view>
            </view>
            <view class="flex items-center">
              <view
                class="icon-jinbi iconfont text-14px mr-6px nrz-thin"
              ></view>
              <view>{{ regVal(goods_info?.price * 100 * choosed_num) }}</view>
            </view>
          </view>
          <view>已选：{{ choosed_type }} x {{ choosed_num }}</view>
        </view>
      </view>
      <section v-for="item in sku_info_list" :key="item?.name" class="mb-14px">
        <div class="mb-8px">{{ item?.name }}</div>
        <div class="flex flex-wrap">
          <button
            v-for="sku_item in item?.value"
            :key="sku_item?.specificationValue"
            shape="square"
            size="small"
            :disabled="sku_item?.disabled"
            class="rounded-none nr-border py-6px mr-8px px-10rpx min-w-70px border-primary text-12px box-border"
            :class="{
              'bg-primary': sku_item?.checked,
              'text-fff': sku_item?.checked,
            }"
            :style="
              sku_item?.disabled
                ? {
                    borderColor: '#ececec',
                    color: '#ececec',
                  }
                : {}
            "
            @click="handle_sku_item(item?.name, sku_item)"
          >
            {{ sku_item?.specification }}
            {{ sku_item?.specificationValue }}
          </button>
        </div>
      </section>
      <section class="mt-20px">
        <div class="flex items-center mb-10px">
          <span class="mr-8px">数量</span>
          <span v-show="max_num" class="mr-8px">剩余{{ max_num }}件</span>
          <span v-show="limitNum">限购{{ limitNum }}件</span>
        </div>
        <van-stepper
          :value="choosed_num"
          min="1"
          :max="Math.min(max_num, limitNum)"
          input-width="40px"
          integer
          @change="handle_num"
        />
      </section>
      <section class="box-border flex justify-end w-full px-15px flex-end">
        <button
          class="box-border rounded-none w-76px mr-10px bg-g text-fff h-32px py-10px"
          @click="close_short_buy"
        >
          再看看
        </button>
        <button
          :disabled="!sku_info_list"
          class="box-border rounded-none ml-10px w-76px bg-primary text-fff h-32px px-10px py-10px"
          @click="navi_to_pay"
        >
          即刻拥有
        </button>
      </section>
    </view>
  </view>
</template>
<script lang="ts">
import { onShareAppMessage, onShareTimeline, regVal } from '@/utils/index';
export default {
  onShareAppMessage,
  onShareTimeline,
};
</script>
<script lang="ts" setup>
import { computed, nextTick, ref, watch } from 'vue';
import Taro, { usePageScroll } from '@tarojs/taro';
import { get_sku_info } from '@/api/mall';
import { useRequest } from '@/hooks/index';
import BgImg from '@/components/bg-img/bg-img.vue';
import {
  diff_arr,
  is_contained,
  deep_clone,
  is_same_arr,
  nrNavigateTo,
  useToast,
  getStore,
  USER_INFO,
} from '@/utils/index';

definePageConfig({ navigationStyle: 'custom' });
let BASE = 100000000;
let props = withDefaults(
  defineProps<{ spuId: string; modelValue: boolean }>(),
  {
    spuId: '',
    // 不用v-model不能正常显示  用props有问题  后续再看
    modelValue: false,
  }
);

let emits = defineEmits(['update:modelValue']);
let goods_info = ref<any>();
let sku_info_list = ref<any>();

let { data: skuData, run: _get_sku_info } = useRequest(get_sku_info, {
  immediate: false,
  onSuccess: (data) => {
    Taro.hideLoading();
    init_sku_info_list(data?.skuInfoList);
    // 初始化sku列只有一排
    if (data?.skuInfoList?.length === 1) {
      nextTick(() => {
        let needSetDisabled: any[] = [];
        // 倒序遍历 防止选中的不是第一个 或者第一个有库存的
        for (let index = data?.skuList.length - 1; index >= 0; index--) {
          const item = data?.skuList[index];
          if (Number(item?.stock) > 0) {
            handle_sku_item(data?.skuInfoList?.[0].name, {
              specificationValue: item?.specs,
            });
          } else {
            // 否则读取第一条信息作为展示,且没库存要禁用
            goods_info.value = data.skuList?.[0];
            // 收集要禁用的
            needSetDisabled.push(item?.specs);
          }
        }
        sku_info_list.value = sku_disabled_set(
          sku_info_list.value,
          needSetDisabled
        );
      });
    } else {
      // 否则读取第一条信息作为展示
      goods_info.value = data.skuList?.[0];
    }
  },
  onError() {
    Taro.hideLoading();
  },
});

let choosed_type = computed(() => {
  let str: string[] = [];
  let helper = (data) => {
    data?.forEach((item) => {
      if (item?.value) {
        helper(item?.value);
      }
      if (item?.checked) {
        str.push(item?.specification);
      }
    });
  };
  helper(sku_info_list.value);

  return str?.length ? str.join('-') : '--';
});

let choosed_num = ref(1);
let max_num = ref(0);
let titleColor = ref('#fff');
let opacity = ref(0);
let all_need_set_disable_specs: any[] = [];
let already_choosed_specs = new Map();
let choosed_sku_id = ref('');
const limitNum = ref(0);
function handle_num(e) {
  choosed_num.value = e?.detail;
}

function findChoosedSku(choosedKeys) {
  let currentChoosedSku = skuData?.value?.skuList.find((item) => {
    let specs = item.specs.split(',');
    return is_same_arr(choosedKeys, specs);
  });
  if (!currentChoosedSku) return;
  max_num.value = currentChoosedSku?.stock;
  choosed_sku_id.value = currentChoosedSku?.skuId;
  goods_info.value = currentChoosedSku;
  limitNum.value = currentChoosedSku.limitCount;
}

function sku_disabled_set(data, ndSet: any[] = []) {
  let copy_data = JSON.parse(JSON.stringify(data));
  let helper = (data: any) => {
    let arr: any[] = [];
    data?.forEach((sku_item) => {
      if (sku_item?.value) {
        helper(sku_item?.value);
      }

      if (ndSet?.includes(sku_item?.specificationValue)) {
        sku_item.disabled = true;
      } else {
        sku_item.disabled = false;
      }
    });
    return arr;
  };
  helper(copy_data);
  return copy_data;
}

function sku_cancel_disabled(data) {
  data.forEach((item) => {
    item.disabled = false;
    if (item?.value) {
      sku_cancel_disabled(item.value);
    }
  });
}
function sku_need_set_disabled(choosed_specs) {
  skuData.value?.skuList?.forEach((sku_comb) => {
    // 没有库存的sku组合设置禁选
    let item_specs = sku_comb?.specs?.split(',');
    if (is_contained(item_specs, choosed_specs) && sku_comb?.stock <= 0) {
      // 需要设置禁选的 sku
      let need_set_disable_specs = diff_arr(item_specs, choosed_specs);
      all_need_set_disable_specs.push(...need_set_disable_specs);
    }
  });

  // 更新设置
  sku_info_list.value = sku_disabled_set(
    sku_info_list.value,
    all_need_set_disable_specs
  );
}
function handle_sku_item(name, item) {
  let sku_type_len = sku_info_list.value?.length;
  // 清空上次操作的sku禁用选项
  all_need_set_disable_specs = [];

  if (already_choosed_specs.get(name) === item.specificationValue) {
    //  存在的情况判断是不是取消选择
    already_choosed_specs.delete(name);
  } else {
    already_choosed_specs.set(name, item.specificationValue);
  }

  if (already_choosed_specs.size === sku_type_len - 1) {
    // 优先处理  当选择到只有剩最后一个选择的时候禁用不可选的
    let specs_list: string[] = [];
    for (const val of already_choosed_specs.values()) {
      specs_list.push(val);
    }
    sku_need_set_disabled(specs_list);
  }

  if (already_choosed_specs.size === sku_type_len) {
    // 已选择完毕  进行切换操作
    // 从数组中取出len-1项 进行排列组合 设置disabled
    let stack: any[] = [];
    let choosed_set = new Set();
    for (const spec of already_choosed_specs.values()) {
      choosed_set.add(spec);
    }

    for (const spec of choosed_set) {
      let copy = deep_clone(choosed_set);
      copy.delete(spec);
      stack.push(copy);
    }

    stack.forEach((spec_map) => {
      let spec_list = Array.from(new Set(spec_map));
      sku_need_set_disabled(spec_list);
    });
  }
  if (already_choosed_specs.size < sku_type_len - 1) {
    // 重置禁用项
    sku_cancel_disabled(sku_info_list.value);
  }

  // 选择颜色处理
  // 选中设置
  sku_info_list.value?.forEach((k) => {
    if (k?.name === name) {
      k?.value?.forEach((child) => {
        if (item?.specificationValue === child?.specificationValue) {
          child.checked = !child.checked;
        } else {
          child.checked = false;
        }
      });
    }
  });
  let already_choosed_specs_list = Array.from(
    new Set(already_choosed_specs.values())
  );
  if (already_choosed_specs_list?.length === sku_info_list.value?.length) {
    findChoosedSku(already_choosed_specs_list);
  }
}
function close_short_buy() {
  emits('update:modelValue', false);
}
function navi_to_pay() {
  let user = getStore(USER_INFO);

  if (!user) {
    return nrNavigateTo('login');
  }

  for (let j = 0; j < sku_info_list.value?.length; j++) {
    const sku = sku_info_list.value[j]?.value;
    let name = sku_info_list.value[j]?.name;
    let is_checked = false;
    for (let i = 0; i < sku.length; i++) {
      const item = sku[i];
      if (item.checked) {
        is_checked = true;
      }
    }
    if (!is_checked) {
      useToast(`请选择${name}`);
      return;
    }
  }
  nrNavigateTo('mallGoodsPay', {
    skuId: choosed_sku_id.value,
    spuId: props.spuId,
    num: choosed_num.value,
    img_url: goods_info.value?.imageUrl?.[0],
    price: goods_info.value?.price,
    name: goods_info.value?.name, // 选择后的款式描述
    title: goods_info.value?.title,
    scoreLimit: goods_info.value?.scoreLimit,
  });
}
function init_sku_info_list(data) {
  if (!data?.length) return [];
  let copy_data = JSON.parse(JSON.stringify(data));
  const helper = (c_data) => {
    let arr: any[] = [];
    c_data.forEach((item) => {
      if (item?.value?.length) {
        item.value = helper(item?.value);
      }
      arr.push({
        ...item,
        checked: false,
        disabled: false,
      });
    });
    return arr;
  };

  let reg_data = helper(copy_data);
  sku_info_list.value = reg_data;
  return reg_data;
}
usePageScroll((res) => {
  const cur = +(Math.abs(Math.round(res.scrollTop)) / 200).toFixed(1);
  if (res.scrollTop <= 2) {
    titleColor.value = '#fff';
  } else {
    titleColor.value = `rgba(0,0,0, ${cur})`;
  }
  opacity.value = cur;
});

watch(
  () => props.modelValue,
  (v) => {
    if (v && props.spuId && !sku_info_list.value) {
      Taro.showLoading();
      _get_sku_info({ spuId: props.spuId });
    }
  },
  {
    immediate: true,
  }
);
watch(
  () => props.spuId,
  (v) => {
    _get_sku_info({ spuId: v });
  },
  {
    immediate: true,
  }
);

// bottom
</script>
<style>
.custom-rich {
  padding-bottom: 10px;
}
page {
  background-color: #fff;
}
.nr-shadow {
  box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.4);
}

.nr-bottom-enter-active,
.nr-bottom-leave-active {
  transition: all 0.3s;
}
.nr-bottom-enter-from,
.nr-bottom-leave-to {
  transform: translateY(118%);
}

.nr-fade-enter-from {
  opacity: 0;
}
.nr-fade-enter-active {
  transition: opacity 0.3s;
}
.nr-fade-enter-to {
  opacity: 1;
}

.nr-fade-leave-from {
  opacity: 1;
}
.nr-fade-leave-active {
  transition: opacity 0.3s;
}
.nr-fade-leave-to {
  opacity: 0;
}
.ani {
  transition: all 0.3s;
}
.slide_down {
  transform: translateY(118%);
}
.slide_up {
  transform: translateY(0%);
}
</style>
