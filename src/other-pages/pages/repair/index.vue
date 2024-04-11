<template>
  <CustomBar class="fixed" background-color="#fff" :border="true">
    <template #title> 维修 </template>
  </CustomBar>

  <div
    :style="{
      paddingTop: `${CalcPt}px`,
    }"
    class="box-border safe-bt"
  >
    <section>
      <nut-form ref="ruleForm1" :model-value="formData">
        <nut-form-item
          :show-error-line="false"
          label="选择车辆："
          prop="carName"
          :show-error-message="false"
          :rules="[{ required: true, message: '请选择车辆' }]"
        >
          <div class="flex justify-between" @click="chooseCar">
            <span v-if="formData.carName" class="text-g">{{
              formData.carName
            }}</span>
            <span v-else>点击选择车辆</span>
            <span class="iconfont icon-arrow-right-bold text-hex-aaa"></span>
          </div>
        </nut-form-item>
        <nut-form-item class="relative" label="总里程：" prop="mileage">
          <nut-input
            v-model="formData.mileage"
            class="nut-input-text"
            placeholder="请输入总里程"
            type="text"
          />
        </nut-form-item>
        <nut-form-item
          :show-error-line="false"
          label="选择门店："
          prop="shopName"
          :show-error-message="false"
          :rules="[{ required: true, message: '请选择门店' }]"
        >
          <div class="flex justify-between" @click="chooseCompany">
            <span v-if="formData.shopName" class="text-g">{{
              formData.shopName
            }}</span>
            <span v-else>点击选择门店</span>
            <span class="iconfont icon-arrow-right-bold text-hex-aaa"></span>
          </div>
        </nut-form-item>
        <nut-form-item
          :show-error-line="false"
          label="期望时间："
          prop="time"
          :show-error-message="false"
          :rules="[{ required: true, message: '请选择期望时间' }]"
        >
          <div class="flex justify-between" @click="chooseDeadLine">
            <span v-if="formData.time" class="text-g">{{ formData.time }}</span>
            <span v-else>点击选择时间</span>
            <span class="iconfont icon-arrow-right-bold text-hex-aaa"></span>
          </div>
        </nut-form-item>
        <nut-form-item
          class="relative"
          label="联系人："
          prop="name"
          :show-error-line="false"
          :show-error-message="false"
          :rules="[{ required: true, message: '请输入联系人' }]"
        >
          <nut-input
            v-model="formData.name"
            class="nut-input-text"
            placeholder="请输入联系人"
            type="text"
          />
        </nut-form-item>
        <nut-form-item
          class="relative"
          label="联系电话："
          prop="mobile"
          :show-error-message="false"
          :show-error-line="false"
          :rules="[
            { required: true, message: '请输入联系电话' },
            {
              validator: customValidatorPhone,
              message: '手机号不合法',
            },
          ]"
        >
          <nut-input
            v-model="formData.mobile"
            class="nut-input-text"
            placeholder="请输入联系电话"
            type="text"
          />
        </nut-form-item>
        <nut-form-item
          class="relative"
          label="问题描述："
          prop="intro"
          :show-error-line="false"
          :show-error-message="false"
          :rules="[
            { required: true, message: '请描述遇到的问题' },
            {
              validator: customValidatorIntro,
              message: '字数太少',
            },
          ]"
        >
          <nut-textarea
            v-model="formData.intro"
            placeholder="请简单描述遇到的问题(5-100字)"
            max-length="100"
            limit-show
          />
        </nut-form-item>
      </nut-form>
      <section class="px-16px text-12px text-normal opacity-34 mt-40px">
        <div class="flex leading-5 text-left">
          <div class="w-70px">温馨提示：</div>
          <div class="flex flex-col flex-1">
            提交维修单后，会生成待确认服务订单，等待对应门店确认后，会和您电话沟通，请保持电话畅通。具体事宜已双方电话沟通为准。
          </div>
        </div>
      </section>
      <div class="flex justify-center leading-normal px-16px py-30px">
        <nut-button
          class="w-full border-hex-11264d text-hex-11264d"
          @click="valiteForm"
          >提交</nut-button
        >
      </div>
    </section>
  </div>
  <NrzAction
    v-model:show="showCarChoose"
    tips="选择车辆"
    :item-list="carList"
    @choose="selectCar"
  >
  </NrzAction>
  <NrzDateTime
    ref="datePicker"
    :start-year="+dayjs().format('YYYY')"
    :end-year="+dayjs().add(1, 'year').format('YYYY')"
    :type="8"
    @confirm="confirm"
  ></NrzDateTime>
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
import { systemInfo, loveCarStore } from '@/stores/index';
import Taro, { useRouter } from '@tarojs/taro';
import NrzAction from '@/components/nrz-action/index.vue';
import NrzDateTime from '@/components/nrz-datetime/index.vue';
import {
  CODE,
  nrNavigateTo,
  customValidatorPhone,
  goPages,
  jGcustomCount,
  JG,
} from '@/utils/index';
import { getAllCar, fixedOrder, getCarBehavior } from '@/api/index';
import dayjs from 'dayjs';

definePageConfig({ navigationStyle: 'custom' });
const datePicker = ref();
const formData = reactive({
  mobile: '',
  carName: '',
  shopName: '',
  name: '',
  time: '',
  type: 0, // 0常规 1首保
  minDate: new Date(),
  maxDate: new Date(2030, 10, 1),
  currentDate: new Date().getTime(),
  intro: '',
  mileage: '',
});

let CalcPt = computed(
  () => systemInfo().RightBtnRect.h + systemInfo().RightBtnRect.t + 10
);
let shopId = ref();
const carList = ref<any[]>();
const isMaintains = ref<number>();
let showCarChoose = ref(false);
let vin = ref('');
const confirm = (res) => {
  formData.time = res.result;
};

function customValidatorIntro(val) {
  return val?.length >= 5;
}

function chooseCar() {
  showCarChoose.value = true;
}
function chooseCompany() {
  nrNavigateTo('search-after-service');
}

function chooseDeadLine() {
  datePicker.value.show();
}
function selectCar(res) {
  isMaintains.value = res.isMaintains;
  formData.carName = res.name;
  vin.value = res.vin;
  _getCarBehavior(res?.vin);
}

function _getAllCar() {
  getAllCar({}).then((res) => {
    if (res.code !== CODE) return;
    carList.value = res.data;
  });
}
function _getCarBehavior(vin) {
  getCarBehavior({ vin }).then((res) => {
    if (res?.code == CODE) {
      formData.mileage = res?.data?.total_mileage || '';
    }
  });
}
const ruleForm1 = ref<any>(null);
const valiteForm = () => {
  ruleForm1.value.validate().then(({ valid, errors }: any) => {
    if (valid) {
      let params = {
        vin: vin.value,
        time: formData.time,
        name: formData.name,
        shopId: shopId.value,
        mobile: formData.mobile,
        intro: formData.intro,
        mileage: formData.mileage,
      };
      fixedOrder(params).then((res) => {
        jGcustomCount(JG.CV_019);
        if (res.code === CODE) {
          Taro.showToast({
            title: '提交成功',
            icon: 'none',
          });
          setTimeout(() => {
            goPages('index');
          }, 3000);
        }
      });
    } else {
      console.log('=======', errors);
      Taro.showToast({
        title: errors[0].message,
        icon: 'none',
      });
    }
  });
};
onBeforeMount(() => {
  _getAllCar();
});
watch(
  () => loveCarStore().shopInfo,
  (v) => {
    if (v.shopName) {
      formData.shopName = v.shopName;
      shopId.value = v.shopId;
    }
  },
  {
    deep: true,
    immediate: true,
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
.nut-placeholder {
  font-size: 14px;
}
</style>
