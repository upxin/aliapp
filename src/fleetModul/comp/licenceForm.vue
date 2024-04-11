<template>
  <nut-form ref="ruleForm" :model-value="formData">
    <div
      class="border-0 border-solid ml-14px text-16px px-16px mt-20px mb-10px font-700 pl-6px border-l-3px border-normal"
    >
      行驶证数据
    </div>
    <nut-form-item
      prop="licensePlateNumber"
      label-width="100"
      :rules="[{ required: true, message: '请填写车牌号码' }]"
    >
      <template #label>
        <div class="flex">
          <span>车牌号码</span>
          <span class="text-danger ml-4px">*</span>
        </div>
      </template>
      <input
        v-model="formData.licensePlateNumber"
        class="nut-input-text"
        type="text"
        placeholder="请填写车牌号码"
      />
    </nut-form-item>
    <nut-form-item
      prop="vinCode"
      label-width="100"
      :rules="[{ required: true, message: '请填写VIN码' }]"
    >
      <template #label>
        <div class="flex">
          <span>VIN(识别码)</span>
          <span class="text-danger ml-4px">*</span>
        </div>
      </template>
      <input
        v-model="formData.vinCode"
        class="nut-input-text"
        type="text"
        placeholder="请填写VIN码"
      />
    </nut-form-item>
    <nut-form-item label-width="100">
      <template #label>
        <div class="flex">
          <span>品牌型号</span>
        </div>
      </template>
      <input
        v-model="formData.model"
        class="nut-input-text"
        type="text"
        placeholder="请填写品牌型号"
      />
    </nut-form-item>
    <nut-form-item label-width="100">
      <template #label>
        <div class="flex">
          <span>所有人</span>
        </div>
      </template>
      <input
        v-model="formData.owner"
        class="nut-input-text"
        type="text"
        placeholder="请填写所有人"
      />
    </nut-form-item>
    <nut-form-item label-width="100">
      <template #label>
        <div class="flex">
          <span>住址</span>
        </div>
      </template>
      <input
        v-model="formData.address"
        class="nut-input-text"
        type="text"
        placeholder="请填写住址"
      />
    </nut-form-item>
    <nut-form-item label-width="100">
      <template #label>
        <div class="flex">
          <span>使用性质</span>
        </div>
      </template>
      <NrzRadioGroup
        v-model:model-value="formData.useNature"
        direction="horizontal"
      >
        <NrzRadio value="营运">营运</NrzRadio>
        <NrzRadio value="非营运">非营运</NrzRadio>
      </NrzRadioGroup>
    </nut-form-item>
    <nut-form-item label-width="100">
      <template #label>
        <div class="flex">
          <span>发动机号</span>
        </div>
      </template>
      <input
        v-model="formData.engineNumber"
        class="nut-input-text"
        type="text"
        placeholder="请填写发动机号"
      />
    </nut-form-item>
    <nut-form-item label-width="100">
      <template #label>
        <span>注册日期</span>
      </template>
      <div
        class="flex justify-between w-full"
        @click="
          () => {
            state.show = true;
            state.type = 2;
          }
        "
      >
        <input
          v-model="formData.registrationDate"
          class="nut-input-text"
          type="text"
          :disabled="true"
          placeholder="请选择注册日期"
        />
        <span class="icon-arrow-right-bold iconfont"></span>
      </div>
    </nut-form-item>
    <nut-form-item label-width="100">
      <template #label>
        <span>发证日期</span>
      </template>
      <div
        class="flex justify-between w-full"
        @click="
          () => {
            state.show = true;
            state.type = 1;
          }
        "
      >
        <input
          v-model="formData.issueDate"
          class="nut-input-text"
          type="text"
          :disabled="true"
          placeholder="请选择发证日期"
        />
        <span class="icon-arrow-right-bold iconfont"></span>
      </div>
    </nut-form-item>
    <nut-form-item label-width="100">
      <template #label>
        <div class="flex">
          <span>核载人数</span>
        </div>
      </template>
      <input
        v-model="formData.passengerCapacity"
        class="nut-input-text"
        type="text"
        placeholder="请输入核载人数"
      />
    </nut-form-item>
    <nut-form-item label-width="100">
      <template #label>
        <div class="flex">
          <span>总质量</span>
        </div>
      </template>
      <input
        v-model="formData.totalWeight"
        class="nut-input-text"
        type="text"
        placeholder="请输入总质量"
      />
    </nut-form-item>
    <nut-form-item label-width="100">
      <template #label>
        <div class="flex">
          <span>整备质量</span>
        </div>
      </template>
      <input
        v-model="formData.curbWeight"
        class="nut-input-text"
        type="text"
        placeholder="请输入整备质量"
      />
    </nut-form-item>
    <nut-form-item label-width="100">
      <template #label>
        <div class="flex">
          <span>外廓尺寸(mm)</span>
        </div>
      </template>
      <input
        v-model="formData.overallDimension"
        class="nut-input-text"
        type="text"
        placeholder="请输入外廓尺寸"
      />
    </nut-form-item>
    <nut-form-item label-width="100">
      <template #label>
        <div class="flex">
          <span>档案编码</span>
        </div>
      </template>
      <input
        v-model="formData.recordNumber"
        class="nut-input-text"
        type="text"
        placeholder="请输入档案编码"
      />
    </nut-form-item>
  </nut-form>
  <van-popup
    :show="state.show"
    position="bottom"
    :round="true"
    :z-index="999"
    @close="state.show = false"
  >
    <van-datetime-picker
      type="date"
      visible-item-count="5"
      :value="dayjs().valueOf()"
      :min-date="dayjs().subtract(1, 'year').valueOf()"
      :show-toolbar="true"
      :max-date="dayjs().add(1, 'year').valueOf()"
      @cancel="state.show = false"
      @confirm="confirm"
    />
  </van-popup>
</template>
<script lang="ts" setup>
//
import { reactive, watch, ref } from 'vue';
import dayjs from 'dayjs';
import { YMD_EN, useToast } from '@/utils';
import NrzRadio from '@/components/nrz-radio/index.vue';
import NrzRadioGroup from '@/components/nrz-radio-group/index.vue';
let props = withDefaults(defineProps<{ back: any; front: any }>(), {
  back: () => ({}),
  front: () => ({}),
});
let ruleForm = ref();
let state = reactive({
  show: false,
  type: 0,
});
let formData = reactive({
  address: '',
  engineNumber: '',
  issueAuthority: '',
  issueDate: '',
  licensePlateNumber: '',
  model: '',
  owner: '',
  registrationDate: '',
  useNature: '',
  vinCode: '',
  curbWeight: '',
  energySign: '',
  overallDimension: '',
  passengerCapacity: '',
  recordNumber: '',
  totalWeight: '',
});

const confirm = (v) => {
  let time = dayjs(v.detail).format(YMD_EN);
  state.show = false;
  if (state.type === 1) {
    formData.issueDate = time;
  }
  if (state.type === 2) {
    formData.licensePlateNumber = time;
  }
};
const setFormData = (v) => {
  console.table(v);
  for (let key in v) {
    formData[key] = v[key];
  }
};

watch(
  () => props.back,
  (v) => {
    setFormData(v);
  }
);
watch(
  () => props.front,
  (v) => {
    setFormData(v);
  }
);
const validateLicense = () => {
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
  validateLicense,
});
</script>
