<template>
  <div class="text-g px-16px mt-40px nrz-thin">买家信息</div>
  <NrzForm ref="ruleForm1" class="px-16px">
    <NrzFormItem label="购车类型" :fullBorder="false">
      <template #right>
        <NrzRadioGroup
          v-model:model-value="formData.customer_type"
          @change="
            (v) => {
              Store.setChoosedBuyType(v);
            }
          "
        >
          <NrzRadio value="0">个人购车</NrzRadio>
          <NrzRadio value="1">企业购车</NrzRadio>
        </NrzRadioGroup>
      </template>
    </NrzFormItem>
    <NrzFormItem
      label="买家姓名"
      :fullBorder="false"
      :rules="[{ required: true, message: '请输入买家姓名' }]"
    >
      <NrzInput
        v-model:value="formData.buyer_name"
        placeholder="请输入买家姓名"
        :inp-class="{ 'text-primary': true }"
        type="text"
      />
    </NrzFormItem>
    <NrzFormItem
      label="上牌城市"
      :fullBorder="false"
      :rules="[{ required: true, message: '请选择上牌城市' }]"
    >
      <section class="flex items-center justify-between">
        <NrzInput
          v-model:value="formData.city"
          :clearable="false"
          placeholder="请选择上牌城市"
          :inp-class="{ 'text-primary': true }"
          type="text"
          readonly
          @click="handelCity"
        />
        <span class="iconfont icon-arrow-right-bold text-hex-aaa"></span>
      </section>
    </NrzFormItem>
    <NrzFormItem
      label="交付中心"
      :bottomBorder="false"
      :rules="[{ required: true, message: '请选择交付中心' }]"
    >
      <section class="flex items-center justify-between">
        <NrzInput
          v-model:value="formData.center"
          :clearable="false"
          placeholder="请选择交付中心"
          :inp-class="{ 'text-primary': true }"
          type="text"
          readonly
          @click="handelCenter"
        />
        <span class="iconfont icon-arrow-right-bold text-hex-aaa"></span>
      </section>
    </NrzFormItem>
    <div class="text-g mt-40px nrz-thin my-10px">车主信息</div>
    <div
      class="bg-hex-f5f5f5 text-hex-000 opacity-36 text-12px h-35px leading-35px pl-8px"
    >
      * 车主是机动车销售统一发票人，也是车辆行驶证上所有人。
    </div>
    <template v-if="formData.customer_type === '1'">
      <NrzFormItem
        label="企业名称"
        :fullBorder="false"
        :rules="[{ required: true, message: '请输入企业名称' }]"
      >
        <NrzInput
          v-model:value="formData.owner_name"
          placeholder="请输入企业名称"
          type="text"
        />
      </NrzFormItem>
      <NrzFormItem
        label="企业代码"
        :fullBorder="false"
        :rules="[{ required: true, message: '请输入社会统一信用码' }]"
      >
        <NrzInput
          v-model:value="formData.card_no"
          placeholder="请输入社会统一信用码"
          type="text"
        />
      </NrzFormItem>
    </template>

    <template v-if="formData.customer_type === '0'">
      <NrzFormItem
        label="车主姓名"
        :fullBorder="false"
        :rules="[{ required: true, message: '请输入车主姓名' }]"
      >
        <NrzInput
          v-model:value="formData.owner_name"
          placeholder="请输入车主姓名"
          type="text"
        />
      </NrzFormItem>
      <NrzFormItem
        label="证件类型"
        :fullBorder="false"
        :rules="[{ required: true, message: '请选择证件类型' }]"
      >
        <section class="flex items-center justify-between">
          <NrzInput
            v-model:value="formData.idType"
            :clearable="false"
            placeholder="请选择证件类型"
            :inp-class="{ 'text-primary': true }"
            type="text"
            readonly
            @click="handelIdType"
          />
          <span class="iconfont icon-arrow-right-bold text-hex-aaa"></span>
        </section>
      </NrzFormItem>
      <NrzFormItem
        label="证件号码"
        :fullBorder="false"
        :rules="[{ required: true, message: '请输入证件号码' }]"
      >
        <NrzInput
          v-model:value="formData.card_no"
          placeholder="请输入证件号码"
          type="text"
        />
      </NrzFormItem>
    </template>

    <NrzFormItem label="电话号码" :bottomBorder="false">
      <div class="flex items-center">
        <NrzInput
          v-model:value="formData.contact"
          style="width: 94px; color: #11264d"
          :disabled="true"
          type="text"
          :clearable="false"
        />
        <span class="opacity-60 text-12px nrz-thin"
          >（请确定该账号为车主所有）</span
        >
      </div>
    </NrzFormItem>
  </NrzForm>
  <div class="text-g px-16px mt-40px nrz-thin my-10px">付款信息</div>
  <NrzForm class="px-16px">
    <NrzFormItem label="付款方式" :bottomBorder="false">
      <NrzRadioGroup v-model:model-value="formData.pay_type">
        <NrzRadio value="1">分期</NrzRadio>
        <NrzRadio value="2">全款</NrzRadio>
      </NrzRadioGroup>
    </NrzFormItem>
  </NrzForm>
  <section class="px-16px">
    <NrImg
      :url="FINANCIAL_CALC"
      :overlay="true"
      mode="scaleToFill"
      onlyImg
      :blur="true"
      class="box-border relative w-full overflow-hidden h-122px bg-cover"
      @click="goToCalc"
    >
      <div class="mt-30px ml-10px text-light-50">
        {{ '分期购车计算器 >>' }}
      </div>
    </NrImg>
    <div class="text-g text-10px mt-10px mb-27px">
      * 分期请以线下交付中心实际沟通为准，以上金融计算器仅供参考。
    </div>
    <div class="flex justify-center py-20px">
      <NrzCheckBox
        v-model:checked="read"
        color="#11264d"
        borderColor="#11264d"
        size="30rpx"
      >
        <div class="flex items-center">
          <span>已仔细阅读并同意</span>
          <span style="color: #1990ff" @click.stop="goToProtocol">
            {{ '《前晨汽车购车协议》' }}
          </span>
        </div>
      </NrzCheckBox>
    </div>
  </section>
  <NrzAction
    v-model:show="showCenterPanel"
    :item-list="centers"
    tips="请选择交付中心"
    @click="chooseCenter"
  >
  </NrzAction>

  <NrzAction
    v-model:show="showIdPanel"
    :item-list="idTypes"
    tips="请选择证件类型"
    @click="chooseIdType"
  >
  </NrzAction>
  <NrzAddr v-model:show="cityVisible" :layer="2" @change="getPath"></NrzAddr>
</template>
<script lang="ts" setup>
import { onBeforeMount, reactive, ref, watch } from 'vue';
import Taro from '@tarojs/taro';
import {
  CODE,
  getStore,
  USER_INFO,
  nrNavigateTo,
  setStore,
  LOCAL_BUY_TYPE,
  ID_MAP,
  FINANCIAL_CALC,
  jGcustomCount,
  JG,
} from '@/utils/index';
import { store, CarConf } from '@/stores/index';
import { getDeliveryCenter, createOrder } from '@/api/index';
import NrImg from '@/components/img/img.vue';
import NrzCheckBox from '@/components/nrz-checkbox/index.vue';
import NrzRadio from '@/components/nrz-radio/index.vue';
import NrzRadioGroup from '@/components/nrz-radio-group/index.vue';
import NrzAction from '@/components/nrz-action/index.vue';
import NrzAddr from '@/components/nrz-addr/index.vue';
import NrzForm from '@/components/nrz-form/index.vue';
import NrzFormItem from '@/components/nrz-form-item/index.vue';
import NrzInput from '@/components/nrz-input/index.vue';

let Store = store();
const rules1 = [
  {
    name: 'buyer_name',
    rule: ['required'],
    msg: ['请输入买家姓名'],
  },
  {
    name: 'city',
    rule: ['required'],
    msg: ['请选择上牌城市'],
  },
  {
    name: 'center',
    rule: ['required'],
    msg: ['请选择交付中心'],
  },
];
const selfRules = [
  {
    name: 'owner_name',
    rule: ['required'],
    msg: ['请输入车主姓名'],
  },
  {
    name: 'idType',
    rule: ['required'],
    msg: ['请选择证件类型'],
  },
  {
    name: 'card_no',
    rule: ['required'],
    msg: ['请输入证件号码'],
  },
];
const compRules = [
  {
    name: 'owner_name',
    rule: ['required'],
    msg: ['请输入企业名称'],
  },
  {
    name: 'card_no',
    rule: ['required'],
    msg: ['请输入社会统一信用码'],
  },
];

const CarConfStore = CarConf();
let showCenterPanel = ref(false);
let showIdPanel = ref(false);
let centers = ref<any[]>();
let idTypes: any[] = ID_MAP;
let ruleForm1 = ref<any>(null);

let formData = reactive({
  buyer_name: '', // 买家姓名
  city_id: '', // 城市id
  owner_name: '', //车主
  card_type: '', //证件类型
  card_no: '', //证件号码
  pay_type: '1', // 支付方式(1.分期，2全款)
  customer_type: '0', // 0：个人 1：企业
  address_id: '', //交付中心code
  contact: '', // 联系人手机号
  member_id: '', //登录人id
  must: [], // 选配列表(颜色+选装包)
  type: '', //车辆型号mock: EC1
  color: null,
  agreement: 1,
  // 下面从选配接口取
  deposit: 1,
  plan: '',
  amount: '', // 这个是总价
  specs_id: '',
  mutual_exclusion: '',

  city: '',
  center: '',
  idType: '',
});
let read = ref(false);
let telephone = '';
let goToProtocol = () => {
  nrNavigateTo('protocol');
};
const cityVisible = ref(false);
let handelCity = () => {
  cityVisible.value = true;
};
function getPath(e) {
  formData.city = e.text?.[1];
  formData.city_id = e.value?.[1]; // 上传给后端的
  formData.center = '';
  Taro.showLoading();
  _getDeliveryCenter(e.value?.[1]);
}
let handelCenter = () => {
  if (!formData.city_id) {
    Taro.showToast({ title: '请选择上牌城市', icon: 'none' });
    return;
  }
  showCenterPanel.value = true;
};
let handelIdType = () => {
  showIdPanel.value = true;
};
let chooseIdType = (res) => {
  formData.idType = res.name;
  formData.card_type = res.id;
};

let chooseCenter = (res) => {
  console.log(res, '000');
  formData.center = res.name;
  formData.address_id = res.code;
  telephone = res?.telephone;
};
watch(
  () => Store.choosedBuyType,
  (v) => {
    formData.customer_type = v;
    setStore(LOCAL_BUY_TYPE, v);
  }
);
function goToCalc() {
  nrNavigateTo('carInstallmentCalculator', { tel: telephone });
}
function _submitPay() {
  let user = getStore(USER_INFO);
  let amount = CarConfStore.state.totalPrice;

  let {
    buyer_name,
    city_id,
    owner_name,
    card_type,
    card_no,
    pay_type,
    customer_type,
    address_id,
    contact,
    color,
    city,
  } = formData;
  const type = CarConfStore.state.type;
  const imgUrl = CarConfStore.state.imgUrl;

  const optional = CarConfStore.state?.optional?.length
    ? CarConfStore.state?.optional
    : [];
  const selection = CarConfStore.state?.selection
    ? [CarConfStore.state?.selection]
    : []; // 防止传null给后端

  const choose = [CarConfStore.state?.color, ...selection, ...optional];

  const params = {
    openid: user.bindBean[0].open_id,
    buyer_name,
    name: buyer_name,
    city_id,
    city,
    owner_name,
    card_type,
    card_no,
    pay_type,
    customer_type,
    address_id,
    contact,
    member_id: user?.member_id,
    optional: null,
    must: choose,
    type,
    color,
    selection: null,
    agreement: 1,
    deposit,
    plan,
    amount,
    specs_id,
    mutual_exclusion,
    imgUrl,
  };
  createOrder(params).then((res) => {
    jGcustomCount(JG.BOOK_004, params);
    if (res.code !== CODE) return;
    const order = res.data.wepay;
    if (!order) {
      Taro.showToast({
        title: '订单生成失败',
        icon: 'none',
      });
      return;
    }
    Taro.requestPayment({
      timeStamp: order.timestamp,
      nonceStr: order.noncestr,
      package: order.packager,
      signType: 'MD5',
      paySign: order.sign,
      success: function () {
        nrNavigateTo('success', {
          color: formData.color,
          order_id: res?.data?.order_id,
        });
      },
      fail: function (err) {
        Taro.showToast({
          title: '支付失败',
          icon: 'none',
        });
      },
    });
  });
}

let valiteForm = () => {
  let form1 = new Promise((resolve, reject) => {
    ruleForm1.value
      .validate(
        formData,
        formData.customer_type == '1'
          ? [...rules1, ...compRules]
          : [...rules1, ...selfRules]
      )
      .then((res) => {
        console.log('校验通过！');
      })
      .catch((errors) => {
        console.log(errors);
      });
  });

  Promise.all([form1])
    .then(() => {
      if (!read.value) {
        return Taro.showToast({
          title: '请阅读并同意购车协议',
          icon: 'none',
        });
      }
      _submitPay();
    })
    .catch((error) => {
      Taro.showToast({
        title: error[0].message,
        icon: 'none',
      });
    });
};

function _getDeliveryCenter(adcode) {
  getDeliveryCenter({ cityId: adcode })
    .then((res) => {
      if (res.code !== CODE) return;
      centers.value = res.data?.map((item) => {
        return {
          ...item,
          text: item.name,
        };
      });
    })
    .catch(() => {
      Taro.hideLoading();
    })
    .finally(() => {
      Taro.hideLoading();
    });
}
const props = defineProps({
  carConfig: {
    type: Object,
    default: () => {
      return {};
    },
  },
});
onBeforeMount(() => {
  formData.customer_type = Store.choosedBuyType;
  formData.contact = getStore(USER_INFO)?.mobile;
});

defineExpose({
  valiteForm,
});
</script>
<style lang="scss">
.nut-cell {
  // 覆盖label样式
  color: var(--color-primary);
}
.input-placeholder {
  color: #cccccc;
}
.nut-cell--clickable::before {
  content: none;
}
</style>
