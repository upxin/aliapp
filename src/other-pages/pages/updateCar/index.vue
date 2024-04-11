<template>
  <CustomBar :border="true" background-color="#fff"
    ><template #title> 更新车辆信息 </template></CustomBar
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
        <nut-input
          v-model="formData.vin"
          class="nut-input-text"
          placeholder="请输入车架编号"
          disabled
          type="text"
        />
      </nut-form-item>
      <nut-form-item
        class="relative"
        label="车辆别名："
        prop="name"
        :show-error-line="false"
        :rules="[{ required: true, message: '请输入车辆别名' }]"
      >
        <nut-input
          v-model="formData.name"
          class="nut-input-text"
          placeholder="请输入车辆别名"
          type="text"
        />
      </nut-form-item>
      <nut-form-item
        label="车牌号："
        prop="licensePlateNum"
        :show-error-line="false"
      >
        <nut-input
          v-model="formData.licensePlateNum"
          class="nut-input-text"
          placeholder="请输入车牌号"
          type="text"
        />
      </nut-form-item>
      <nut-form-item
        :show-error-line="false"
        label="保险公司："
        prop="insurerName"
      >
        <div class="flex justify-between" @click="chooseCompany">
          <span v-if="formData.insurerName" class="text-g">{{
            formData.insurerName
          }}</span>
          <span v-else>请选择保险公司</span>
          <span class="iconfont icon-arrow-right-bold text-hex-aaa"></span>
        </div>
      </nut-form-item>
      <nut-form-item :show-error-line="false" label="到期时间：" prop="time">
        <div class="flex justify-between" @click="chooseDeadLine">
          <span v-if="formData.time" class="text-g">{{ formData.time }}</span>
          <span v-else>请选择到期时间</span>
          <span class="iconfont icon-arrow-right-bold text-hex-aaa"></span>
        </div>
      </nut-form-item>
    </nut-form>
    <section class="px-16px text-12px text-normal opacity-34 mt-40px">
      <div class="flex leading-5 text-left">
        <div class="w-70px">温馨提示：</div>
        <div class="flex flex-col flex-1">
          <span>
            1.车主添加车辆时绑定保险公司和到期时间，可在特殊情况时直接拨打保险公司电话；
          </span>
          <span>2. 解除车辆后司机添加的车辆也自动被解除。</span>
        </div>
      </div>
    </section>
    <div class="flex justify-center leading-normal px-16px mt-30px">
      <nut-button
        class="w-full border-hex-09024A text-hex-09024A"
        @click="valiteForm"
        >更新</nut-button
      >
    </div>
    <div class="flex justify-center leading-normal px-16px mt-30px">
      <nut-button
        class="w-full border-hex-101010 text-normal opacity-53"
        @click="_unbindCar"
        >解除车辆</nut-button
      >
    </div>
  </div>
  <NrzAction
    v-model:show="show"
    tips="请选择保险公司"
    :item-list="INSURE_COMPONY"
    @choose="chooseItem"
  >
  </NrzAction>
  <NrzDateTime ref="datePicker" :type="2" @confirm="confirm"></NrzDateTime>
</template>

<script lang="ts">
import { onShareAppMessage, onShareTimeline } from '@/utils/index';
export default {
  onShareAppMessage,
  onShareTimeline,
};
</script>

<script lang="ts" setup>
import { reactive, ref, computed, watch } from 'vue';
import CustomBar from '@/components/customHeader/index.vue';
import { systemInfo } from '@/stores/systemInfo';
import Taro, { useRouter } from '@tarojs/taro';
import { updateCarInfo, unbindCar } from '@/api/index';
import { INSURE_COMPONY, useToast, CODE, goPages } from '@/utils/index';
import NrzAction from '@/components/nrz-action/index.vue';
import NrzDateTime from '@/components/nrz-datetime/index.vue';

definePageConfig({ transparentTitle: 'auto',titlePenetrate: 'YES',defaultTitle: '', });
const minDate = new Date(2020, 0, 1);
const maxDate = new Date(2025, 10, 1);
const formData = reactive({
  vin: '',
  name: '',
  insurerName: '',
  id: '',
  licensePlateNum: '',
  time: '',
  currentDate: new Date(),
});
const datePicker = ref();
const show = ref(false);
const showDate = ref(false);
const chooseItem = (res) => {
  formData.insurerName = res.name;
};
const confirm = (res) => {
  formData.time = res.result;
};

function chooseCompany() {
  show.value = true;
}
function chooseDeadLine() {
  datePicker.value.show();
}

let CalcPt = computed(
  () => systemInfo().RightBtnRect.h + systemInfo().RightBtnRect.t + 10
);

function _updateCar() {
  let { vin, name, time, licensePlateNum, id } = formData;
  updateCarInfo({ vin, name, time, licensePlateNum, id }).then((res) => {
    if (res.code === CODE) {
      useToast(res.msg);
      setTimeout(() => {
        goPages('index');
      }, 3000);
    }
  });
}

function _unbindCar() {
  unbindCar({ vin: formData.vin }).then((res) => {
    if (res.code === CODE) {
      useToast(res.msg);
      setTimeout(() => {
        goPages('index');
      }, 3000);
    }
  });
}

const ruleForm1 = ref<any>(null);
const valiteForm = () => {
  ruleForm1.value.validate().then(({ valid, errors }: any) => {
    if (valid) {
      _updateCar();
    } else {
      Taro.showToast({
        title: errors[0].message,
        icon: 'none',
      });
    }
  });
};

watch(
  () => useRouter().params,
  (v) => {
    if (v) {
      if (useRouter().params?.toast) {
        useToast(useRouter().params?.toast);
      }
      formData.vin = v?.vin || '';
      formData.id = v?.insurerId || '';
      formData.name = v?.name || '';
      formData.licensePlateNum = v?.licensePlateNum || '';
      formData.time = v?.time || '';
      formData.insurerName = v?.insurerName || '';
    }
  },
  {
    immediate: true,
    deep: true,
  }
);
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
.nut-cell-group__warp {
  margin: 0;
}
</style>
