<template>
  <nut-form>
    <nut-form-item label="抬头类型" prop="titleType">
      <span class="text-normal">{{
        formData?.titleType == '1' ? '个人' : '单位'
      }}</span>
    </nut-form-item>
    <nut-form-item label="发票抬头" prop="invoiceTitle">
      <span class="text-normal">{{ formData.invoiceTitle }}</span>
    </nut-form-item>
    <nut-form-item label="税号" prop="taxCode">
      <span class="text-normal">{{ formData.taxCode }}</span>
    </nut-form-item>
    <nut-form-item label="单位地址">
      <span class="text-normal"> {{ formData.address }}</span>
    </nut-form-item>
    <nut-form-item class="relative" label="单位电话">
      <span class="text-normal"> {{ formData.tel }}</span>
    </nut-form-item>
    <nut-form-item class="relative" label="开户银行" prop="openBank">
      <span class="text-normal">{{ formData.openBank }}</span>
    </nut-form-item>
    <nut-form-item class="relative" label="银行账号" prop="bankCode">
      <span class="text-normal">{{ formData.bankCode }}</span>
    </nut-form-item>
  </nut-form>
</template>

<script lang="ts">
import { onShareAppMessage, onShareTimeline } from '@/utils/index';
export default {
  onShareAppMessage,
  onShareTimeline,
};
</script>

<script lang="ts" setup>
definePageConfig({
 transparentTitle: 'auto',
  titlePenetrate: 'YES',
  defaultTitle: '',});
interface FormData {
  formData: {
    address: string;
    titleType: string;
    invoiceTitle: string;
    taxCode: string;
    content: string;
    money: string;
    tel: string;
    openBank: string;
    bankCode: string;
  };
}
withDefaults(defineProps<FormData>(), {
  formData: () => {
    return {
      address: '',
      titleType: '1',
      invoiceTitle: '',
      taxCode: '',
      content: '',
      money: '',
      tel: '',
      openBank: '',
      bankCode: '',
    };
  },
});
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
