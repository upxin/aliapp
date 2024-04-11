import {
  get,
  getStore,
  goPages,
  nrNavigateTo,
  post,
  USER_INFO,
  BASE_URL,
  useToast,
  Routes,
  showCharginCar,
} from '@/utils/index';
import Taro from '@tarojs/taro';

export function getTaskList() {
  return get({
    url: '/payment/points/task/list',
  });
}

export function parseSite(params) {
  return post({
    url: '/vehicle/charge/parse',
    params,
  });
}

export function allCarList() {
  return get({
    url: '/vehicle/user/carList',
    params: {
      withNoCar: true,
    },
  });
}
export function getSiteBanner(type = 2) {
  return post({
    url: `/vehicle/open/resource/${type}`,
    params: {
      pageSize: -1,
    },
  });
}

export function signinCalendar(params) {
  return post({
    url: '/payment/signIn/signinCalendar',
    params,
  });
}

export function getScoreList(params) {
  return post({
    url: '/payment/points/logs/page',
    params,
  });
}

export function getOtherCarChargingData(vin) {
  return get({
    url: `/vehicle/charge/chargeInfo/${vin}`,
  });
}

function toChargingCar(code: string) {
  if (code?.startsWith('nrz_')) {
    nrNavigateTo('chargingOtherCar');
  } else {
    showCharginCar(code);
    goPages('index');
  }
}

function getSiteInfo({ qrCode }) {
  parseSite({
    qrCode,
  }).then((res) => {
    Taro.hideLoading();

    if (!res?.data) {
      useToast(res?.msg);
      return;
    }
    nrNavigateTo(Routes.beforeCharge, {
      connectorId: res?.data?.connector?.connectorId,
    });
  });
}

export function getCharging() {
  const userInfo = getStore(USER_INFO);
  if (!userInfo) {
    nrNavigateTo('login');
    return;
  }
  Taro.showLoading({
    title: '加载中...',
  });
  return new Promise((rv) => {
    get({
      url: '/vehicle/charge/chargingOrder',
    }).then((res1) => {
      if (res1?.data) {
        Taro.hideLoading();

        Taro.showModal({
          title: '提示',
          confirmText: '查看',
          content: '当前有其他车辆正在充电,是否查看？',
          success(res2) {
            if (res2.confirm) {
              console.log('用户点击确定');
              toChargingCar(res1?.data);
            } else if (res2.cancel) {
              console.log('用户点击取消');
            }
          },
        });
        rv(res1?.data);
      } else {
        Taro.hideLoading();
        Taro.scanCode({
          success(res) {
            const { errMsg, result } = res;
            //rawData aHR0cHM6Ly9xcmNvZGUuY2Ftc25ldGVjLmNvbS8jLzEyMzUyNTY4MDI=
            //result  https://qrcode.camsnetec.com/#/1235256802
            if (errMsg !== 'scanCode:ok') {
              return useToast(errMsg);
            }
            getSiteInfo({
              qrCode: result,
            });
          },
        });
      }
    });
  });
}

export function getChargingInSite() {
  // 401 不需要 loading
  const userInfo = getStore(USER_INFO);
  if (!userInfo) return;

  Taro.request({
    url: BASE_URL + '/vehicle/charge/chargingOrder', //地址
    method: 'GET', //请求方式
    timeout: 10000, // 超时时间
    header: {
      //请求头
      'content-type': 'application/json;charset=UTF-8',
      platform: 'weapp',
      'member-id': userInfo?.member_id || '',
      Authorization: userInfo?.token,
      'app-token': userInfo?.token,
    },
    success(res) {
      if (res?.data?.data) {
        Taro.showModal({
          title: '提示',
          confirmText: '查看',
          content: '当前有其他车辆正在充电,是否查看？',
          success(res2) {
            if (res2.confirm) {
              console.log('用户点击确定');
              toChargingCar(res?.data?.data);
            } else if (res2.cancel) {
              console.log('用户点击取消');
            }
          },
        });
      }
    },
  });
}
