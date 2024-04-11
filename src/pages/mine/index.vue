<template>
  <CustomBar background-color="#f6f6f6" position="relative" :border="false">
    <template #default>
      <div class="flex items-center pl-60px">
        <span
          class="icon-qrcode iconfont text-16px"
          @click="
            () => {
              show = true;
              invite = false;
              jGcustomCount(JG.USER_007);
            }
          "
        ></span>
        <span
          class="icon-setting iconfont ml-18px text-20px font-bold"
          @click="
            () => {
              handleSet();
            }
          "
        ></span>
        <span
          class="iconfont icon-qiandao ml-18px text-24px text-20px"
          @tap="tabSign"
        ></span>
      </div>
    </template>
  </CustomBar>
  <div
    v-if="showLogin"
    class="fixed top-0 left-0 w-full h-full"
    style="z-index: 9999"
  >
    <Login @back="closeLogin" @success="refresh"></Login>
  </div>
  <template v-else>
    <FullLoading :loading="fl">
      <section
        style="background-color: #f6f6f6"
        class="flex items-center justify-between px-15px pb-20px pt-40px"
      >
        <div class="flex items-center flex-1">
          <NrImg
            mode="scaleToFill"
            class="overflow-hidden rounded-full w-60px h-60px"
            :url="avatar"
          ></NrImg>
          <section class="pl-16px">
            <span class="mb-6px">Hi，</span>
            <span>{{ nickName }}</span>
          </section>
        </div>
        <nut-button
          class="border-solid rounded-none border-1px text-12px text-primary py-6px px-10px nrz-thin"
          @click="_signIn"
        >
          {{
            signData?.hasSignOrNot
              ? `已连续签到
                  ${
                    signData?.continuedDays > 99
                      ? '99+'
                      : signData?.continuedDays
                  }
                  天`
              : '即刻签到'
          }}
        </nut-button>
      </section>
      <div class="flex justify-around text-normal bg-hex-fff py-18px mb-10px">
        <section
          class="flex flex-col items-center justify-center"
          @click="
            () => {
              nrNavigateTo(Routes.scoreList);
            }
          "
        >
          <span class="font-blod mb-12px h-14px">{{ allPoints }}</span>
          <span class="nrz-thin text-12px opacity-61">我的积分</span>
        </section>
        <section
          class="flex flex-col items-center justify-center"
          @click="
            () => {
              navigateToPage({
                route: 'chargeWalletHome',
              });
            }
          "
        >
          <span
            class="font-blod mb-12px h-14px"
            @click="
              () => {
                toChargeWallet();
              }
            "
          >
            {{ needOpenWallet ? '即刻开通' : coin }}
          </span>
          <span class="nrz-thin text-12px opacity-61">充电钱包</span>
        </section>
        <section
          class="flex flex-col items-center justify-center"
          @click="
            () => {
              nrNavigateTo(Routes.coupon);
            }
          "
        >
          <span class="font-blod mb-12px h-14px">{{ couponCount }}</span>
          <span class="nrz-thin text-12px opacity-61">优惠卡券</span>
        </section>
      </div>
      <div style="background-color: #f6f6f6; height: 10px"></div>

      <section class="flex items-center justify-between px-15px bg-fff py-10px">
        <div>
          <span>邀请好友</span>
          <span class="opacity-70 text-10px mt-6px">
            赢取属于您的专属好友推荐礼。
          </span>
        </div>
        <nut-button
          class="rounded-full bg-main px-14px py-6px nrz-thin m-0"
          :style="{ color: 'rgba(16, 16, 16, 0.75)' }"
          @click="
            () => {
              jGcustomCount(JG.USER_007);
              show = true;
              invite = true;
            }
          "
        >
          点击邀请
        </nut-button>
      </section>

      <div style="background-color: #f6f6f6; height: 10px"></div>

      <section class="flex flex-wrap bg-fff py-20px">
        <div
          v-for="item in entryList"
          :key="item.imageUrl"
          class="flex flex-col items-center w-1_4 mb-20px"
          @click="
            () => {
              handleListItem(item);
            }
          "
        >
          <NrImg :url="item.imageUrl" class="w-24px h-24px"></NrImg>
          <div class="mt-6px">{{ item.text }}</div>
        </div>
      </section>
      <section class="bg-fff">
        <NrImg
          :url="LOGO_IMG_BOTTOM"
          class="m-auto bg-center bg-no-repeat bg-contain w-100px h-32px"
        ></NrImg>
      </section>
      <div class="bg-fff h-60px"></div>
    </FullLoading>
  </template>
  <NrzOverlay v-model:show="show">
    <div class="flex flex-col items-center px-60px">
      <div
        class="flex flex-col items-center flex-1 w-full overflow-hidden text-center bg-primary text-fff"
      >
        <div class="w-full bg-fff py-10px">
          <img
            :src="LOGO_IMG_BOTTOM"
            class="w-120px h-30px mt-10px"
            mode="scaleToFill"
          />
        </div>
        <div class="w-full nr-border-b--dashed"></div>
        <div class="arc text-primary nrz-thin">
          {{ nickName }}
        </div>
        <canvas
          id="canvas"
          canvas-id="canvas"
          type="2d"
          @ready="onReady"
          class="w-120px h-120px"
        ></canvas>
        <div v-if="invite" class="py-20px">扫描二维码下载APP赢积分！</div>
        <section v-else class="py-20px">
          <div class="nrz-thin mt-10px">请使用前晨APP扫描</div>
          <div class="nrz-thin">*长按图片保存本地</div>
        </section>
      </div>
      <span
        class="icon-close1 iconfont mt-10px text-40px text-fff"
        @click.stop="
          () => {
            show = false;
          }
        "
      ></span>
    </div>
  </NrzOverlay>
  <fly-landscape :show="showSignPopover" @close="showSignPopover = false">
    <div class="h-300px relative w-273px">
      <img :src="signBgUrl" class="w-full h-full" />
      <img
        :src="dateUrl"
        class="w-90px h-110px absolute x-center bottom-70px"
      />
      <div class="absolute bottom-96px font-bold z-99 x-center flex items-end">
        <div class="text-14px pb-10px">+</div>
        <div class="text-36px">
          {{ awardPoints }}
        </div>
      </div>
      <div class="absolute bottom-80px nrz-thin z-99 text-12px x-center">
        {{ toDay }}
      </div>
      <div
        class="opacity-40 absolute bottom-48px nrz-thin z-99 text-12px x-center"
      >
        签到奖励{{ awardPoints }}积分已入账
      </div>
      <nut-button
        class="absolute x-center px-20px nrz-thin text-12px text-fff bottom-14px py-6px rounded-full"
        style="background-color: #f73333"
        @tap="tapTpScoreInfo"
      >
        查看积分
      </nut-button>
    </div>
  </fly-landscape>
</template>
<script lang="ts">
import { onShareAppMessage, onShareTimeline } from '@/utils/index';
import { onMounted } from 'vue';
export default {
  onShareAppMessage,
  onShareTimeline,
};
</script>
<script lang="ts" setup>
import { ref } from 'vue';
import NrzOverlay from '@/components/nrz-overlay/index.vue';
import Taro, {
  useDidShow,
  usePullDownRefresh,
  useShareAppMessage,
} from '@tarojs/taro';
import FlyLandscape from '@/components/landscape/index.vue';
import {
  getMinePageData,
  getPayPointsAll,
  isOpenWallet,
  walletDetail,
  deliverProcess,
  getPersonalInfo,
  getCouponCount,
  signIn,
} from '@/api/index';
import {
  nrNavigateTo,
  getStore,
  USER_INFO,
  CODE,
  goPages,
  useToast,
  LOGO_IMG_BOTTOM,
  NEWRIZON_DOMAIN,
  WEBVIEW_PREFIX,
  navigateToPage,
  JG,
  jGcustomCount,
  BTN_SHARE,
} from '@/utils/index';
import { homeStore, loveCarStore } from '@/stores';
import Login from '@/components/login/index.vue';
import NrImg from '@/components/img/img.vue';
import { Routes } from '@/utils/index';
import CustomBar from '@/components/customHeader/index.vue';
import { entryList } from './util.js';
import dayjs from 'dayjs';
import FullLoading from '@/components/full-loading/index.vue';
import { Base64 } from '@/utils/index';
import QRCode from 'qrcode';

useShareAppMessage(() => {
  return {
    title: '前晨汽车 智能网联商用车引领者',
    path: `/pages/index/index`,
    imageUrl: BTN_SHARE,
  };
});
const signBgUrl = 'https://nrz-app.su.bcebos.com/app-pic/signin_dialog_bg.png';
const dateUrl =
  'https://nrz-app.su.bcebos.com/app-pic/signin_dialog_inner_bg.png';

definePageConfig({
  transparentTitle: 'auto',
  titlePenetrate: 'YES',
  defaultTitle: '',
  enablePullDownRefresh: true,
  enableShareAppMessage: true,
});
const HomeStore = homeStore();
let showSignPopover = ref(false);
let toDay = ref(dayjs().format('MM月DD日'));
const mobile = ref('');
const nickName = ref('');
let invite = ref(false);
let show = ref(false);
let fl = ref(true);
let awardPoints = ref('');
const userInfo = ref();
let showLogin = ref(true);
let needOpenWallet = ref(false);
let allPoints = ref(0);
let coin = ref(0);
let signData = ref<{
  carNum?: number;
  collectNum?: number;
  scoreNum?: number;
  orderNum?: number;
  hasSignOrNot?: boolean;
  continuedDays?: number;
}>({});
let couponCount = ref(0);

function onReady() {
  console.log('onReady================', 1111);

  let base64Json = Base64.encode(
    JSON.stringify({
      name: nickName.value,
      mobile: mobile.value,
    })
  );

  let url = `https://bevwjw.jgmlink.cn/Aa6F?info=${base64Json}`;
  let q = Taro.createSelectorQuery().select('#canvas');
  q.node().exec((res) => {
    const canvas = res[0].node;
    console.log(canvas, 1111);
    QRCode.toCanvas(canvas, url, function (error) {
      if (error) console.error(error);
      console.log('success!');
    });
  });
}
onMounted(() => {});
function closeVr() {
  loveCarStore().setIsVr(false);
  Taro.reLaunch({
    url: '/pages/index/index',
  });
}
function handleSet() {
  nrNavigateTo(Routes.setMine);
}
const avatar = ref();

function tabSign() {
  nrNavigateTo(Routes.signinCalendar);
}
function _signIn() {
  signIn().then((res) => {
    if (res?.data) {
      awardPoints.value = res?.data?.awardPoints;
      showSignPopover.value = true;
      jGcustomCount(JG.USER_005);
    } else {
      useToast(res?.msg);
    }
    if (res?.code == CODE) {
      init();
    }
  });
  jGcustomCount(JG.ALL_007);
}
function tapTpScoreInfo() {
  showSignPopover.value = false;
  nrNavigateTo(Routes.scoreList);
}
function goCollect() {
  let { member_id, token } = getStore(USER_INFO) ?? {};
  let url = `${WEBVIEW_PREFIX}?url=${NEWRIZON_DOMAIN}/pages/user_collection/user_collection?type=1&title=收藏列表&MEMBER_ID=${member_id}&TOKEN=${token}&PLATFORM=weapp&t=${new Date().getTime()}`;
  nrNavigateTo(url);
}

async function _deliverProcess() {
  if (!getStore(USER_INFO)) return;
  const { code, data } = await deliverProcess({});
  if (code !== CODE) return;
  if (data) {
    goPages('index');
  } else {
    // data为null 是都确认了就去车队
    nrNavigateTo(Routes.fleetHome);
  }
}
function handleListItem({ type, route, moduleName, params }: any) {
  console.log(1234, type, route, moduleName, params);
  if (!route) return useToast('敬请期待');
  if (type === 4) {
    nrNavigateTo(Routes.addCar);
    return;
  }
  if (type == 12) {
    goCollect();
    return;
  }
  if (type == 3) {
    _deliverProcess();
    return;
  }
  nrNavigateTo(route, params);
}
function toChargeWallet() {
  navigateToPage({
    route: 'chargeWalletHome',
  });
}
function closeLogin() {
  showLogin.value = false;
  goPages('index');
}
function refresh() {
  showLogin.value = false;
  HomeStore.setState('needRefresh', true);
  init();
}
function _getMainData() {
  if (getStore(USER_INFO)?.member_id) {
    userInfo.value = getStore(USER_INFO);
    getMinePageData({ member_id: getStore(USER_INFO)?.member_id }).then(
      (res) => {
        fl.value = false;
        if (res.code === CODE) {
          signData.value = res.data;
        }
      }
    );
  }
}
function _getAllPoints() {
  let member_id = getStore(USER_INFO)?.member_id;
  getPayPointsAll({ member_id }).then((res) => {
    if (res.code !== CODE) return;
    allPoints.value = Number(res.data);
  });
}
function _walletDetail() {
  isOpenWallet({})
    .then((res) => {
      fl.value = false;

      Taro.stopPullDownRefresh();
      if (res.code !== CODE) return useToast(res?.msg);
      if (res.data) {
        walletDetail({}).then((res) => {
          if (res.code !== CODE) return useToast(res?.msg);
          coin.value = res.data?.coin;
        });
        needOpenWallet.value = false;
      } else {
        needOpenWallet.value = true;
      }
    })
    .catch(() => {
      fl.value = false;
    });
}
function init() {
  _getMainData();
  _getAllPoints();
  _walletDetail();
  getPersonalInfo({}).then((res) => {
    if (res?.data?.avatar) {
      avatar.value = res?.data?.avatar;
      nickName.value = res?.data?.nickname ?? getStore(USER_INFO)?.nickName;
    }
  });
  getCouponCount({}).then((res) => {
    console.log('coupon', res.data);
    couponCount.value = res.data;
  });
}

useDidShow(() => {
  if (!getStore(USER_INFO)) {
    showLogin.value = true;
    return;
  }
  showLogin.value = false;
  init();
});
usePullDownRefresh(() => {
  if (!getStore(USER_INFO)) {
    showLogin.value = true;
    return;
  }
  showLogin.value = false;
  init();
});
// bottom
</script>
<style lang="scss">
page {
  background-color: #fff;
}
.nut-dialog {
  padding: 0;
  padding-top: 20px;
}
.popup-center.round {
  border-radius: 6px;
}
.wrapper {
  display: flex;
  height: 100%;
  align-items: center;
  flex-direction: column;
  overflow: hidden;
  justify-content: center;
  .content {
    display: flex;
    flex-direction: column;
    width: 240px;
    height: 360px;
    background: #fff;
    border-radius: 8px;
    overflow: hidden;
    align-items: center;
  }
}
.arc {
  width: 110%;
  height: 60px;
  background: #fff;
  border-radius: 0 0 100% 100%;
  margin-bottom: 20px;
  line-height: 60px;
}
#qr-main-container {
  position: fixed;
  left: 1000px;
}
</style>
