<template>
  <section>
    <div
      class="flex justify-center pt-10px pb-20px bg-fff mb-10px"
      @click="paserCarImg"
    >
      <div class="relative">
        <NrImg
          only-img
          :url="state.carImg || formData.avatar"
          mode="aspectFill"
          class="overflow-hidden rounded-full w-98px h-98px"
        ></NrImg>
        <div
          style="background-color: #f9f9f9"
          class="absolute flex items-center justify-center rounded-full bottom-2px right-2px p-6px"
        >
          <span class="icon-photograph iconfont text-14px"></span>
        </div>
      </div>
    </div>

    <nut-form ref="ruleForm" :model-value="formData">
      <nut-form-item prop="mobile">
        <template #label>
          <span class="pl-10px">手机</span>
        </template>
        <div class="flex justify-between w-full">
          <input
            v-model="formData.mobile"
            class="flex-1 nut-input-text"
            type="text"
            :disabled="true"
          />
          <span>不可修改</span>
        </div>
      </nut-form-item>
      <nut-form-item
        label="昵称"
        :show-error-line="false"
        prop="nickname"
        required
        :rules="[{ required: true, message: '请填写昵称' }]"
      >
        <input
          v-model="formData.nickname"
          placeholder="请输入昵称"
          class="nut-input-text"
          type="text"
          @change="nickNameChanged = true"
        />
      </nut-form-item>
      <nut-form-item
        label="性别"
        :show-error-line="false"
        prop="sex"
        required
        :rules="[{ required: true, message: '请选择性别' }]"
      >
        <div
          class="flex justify-between w-full"
          @click="state.sexVisible = true"
        >
          <input
            v-model="formData.sex"
            class="nut-input-text"
            type="text"
            :disabled="true"
            placeholder="点击选择性别"
          />
          <span class="icon-arrow-right-bold iconfont"></span>
        </div>
      </nut-form-item>
      <nut-form-item
        label="生日"
        prop="birthday"
        required
        :show-error-line="false"
        :rules="[{ required: true, message: '请选择生日' }]"
      >
        <div
          class="flex justify-between w-full"
          @click="
            () => {
              datePicker.show();
            }
          "
        >
          <input
            v-model="formData.birthday"
            class="nut-input-text"
            type="text"
            :disabled="true"
            placeholder="点击选择生日"
          />
          <span class="icon-arrow-right-bold iconfont"></span>
        </div>
      </nut-form-item>
      <nut-form-item
        label="城市"
        prop="city"
        :show-error-line="false"
        required
        :rules="[{ required: true, message: '请选择城市' }]"
      >
        <div
          class="flex justify-between w-full"
          @click="state.cityVisible = true"
        >
          <input
            v-model="formData.city"
            class="nut-input-text"
            type="text"
            :disabled="true"
            placeholder="点击选择城市"
          />
          <span class="icon-arrow-right-bold iconfont"></span>
        </div>
      </nut-form-item>
      <div class="h-10px bg-main"></div>
      <div
        class="box-border flex items-center w-full text-10px px-20px py-14px"
      >
        <span class="iconfont icon-notice" style="color: #e6d01b"></span>
        <div class="flex-1 opacity-50 ml-6px">首次完善驾照信息可得积分奖励</div>
        <div class="flex items-center" @click="parserVeh">
          <div class="iconfont icon-scan text-primary text-10px"></div>
          <div class="text-primary ml-6px">自动识别驾驶证</div>
        </div>
      </div>
      <nut-form-item>
        <template #label>
          <span class="pl-10px">姓名</span>
        </template>
        <input
          v-model="formData.name"
          class="nut-input-text"
          type="text"
          placeholder="请输入姓名"
          @change="lCed = true"
        />
      </nut-form-item>
      <nut-form-item>
        <template #label>
          <span class="pl-10px">国籍</span>
        </template>
        <div class="flex justify-between w-full">
          <input
            v-model="formData.country"
            class="nut-input-text"
            type="text"
            placeholder="请输入国籍"
            @change="lCed = true"
          />
        </div>
      </nut-form-item>
      <nut-form-item>
        <template #label>
          <span class="pl-10px">准驾类型</span>
        </template>
        <div class="flex justify-between w-full">
          <input
            v-model="formData.drivingType"
            class="nut-input-text"
            type="text"
            placeholder="请输入准驾类型"
            @change="lCed = true"
          />
        </div>
      </nut-form-item>
      <nut-form-item>
        <template #label>
          <span class="pl-10px">初领日期</span>
        </template>
        <div
          class="flex justify-between w-full"
          @click="
            () => {
              datePickerPeriod.show();
              state.timeFlag = 'init';
            }
          "
        >
          <input
            v-model="formData.drawTime"
            class="nut-input-text"
            type="text"
            :disabled="true"
            placeholder="请选择初领日期"
          />
          <span class="icon-arrow-right-bold iconfont"></span>
        </div>
      </nut-form-item>
      <nut-form-item>
        <template #label>
          <span class="pl-10px">有效开始期</span>
        </template>
        <div
          class="flex justify-between w-full"
          @click="
            () => {
              datePickerPeriod.show();
              state.timeFlag = 'start';
            }
          "
        >
          <input
            v-model="formData.validStart"
            class="nut-input-text"
            type="text"
            :disabled="true"
            placeholder="请选择证件开始期限"
          />
          <span class="icon-arrow-right-bold iconfont"></span>
        </div>
      </nut-form-item>
      <nut-form-item>
        <template #label>
          <span class="pl-10px">有效结束期</span>
        </template>
        <div
          class="flex justify-between w-full"
          @click="
            () => {
              datePickerPeriod.show();
              state.timeFlag = 'end';
            }
          "
        >
          <input
            v-model="formData.validEnd"
            class="nut-input-text"
            type="text"
            :disabled="true"
            placeholder="请选择证件开始期限"
          />
          <span class="icon-arrow-right-bold iconfont"></span>
        </div>
      </nut-form-item>
      <nut-form-item>
        <template #label>
          <span class="pl-10px">证号</span>
        </template>
        <div class="flex justify-between w-full">
          <input
            v-model="formData.number"
            class="nut-input-text"
            type="text"
            placeholder="请输入证号"
          />
        </div>
      </nut-form-item>
      <nut-form-item>
        <template #label>
          <span class="pl-10px">住址</span>
        </template>
        <input
          v-model="formData.address"
          class="nut-input-text"
          type="text"
          placeholder="请输入住址"
        />
      </nut-form-item>
    </nut-form>
    <div class="box-border w-full px-20px pt-30px pb-60px">
      <button class="py-10px bg-primary text-fff" @click="validateForm">
        提交保存
      </button>
    </div>
  </section>
  <NrzAction
    v-model:show="state.sexVisible"
    tips="选择性别"
    :itemList="[{ text: '男' }, { text: '女' }]"
    @click="
      ({ text }) => {
        formData.sex = text;
      }
    "
  ></NrzAction>
  <!-- 选择生日 -->
  <NrzDateTime
    ref="datePicker"
    :type="2"
    :end-year="+dayjs().format('YYYY')"
    :max-month="+dayjs().month() + 1"
    :max-day="+dayjs().date()"
    @confirm="confirmBirthday"
  ></NrzDateTime>
  <Addr v-model:show="state.cityVisible" :layer="2" @change="chooseCity"></Addr>
  <NrzDateTime
    ref="datePickerPeriod"
    :type="2"
    @confirm="confirmPeriod"
  ></NrzDateTime>
</template>
<script lang="ts" setup>
import { reactive, ref, onBeforeMount } from 'vue';
import NrImg from '@/components/img/img.vue';
import NrzAction from '@/components/nrz-action/index.vue';
import NrzDateTime from '@/components/nrz-datetime/index.vue';

import dayjs from 'dayjs';
import {
  YMD_EN,
  getStore,
  USER_INFO,
  useToast,
  jGcustomCount,
  JG,
} from '@/utils/index';
import {
  uploadFile,
  getPersonalInfo,
  editPersonalInfo,
  parseVehicle,
} from '@/api';
import Taro from '@tarojs/taro';
import Addr from '@/components/nrz-addr/index.vue';
definePageConfig({
  navigationBarTitleText: '编辑个人资料',
});
const ruleForm = ref<any>(null);
const datePicker = ref();
let formData = reactive({
  mobile: getStore(USER_INFO)?.mobile,
  nickname: '',
  name: '',
  sex: '',
  birthday: '',
  drawTime: '',
  city: '',
  validStart: '',
  validEnd: '',
  avatar: '',
  address: '',
  drivingType: '',
  number: '',
  country: '',
  validFromDate: '',
});
let state = reactive<any>({
  sexVisible: false,
  carImg: '',
  birthdayVisible: false,
  minDate: dayjs().subtract(80, 'year').valueOf(),
  maxDate: dayjs().valueOf(),
  cityVisible: false,
  licenseTimeVisible: false,
  city: '',
  licenseTimePickerUse: new Date(dayjs().subtract(30, 'year').valueOf()),
  start: dayjs().subtract(30, 'year').valueOf(),
  end: dayjs().add(30, 'year').valueOf(),
  timeFlag: '',
});

function confirmPeriod(e) {
  if (state.timeFlag === 'start') {
    formData.validStart = dayjs(e.result).format(YMD_EN);
  }

  if (state.timeFlag === 'end') {
    formData.validEnd = dayjs(e.result).format(YMD_EN);
  }
  if (state.timeFlag === 'init') {
    formData.drawTime = dayjs(e.result).format(YMD_EN);
  }
  lCed.value = true;

  closePeriod();
}

const datePickerPeriod = ref();

function closePeriod() {
  datePickerPeriod.value.hide();
}
const confirmBirthday = (res) => {
  formData.birthday = res.result;
};
function chooseCity(e: any) {
  let i = e.text?.length - 1;
  formData.city = e.text?.[i];
  state.cityVisible = false;
}

let nickNameChanged = ref(false);
let avatarCed = ref(false);

let lCed = ref(false);

function validateForm() {
  ruleForm.value.validate().then(({ valid, errors }: any) => {
    if (valid) {
      if (nickNameChanged.value) {
        jGcustomCount(JG.USER_001);
      }
      if (avatarCed.value) {
        jGcustomCount(JG.USER_003);
      }
      if (lCed.value) {
        jGcustomCount(JG.USER_002);
      }

      let opts = {
        avatar: formData.avatar,
        mobile: formData?.mobile,
        nickname: formData?.nickname,
        sex: formData?.sex,
        birthday: formData?.birthday,
        city: formData?.city,
        driverCardInfo: {
          name: formData.name,
          country: formData.country,
          drivingType: formData?.drivingType,
          drawTime: formData?.drawTime,
          validStart: formData?.validFromDate,
          validEnd: formData?.validEnd,
          number: formData?.number,
          address: formData?.address,
        },
      };
      editPersonalInfo(opts).then((res) => {
        if (res.code !== 200) return;
        Taro.navigateBack({
          success() {
            useToast(res?.msg || '修改成功');
          },
        });
      });
    } else {
      useToast(errors[0].message);
    }
  });
}
const paserCarImg = () => {
  Taro.chooseImage({
    sourceType: ['album', 'camera'],
    success(res) {
      const tempFilePaths = res.tempFilePaths[0];
      state.carImg = tempFilePaths;
      uploadFile({
        file: tempFilePaths,
        type: 'avatar',
      }).then((res: any) => {
        avatarCed.value = true;
        formData.avatar = res;
      });
    },
  });
};
const parserVeh = () => {
  //
  Taro.chooseImage({
    sourceType: ['album', 'camera'],
    success(res) {
      const tempFilePaths = res.tempFilePaths[0];
      parseVehicle({
        file: tempFilePaths,
      }).then((res: any) => {
        console.table(res);
        for (let key in res) {
          formData[key] = res[key];
        }
        formData.country = res.nationality;
        formData.drivingType = res.approvedType;
        formData.drawTime = res?.initialIssueDate;
        formData.number = res?.licenseNumber;
      });
    },
  });
};
onBeforeMount(() => {
  getPersonalInfo({}).then((res) => {
    formData.avatar = res?.data?.avatar;
    formData.nickname = res?.data?.nickname;
    formData.sex = res?.data?.sex;
    formData.birthday = res?.data?.birthday;
    formData.city = res?.data?.city;
    let driverCardInfo = res?.data?.driverCardInfo;
    if (driverCardInfo) {
      for (const key in driverCardInfo) {
        formData[key] = driverCardInfo[key];
      }
    }
  });
});
</script>
