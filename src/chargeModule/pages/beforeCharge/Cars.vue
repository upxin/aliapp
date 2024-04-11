<template>
  <section class="pb-100px">
    <view class="flex items-center">
      <view
        style="background-color: #e8c40e"
        class="flex text-fff items-center justify-center mr-8px w-14px h-14px"
      >
        <view class="iconfont icon-chongdianzhuang text-8px"></view>
      </view>
      <view class="text-14px">选择车辆</view>
    </view>
    <view class="opacity-50 text-10px pl-16px mt-10px mb-20px"
      >* 为了更好的展示充电数据请选择正确的充电车辆。</view
    >
    <div class="pl-22px">
      <section
        v-for="item in list"
        :key="item?.vinCode"
        class="nr-border mb-14px"
        :class="{ 'border-primary': item.checked }"
        @tap="tapItem(item)"
      >
        <view
          v-if="item?.vinCode?.startsWith('nrz_')"
          class="box-border flex items-center w-full nrz-thin h-84px px-13px"
        >
          <view
            class="w-90px flex justify-center items-center bg-fleet py-20px mr-10px"
          >
            <view class="icon-chongdianzhuang iconfont text-30px"></view>
          </view>

          <view class="flex flex-col justify-between flex-1 nrz-thin">
            <section class="flex justify-between mb-14px">
              <view class="text-12px pt-4px">非前晨车辆</view>
              <view
                v-if="!platformNum"
                class="justify-center nr-border border-primary py-8px text-10px w-110px flex items-center"
                @tap="addPlateNum"
              >
                + 点击添加车牌
              </view>
              <view
                v-else
                class="justify-center nr-border border-primary py-4px text-10px w-110px flex items-center"
                @tap="addPlateNum"
              >
                {{ platformNum }}
              </view>
            </section>

            <view class="opacity-60 text-10px">
              绑定车牌可在符合条件前提下免部分停车费
            </view>
          </view>
        </view>

        <view v-else class="h-84px px-14px mt-15px flex items-center">
          <NrImg
            :url="1 ? WHITE_CAR : BLUE_CAR"
            only-img
            class="w-100px h-70px mr-16px"
          ></NrImg>
          <view class="mr-auto">{{ item?.model || item?.vehicleName }}</view>
          <NrImg
            v-if="item?.licensePlateNum"
            :url="PLATE"
            class="bg-green-400 rounded-md w-97px h-34px leading-34px"
          >
            <div class="flex pl-8px text-12px font-bold items-center h-full">
              <view>{{ item?.licensePlateNum.slice(0, 2) }}</view>
              <view class="w-12px"></view>
              <view> {{ item?.licensePlateNum.slice(1) }} </view>
            </div>
          </NrImg>
          <template v-else>
            <div
              v-if="item?.identity == 1"
              class="justify-center nr-border border-primary py-4px text-10px w-110px flex items-center"
              @tap.stop="
                tapToPage(Routes.carRecord, { vinLicense: item?.vinCode })
              "
            >
              添加车牌
            </div>
            <div
              v-if="item?.identity == 2"
              class="justify-center nr-border border-primary py-4px text-10px w-110px flex items-center"
              @tap.stop="
                () => {
                  makePhoneCall(item?.ownerMobile);
                }
              "
            >
              联系车主添加车牌
            </div>
          </template>
        </view>
      </section>
    </div>
  </section>
  <NrzModal v-model:show="show" title="添加车牌" @click="buttonTap">
    <template #content>
      <div class="flex justify-center">
        <input v-model="num" type="text" placeholder="请输入车牌" />
      </div>
    </template>
  </NrzModal>
</template>
<script lang="ts" setup>
import NrImg from '@/components/img/img.vue';
import {
  PLATE,
  WHITE_CAR,
  BLUE_CAR,
  useToast,
  Routes,
  nrNavigateTo,
  makePhoneCall,
} from '@/utils';
import { ref, onBeforeMount } from 'vue';
import NrzModal from '@/components/nrz-modal/index.vue';
import { allCarList } from '@/api';

withDefaults(defineProps<{ currentCar: any }>(), {
  currentCar: () => ({}),
});
let emits = defineEmits(['update:currentCar']);
interface carInfo {
  vinCode: string;
  [propKey: string]: any;
}
let platformNum = ref();
let num = ref('');
let list = ref<carInfo[]>([]);
let show = ref(false);
function addPlateNum() {
  show.value = true;
}
function buttonTap({ index, item }) {
  console.log(index, item);
  if (index === 1) {
    if (num.value?.length < 6) {
      useToast('车牌号至少6位');
      return;
    }
    platformNum.value = num.value.toLocaleUpperCase();
    list.value = list.value?.map((k) => {
      return {
        ...k,
        licensePlateNum: k?.vinCode?.startsWith('nrz_')
          ? num.value.toLocaleUpperCase()
          : k?.licensePlateNum,
      };
    });
    const temp = list.value?.find((item) => {
      return !!item?.checked;
    });
    emits('update:currentCar', temp);
    show.value = false;
  } else {
    show.value = false;
  }
}
function tapToPage(route, p = {}) {
  nrNavigateTo(route, p);
}
function tapItem(item) {
  emits('update:currentCar', item);
  list.value = list.value?.map((k) => {
    return {
      ...k,
      checked: k.vinCode === item.vinCode ? true : false,
    };
  });
}
onBeforeMount(() => {
  allCarList().then((res) => {
    if (res?.code !== 200) return useToast(res?.msg);
    list.value = res?.data?.map((item, i) => {
      return {
        ...item,
        checked: i === 0 ? true : false,
      };
    });
    if (list.value?.length > 1) {
      list.value = res?.data?.map((item, i) => {
        return {
          ...item,
          checked: i === 1 ? true : false,
        };
      });
    }
    const temp = list.value?.find((item) => {
      return !!item?.checked;
    });
    emits('update:currentCar', temp);
  });
});
</script>
