<template>
  <CustomHeader background-color="#fff">
    <template #customLeft>
      <span @click="handleDelAddr">删除</span>
    </template>
    <template #title>编辑收货地址</template>
  </CustomHeader>
  <div :style="{ height: `${headerHeight}px` }"></div>
  <nut-form ref="ruleForm" :model-value="formData">
    <nut-form-item
      label="收货人"
      prop="name"
      required
      :rules="[{ required: true, message: '请输入姓名' }]"
    >
      <input
        v-model="formData.name"
        class="nut-input-text"
        placeholder="请输入姓名"
        type="text"
      />
    </nut-form-item>
    <nut-form-item
      label="手机号码"
      prop="contact"
      required
      :rules="[
        { required: true, message: '请输入手机号码' },
        {
          validator: customValidatorPhone,
          message: '手机号不合法',
        },
      ]"
    >
      <input
        v-model="formData.contact"
        class="nut-input-text"
        placeholder="请输入手机号码"
        type="text"
      />
    </nut-form-item>
    <nut-form-item
      label="所在地区"
      required
      prop="addr"
      :rules="[{ required: true, message: '请选择地区' }]"
    >
      <div class="flex justify-between" @click="choose_area">
        <input
          :value="formData.addr"
          class="nut-input-text"
          type="text"
          placeholder="请选择所在地区"
          :disabled="true"
        />
        <span class="iconfont icon-arrow-right-bold"></span>
      </div>
    </nut-form-item>
    <nut-form-item
      label="详细地址"
      prop="address"
      required
      :rules="[{ required: true, message: '请输入详细地址' }]"
    >
      <nut-textarea
        v-model="formData.address"
        placeholder="请输入详细地址"
        type="text"
      />
    </nut-form-item>
    <nut-form-item label="是否默认">
      <NrzSwitch
        v-model:checked="formData.is_default"
        scaleRatio="0.8"
      ></NrzSwitch>
    </nut-form-item>
  </nut-form>
  <button
    class="rounded-none bg-primary text-fff mx-30px mt-20px py-10px"
    @click="validate_form"
  >
    保存收货地址
  </button>
  <Cascader v-model:show="visible" :layer="3" @change="change"></Cascader>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import CustomHeader from '@/components/customHeader/index.vue';
import {
  getArea,
  add_receiver_addr,
  editReceiverAddr,
  delAddr,
} from '@/api/mall';
import {
  webServerApiKey,
  getStore,
  USER_INFO,
  useToast,
  customValidatorPhone,
} from '@/utils/index';
import Taro, { useDidShow, useRouter } from '@tarojs/taro';
import { useHeaderHeight, useRequest } from '@/hooks/index';
import NrzSwitch from '@/components/nrz-switch/index.vue';
import Cascader from '@/components/nrz-addr/index.vue';

definePageConfig({
 transparentTitle: 'auto',
  titlePenetrate: 'YES',
  defaultTitle: '',});

let ruleForm = ref();
let params = useRouter().params;
let { headerHeight } = useHeaderHeight();
const formData = reactive({
  name: '',
  contact: '',
  address: '',
  addr: '',
  is_default: true,
});
const visible = ref(false);
let addrVal: any[];
let addrName: any[];

let { run: _delAddr } = useRequest(delAddr, {
  showToast: true,
  onSuccess: () => {
    Taro.navigateBack();
  },
});
function handleDelAddr() {
  console.log(useRouter().params?.id);
  Taro.showModal({
    title: '提示',
    content: '确认删除收货地址？',
    confirmColor: '#cc463d',
    success(res) {
      if (res.confirm) {
        _delAddr({ id: useRouter().params?.id as string });
      } else if (res.cancel) {
        console.log('用户点击取消');
      }
    },
  });
}
function change(e: any) {
  formData.addr = e.text.join('');
  addrName = e.text;
  addrVal = e.value;
}

function save_addr() {
  let user = getStore(USER_INFO);
  let opts = {
    name: formData.name,
    contact: formData.contact,
    address: formData.address,
    province: addrName?.[0],
    adcode: addrVal?.[0],
    city: addrName?.[1],
    district: addrVal?.[2],
    is_default: formData?.is_default ? 1 : 0,
  };
  if (addrVal?.[1]) {
    opts.adcode1 = addrVal?.[1];
  }
  if (addrVal?.[2]) {
    opts.adcode2 = addrVal?.[2];
  }
  Taro.showLoading();
  if (params?.name) {
    editReceiverAddr({ ...opts, id: params?.id }).then((res) => {
      Taro.hideLoading();
      if (res.code === 200) {
        useToast(res.msg || '修改成功');
        Taro.navigateBack();
      }
    });
    return;
  }

  add_receiver_addr({ ...opts, member_id: user?.member_id }).then((res) => {
    Taro.hideLoading();
    if (res.code === 200) {
      useToast(res.msg || '添加成功');
      Taro.navigateBack();
    }
  });
}
function validate_form() {
  ruleForm.value.validate().then(({ valid, errors }: any) => {
    if (valid) {
      save_addr();
    } else {
      console.log('error submit!!', errors);
    }
  });
}

const choose_area = () => {
  visible.value = true;
};
useDidShow(() => {
  if (params?.name) {
    const {
      name = '',
      city = '',
      address = '',
      contact = '',
      district = '',
      province = '',
      is_default = '',
      adcode = '',
      adcode1 = '',
      adcode2 = '',
    } = params;

    addrName = [province, city, district];
    addrVal = [adcode, adcode1, adcode2];

    formData.addr = `${province}${city}${district}`;
    formData.name = name;
    formData.is_default = is_default == '1' ? true : false;
    formData.contact = contact;
    formData.address = address;
  }
});
</script>
