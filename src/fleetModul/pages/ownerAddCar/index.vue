<template>
  <CustomBar background-color="#fff" :z="998">
    <template #title>{{
      params?.type === '3' ? 'OBU推广' : '成为车主'
    }}</template>
    <template v-if="params?.type === '3'" #customLeft>
      <span @click="navitoRecords">推广记录</span>
    </template>
  </CustomBar>
  <!--用于图片压缩的canvas画布，不在页面中展示，且id固定不可变-->
  <!--画布结束-->
  <section :style="{ paddingTop: `${headerHeight}px` }">
    <section class="py-20px">
      <div class="flex m-auto border-solid border-1px border-primary w-168px">
        <span
          class="text-center py-8px w-84px"
          :class="{ 'bg-primary': type === 1, 'text-fff': type === 1 }"
          @click="type = 1"
        >
          行驶证识别
        </span>
        <span
          class="text-center py-8px w-84px"
          :class="{ 'bg-primary': type === 2, 'text-fff': type === 2 }"
          @click="type = 2"
        >
          手动录入
        </span>
      </div>
    </section>
    <Auto
      v-if="type === 1"
      v-model:back="backData"
      v-model:front="frontData"
    ></Auto>
    <template v-if="params?.type === 'obu'">
      <div
        class="flex border-0 border-solid ml-14px text-16px px-16px mt-20px mb-10px font-700 pl-6px border-l-3px border-normal"
      >
        <span>车主信息</span>
        <span class="text-danger">*</span>
      </div>
      <template v-if="showOwner">
        <nut-form ref="ownerForm" :model-value="ownerData">
          <nut-form-item
            prop="owner"
            label-width="100"
            :rules="[{ required: true, message: '请填写车主名称' }]"
          >
            <template #label>
              <div class="flex">
                <span>车主名称</span>
                <span class="text-danger ml-4px">*</span>
              </div>
            </template>
            <input
              v-model="ownerData.owner"
              class="nut-input-text"
              type="text"
              placeholder="请填写车主名称"
            />
          </nut-form-item>
          <nut-form-item
            prop="mainAccount"
            label-width="100"
            :rules="[
              {
                validator: customValidatorPhone,
                message: '车主手机号不合法',
              },
            ]"
          >
            <template #label>
              <div class="flex">
                <span>车主手机</span>
                <span class="text-danger ml-4px">*</span>
              </div>
            </template>
            <input
              v-model="ownerData.mainAccount"
              class="nut-input-text"
              type="text"
              placeholder="请填写司机手机"
            />
          </nut-form-item>
          <div
            class="leading-normal opacity-50 ml-6px text-10px px-20px py-14px"
          >
            *
            完善司机信息，可自动开通前晨APP账号，司机可在APP上查看车辆相关数据。
          </div>
        </nut-form>
      </template>
      <div class="mx-14px my-20px">
        <button
          class="flex justify-center items-center m-auto rounded-full w-200px py-10px"
          style="background-color: rgba(239, 244, 248, 1)"
          @click="scanOwner"
        >
          <span class="icon-qr-scan-2-line iconfont"></span>
          <span class="ml-6px">扫描车主二维码</span>
        </button>
      </div>

      <div class="leading-normal nrz-thin text-12px px-20px mb-20px">
        *车主打开前晨APP，登录后在【我的】页面点击左上角的个人二维码，扫描获取车主关联信息。
      </div>
    </template>
    <section>
      <div class="h-10px bg-main"></div>
      <DriverForm ref="driverForm"></DriverForm>
      <div class="h-10px bg-main"></div>
      <DFrom ref="licenseForm" :back="backData" :front="frontData"></DFrom>
      <div class="h-10px bg-main"></div>
      <div
        class="border-0 border-solid ml-14px text-16px px-16px mt-20px mb-10px font-700 pl-6px border-l-3px border-normal"
      >
        车辆正面照
      </div>
      <section class="box-border w-full px-20px mt-30px">
        <div v-if="state.carImg" class="relative w-full h-200px">
          <img class="w-full h-200px" mode="aspectFit" :src="state.carImg" />
          <div
            class="absolute flex items-center justify-center rounded-full w-100px h-100px center"
            style="background-color: rgba(222, 36, 33, 0.6)"
            @click="delCarImg"
          >
            <span
              class="iconfont icon-changyonggoupiaorenshanchu text-40px text-fff"
            ></span>
          </div>
        </div>
        <section v-else class="relative bg-main h-200px" @click="paserCarImg">
          <div
            class="absolute flex items-center justify-center rounded-full w-120px h-120px center"
            style="background-color: rgba(91, 250, 166, 0.8)"
          >
            <span class="icon-photograph iconfont text-40px text-fff"></span>
          </div>
        </section>
      </section>
    </section>
  </section>
  <section class="flex justify-center px-40px pb-50px mt-20px">
    <button class="w-full py-14px bg-primary text-fff" @click="submit">
      提交
    </button>
  </section>
  <NrzOverlay v-if="params?.type === '3'" :show="show" :z-index="999">
    <div class="flex items-center justify-center w-full h-full">
      <div
        class="flex flex-col items-center rounded-md bg-fff w-280px p-14px px-24px"
      >
        <div class="font-bold text-16px my-6px">OBU推广说明</div>

        <section class="opacity-70">
          <div v-for="(k, i) of list" :key="i" class="flex items-start my-10px">
            <span class="pr-6px">{{ i + 1 }}.</span>
            <span class="flex-1"> {{ k }}</span>
          </div>
        </section>
        <nut-button
          class="m-auto w-200px"
          shape="square"
          :disabled="delay > 0"
          color="#11264d"
          @click="show = false"
        >
          {{ delay > 0 ? `请仔细阅读(${delay})` : '确认' }}
        </nut-button>
      </div>
    </div>
  </NrzOverlay>
  <NrzOverlay :show="showCropper" :z-index="999">
    <Cropper :img-url="oldCarImgUrl" @success="carImgSuccess"></Cropper>
  </NrzOverlay>
</template>
<script lang="ts">
import { onShareAppMessage, onShareTimeline } from '@/utils/index';
export default {
  onShareAppMessage,
  onShareTimeline,
};
</script>
<script lang="ts" setup>
import { onMounted, ref, reactive } from 'vue';
import CustomBar from '@/components/customHeader/index.vue';
import Taro, { useReady, useRouter } from '@tarojs/taro';
import {
  uploadFile,
  bindMaster,
  addObu,
  bindOther,
  getObuInfo,
} from '@/api/index';
import {
  CODE,
  setStore,
  OBU_USER,
  useToast,
  Base64,
  customValidatorPhone,
  getStore,
  USER_INFO,
  nrNavigateTo,
  Routes,
  jGcustomCount,
  JG,
} from '@/utils/index';
import Auto from '../../comp/auto.vue';
import DriverForm from '../../comp/driverForm.vue';
import DFrom from '../../comp/licenceForm.vue';
import { useHeaderHeight, useModal } from '@/hooks/index';
import Cropper from './Cropper.vue';
import NrzOverlay from '@/components/nrz-overlay/index.vue';

definePageConfig({
 transparentTitle: 'always',
  titlePenetrate: 'YES',
  defaultTitle: '',  usingComponents: {
    'image-cropper': '../../../components/image-cropper/image-cropper',
  },
});
const { headerHeight } = useHeaderHeight();
// bottom
let list = [
  'OBU推广使用一定要遵循车主自愿原则，不得违背车主意愿强行安装。',
  '安装后不得以查看数据等为目的诱导骗取司机的前晨APP账号。',
  '推广安装成功后会获得一定的前晨积分奖励，具体金额以实际奖励为准。',
  '安装之后司机的正常行驶等某正常用车行为可能会给您带来一定的积分奖励，具体以前晨汽车官方解释为准。',
  '前晨OBU最终解释权归前晨汽车所有，以OBU推广之名违反国家法律的一切行为推广人员应承担相应的法律责任。',
];
let oldCarImgUrl = ref('');
let canvasW = ref(300);
let canvasH = ref(300);
let showCropper = ref(false);
let backData = ref();
let frontData = ref();
let params = useRouter()?.params;
let type = ref(1);
let vehicleImg = ref<any>('');
let state = reactive({
  carImg: '',
});
let show = ref(true);
let delay = ref(10);
let driverForm = ref();
let licenseForm = ref();
let ownerData = reactive({
  owner: '',
  mainAccount: '',
});
let ownerForm = ref();
let canvas;
function setCanvasWH({ w, h }) {
  let ctx = canvas.getContext('2d');
  let dpr = my.getSystemInfoSync().pixelRatio;
  canvasW.value = w;
  canvasH.value = h;
  // ctx.scale(dpr, dpr);
}
function carImgSuccess(url) {
  state.carImg = url;
  uploadFile({
    file: url,
    type: 'vehicle',
  }).then((res) => {
    console.log('vehicleImg', res);
    showCropper.value = false;
    vehicleImg.value = res;
  });
}
function paserCarImg() {
  Taro.chooseMedia({
    count: 1, //只传一张
    mediaType: ['image'],
    sizeType: ['compressed'], //原图质量好，然后通过canvas压缩，缩略图压缩就太糊了
    sourceType: ['album', 'camera'], // 来源是相册和相机
    success: (res) => {
      console.log('choose', res);
      let imgSrc = res?.tempFiles?.[0]?.tempFilePath; //原图的路径
      oldCarImgUrl.value = imgSrc;
      showCropper.value = true;
    },
  });
}
const delCarImg = () => {
  useModal({
    title: '提醒',
    content: '确认删除车辆正面照？删除后需要重新上传！',
    success: () => {
      state.carImg = '';
      vehicleImg.value = '';
    },
  });
};

let showOwner = ref(false);

const scanOwner = () => {
  Taro.scanCode({
    success(res) {
      const { errMsg, result } = res;
      if (errMsg !== 'scanCode:ok') return useToast(errMsg);
      let info = result.split('info=')?.[1];
      let data = JSON.parse(Base64.decode(info));
      showOwner.value = true;

      ownerData.owner = data?.name;
      ownerData.mainAccount = data?.mobile;
    },
  });
};
const navitoRecords = () => {
  nrNavigateTo(Routes.obuRecords);
};
const validateOwnerForm = () => {
  return new Promise((resolve) => {
    ownerForm.value.validate().then(({ valid, errors }: any) => {
      console.log('valid, errors', valid, errors);
      if (valid) {
        resolve(ownerData);
      } else {
        useToast(errors[0].message);
      }
    });
  });
};

const submit = () => {
  let promiseList = [
    driverForm.value.validateDriver(),
    licenseForm.value.validateLicense(),
  ];

  if (params.type === '3') {
    if (!showOwner.value) return useToast('请扫码获取车主信息');

    promiseList.push(validateOwnerForm());
  }

  //  推广obu   /vehicle/veh/promote/add
  Promise.all(promiseList).then((res) => {
    if (!vehicleImg.value) return useToast('请上传车辆正面照');
    let p1 = res.reduce((prev, cur) => {
      return { ...prev, ...cur };
    }, {});

    let p = { ...p1, vehicleImg: vehicleImg.value, vehicleType: null };
    Taro.showLoading();

    if (params.type === '3') {
      let userInfo = getStore(USER_INFO);

      addObu({
        ...p,
        installerName: userInfo?.nickName,
        installerMobile: userInfo.mobile,
      }).then((res) => {
        if (res.code === CODE) {
          jGcustomCount(JG.USER_008);
          Taro.hideLoading({
            success: () => {
              console.log('succcc');
              useToast(res?.msg);
              setTimeout(() => {
                nrNavigateTo(Routes.obuResult, res?.data);
              }, 1000);
            },
          });
        } else {
          Taro.hideLoading({
            success() {
              useToast(res?.msg);
            },
          });
        }
      });
      return;
    }
    if (params?.type === 'other') {
      jGcustomCount(JG.BV_005);

      bindOther(p).then((res) => {
        if (res.code === CODE) {
          Taro.hideLoading({
            success() {
              setTimeout(() => {
                useToast('添加成功');
                Taro.navigateBack();
              }, 1000);
              const mobile = getStore(USER_INFO);
              getObuInfo({ mobile }).then((obu) => {
                if (obu.code === CODE) {
                  setStore(OBU_USER, obu.data);
                }
              });
            },
          });
        } else {
          Taro.hideLoading({
            success() {
              useToast(res?.msg);
            },
          });
        }
      });
      return;
    }
    bindMaster(p).then((res) => {
      jGcustomCount(JG.BV_004);
      if (res.code === CODE) {
        Taro.hideLoading({
          success() {
            setTimeout(() => {
              useToast('添加成功');
              Taro.navigateBack();
            }, 1000);
          },
        });
      } else {
        Taro.hideLoading({
          success() {
            useToast(res?.msg);
          },
        });
      }
    });
  });
};
let timer: any;
onMounted(() => {
  timer = setInterval(() => {
    if (delay.value === 0) return clearInterval(timer);
    delay.value = delay.value - 1;
  }, 1000);
});
useReady(() => {
  setTimeout(() => {
    const query = my.createSelectorQuery();
    query
      .select('#zipCanvas')
      .fields({ node: true, size: true, id: true })
      .exec((res) => {
        console.log(res);
        let { node } = res[0];
        canvas = node;
      });
  }, 1000);
});
</script>
<style>
page {
  border-color: #fff;
}
</style>
