<template>
  <nut-form ref="ruleForm" :model-value="formData">
    <div
      class="border-0 border-solid ml-14px text-16px px-16px mt-20px mb-10px font-700 pl-6px border-l-3px border-normal"
    >
      司机信息
    </div>

    <nut-form-item prop="driver" label-width="100">
      <template #label>
        <div class="flex">
          <span>司机名称</span>
          <span class="text-danger ml-4px">*</span>
        </div>
      </template>
      <input
        :placeholder="formData.driver"
        class="nut-input-text"
        :disabled="true"
        type="text"
      />
    </nut-form-item>
    <nut-form-item prop="driverMobile" label-width="100">
      <template #label>
        <div class="flex">
          <span>司机手机</span>
          <span class="text-danger ml-4px">*</span>
        </div>
      </template>
      <input
        :placeholder="formData.driverMobile"
        class="nut-input-text"
        type="text"
        :disabled="true"
      />
    </nut-form-item>
    <div class="leading-normal opacity-50 ml-6px text-10px px-20px py-14px">
      * 完善司机信息，可自动开通前晨APP账号，司机可在APP上查看车辆相关数据。
    </div>
    <div
      class="border-0 border-solid ml-14px text-16px px-16px mt-20px mb-10px font-700 pl-6px border-l-3px border-normal"
    >
      基础信息
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
        :placeholder="formData.licensePlateNumber"
        class="nut-input-text"
        type="text"
        :disabled="true"
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
        :placeholder="formData.vinCode"
        class="nut-input-text"
        type="text"
        :disabled="true"
      />
    </nut-form-item>
    <nut-form-item label-width="100">
      <template #label>
        <div class="flex">
          <span>品牌型号</span>
        </div>
      </template>
      <input
        :placeholder="formData.model"
        class="nut-input-text"
        :disabled="true"
        type="text"
      />
    </nut-form-item>
    <nut-form-item label-width="100">
      <template #label>
        <div class="flex">
          <span>所有人</span>
        </div>
      </template>
      <input
        :placeholder="formData.owner"
        :disabled="true"
        class="nut-input-text"
        type="text"
      />
    </nut-form-item>
    <nut-form-item label-width="100">
      <template #label>
        <div class="flex">
          <span>住址</span>
        </div>
      </template>
      <input
        :placeholder="formData.address"
        :disabled="true"
        class="nut-input-text"
        type="text"
      />
    </nut-form-item>
    <nut-form-item label-width="100">
      <template #label>
        <div class="flex">
          <span>使用性质</span>
        </div>
      </template>
      <NrzRadioGroup v-model:model-value="formData.useNature">
        <NrzRadio value="营运" :disabled="true">营运</NrzRadio>
        <NrzRadio value="非营运" :disabled="true">非营运</NrzRadio>
      </NrzRadioGroup>
    </nut-form-item>
    <nut-form-item label-width="100">
      <template #label>
        <div class="flex">
          <span>发动机号</span>
        </div>
      </template>
      <input
        :placeholder="formData.engineNumber"
        :disabled="true"
        class="nut-input-text"
        type="text"
      />
    </nut-form-item>
    <nut-form-item label-width="100">
      <template #label>
        <span>注册日期</span>
      </template>
      <div class="flex justify-between w-full">
        <input
          :placeholder="formData.registrationDate"
          class="nut-input-text"
          type="text"
          :disabled="true"
        />
        <span class="icon-arrow-right-bold iconfont"></span>
      </div>
    </nut-form-item>
    <nut-form-item label-width="100">
      <template #label>
        <span>发证日期</span>
      </template>
      <div class="flex justify-between w-full">
        <input
          :placeholder="formData.issueDate"
          class="nut-input-text"
          type="text"
          :disabled="true"
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
        :placeholder="formData.passengerCapacity"
        class="nut-input-text"
        :disabled="true"
        type="text"
      />
    </nut-form-item>
    <nut-form-item label-width="100">
      <template #label>
        <div class="flex">
          <span>总质量</span>
        </div>
      </template>
      <input
        :placeholder="formData.totalWeight"
        class="nut-input-text"
        type="text"
        :disabled="true"
      />
    </nut-form-item>
    <nut-form-item label-width="100">
      <template #label>
        <div class="flex">
          <span>整备质量</span>
        </div>
      </template>
      <input
        :placeholder="formData.curbWeight"
        class="nut-input-text"
        type="text"
        :disabled="true"
      />
    </nut-form-item>
    <nut-form-item label-width="100">
      <template #label>
        <div class="flex">
          <span>外廓尺寸(mm)</span>
        </div>
      </template>
      <input
        :placeholder="formData.overallDimension"
        class="nut-input-text"
        :disabled="true"
        type="text"
      />
    </nut-form-item>
    <nut-form-item label-width="100">
      <template #label>
        <div class="flex">
          <span>档案编码</span>
        </div>
      </template>
      <input
        :placeholder="formData.recordNumber"
        class="nut-input-text"
        :disabled="true"
        type="text"
      />
    </nut-form-item>
  </nut-form>
</template>
<script lang="ts" setup>
//
import { reactive, watch, ref, onMounted } from 'vue';
import NrzRadio from '@/components/nrz-radio/index.vue';
import NrzRadioGroup from '@/components/nrz-radio-group/index.vue';
let props = withDefaults(defineProps<{ data: any }>(), {
  data: {},
});
let ruleForm = ref();
let formData = reactive({
  driver: '',
  driverMobile: '',
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

const setFormData = (v) => {
  console.log(456, v);
  for (let key in v) {
    formData[key] = v[key];
  }
};

watch(
  () => props.data,
  (v) => {
    setFormData(v);
  }
);
onMounted(() => {
  setFormData(props.data);
});
</script>
<style>
.input-placeholder {
  color: #999;
}
</style>
