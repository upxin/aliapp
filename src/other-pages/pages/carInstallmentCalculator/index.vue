<template>
  <div
    :style="{ backgroundImage: `url(${CALC_BG})` }"
    class="w-full bg-no-repeat bg-contain bg-hex-1D4A9F pt-260px pb-70px"
  >
    <div
      class="box-border flex flex-col justify-between m-auto bg-black rounded-lg bg-opacity-15 p-20px pt-10px w-320px text-light-50 text-14px"
    >
      <div class="flex items-center py-10px my-8px">
        <span class="min-w-65px">办理城市</span>
        <span class="mr-10px">：</span>
        <nut-cell
          class="nut-input-text"
          is-link
          :title="formData.city"
          @click="handleIdCity"
        >
          <template #link>
            <span
              class="iconfont text-hex-aaa icon-arrow-right-bold text-16px"
            ></span>
          </template>
        </nut-cell>
      </div>
      <div class="flex items-center py-10px my-8px">
        <span class="min-w-65px">分期机构</span>
        <span class="mr-10px">：</span>
        <nut-cell
          class="bg-center bg-no-repeat nut-input-text bg-reg"
          :style="{
            backgroundImage: `url(${formData.orgUrl})`,
          }"
          is-link
          :title="formData.organization"
          @click="handleOrg"
        >
          <template #link>
            <span
              class="iconfont text-hex-aaa icon-arrow-right-bold text-16px"
            ></span>
          </template>
        </nut-cell>
      </div>
      <div class="flex items-center py-10px my-8px">
        <span class="min-w-65px">分期数</span>
        <span class="mr-10px">：</span>
        <nut-cell
          class="nut-input-text"
          is-link
          :title="formData.stagesName"
          @click="handleMonth"
        >
          <template #link>
            <span
              class="iconfont text-hex-aaa icon-arrow-right-bold text-16px"
            ></span>
          </template>
        </nut-cell>
      </div>
      <div class="flex items-center py-10px my-8px">
        <span class="min-w-65px">分期本金</span>
        <span class="mr-10px">：</span>
        <section class="relative flex-1 w-full">
          <nut-range
            v-model="formData.capital"
            hidden-range
            :max="formData.max"
            min="0"
            inactive-color="#101010"
            active-color="#fff"
            @change="onChange"
          >
            <template #button>
              <div
                class="border-2 border-solid rounded-full mr-4px w-4px h-4px border-normal"
              >
                <div
                  class="absolute rounded-md -top-30px -left-16px h-24px pl-4px pr-5px bg-primary leading-24px"
                >
                  <div>￥{{ formatThousands(formData.capital) }}</div>
                  <div class="absolute arrow_down top-full left-17px"></div>
                </div>
              </div>
            </template>
          </nut-range>
          <div class="absolute flex items-center w-full">
            <div
              class="flex justify-between w-full h-20px leading-20px top-full"
            >
              <span>￥{{ formData.min }}</span>
              <span>￥{{ formatThousands(formData.max) }}</span>
            </div>
          </div>
        </section>
      </div>
    </div>
    <div
      :style="{ backgroundImage: `url(${CALC_PAD})` }"
      class="m-auto overflow-hidden bg-center bg-no-repeat bg-cover mt-30px w-315px h-246px"
    >
      <div class="flex items-center justify-center text-14px mt-50px mb-40px">
        <div>月供额：</div>
        <div class="font-bold text-18px">
          ￥{{
            formData.monthly_payment
              ? formatThousands(formData.monthly_payment, 2)
              : '--'
          }}
        </div>
      </div>
      <section class="flex justify-between text-center px-22px mt-30px">
        <div class="flex-1 text-normal text-opacity-77">
          <div class="w-full text-center text-10px nrz-thin mb-8px">
            分期本金
          </div>
          <div class="w-full text-12px">
            ￥{{
              formData.total_installment
                ? formatThousands(formData.total_installment)
                : '--'
            }}
          </div>
        </div>
        <div class="h-34px w-1px bg-primary bg-opacity-10"></div>
        <div class="flex-1 text-normal text-opacity-77">
          <div class="w-full text-center text-10px nrz-thin mb-8px">总利息</div>
          <div class="w-full text-12px">
            ￥{{
              formData.total_interest
                ? formatThousands(formData.total_interest, 2)
                : '--'
            }}
          </div>
        </div>
        <div class="h-34px w-1px bg-primary bg-opacity-10"></div>
        <div class="flex-1 text-normal text-opacity-77">
          <div class="w-full text-center text-10px nrz-thin mb-8px">年化费</div>
          <div class="w-full text-12px">
            {{
              formData.annualized_rate && formData.capital != 0
                ? `${formData.annualized_rate}%`
                : '--'
            }}
          </div>
        </div>
      </section>
      <div class="text-center text-black opacity-50 text-10px mt-40px">
        * 详细分期方案信息请电话咨询，实际以线下办理为准。
      </div>
    </div>
    <div class="flex justify-center mt-30px">
      <nut-button
        shape="square"
        class="bg-transparent border border-solid border-light-50 w-308px"
        @click="fastCall"
      >
        <div class="flex items-center justify-center">
          <span class="iconfont icon-phone text-light-50"></span>
          <span class="text-light-50 ml-10px">快速咨询</span>
        </div>
      </nut-button>
    </div>
    <NrImg :url="CALC_BT" class="flex justify-center mt-70px h-270px"> </NrImg>
  </div>

  <NrzAddr v-model:show="showCity" :layer="2" @change="chooseCity"></NrzAddr>

  <NrzAction
    v-model:show="showMonth"
    :item-list="monthList"
    @choose="chooseMonth"
  >
  </NrzAction>
  <NrzBottomPopup v-model:show="showOrganization">
    <div class="py-30px">
      <div
        v-for="item in organizationList"
        :key="item.id"
        class="flex items-center justify-between px-20px pb-16px"
        @touchstart.stop="
          () => {
            chooseOrg(item);
          }
        "
      >
        <div class="flex items-center w-full font-bold">
          <span class="min-w-65px">{{ item?.name }}</span>
          <div class="flex-1 h-80px ml-16px">
            <img :src="item.imgUrl" alt="" class="w-full h-full" />
          </div>
        </div>
      </div>
    </div>
  </NrzBottomPopup>
</template>
<script lang="ts">
import { onShareAppMessage, onShareTimeline } from '@/utils/index';
export default {
  onShareAppMessage,
  onShareTimeline,
};
</script>
<script lang="ts" setup>
import { nextTick, onBeforeMount, reactive, ref, watch } from 'vue';
import {
  formatThousands,
  makePhoneCall,
  CODE,
  CALC_PAD,
  CALC_BT,
  CALC_BG,
  NEWRIZON_TEL,
} from '@/utils/index';
import { getCalcData, calc } from '@/api/index';
import NrImg from '@/components/img/img.vue';
import { useRouter } from '@tarojs/taro';
import NrzAction from '@/components/nrz-action/index.vue';
import NrzBottomPopup from '@/components/nrz-bottom-popup/index.vue';
import NrzAddr from '@/components/nrz-addr/index.vue';

definePageConfig({
  navigationBarTitleText: '分期购车计算器',
});

let showCity = ref(false);
let showOrganization = ref(false);
let showMonth = ref(false);
const cityList = ref();
const monthList = ref();
const organizationList = ref<any[]>([]);
let formData = reactive({
  min: 0,
  city: '',
  cityId: '',

  organization: '',
  orgId: '',
  orgUrl: '',

  stages: '',
  stagesName: '',

  capital: 0, // 分期本金
  max: 0,

  total_installment: 0, // 显示部分的分期本金
  monthly_payment: 0, // 月供金额
  total_interest: 0, // 总利息
  annualized_rate: 0, // 年化费率
});
onBeforeMount(() => {
  _getCalcData();
});
function onChange() {
  setTimeout(() => {
    _calc();
  }, 0);
}
function _calc() {
  // 不同城市的不同机构利率不同 所以用接口算
  let p = {
    total_installment: formData.capital, // 分期总额
    city_id: formData.cityId, // 城市
    staging_agency_id: formData.orgId, // 机构
    number_of_installment: formData.stages, // 分期数
  };
  calc(p).then((res) => {
    if (res.code !== CODE) return;
    let {
      monthly_payment,
      total_interest,
      annualized_rate,
      total_installment,
    } = res.data;
    formData.monthly_payment = monthly_payment;
    formData.total_interest = total_interest;
    formData.annualized_rate = annualized_rate;
    formData.total_installment = total_installment;
  });
}
function _getCalcData() {
  // 开通城市列表
  getCalcData({}).then((res) => {
    if (res.code !== CODE) return;
    const {
      city_list,
      number_of_installments,
      staging_agency,
      total_installment,
    } = res.data;

    cityList.value = city_list;
    monthList.value = number_of_installments.map((k) => {
      return {
        name: `${k}期`,
        val: k,
      };
    });
    organizationList.value = staging_agency;

    formData.min = total_installment.min;
    formData.max = total_installment.max;

    formData.city = city_list?.[0]?.name;
    formData.cityId = city_list?.[0]?.key;

    formData.orgId = staging_agency?.[0]?.id;
    formData.organization = staging_agency?.[0]?.name;
    formData.orgUrl = staging_agency[0].imgUrl;

    formData.stages = number_of_installments[0];
    formData.stagesName = `${number_of_installments[0]}期`;
  });
}
function handleIdCity() {
  showCity.value = true;
}
function handleOrg() {
  showOrganization.value = true;
}
function handleMonth() {
  showMonth.value = true;
}

function chooseCity(e) {
  formData.city = e.text?.[1];
  formData.cityId = e.value?.[1];
}

watch(
  () => formData.organization,
  () => {
    setTimeout(() => {
      _calc();
    });
  }
);
watch(
  () => formData.city,
  () => {
    setTimeout(() => {
      _calc();
    });
  }
);
watch(
  () => formData.stages,
  () => {
    setTimeout(() => {
      _calc();
    });
  }
);
function chooseOrg(res) {
  console.log(res);
  formData.organization = res?.name;
  formData.orgId = res.id;
  formData.orgUrl = res.imgUrl;
  showOrganization.value = false;
}
function chooseMonth(res) {
  console.log(res);
  formData.stages = res?.val;
  formData.stagesName = res?.name;
  nextTick(() => {
    showMonth.value = false;
  });
}
function fastCall() {
  makePhoneCall(useRouter()?.params?.tel || NEWRIZON_TEL);
}
</script>
<style>
.nut-input-text {
  padding: 0;
  color: #fff;
}
.nut-cell {
  background-color: transparent;
  box-shadow: none;
}
.nut-cell-group__warp {
  background-color: transparent;
}
.nut-cell-group .nut-cell::after {
  border-bottom: unset;
}
.nut-form-item__label {
  color: #fff;
}
.nut-cell--clickable::before {
  content: none;
}
.nut-input {
  background-color: transparent;
}
.nut-placeholder {
  color: #fff;
}
.bg-reg {
  background-size: 50%;
  background-position: center left 65px;
}
.nut-input.nut-input-border {
  border: 0;
}
.cal-top {
  background-position-x: center;
  background-position-y: 20px;
  background-size: 100% 300px;
}
</style>
