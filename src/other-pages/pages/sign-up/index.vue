<template>
  <main
    :style="{ backgroundImage: `url(${LOGIN_BG})` }"
    class="h-full overflow-hidden bg-center bg-no-repeat bg-cover box-border w-full px-40px"
  >
    <div class="font-bold text-20px mt-130px text-fff pb-30px w-full">注册</div>
    <div class="flex flex-col items-center mb-30px">
      <section class="flex justify-between w-full mb-20px">
        <NrzInput
          v-model:value="formData.mobile"
          style="border-bottom: 1px solid #f5f5f5"
          placeholder="请输入手机号"
          :inp-class="{ 'text-primary': true, 'bg-transparent': true }"
          type="text"
        />
        <nut-button size="small" class="ml-10px" @click.stop="_getCode">
          <div class="flex items-center px-12px">
            <span
              :class="{ hidden: !hasGetCode }"
              class="iconfont icon-loading rotate text-second"
            ></span>
            <span class="ml-6px text-10px text-second font-extralight">
              获取验证码
            </span>
          </div>
        </nut-button>
      </section>
      <NrzInput
        v-model:value="formData.code"
        class="mb-20px w-full"
        style="border-bottom: 1px solid #f5f5f5"
        placeholder="请输入验证码"
        :inp-class="{ 'text-primary': true, 'bg-transparent': true }"
        type="text"
      />
      <NrzInput
        v-model:value="formData.password"
        class="mb-20px w-full"
        style="border-bottom: 1px solid #f5f5f5"
        placeholder="请输入密码"
        :inp-class="{ 'text-primary': true, 'bg-transparent': true }"
        type="text"
      />
    </div>

    <NrzBtn
      style="background-color: rgba(255, 255, 255, 0.5)"
      class="border-0 text-second"
      @click="fastLogin"
    >
      确认修改
    </NrzBtn>
  </main>
</template>
<script lang="ts" setup>
import Taro from '@tarojs/taro';
import {
  nrNavigateTo,
  CODE,
  setStore,
  getUserInfo,
  USER_INFO,
  LOGIN_BG,
  OBU_USER,
} from '@/utils/index';
import { ref } from 'vue';
import { getObuInfo, memberLogin, getCodeReset } from '@/api/index';
import { useToast } from '@/utils/index';
import NrzCheckBox from '@/components/nrz-checkbox/index.vue';
import { homeStore, loveCarStore, store } from '@/stores/index';
import NrzInput from '@/components/nrz-input/index.vue';
import NrzBtn from '@/components/nrz-button/index.vue';

import { reactive } from 'vue';

definePageConfig({
  transparentTitle: 'auto',
  titlePenetrate: 'YES',
  defaultTitle: '',
});
const hasGetCode = ref(false);
let LoveCarStore = loveCarStore();
const emits = defineEmits(['back', 'success']);
const agree = ref(false);
const HomeStore = homeStore();
const formData = reactive({
  mobile: '',
  password: '',
  confirmPsw: '',
  code: '',
});
const code = ref('');
async function fastLogin() {
  Taro.showLoading();
  memberLogin(formData).then((resp) => {
    Taro.hideLoading();

    if (resp.code != 200) return useToast(resp.msg);

    getObuInfo({ mobile: formData?.mobile }).then((obu) => {
      if (obu.code === 200) {
        setStore(OBU_USER, obu.data);
      }
    });
    HomeStore.setState('needRefresh', false);
    store().setLoginStateShop(true);
    setStore(USER_INFO, resp.data);
    LoveCarStore.setIsVr(true);
    emits('success');
  });
}

async function _getCode() {
  if (!formData.mobile) return useToast('请输入手机号');

  try {
    hasGetCode.value = true;
    getCodeReset({ mobile: formData.mobile }).then((res) => {
      code.value = res.data as string;
      setTimeout(() => {
        hasGetCode.value = false;
      }, 10000);
    });
  } catch (error) {
    console.log('error', error);
  }
}
</script>

<style lang="scss">
.nut-checkbox__label {
  font-size: 12px;
}
button::after {
  border: none;
}
#login .nut-checkbox__icon--unchecked {
  color: #f5f5f5;
}
/* 未选中的背景样式 */
checkbox .wx-checkbox-input {
  width: 14px;
  height: 14px;
  background-color: transparent;
  border: 1px solid #11264d;
  border-radius: 50%;
  line-height: 1;
}
/* 选中后的背景样式 */
checkbox .wx-checkbox-input.wx-checkbox-input-checked {
  background: #11264d;
}
/* 选中后的勾子样式 */
checkbox .wx-checkbox-input.wx-checkbox-input-checked::before {
  color: #fff;
  font-size: 14px;
}
</style>
