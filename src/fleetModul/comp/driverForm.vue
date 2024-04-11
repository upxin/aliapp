<template>
  <nut-form ref="ruleForm" :model-value="formData">
    <div
      class="border-0 border-solid ml-14px text-16px px-16px mt-20px mb-10px font-700 pl-6px border-l-3px border-normal"
    >
      司机信息
    </div>

    <nut-form-item prop="driver" label="司机名称" label-width="100">
      <input
        v-model="formData.driver"
        class="nut-input-text"
        type="text"
        placeholder="请填写司机名称"
      />
    </nut-form-item>
    <nut-form-item
      prop="driverMobile"
      label="司机手机"
      label-width="100"
      :rules="[
        {
          validator: customValidatorPhone,
          message: '手机号不合法',
        },
      ]"
    >
      <input
        v-model="formData.driverMobile"
        class="nut-input-text"
        type="text"
        placeholder="请填写司机手机"
      />
    </nut-form-item>
    <div class="leading-normal opacity-50 ml-6px text-10px px-20px py-14px">
      * 完善司机信息，可自动开通前晨APP账号，司机可在APP上查看车辆相关数据。
    </div>
  </nut-form>
</template>
<script lang="ts" setup>
//
import { useToast } from '@/utils';
import { reactive, ref } from 'vue';

let formData = reactive({
  driverMobile: '',
  driver: '',
});
let ruleForm = ref();

const customValidatorPhone = (val) => {
  if (!val) return true;
  return /^[1][3,4,5,7,8][0-9]{9}$/.test(val);
};

const validateDriver = () => {
  return new Promise((resolve) => {
    ruleForm.value.validate().then(({ valid, errors }: any) => {
      if (valid) {
        resolve(formData);
      } else {
        useToast(errors[0].message);
      }
    });
  });
};
defineExpose({
  formData,
  validateDriver,
});
</script>
