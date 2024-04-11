<template>
  <CustomBar class="fixed" icon-color="#fff" :border="false"></CustomBar>
  <div class="box-border h-full overflow-y-auto bg-hex-fff">
    <section>
      <div class="relative">
        <swiper
          :current="current"
          class="h-376px"
          :circular="true"
          @Change="swiperChange"
        >
          <swiper-item v-for="item in imgList" :key="item">
            <img class="w-full h-full" :src="item" alt="" />
          </swiper-item>
        </swiper>
        <div
          class="absolute flex justify-center w-full z-100 text-light-50 bottom-20px"
        >
          <span
            v-for="(_, index) in [0, 1]"
            :key="index"
            class="inline-block w-80px h-5px ml-4px"
            :class="{
              'bg-gray-500': index !== current,
              'bg-hex-fff': index === current,
            }"
          ></span>
        </div>
      </div>
      <div class="relative m-auto z-999 bg-hex-fffpt-10px px-8px">
        <nut-form ref="ruleForm1" :model-value="formData">
          <nut-form-item
            :show-error-message="false"
            :show-error-line="false"
            label-width="60"
            prop="type"
            :rules="[{ required: true, message: '请选择试驾车型' }]"
          >
            <div class="flex justify-between" @click="show = true">
              <input
                v-model="formData.carName"
                :disabled="true"
                type="text"
                placeholder-class="font-extralight"
                placeholder="点击选择车型"
                class="text-normal"
              />
              <span class="iconfont icon-arrow-right-bold text-normal"></span>
            </div>
          </nut-form-item>
          <nut-form-item
            label-width="60"
            :show-error-line="false"
            :show-error-message="false"
            :rules="[{ required: true, message: '请选择门店' }]"
            prop="shopName"
          >
            <div
              class="flex justify-between font-extralight"
              @click="handleShopList"
            >
              <input
                v-model="formData.shopName"
                :disabled="true"
                type="text"
                placeholder-class="font-extralight"
                placeholder="点击选择门店"
                class="text-normal"
              />
              <span class="iconfont icon-arrow-right-bold text-normal"></span>
            </div>
          </nut-form-item>
          <nut-form-item
            label-width="60"
            class="relative"
            prop="mobile"
            :show-error-message="false"
            :show-error-line="false"
            :rules="[
              { required: true, message: '请输入联系电话' },
              {
                validator: customValidatorPhone,
                message: '手机号不合法',
              },
            ]"
          >
            <div class="flex items-center">
              <input
                v-model="formData.mobile"
                class="text-normal flex-1 font-extralight"
                placeholder-class="pc"
                placeholder="请输入联系电话"
                type="text"
              />
              <nut-button
                v-if="userMobile !== formData.mobile || !formData.mobile"
                :disabled="hasGetCode"
                size="mini"
                class="text-normal"
                @click.stop="_getCode"
              >
                <div class="flex items-center px-12px">
                  <span
                    :class="{ hidden: !hasGetCode }"
                    class="iconfont icon-loading rotate text-second"
                  ></span>
                  <span class="ml-6px text-10px text-second font-extralight">
                    获取验证码
                  </span>
                </div>
              </nut-button>
            </div>
          </nut-form-item>
          <nut-form-item
            v-if="userMobile !== formData.mobile || !formData.mobile"
            label-width="60"
            class="relative"
            prop="code"
            :show-error-message="false"
            :show-error-line="false"
            :rules="[{ required: true, message: '请输入验证码' }]"
          >
            <input
              v-model="formData.code"
              class="text-normal font-extralight"
              placeholder-class="pc"
              placeholder="请输入验证码"
              type="text"
            />
          </nut-form-item>
          <nut-form-item style="height: 0px" class="h-0"></nut-form-item>
        </nut-form>
        <div class="px-20px pb-20px">
          <nut-button
            shape="square"
            color="#11264d"
            class="w-full border-0 text-hex-fff text-size-14px mt-40px"
            @click="_validate"
          >
            提交预约
          </nut-button>
        </div>
      </div>
    </section>
  </div>
  <NrzBtmPop v-model:show="show">
    <div
      class="font-bold text-center py-14px text-primary text-18px h-34px leading-34px"
    >
      请选择试驾车型
    </div>
    <div
      v-for="item in carList"
      :key="item?.type"
      class="flex items-center justify-between px-20px pt-10px pb-16px"
      @click="
        () => {
          chooseCarType(item);
        }
      "
    >
      <div class="flex items-center font-bold">
        <img
          mode="widthFix"
          :src="item?.imgUrl"
          alt=""
          class="w-100px mr-16px"
        />
        <span
          :class="{
            'text-hex-F4A35D': formData?.type === item?.type,
          }"
          >{{ item?.name }}</span
        >
      </div>
      <span
        v-show="formData?.type === item?.type"
        class="iconfont icon-check- text-info text-20px"
      ></span>
    </div>
  </NrzBtmPop>
</template>
<script lang="ts" setup>
import { ref, reactive, onBeforeMount, watch } from 'vue';
import CustomBar from '@/components/customHeader/index.vue';
import { loveCarStore } from '@/stores/index';
import Taro, { useRouter, useShareAppMessage } from '@tarojs/taro';
import {
  customValidatorPhone,
  nrNavigateTo,
  CODE,
  jGcustomCount,
  JG,
  getStorage,
  USER_INFO,
} from '@/utils/index';
import { getCarTypeList, getCode, submitTestDrive } from '@/api/index';
import NrzBtmPop from '@/components/nrz-bottom-popup/index.vue';
definePageConfig({ transparentTitle: 'always',titlePenetrate: 'YES',defaultTitle: '', enableShareAppMessage: true });

useShareAppMessage(() => {
  jGcustomCount(JG.MALL_003, { name: '里程计算器' });
  return {
    title: '线上预约试驾前晨汽车',
    path: `/other-pages/pages/testDrive/index`,
    imageUrl: 'https://nrz-app.su.bcebos.com/resources/EC1_detail_share.jpg',
  };
});
function privacy() {
  nrNavigateTo('protocol');
}
const current = ref(0);
const hasGetCode = ref(false);
const imgList = ref();
const swiperChange = (res) => {
  const i = res.detail.current;
  current.value = i;
};
async function _getCode() {
  try {
    const flag = await blurValidatorPhone('mobile');
    console.log('flag', flag);
    if (!flag) return;
    hasGetCode.value = true;
    getCode({ mobile: formData.mobile }).then((res) => {
      formData.code = res.data;
      setTimeout(() => {
        hasGetCode.value = false;
      }, 10000);
    });
  } catch (error) {
    console.log('error', error);
  }
}
function handleShopList() {
  nrNavigateTo('search-after-service', { title: '选择门店', type: 3 });
}

function blurValidatorPhone(prop: string) {
  return new Promise((resolve, reject) => {
    ruleForm1.value.validate(prop).then(({ valid, errors }: any) => {
      if (valid) {
        resolve(true);
      } else {
        Taro.showToast({
          title: errors[0].message,
          icon: 'none',
        });
        reject(false);
      }
    });
  });
}

const formData = reactive({
  type: '',
  carName: '',
  shopName: '',
  shopId: '',
  name: '',
  mobile: '',
  code: '',
  sure: false,
});
const userMobile = ref('');
let carList = ref<any[]>([]);
const show = ref(false);
function chooseCarType(res) {
  formData.type = res.type;
  formData.carName = res.name;
  show.value = false;
}

const ruleForm1 = ref();

function _getCarTypeList() {
  // 车列表
  getCarTypeList({}).then((res) => {
    if (res.code !== CODE) return;
    carList.value = res.data.vehicleTypes;
    imgList.value = res.data.imgUrls;
    formData.carName = res.data.vehicleTypes?.[0]?.name;
    formData.type = res.data.vehicleTypes?.[0]?.type;
  });
}
function _submitTestDrive(params) {
  submitTestDrive(params).then((res) => {
    if (res.code === CODE) {
      Taro.showToast({
        title: '预约成功',
        icon: 'none',
      });
    } else {
      Taro.showToast({
        title: res.msg,
        icon: 'none',
      });
    }
  });
}
function _validate() {
  ruleForm1.value.validate().then(({ valid, errors }: any) => {
    if (valid) {
      // if (!formData.sure) {
      //   Taro.showToast({
      //     title: '请阅读并勾选隐私协议',
      //     icon: 'none',
      //   });
      //   return;
      // }
      const params = {
        type: formData.type,
        name: formData.name,
        shopId: formData.shopId,
        shopName: formData.shopName,
        code: formData.code,
        mobile: formData.mobile,
      };
      _submitTestDrive(params);
    } else {
      console.log(errors);
      Taro.showToast({
        title: errors[0].message,
        icon: 'none',
      });
    }
  });
}

onBeforeMount(() => {
  _getCarTypeList();
  const { shopName, shopId } = useRouter().params;
  if (!shopName) return;
  formData.shopId = shopId as string;
  formData.shopName = decodeURIComponent(shopName as string);
  getStorage(USER_INFO).then((res: any) => {
    formData.mobile = res?.mobile;
    userMobile.value = res?.mobile;
  });
});
watch(
  () => loveCarStore().shopInfo,
  (v) => {
    if (v.shopName) {
      formData.shopName = v.shopName;
      formData.shopId = v.shopId;
    }
  },
  {
    deep: true,
    immediate: true,
  }
);
</script>
<style lang="scss">
.nut-cell {
  // 覆盖label样式
  color: var(--color-primary);
  padding-top: 22px;
  padding-bottom: 22px;
}

.nut-input-text {
  padding: 0;
  color: #9b9b9b;
}

.pc {
  font-weight: 200;
}

.nut-cell--clickable::before {
  content: none;
}

.nut-checkbox__label {
  font-size: 12px;
}
</style>
