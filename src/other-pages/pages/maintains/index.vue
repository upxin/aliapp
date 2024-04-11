<template>
  <CustomBar class="fixed" background-color="#fff" :border="true"
    ><template #title> 保养 </template></CustomBar
  >

  <div
    :style="{
      paddingTop: `${CalcPt}px`,
    }"
    class="box-border h-full pb-60px"
    @touchmove="handleTouchMove"
  >
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
        label="保养类型："
        prop="type"
        :show-error-line="false"
      >
        <NrzRadioGroup v-model:modelValue="formData.type">
          <view class="flex">
            <NrzRadio class="mr-4px" value="1" :disabled="disabledChecked">
              首保
            </NrzRadio>
            <NrzRadio value="0">常规保</NrzRadio>
          </view>
        </NrzRadioGroup>
      </nut-form-item>
    </nut-form>
    <section class="px-16px text-12px text-normal opacity-34 mt-40px">
      <div class="flex leading-5 text-left">
        <div class="w-70px">温馨提示：</div>
        <div class="flex flex-col flex-1">
          <span
            >1.
            提交保养单后，会生成待确认服务订单，等待对应门店确认后，会和您电话沟通，请保持电话畅通。具体事宜已双方电话沟通为准；</span
          >
          <span>2. 首保之后只能选择常规保养；</span>
        </div>
      </div>
    </section>
    <div class="flex justify-center leading-normal px-16px mt-30px">
      <nut-button
        class="w-full border-hex-11264d text-hex-11264d"
        @click="valiteForm"
        >提交</nut-button
      >
    </div>
  </div>
  <div
    class="fixed bottom-0 flex justify-between w-full nrz-safe h-50px bg-hex-fff nr-shadow-top"
  >
    <nut-button
      class="flex-1 h-full"
      shape="square"
      @click="
        () => {
          makePhoneCall('');
        }
      "
    >
      <div class="flex items-center justify-center">
        <span class="iconfont icon-phone text-primary"></span>
        <div class="h-20px leading-20px ml-10px">客服电话</div>
      </div>
    </nut-button>
    <div class="h-full bg-gray-300 w-1px"></div>
    <nut-button class="flex-1 h-full" shape="square">
      <div class="flex items-center justify-center animate-flip">
        <span class="iconfont icon-message"></span>
        <div class="h-20px leading-20px ml-10px">极速咨询</div>
      </div>
    </nut-button>
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
    :type="8"
    @confirm="confirm"
  ></NrzDateTime>
</template>

<script lang="ts">
import { onShareAppMessage, onShareTimeline } from '@/utils/index';
import dayjs from 'dayjs';
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
import NrzDateTime from '@/components/nrz-datetime/index.vue';
import NrzRadio from '@/components/nrz-radio/index.vue';
import NrzRadioGroup from '@/components/nrz-radio-group/index.vue';

import {
  makePhoneCall,
  CODE,
  nrNavigateTo,
  customValidatorPhone,
  goPages,
  jGcustomCount,
  JG,
} from '@/utils/index';
import { getAllCar, maintainsOrd, getCarBehavior } from '@/api/index';
import NrzAction from '@/components/nrz-action/index.vue';

definePageConfig({ transparentTitle: 'auto',titlePenetrate: 'YES',defaultTitle: '', });
const datePicker = ref();
const formData = reactive({
  mobile: '',
  carName: '',
  shopName: '',
  name: '',
  time: '',
  type: '3', // 0常规 1首保
  currentDate: '',
  mileage: '',
});

let CalcPt = computed(
  () => systemInfo().RightBtnRect.h + systemInfo().RightBtnRect.t + 10
);
let shopId = ref();
const carList = ref<any[]>();
let disabledChecked = ref(false);
const isMaintains = ref<number>();
let showCarChoose = ref(false);
let Params = useRouter()?.params;
let vin = ref('');
const confirm = (res) => {
  formData.time = res.result;
};

function handleTouchMove(e) {
  e.stopPropagation();
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
  _getCarBehavior(res.vin);
}
function _getCarBehavior(vin) {
  getCarBehavior({ vin }).then((res) => {
    if (res?.code == CODE) {
      formData.mileage = res?.data?.total_mileage || '';
    }
  });
}

function _getAllCar() {
  getAllCar({}).then((res) => {
    if (res.code !== CODE) return;
    carList.value = res.data;
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
        type: formData.type,
        mileage: formData.mileage,
      };
      maintainsOrd(params).then((res) => {
        jGcustomCount(JG.CV_018);
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
  formData.shopName = Params?.shopName || '';
  shopId.value = Params?.shopId || '';

  _getAllCar();
});

watch(
  () => isMaintains.value,
  (v) => {
    if (v) {
      formData.type = '0';
      disabledChecked.value = true;
    }
  }
);
watch(
  () => formData.type,
  (v) => {
    console.log(v, 'formData.type----');
  }
);
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
