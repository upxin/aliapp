<template>
  <CustomBar class="fixed" background-color="#fff" :border="true">
    <template #title> 添加发票抬头 </template>
  </CustomBar>

  <div
    :style="{
      paddingTop: `${headerHeight + 10}px`,
    }"
    class="box-border h-full"
  >
    <nut-form ref="ruleForm1" :model-value="formData">
      <nut-form-item label="抬头类型" prop="titleType">
        <NrzRadioGroup
          v-model:model-value="formData.titleType"
          direction="horizontal"
        >
          <NrzRadio value="2">单位</NrzRadio>
          <NrzRadio value="1">个人</NrzRadio>
        </NrzRadioGroup>
      </nut-form-item>
      <nut-form-item
        label="发票抬头"
        prop="invoiceTitle"
        :show-error-message="false"
        :rules="[
          {
            validator: (v) => {
              return /\S/.test(v);
            },
            message: '请输入发票抬头',
          },
        ]"
      >
        <nut-input
          v-model="formData.invoiceTitle"
          placeholder="请输入发票抬头"
          class="nut-input-text"
          type="text"
        />
      </nut-form-item>
      <nut-form-item
        v-if="formData.titleType == 1"
        label="税号"
        prop="taxCode"
        :rules="[
          {
            validator: (v) => {
              return v?.length >= 18 || !v;
            },
            message: '税号不得小于18位',
          },
        ]"
      >
        <nut-input
          v-model="formData.taxCode"
          placeholder="请输入税号"
          class="nut-input-text"
          type="text"
        />
      </nut-form-item>
      <nut-form-item
        v-if="formData.titleType == 2"
        label="税号"
        prop="taxCode"
        :rules="[
          {
            validator: (v) => {
              return v?.length >= 18;
            },
            message: '税号不得小于18位',
          },
        ]"
      >
        <nut-input
          v-model="formData.taxCode"
          placeholder="请输入税号"
          class="nut-input-text"
          type="text"
        />
      </nut-form-item>
      <nut-form-item
        label="单位地址"
        prop="address"
        :show-error-message="false"
        :show-error-line="false"
      >
        <nut-input
          v-model="formData.address"
          class="nut-input-text"
          placeholder="请输入单位地址"
          type="text"
        />
      </nut-form-item>
      <nut-form-item
        class="relative"
        label="单位电话"
        prop="tel"
        :show-error-message="false"
        :rules="[{ validator: valitePhone, message: '电话格式不正确' }]"
      >
        <nut-input
          v-model="formData.tel"
          class="nut-input-text"
          type="text"
          placeholder="请输入单位电话"
        />
      </nut-form-item>
      <nut-form-item class="relative" label="开户银行" prop="openBank">
        <nut-input
          v-model="formData.openBank"
          class="nut-input-text"
          type="text"
          placeholder="请输入单位开户银行"
        />
      </nut-form-item>
      <nut-form-item class="relative" label="银行账号" prop="bankCode">
        <nut-input
          v-model="formData.bankCode"
          class="nut-input-text"
          type="text"
          placeholder="请输入单位银行账号"
        />
      </nut-form-item>
    </nut-form>
    <div class="flex justify-center leading-normal px-16px mt-30px">
      <nut-button
        class="w-full border-0 text-fff bg-primary"
        shape="square"
        @click="valiteForm"
        >添加</nut-button
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
import { reactive, ref } from 'vue';
import CustomBar from '@/components/customHeader/index.vue';
import Taro from '@tarojs/taro';
import { useHeaderHeight } from '@/hooks/index';
import { CODE, useToast } from '@/utils/index';
import { addInvoiceTitle } from '@/api/index';
import NrzRadio from '@/components/nrz-radio/index.vue';
import NrzRadioGroup from '@/components/nrz-radio-group/index.vue';
definePageConfig({
 transparentTitle: 'always',
  titlePenetrate: 'YES',
  defaultTitle: '',});

let ruleForm1 = ref();
const { headerHeight } = useHeaderHeight();
let formData = reactive({
  address: '',
  titleType: '1',
  invoiceTitle: '',
  taxCode: '',
  content: '',
  money: '',
  tel: '',
  openBank: '',
  bankCode: '',
});
const valitePhone = (val) => {
  console.log(val);
  return /^[1][3,4,5,7,8][0-9]{9}$/.test(val) || val === '';
};

const valiteForm = () => {
  ruleForm1.value.validate().then(({ valid, errors }: any) => {
    if (valid) {
      addInvoiceTitle(formData).then((res) => {
        if (res?.code == CODE) {
          useToast(res?.msg);
          Taro.navigateBack();
        }
      });
    } else {
      Taro.showToast({
        title: errors[0].message,
        icon: 'none',
      });
    }
  });
};
</script>
<style lang="scss">
.nut-cell {
  // 覆盖label样式
  color: var(--color-primary);
}
.nut-input-text {
  padding: 0;
  color: #b9b9b9;
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
.nut-placeholder {
  font-size: 14px;
}
.nut-form-item__label {
  color: rgba(16, 16, 16, 0.4);
}
</style>
