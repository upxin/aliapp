import { get, post } from '@/utils/index';

export function getCarTypeList(params) {
  return get({
    url: '/vehicle/test',
    params,
  });
}
// 售前门店列表
export const getShopList = (params) => {
  return get({ url: '/vehicle/shops/list', params });
};

// 售前已开通城市列表
export const getCityList = (params) => {
  return get({
    url: '/vehicle/shop/citys/list',
    params,
  });
};

export function submitTestDrive(params) {
  // const stringP = qs.stringify(params);
  return post({
    url: `/vehicle/test/drive`,
    params,
    // headers: {
    //     'content-type': 'application/x-www-form-urlencoded',
    // },
  });
}
// 车首页下面
export const getLoveCar = (params) => {
  return get({ url: '/vehicle/owner/loveCar', params });
};
export function getPhone(params) {
  return get({ url: '/member/getPhoneNum', params });
}

// 车首页上面轮播
// vin字段切换右上角绑定的汽车名字
export function carInfo(params: { isOwner: boolean; vin?: string }) {
  // 车主 isOwner true 司机 isOwner false。调用两次 判断是车主还是司机 或者即是车主也是司机
  // 1. delivery 付定金或者全款 待交车
  // 2. optional 判断是否选配，同时要判断本地
  // cars 右上角显示的车名称  包含vin参数 可以选取。点击后再走carInfo
  return get({
    url: '/vehicle/owner/carInfo',
    params,
  });
}

export function carDetail(params) {
  return get({ url: '/vehicle/vehicle/img', params });
}
export function getCarBehavior(params) {
  return get({
    url: '/vehicle/owner/carBehavior',
    params,
  });
}
export function getDriverList(params) {
  return get({
    url: '/vehicle/drivers',
    params,
  });
}

export function searchBreakRules(params) {
  return get({
    url: '/vehicle/violation/inquiry',
    params,
  });
}

export function autoParts(params) {
  return get({
    url: '/vehicle/search/autoParts/list',
    params,
  });
}
export function getVideos(params) {
  return get({
    url: '/vehicle/atlas/videos',
    params,
  });
}
export function getMessage(params) {
  return get({ url: '/info/msg/list', params });
}
export function agree(params) {
  return post({
    url: '/info/msg/update',
    params,
  });
}
export function getPayPoints(params) {
  return get({
    url: '/payment/points/logs',
    params,
  });
}

export function getPayPointsAll(params) {
  return get({
    url: '/payment/points/get',
    params,
  });
}

export function getPartsDetail(params) {
  return get({
    url: '/vehicle/autoParts/detail',
    params,
  });
}

export function getAllCar(params) {
  // 获取用户所有的车
  return get({
    url: '/vehicle/user/vehicle/list',
    params,
  });
}
export function bannerListConsut(params) {
  return get({
    url: '/info/information/banner',
    params,
  });
}

export function navigationListConsut(params) {
  return get({
    url: '/info/information/navigation',
    params,
  });
}
export function newsListConsut(params) {
  return get({
    url: '/info/information/news',
    params,
  });
}
export function updateCarInfo(params) {
  return post({
    url: '/vehicle/update',
    params,
  });
}

export function unbindCar(params) {
  return post({
    url: '/vehicle/owner/unbind',
    params,
  });
}

export function maintainsRecord(params) {
  return get({
    url: '/vehicle/maintains/record',
    params,
  });
}

export function hasPrepay(params) {
  return get({
    url: '/portal/get/switch',
    params,
  });
}

// 交付弹框判断
export function deliverProcess(params) {
  return get({
    url: '/vehicle/owner/deliverProcess',
    params,
  });
}

// 交付弹框确认
export function deliverProcessPost(params) {
  return post({
    url: '/owner/deliverProcess/confirm',
    params,
  });
}

// 交付确认列表
export function deliverProcessList(params) {
  return get({
    url: '/vehicle/owner/deliverProcessList',
    params,
  });
}
export function signIn() {
  return get({
    url: '/payment/signIn/submitSignInfo',
  });
}
