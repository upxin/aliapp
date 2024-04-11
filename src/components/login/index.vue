<template>
  <main
    :style="{ backgroundImage: `url(${LOGIN_BG})` }"
    class="h-full overflow-hidden bg-center bg-no-repeat bg-cover box-border w-full px-40px"
  >
    <div
      class="font-bold text-20px mt-130px text-fff pb-30px w-full flex justify-between"
    >
      欢迎来到前晨
      <div class="text-blue-500" @click="toSignUp">立即注册</div>
    </div>
    <div class="flex flex-col items-center justify-center mb-30px">
      <NrzInput
        v-model:value="formData.mobile"
        style="border-bottom: 1px solid #f5f5f5"
        placeholder="请输入手机号"
        :inp-class="{ 'text-primary': true, 'bg-transparent': true }"
        type="text"
        :clearable="false"
        class="mb-30px w-full"
      />
      <NrzInput
        v-model:value="formData.password"
        :clearable="false"
        class="w-full"
        style="border-bottom: 1px solid #f5f5f5"
        placeholder="请输入密码"
        :inp-class="{ 'text-primary': true, 'bg-transparent': true }"
        type="text"
      />
    </div>
    <section id="login" class="flex justify-between mb-40px text-12px">
      <div class="flex items-center">
        <NrzCheckBox
          v-model:checked="agree"
          color="#11264d"
          borderColor="#11264d"
          size="30rpx"
          class="text-12px"
        >
          已阅读并同意
        </NrzCheckBox>
        <div
          class="flex text-hex-1990FF"
          @click="
            () => {
              nrNavigateTo('protocol');
            }
          "
        >
          《用户隐私协议》
        </div>
      </div>
      <div class="text-blue-500" @click="forgotPsw">忘记密码</div>
    </section>
    <section></section>
    <NrzBtn
      style="background-color: rgba(255, 255, 255, 0.5)"
      class="border-0 text-second"
      @click="fastLogin"
    >
      登录
    </NrzBtn>
  </main>
</template>
<script lang="ts" setup>
import Taro, { useRouter } from '@tarojs/taro';
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
import { getObuInfo, memberLogin } from '@/api/index';
import { useToast } from '@/utils/index';
import NrzCheckBox from '@/components/nrz-checkbox/index.vue';
import { homeStore, loveCarStore, store } from '@/stores/index';
import NrzInput from '@/components/nrz-input/index.vue';
import NrzBtn from '@/components/nrz-button/index.vue';

import { reactive } from 'vue';

const query = useRouter().params;
definePageConfig({
  transparentTitle: 'auto',
  titlePenetrate: 'YES',
  defaultTitle: '',
});
let LoveCarStore = loveCarStore();
const emits = defineEmits(['back', 'success']);
const agree = ref(false);
const HomeStore = homeStore();
const formData = reactive({
  mobile: '',
  password: '',
});
function forgotPsw() {
  nrNavigateTo('forgotPsw');
}
function toSignUp() {
  nrNavigateTo('sign-up');
}
async function fastLogin() {
  if (!agree.value) return useToast('请阅读并勾选隐私协议');

  Taro.showLoading({
    title: '',
  });
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
    if (query?.isBack) {
      Taro.navigateBack();
      return;
    }
    if (query?.home) {
      Taro.switchTab({
        url: '/pages/index/index',
      });
      return;
    }
  });
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
</style>
