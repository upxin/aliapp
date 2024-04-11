<template>
  <CustomBar background-color="#fff">
    <template #title>{{ params?.title || '成为车司机' }}</template>
  </CustomBar>
  <section :style="{ paddingTop: `${headerHeight}px` }">
    <section class="py-20px">
      <div
        class="box-border flex m-auto border-solid border-1px border-primary w-168px"
      >
        <span
          class="text-center py-8px w-84px"
          :class="{ 'bg-primary': type === 1, 'text-fff': type === 1 }"
          @click="
            () => {
              type = 1;
              formData.vinCode = '';
            }
          "
        >
          行驶证识别
        </span>
        <span
          class="text-center py-8px w-84px"
          :class="{ 'bg-primary': type === 2, 'text-fff': type === 2 }"
          @click="
            () => {
              type = 2;
              formData.vinCode = '';
            }
          "
        >
          手动录入
        </span>
      </div>
    </section>
    <section v-if="type === 1" class="box-border w-full px-20px">
      <div v-if="state.frontImg" class="relative w-full h-200px">
        <img class="w-full h-200px" mode="scaleToFill" :src="state.frontImg" />
        <div
          class="absolute flex items-center justify-center rounded-full w-100px h-100px center"
          style="background-color: rgba(222, 36, 33, 0.6)"
          @click="delFront"
        >
          <span
            class="iconfont icon-changyonggoupiaorenshanchu text-40px text-fff"
          ></span>
        </div>
      </div>
      <section v-else class="relative bg-main h-200px" @click="paserFrontImg">
        <div class="pt-20px pl-20px text-hex-bbbbbb">机动车行驶证主页</div>
        <div
          class="absolute flex items-center justify-center rounded-full w-100px h-100px center"
          style="background-color: rgba(91, 250, 166, 0.8)"
        >
          <span class="icon-photograph iconfont text-40px text-fff"></span>
        </div>
      </section>
    </section>
    <section v-if="type === 2 || formData.vinCode">
      <nut-form ref="ruleForm" :model-value="formData">
        <div
          class="border-0 border-solid ml-14px text-16px px-16px mt-20px mb-10px font-700 pl-6px border-l-3px border-normal"
        >
          司机信息
        </div>
        <nut-form-item
          prop="vinCode"
          label="VIN码(识别码)"
          label-width="110"
          required
          :rules="[{ required: true, message: '请填写VIN码' }]"
        >
          <input
            v-model="formData.vinCode"
            class="nut-input-text"
            type="text"
            placeholder="请填写VIN码"
          />
        </nut-form-item>
      </nut-form>
    </section>
  </section>

  <section class="flex justify-center px-40px pb-50px mt-20px">
    <button class="w-full py-14px bg-primary text-fff" @click="submit">
      提交
    </button>
  </section>
</template>
<script lang="ts">
import { onShareAppMessage, onShareTimeline } from '@/utils/index';
export default {
  onShareAppMessage,
  onShareTimeline,
};
</script>
<script lang="ts" setup>
import { onBeforeMount, ref, reactive } from 'vue';
import CustomBar from '@/components/customHeader/index.vue';
import Taro, { useRouter } from '@tarojs/taro';
import {
  CODE,
  getStore,
  USER_INFO,
  useToast,
  setStore,
  OBU_USER,
  jGcustomCount,
  JG,
} from '@/utils/index';
import { useHeaderHeight, useModal } from '@/hooks/index';
import { parseLisence, driverAddCar, getObuInfo } from '@/api/index';

definePageConfig({ transparentTitle: 'always',titlePenetrate: 'YES',defaultTitle: '', });
const { headerHeight } = useHeaderHeight();
// bottom

let params = useRouter()?.params;
let type = ref(1);
let state = reactive({
  carImg: '',
  frontImg: '',
});
let formData = reactive({
  vinCode: '',
});
let ruleForm = ref();
const paserFrontImg = () => {
  Taro.chooseImage({
    sourceType: ['album', 'camera'],
    success(res) {
      const tempFilePaths = res.tempFilePaths[0];
      state.frontImg = tempFilePaths;
      jGcustomCount(JG.CV_002);
      parseLisence({
        file: tempFilePaths,
      }).then((data: any) => {
        formData.vinCode = data?.faceData?.vinCode;
      });
    },
  });
};
const delFront = () => {
  useModal({
    title: '提醒',
    content: '确认删除行驶证主页？删除后可以重新上传！',
    success: () => {
      state.frontImg = '';
    },
  });
};
function _driverAddCar(p) {
  Taro.showLoading();
  driverAddCar(p).then((res) => {
    if (res.code === CODE) {
      Taro.hideLoading({
        success() {
          useToast(res.msg || '添加成功');
          const mobile = getStore(USER_INFO);
          getObuInfo({ mobile }).then((obu) => {
            if (obu.code === 200) {
              setStore(OBU_USER, obu.data);
            }
          });
          setTimeout(() => {
            Taro.navigateBack();
          }, 1000);
        },
      });
    } else {
      Taro.hideLoading({
        success() {
          useToast(res.msg);
        },
      });
    }
  });
}
const submit = () => {
  if (!ruleForm.value) return useToast('请识别驾驶证主页');
  ruleForm.value.validate().then(({ valid, errors }: any) => {
    if (valid) {
      let p = {
        vin: formData.vinCode,
      };
      _driverAddCar(p);
    } else {
      useToast(errors[0].message);
    }
  });
};

onBeforeMount(() => {
  if (params?.vin) {
    formData.vinCode = params?.vin;
    type.value = 2;
  }
});
</script>
<style>
page {
  background-color: #fff;
}
</style>
