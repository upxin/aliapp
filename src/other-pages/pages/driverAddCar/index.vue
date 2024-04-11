<template>
  <CustomBar background-color="#fff"
    ><template #title> 添加车辆 </template></CustomBar
  >
  <div
    :style="{ paddingTop: `${CalcPt}px` }"
    class="box-border h-full overflow-y-auto"
  >
    <nut-form ref="ruleForm1" :model-value="formData">
      <nut-form-item
        class="relative"
        label="车架编号："
        prop="vin"
        :show-error-line="false"
        :rules="[{ required: true, message: '请输入车架编号' }]"
      >
        <span class="absolute text-red-500 z-99 left-6px">*</span>
        <nut-input
          v-model="formData.vin"
          class="nut-input-text"
          placeholder="请输入17位车架编号"
          type="text"
        />
      </nut-form-item>
    </nut-form>
    <section class="px-16px text-12px text-normal opacity-34 mt-40px">
      <div class="flex leading-5 text-left">
        <div class="flex flex-col flex-1">
          温馨提醒：提交添加车辆需车主同意后才可成为司机。
        </div>
      </div>
    </section>
    <div class="flex justify-center leading-normal px-16px mt-140px">
      <nut-button
        class="w-full border-hex-11264d text-hex-11264d"
        @click="valiteForm"
        >成为司机</nut-button
      >
    </div>
  </div>
</template>

<script lang="ts">
import { onShareAppMessage, onShareTimeline } from '@/utils/index';
export default {
  onShareAppMessage,
  onShareTimeline,
};
</script>

<script lang="ts" setup>
import { reactive, ref, computed } from 'vue';
import CustomBar from '@/components/customHeader/index.vue';
import { systemInfo } from '@/stores/systemInfo';
import { driverAddCar } from '@/api/index';
import { useToast, CODE } from '@/utils/index';

import Taro from '@tarojs/taro';
definePageConfig({ navigationStyle: 'custom' });
const formData = reactive({
  vin: '',
  // carName: '',
});
let CalcPt = computed(
  () => systemInfo().RightBtnRect.h + systemInfo().RightBtnRect.t + 10
);
const ruleForm1 = ref<any>(null);
const valiteForm = () => {
  ruleForm1.value.validate().then(({ valid, errors }: any) => {
    if (valid) {
      let p = {
        vin: formData.vin,
      };
      _driverAddCar(p);
    } else {
      Taro.showToast({
        title: errors[0].message,
        icon: 'none',
      });
    }
  });
};
function _driverAddCar(p) {
  driverAddCar(p).then((res) => {
    if (res.code === CODE) {
      setTimeout(() => {
        useToast(res.msg);
      }, 20);
      Taro.navigateBack();
    } else {
      useToast(res.msg);
    }
  });
}
</script>
<style lang="scss">
.nut-cell {
  // 覆盖label样式
  color: var(--color-primary);
}
.nut-input-text {
  padding: 0;
  color: #9b9b9b;
}
.input-placeholder {
  color: #cccccc;
}
.nut-cell--clickable::before {
  content: none;
}
</style>
