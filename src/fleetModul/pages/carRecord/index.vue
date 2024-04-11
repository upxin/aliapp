<template>
  <CustomBar
    background-color="#fff"
    v-bind="{ a: 'b', c: 'd' }"
    @cusBack="backToPrev"
  >
    <template #title>{{ plate }}</template>
    <template #customLeft>
      <span @click="eidtInfo">{{ !isEdit ? '修改' : '保存' }}</span>
    </template>
  </CustomBar>
  <FullLoading :loading="floading" :err="err" @re-load="_getCarDetail">
    <div
      class="bg-fff pb-20px"
      :style="{ paddingTop: `${headerHeight + 20}px` }"
    >
      <NrImg
        :only-img="true"
        class="m-auto w-160px h-120px"
        :url="carImg"
        mode="scaleToFill"
        @click="uploadCarImg"
      ></NrImg>
      <div class="text-center opacity-50 text-12px mt-6px mb-8px">
        {{ updateTime }} 添加
      </div>
      <div
        class="flex items-center justify-center"
        @click="
          () => {
            if (!isEdit) return;
            nickNameVisible = true;
          }
        "
      >
        <span class="opacity-50">别名：</span>
        <span class="mr-6px">{{ vehicleName || '点击添加别名' }}</span>
        <span class="icon-bianji iconfont text-12px text-hex-aaa mt-2px"></span>
      </div>
    </div>
    <div class="text-16px px-16px pt-30px pb-10px font-700 bg-fff">
      常规信息
    </div>
    <Item
      title="违章查询"
      :route="Routes.carViolateRegulations"
      class="nr-border-b"
    ></Item>
    <Item
      title="车辆审核"
      class="nr-border-b"
      @click="
        () => {
          hanldeCarCheck();
          editType = 0;
          getNormalInfo(0);
        }
      "
    ></Item>
    <Item
      title="保险信息"
      class="nr-border-b"
      @click="
        () => {
          insuranceVisible = true;
          editType = 1;
          getNormalInfo(1);
        }
      "
    ></Item>
    <Item
      title="距离下次保养"
      class="mb-10px"
      @click="
        () => {
          keepVisible = true;
          editType = 2;
          getNormalInfo(2);
        }
      "
    ></Item>
    <EditForm v-if="isEdit" ref="editForm" :data="formData"></EditForm>
    <ShowForm v-else :data="formData"></ShowForm>
    <div class="flex justify-center w-full bg-fff py-20px pb-40px">
      <button
        class="w-200px h-40px leading-40px bg-main"
        style="
          background-color: rgba(187, 187, 187, 0.38);
          color: rgba(16, 16, 16, 0.6);
        "
        @click="_unbind"
      >
        解除绑定
      </button>
    </div>
  </FullLoading>
  <nrz-modal
    v-model:show="nickNameVisible"
    title="设置别名"
    @cancel="onClose"
    @ok="confirm"
  >
    <template #content>
      <input
        v-model="currentName"
        class="text-center text-primary text-14px"
        placeholder="请输入别名"
        type="text"
      />
    </template>
  </nrz-modal>
  <NrzBottomPopup v-model:show="carCheckVisible" tips="车辆审核">
    <Item
      title="车辆年审"
      class="nr-border-b nr-border-t"
      :val="dayjs(yearCheckCar).format(YMD_EN)"
      @click="handleInfo(1, '车辆年审', yearCheckCar)"
    ></Item>
    <Item
      title="运营证年审"
      class="nr-border-b"
      :val="dayjs(cardYear).format(YMD_EN)"
      @click="handleInfo(2, '运营证年审', cardYear)"
    ></Item>
    <Item
      title="运营证季审"
      class="nr-border-b"
      :val="dayjs(cardSeason).format(YMD_EN)"
      @click="handleInfo(3, '运营证季审', cardSeason)"
    ></Item>
  </NrzBottomPopup>
  <NrzBottomPopup v-model:show="insuranceVisible" tips="保险信息">
    <Item
      title="交强险"
      :text="compulsoryInsuranceCompany"
      :val="dayjs(compulsoryInsurance).format(YMD_EN)"
      class="nr-border-b nr-border-t"
      @click="handleInfo(4, compulsoryInsuranceCompany, compulsoryInsurance)"
    ></Item>
    <Item
      title="商业险"
      class="nr-border-b"
      :text="commercialInsuranceCompany"
      :val="dayjs(commercialInsurance).format(YMD_EN)"
      @click="handleInfo(5, commercialInsuranceCompany, commercialInsurance)"
    ></Item>
    <Item
      title="物流责任险"
      :text="logisticsLiabilityInsuranceCompany"
      :val="dayjs(logisticsLiabilityInsurance).format(YMD_EN)"
      class="nr-border-b"
      @click="
        handleInfo(
          6,
          logisticsLiabilityInsuranceCompany,
          logisticsLiabilityInsurance
        )
      "
    ></Item>
    <div class="w-full flex justify-center py-20px">
      <NrzBtn
        class="py-16px"
        style="width: 80%"
        plain
        round
        @click="editVehFile"
        >确定</NrzBtn
      >
    </div>
  </NrzBottomPopup>
  <NrzBottomPopup v-model:show="keepVisible" title="保险信息">
    <div class="flex justify-between px-16px text-12px opacity-70 mt-20px">
      <span class="w-80px">模式</span>
      <span>设置最近一次保养</span>
      <span class="text-center w-100px">周期</span>
    </div>
    <div class="flex items-center justify-between px-16px my-10px">
      <span class="w-80px">按里程</span>
      <input
        v-model="totalDistance"
        type="text"
        class="ipt ipt-w"
        placeholder="输入总里程"
      />
      <span class="flex items-center w-100px">
        <input v-model="distanceCycle" type="text" class="ipt" />
        <span class="w-12px">(km)</span>
      </span>
    </div>
    <div class="flex items-center justify-between px-16px">
      <span class="w-80px">按时间</span>
      <span
        class="flex-1 text-center"
        @click="
          () => {
            maintenanceVisible = true;
            editType = 5;
            checkData = maintenance;
          }
        "
        >{{
          maintenance ? dayjs(maintenance).format(YMD_EN) : '点击选择日期'
        }}</span
      >
      <span class="flex items-center w-100px">
        <input v-model="maintenanceCycle" type="text" class="ipt" />
        <span class="w-12px">(月)</span>
      </span>
    </div>
    <div class="flex justify-center w-full py-20px">
      <NrzBtn
        style="width: 80%"
        round
        plain
        @click="
          () => {
            keepVisible = false;
            editVehFile();
          }
        "
      >
        确定
      </NrzBtn>
    </div>
  </NrzBottomPopup>
  <van-popup
    :show="maintenanceVisible"
    position="bottom"
    :round="true"
    :z-index="1000"
    @close="maintenanceVisible = false"
  >
    <van-datetime-picker
      type="date"
      visible-item-count="5"
      :title="currentTitle"
      :value="checkData"
      :min-date="dayjs().subtract(1, 'year').valueOf()"
      :show-toolbar="true"
      :max-date="dayjs().add(1, 'year').valueOf()"
      @confirm="confirmmaintenance"
      @cancel="maintenanceVisible = false"
    />
  </van-popup>
  <van-popup
    :show="showTimePickerPanel"
    position="bottom"
    :round="true"
    :z-index="999"
    @close="showTimePickerPanel = false"
  >
    <van-picker
      :visible-item-count="3"
      :columns="INSURE_COMPONY.map((k) => k.name)"
      :default-index="defaultIndex"
      @change="changeIC"
    />
    <van-datetime-picker
      type="date"
      :title="currentTitle"
      :visible-item-count="3"
      :value="pcData"
      :min-date="dayjs().subtract(1, 'year').valueOf()"
      :show-toolbar="false"
      :max-date="dayjs().add(1, 'year').valueOf()"
      @input="confirmTime"
    />
    <button
      class="py-20px"
      @click="
        () => {
          showTimePickerPanel = false;
          editVehFile();
        }
      "
    >
      确定
    </button>
  </van-popup>
</template>
<script lang="ts">
import { onShareAppMessage, onShareTimeline } from '@/utils/index';
export default {
  onShareAppMessage,
  onShareTimeline,
};
</script>
<script lang="ts" setup>
import NrzModal from '@/components/nrz-modal/index.vue';
import { onBeforeMount, ref } from 'vue';
import CustomBar from '@/components/customHeader/index.vue';
import Taro, { useRouter } from '@tarojs/taro';
import {
  getCarDetail,
  uploadFile,
  getCarOtherInfo,
  editCarInfo,
  updateVehicleFile,
  unbindCar,
  delCarInfo,
} from '@/api/index';
import {
  CODE,
  Routes,
  useToast,
  YMD_EN,
  INSURE_COMPONY,
  jGcustomCount,
  JG,
} from '@/utils/index';
import NrImg from '@/components/img/img.vue';
import { useHeaderHeight, useModal } from '@/hooks/index';
import Item from './Item.vue';
import NrzBtn from '@/components/nrz-button/index.vue';
import NrzBottomPopup from '@/components/nrz-bottom-popup/index.vue';
import ShowForm from './form.vue';
import EditForm from './editForm.vue';
import FullLoading from '@/components/full-loading/index.vue';
import dayjs from 'dayjs';

definePageConfig({ navigationStyle: 'custom' });
let floading = ref(true);
let checkData = ref();
let pcData = ref();
let defaultIndex = ref();
let commercialInsuranceCompany = ref();
let commercialInsurance = ref();
let logisticsLiabilityInsuranceCompany = ref();
let logisticsLiabilityInsurance = ref();
let compulsoryInsuranceCompany = ref();
let compulsoryInsurance = ref();
let maintenance = ref();
let maintenanceVisible = ref(false);
let maintenanceCycle = ref();
let keepVisible = ref();
let totalDistance = ref();
let distanceCycle = ref();
let editForm = ref();
let formData = ref();
let insuranceVisible = ref(false);
let showTimePickerPanel = ref(false);
let plate = ref('');
let carCheckVisible = ref(false);
let isEdit = ref(false);
let vehicleName = ref('');
let updateTime = ref('');
let carImg = ref('');
let nickNameVisible = ref(false);
let currentName = ref();
let yearCheckCar = ref();
let cardYear = ref();
let cardSeason = ref();
let infoType = ref();
let currentTitle = ref('');
let editType = ref(0);
let err = ref(false);
const { headerHeight } = useHeaderHeight();

let backToPrev = () => {
  if (isEdit.value) {
    useModal({
      title: '提醒',
      content: '是否确定放弃编辑车辆档案？',
      success() {
        Taro.navigateBack();
      },
    });
    return;
  }
  Taro.navigateBack();
};
const paserFrontImg = () => {
  Taro.chooseImage({
    sourceType: ['album', 'camera'],
    success(res) {
      const tempFilePaths = res.tempFilePaths[0];
      carImg.value = tempFilePaths;
      uploadFile({
        file: tempFilePaths,
        type: 'vehicle',
      }).then((res) => {
        carImg.value = res as string;
      });
    },
  });
};
const uploadCarImg = () => {
  if (!isEdit.value) return;
  paserFrontImg();
};
const onClose = () => {
  nickNameVisible.value = false;
};
const confirm = () => {
  if (!currentName.value) return useToast('别名不可为空');
  vehicleName.value = currentName.value;
  nickNameVisible.value = false;
};
const hanldeCarCheck = () => {
  carCheckVisible.value = true;
};

let changeIC = (v) => {
  if (infoType.value === 4) {
    compulsoryInsuranceCompany.value = v.detail?.value;
  }
  if (infoType.value === 5) {
    commercialInsuranceCompany.value = v.detail?.value;
  }
  if (infoType.value === 6) {
    logisticsLiabilityInsuranceCompany.value = v.detail?.value;
  }
};
const confirmTime = (v) => {
  console.log(v.detail);
  let time = v.detail;
  if (infoType.value === 4) {
    compulsoryInsurance.value = time;
  }
  if (infoType.value === 5) {
    commercialInsurance.value = time;
  }
  if (infoType.value === 6) {
    logisticsLiabilityInsurance.value = time;
  }
};

let confirmmaintenance = (v) => {
  if (editType.value === 5) {
    maintenance.value = v?.detail;
  }
  if (infoType.value === 1) {
    yearCheckCar.value = v?.detail;
    editVehFile();
  }
  if (infoType.value === 2) {
    cardYear.value = v?.detail;
    editVehFile();
  }
  if (infoType.value === 3) {
    cardSeason.value = v?.detail;
    editVehFile();
  }
  checkData.value = v?.detail;
  maintenanceVisible.value = false;
};
const handleInfo = (type, title, time?) => {
  currentTitle.value = title;
  infoType.value = type;
  carCheckVisible.value = false;
  insuranceVisible.value = false;
  if (type === 1) {
    maintenanceVisible.value = true;
    checkData.value = dayjs(time).valueOf();
    yearCheckCar.value = time;
    return;
  }
  if (type === 2) {
    maintenanceVisible.value = true;
    checkData.value = dayjs(time).valueOf();
    cardYear.value = time;
    return;
  }
  if (type === 3) {
    maintenanceVisible.value = true;
    checkData.value = dayjs(time).valueOf();
    cardSeason.value = time;
    return;
  }
  // 456
  showTimePickerPanel.value = true;
  defaultIndex.value = INSURE_COMPONY.findIndex((k) => k.name === title);
  pcData.value = dayjs(time).valueOf();
};

let params = useRouter()?.params;
let editVehFile = () => {
  updateVehicleFile({
    type: editType.value,
    vinCode: params?.vinLicense,
    carCheckReq: {
      yearCheck: yearCheckCar.value
        ? dayjs(yearCheckCar.value).format(YMD_EN)
        : '',
      cardYear: cardYear.value ? dayjs(cardYear.value).format(YMD_EN) : '',
      cardSeason: cardSeason.value
        ? dayjs(cardSeason.value).format(YMD_EN)
        : '',
    },
    insuranceReq: {
      compulsoryInsuranceCompany: compulsoryInsuranceCompany.value
        ? compulsoryInsuranceCompany.value
        : '',
      compulsoryInsurance: compulsoryInsurance.value
        ? dayjs(compulsoryInsurance.value).format(YMD_EN)
        : '',
      commercialInsurance: commercialInsurance.value
        ? dayjs(commercialInsurance.value).format(YMD_EN)
        : '',
      commercialInsuranceCompany: commercialInsuranceCompany.value,
      logisticsLiabilityInsuranceCompany:
        logisticsLiabilityInsuranceCompany.value,
      logisticsLiabilityInsurance: logisticsLiabilityInsurance.value
        ? dayjs(logisticsLiabilityInsurance.value).format(YMD_EN)
        : '',
    },
    nextInsuranceReq: {
      totalDistance: totalDistance.value,
      distanceCycle: distanceCycle.value,
      maintenance: dayjs(maintenance.value).format(YMD_EN),
      maintenanceCycle: maintenanceCycle.value,
    },
  });
};
let save = () => {
  let form1 = editForm.value.validateLicense();
  let form2 = editForm.value.validateDriver();
  Promise.all([form1, form2])
    .then((res) => {
      Taro.showLoading();
      editCarInfo({
        ...res[0],
        ...res[1],
        vehicleImg: carImg.value,
        vehicleName: vehicleName.value,
      }).then((resp) => {
        jGcustomCount(JG.CV_003);
        jGcustomCount(JG.CV_007);

        if (resp?.code !== CODE) return useToast(resp?.msg);
        Taro.hideLoading({
          success() {
            useToast(resp?.msg);
          },
        });
        _getCarDetail();
      });
      isEdit.value = false;
    })
    .catch((error) => {
      Taro.showToast({
        title: error[0].message,
        icon: 'none',
      });
    });
};
let eidtInfo = () => {
  if (!isEdit.value) {
    isEdit.value = true;
    return;
  }
  if (isEdit.value) {
    save();
  }
};
let _unbind = () => {
  useModal({
    title: '提醒',
    content:
      '解除绑定后车辆所有数据都将丢失，且APP中不在可见，请确定是否解除绑定？',
    success() {
      Taro.showLoading();
      if (formData?.value?.vehicleType === 1) {
        // 解除电车
        unbindCar({ vin: formData.value?.vinCode }).then((resp) => {
          if (resp?.code !== CODE) return useToast(resp?.msg);
          Taro.hideLoading({
            success() {
              Taro.navigateBack({
                success() {
                  useToast(resp?.msg);
                },
              });
            },
          });
        });
      } else {
        // 解除油车
        delCarInfo(formData.value?.id).then((resp) => {
          if (resp?.code !== CODE) return useToast(resp?.msg);
          Taro.hideLoading({
            success() {
              Taro.navigateBack({
                success() {
                  useToast(resp?.msg);
                },
              });
            },
          });
        });
      }
    },
  });
};

function _getCarDetail() {
  getCarDetail({ vinLicense: params?.vinLicense })
    .then((res) => {
      floading.value = false;
      err.value = false;

      if (res?.code !== CODE) return useToast(res?.msg);
      formData.value = res?.data;
      vehicleName.value = res?.data?.vehicleName;
      carImg.value = res?.data?.vehicleImg;
      updateTime.value = res?.data?.updateTime;
    })
    .catch(() => {
      err.value = true;
      floading.value = false;
    });
}
onBeforeMount(() => {
  _getCarDetail();
});

let getNormalInfo = (type) => {
  getCarOtherInfo({ vinCode: params?.vinLicense, type }).then((res) => {
    if (type == 0) {
      jGcustomCount(JG.CV_005);
    }
    if (type == 2) {
      jGcustomCount(JG.CV_006);
    }
    if (type == 1) {
      jGcustomCount(JG.CV_004);
    }
    if (res?.code !== CODE) return useToast(res?.msg);
    let {
      yearCheck: cc = '',
      cardYear: cy = '',
      cardSeason: cs = '',
    } = res?.data?.carCheckReq ?? {};
    console.log(cc, cy, cs);
    yearCheckCar.value = dayjs(cc ?? '').valueOf();
    cardYear.value = dayjs(cy ?? '').valueOf();
    cardSeason.value = dayjs(cs ?? '').valueOf();

    let {
      commercialInsuranceCompany: c1,
      commercialInsurance: c2,
      compulsoryInsurance: c3,
      compulsoryInsuranceCompany: c4,
      logisticsLiabilityInsurance: c5,
      logisticsLiabilityInsuranceCompany: c6,
    } = res?.data?.insuranceReq ?? {};
    commercialInsuranceCompany.value = c1;
    commercialInsurance.value = c2;
    compulsoryInsurance.value = c3;
    compulsoryInsuranceCompany.value = c4;
    logisticsLiabilityInsurance.value = c5;
    logisticsLiabilityInsuranceCompany.value = c6;

    totalDistance.value = res?.data?.nextInsuranceReq?.totalDistance || '';
    distanceCycle.value = res?.data?.nextInsuranceReq?.distanceCycle || '';
    maintenance.value = dayjs(
      res?.data?.nextInsuranceReq?.maintenance || ''
    ).valueOf();
    maintenanceCycle.value =
      res?.data?.nextInsuranceReq?.maintenanceCycle || '';
  });
};
</script>
<style>
.ipt {
  background-color: #ddd;
  width: 60px;
  padding: 4px 4px;
}
.ipt-w {
  width: 80px;
}
</style>
