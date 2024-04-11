<template>
  <CustomBar class="fixed" background-color="#fff" :border="true">
    <template #title> 开发票 </template>
    <template #customLeft>
      <span @click="goTitle(1)">发票抬头</span>
    </template>
  </CustomBar>

  <div
    :style="{
      paddingTop: `${headerHeight}px`,
    }"
    class="box-border h-full overflow-auto"
  >
    <div class="font-bold h-35px px-16px leading-35px">发票类型</div>
    <div class="bg-fff pt-16px pb-20px">
      <section class="px-70px">
        <div
          class="flex items-center justify-between border border-solid text-12px leading-40px h-40px border-primary"
        >
          <div
            class="box-border flex-1 h-full text-center px-10px"
            :class="{
              'bg-hex-11264d': type === 1,
              'text-light-50': type === 1,
              'bg-opacity-60': type === 1,
            }"
            @click="
              () => {
                changeType(1);
              }
            "
          >
            普通发票电子版
          </div>
          <div
            class="box-border flex-1 h-full text-center px-10px"
            :class="{
              'text-light-50': type === 2,
              'bg-hex-11264d': type === 2,
              'bg-opacity-60': type === 2,
            }"
            @click="
              () => {
                changeType(2);
              }
            "
          >
            专用发票电子版
          </div>
        </div>
      </section>
      <div class="text-center text-10px opacity-40 text-primary mt-10px">
        * 前晨发票均提供电子版。电子票据与纸质票据具有同等法律效力
      </div>
    </div>

    <div class="font-bold h-35px px-16px leading-35px">发票详情</div>
    <nut-form ref="ruleForm1" :model-value="formData">
      <nut-form-item label="发票类型">
        <span class="text-normal">{{ formData.invoiceType }}</span>
      </nut-form-item>
      <nut-form-item label="发票抬头">
        <div class="flex items-center" @click="goTitle(0)">
          <span class="mr-6px">{{ invoiceTitle }}</span>
          <span class="icon-fapiaotaitou iconfont"></span>
        </div>
      </nut-form-item>
      <nut-form-item class="relative" label="发票内容">
        <span class="text-normal">{{ formData.content }}</span>
      </nut-form-item>
      <nut-form-item class="relative" label="发票金额">
        <span class="text-normal">{{ formData.money }}元</span>
      </nut-form-item>
    </nut-form>
    <InvoiceTitle v-if="showTitle" :form-data="showTitle"></InvoiceTitle>
    <div class="font-bold h-35px px-16px leading-35px">接受信息</div>
    <nut-form ref="ruleForm2" :model-value="formData">
      <!-- <nut-form-item class="relative" label="电子邮箱" prop="email">
        <nut-input
          v-model="formData.email"
          class="nut-input-text"
          type="text"
        />
      </nut-form-item> -->
      <nut-form-item class="relative" label="电话号码" prop="phone">
        <nut-input
          v-model="formData.phone"
          class="nut-input-text"
          type="text"
        />
      </nut-form-item>
    </nut-form>
    <div class="flex justify-center leading-normal px-16px mt-30px mb-40px">
      <nut-button
        :disabled="disabled"
        class="w-full border-0 text-fff bg-primary"
        shape="square"
        @click="valiteForm"
        >提交</nut-button
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
import { onBeforeMount, reactive, ref, watch, computed } from 'vue';
import CustomBar from '@/components/customHeader/index.vue';
import InvoiceTitle from './InvoiceTitle.vue';
import { store } from '@/stores/index';
import Taro, { useRouter, useDidShow } from '@tarojs/taro';
import { useHeaderHeight, useGetNavigateBackParams } from '@/hooks/index';
import {
  CODE,
  JG,
  jGcustomCount,
  navigateToPage,
  OrderType,
  SET_INVOICE_TITLE,
  useToast,
} from '@/utils/index';
import { openInvoice } from '@/api/index';
definePageConfig({
 transparentTitle: 'auto',
  titlePenetrate: 'YES',
  defaultTitle: '',});
let showTitle = ref<any>(null);
let { params } = useRouter();
let ruleForm1 = ref();
let ruleForm2 = ref();
let type = ref(1);
let beFullTitle = ref(false);
let disabled = ref(false);
const { headerHeight } = useHeaderHeight();
let formData = reactive({
  invoiceType: '电子发票',
  invoiceTitleType: 0,
  invoiceTitle: '',
  content: '',
  money: '',
  email: '',
  phone: '',
});
const valitePhone = (val) => {
  return /^[1][3,4,5,7,8][0-9]{9}$/.test(val);
};
function valiteEmail(val) {
  return (
    '' == val ||
    /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/.test(val)
  );
}
function goTitle(edit) {
  navigateToPage({
    route: 'invoiceTitle',
    params: {
      edit,
    },
  });
}
const invoiceTitle = computed(() => {
  return formData.invoiceTitle ? formData.invoiceTitle : '请选择发票抬头';
});
function changeType(isCollect) {
  type.value = isCollect;
}
function validateTitle(data) {
  let flag = false;
  for (let k in data) {
    if (!data[k]) {
      flag = true;
      break;
    }
  }

  beFullTitle.value = flag;
}

function openBill() {
  let openParams = {
    billType: type.value,
    orderType: params?.orderType,
    id: showTitle.value.id,
    billContent: formData.content,
    mobile: formData.phone,
    email: formData.email,
    orderIds: store().checkedInvoice,
  };
  Taro.showLoading();
  disabled.value = true;
  openInvoice(openParams).then((res) => {
    disabled.value = false;
    Taro.hideLoading();
    if ((params?.orderType, OrderType.CHARGE)) {
      jGcustomCount(JG.CHARGE_011, {
        billType: type.value,
        orderType: params?.orderType,
        money: formData?.money,
      });
    }
    jGcustomCount(JG.MALL_004, {
      billType: type.value,
      orderType: params?.orderType,
      money: formData?.money,
    });
    if (res.code == CODE) {
      Taro.navigateBack({
        success: () => {
          useToast(res.msg);
        },
      });
      return;
    }
    useToast(res.msg);
  });
}
function valiteBill() {
  if (type.value == 2) {
    if (!showTitle.value) return useToast('请选择发票抬头');
    if (beFullTitle.value) {
      navigateToPage({
        route: 'editInvoiceTitleFull',
        params: { ...showTitle.value },
      });
      return;
    }
    openBill();
  } else {
    if (!showTitle.value) return useToast('请选择发票抬头');
    openBill();
  }
}
const valiteForm = () => {
  // if (!formData.email && !formData.phone) {
  //   return useToast('请输入手机号或者邮箱');
  // }
  // if (!valiteEmail(formData.email)) {
  //   return useToast('邮箱格式不正确');
  // }
  if (!valitePhone(formData.phone)) {
    return useToast('手机格式不正确');
  }
  valiteBill();
};
onBeforeMount(() => {
  formData.content = params.content as string;
  formData.money = params.totalPrice as string;
});

useDidShow(() => {
  const invoiceTitle = useGetNavigateBackParams(SET_INVOICE_TITLE);
  console.log('invoiceTitle', invoiceTitle);
  validateTitle(invoiceTitle || { fail: '' });
  if (invoiceTitle) {
    showTitle.value = invoiceTitle;
  }
});

watch(
  () => beFullTitle.value,
  (v) => {
    console.log('beFullTitle', v);
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
