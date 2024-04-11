<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { customValidatorPhone, useToast, valiteEmail } from '@/utils';
import { companyInfo, joinUs } from '@/api';
import { onBeforeMount } from 'vue';
import Taro from '@tarojs/taro';
import NrzAddr from '@/components/nrz-addr/index.vue';

definePageConfig({
  navigationBarTitleText: '成为合作伙伴',
});
const formRef = ref();
const formData = reactive({
  company: '',
  manager: '',
  email: '',
  managerMobile: '',
  address: [],
  cityCode: '',
});
const state = reactive({
  show: false,
  province: [],
  city: [],
  country: [],
  town: [],
  addr: '',
  info: {},
});
function submit() {
  formRef.value.validate().then(() => {
    joinUs(formData).then((res) => {
      useToast(res.msg);
      setTimeout(() => {
        Taro.navigateBack();
      }, 1000);
    });
  });
}

const customBlurValidate = (prop: string) => {
  formRef.value.validate(prop).then(({ valid, errors }: any) => {
    if (valid) {
      console.log('success', formData);
    } else {
      console.log('error submit!!', errors);
    }
  });
};
const confirm = (e) => {
  formData.address = e.text?.join('/');
  formData.cityCode = e.value?.[1];
  console.log(formData);
};

function _valiteEmail(val) {
  if (!val) return true;
  return valiteEmail(val);
}
onBeforeMount(() => {
  companyInfo({}).then((res) => {
    state.info = res.data;
  });
});
</script>

<template>
  <section
    class="w-full px-20px box-border nrz-safe"
    style="background-color: rgba(0, 0, 0, 0.3)"
  >
    <p class="text-28px text-center font-bold pt-34px pb-62px text-fff">
      携手前晨 • 共创辉煌
    </p>
    <nut-form ref="formRef" :model-value="formData">
      <nut-form-item label="公司名称" :label-width="70">
        <input
          v-model="formData.company"
          class="nut-input-text"
          placeholder="请输入公司名称"
          placeholder-class="placeholderStyle"
          type="text"
        />
      </nut-form-item>
      <nut-form-item label="您的称呼" :label-width="70">
        <input
          v-model="formData.manager"
          class="nut-input-text"
          placeholder="请输入您的称呼"
          placeholder-class="placeholderStyle"
          type="text"
        />
      </nut-form-item>
      <nut-form-item
        prop="managerMobile"
        :label-width="70"
        :show-error-line="false"
        :rules="[
          { required: true, message: '请输入您的电话' },
          {
            validator: customValidatorPhone,
            message: '电话格式不正确',
          },
        ]"
      >
        <template #label>
          <div class="flex">
            <span>您的电话</span>
            <span class="text-danger pl-4px">*</span>
          </div>
        </template>
        <input
          v-model="formData.managerMobile"
          class="nut-input-text"
          placeholder="请输入您的电话"
          placeholder-class="placeholderStyle"
          type="text"
          @blur="customBlurValidate('managerMobile')"
        />
      </nut-form-item>
      <nut-form-item
        label="您的邮箱"
        prop="email"
        :label-width="70"
        :rules="[{ validator: _valiteEmail, message: '邮箱格式不正确' }]"
      >
        <input
          v-model="formData.email"
          placeholder-class="placeholderStyle"
          class="nut-input-text"
          placeholder="请输入您的邮箱"
          type="text"
          @blur="customBlurValidate('email')"
        />
      </nut-form-item>
      <nut-form-item label="所在区域" :label-width="70">
        <div class="flex">
          <input
            v-model="formData.address"
            class="nut-input-text"
            :disabled="true"
            placeholder-class="placeholderStyle"
            placeholder="请选择地址"
            type="text"
            @click="state.show = true"
          />
          <span class="icon-sanjiao iconfont"></span>
        </div>
      </nut-form-item>

      <nut-form-item :label="' '" :label-width="70">
        <div class="text-fff nrz-thin text-center" @tap="submit">即刻提交</div>
      </nut-form-item>
    </nut-form>
    <div class="text-12px text-fff nrz-thin mt-60px pb-40px">
      <div class="flex mb-10px items-center">
        <span class="iconfont icon-managerMobile mr-6px"></span>
        <span>{{ state.info.managerMobile }}</span>
      </div>
      <div class="flex mb-10px items-center">
        <span class="iconfont mr-6px icon-weizhi"></span>
        <span>{{ state.info.managerMobile }} </span>
        <span class="ml-10px">{{ state.info.manager }}</span>
      </div>
      <div class="flex mb-10px items-center">
        <span class="iconfont icon-icon- mr-6px"></span>
        <span>{{ state.info.email }}</span>
      </div>
      <div class="flex mb-10px items-center">
        <span class="icon-weizhi iconfont mr-6px"></span>
        <span>{{ state.info.address }}</span>
      </div>
    </div>
  </section>
  <NrzAddr v-model:show="state.show" :layer="2" @change="confirm"></NrzAddr>
</template>
<style lang="scss">
.nut-cell-group__warp,
.nut-cell {
  background-color: transparent;
}
.nut-cell-group .nut-cell::after {
  border-bottom: none;
}
.nut-form-item__label {
  color: #fff;
  font-size: 12px;
}
.nut-form-item__body__slots {
  padding: 6px;
  background-color: #fff;
}

.nut-form-item:last-child {
  .nut-form-item__body__slots {
    background-color: orange;
  }
}
.placeholderStyle {
  color: #999;
  font-size: 12px;
}
.nut-form-item__body__slots .nut-input-text {
  font-size: 12px;
}
.nut-form-item__label {
  padding: 6px 0;
}
</style>
