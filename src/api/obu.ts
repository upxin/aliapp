import {
  get,
  post,
  httpDelete,
  BASE_URL,
  BASE_OBU_URL,
  getStore,
  USER_INFO,
} from '@/utils/index';
import Taro from '@tarojs/taro';

export function getObuInfo(params) {
  return get({
    url: '/vehicle/open/myTeam',
    params,
    headers: {},
    opts: {
      obu: true,
    },
  });
}

export function parseLisence({ file }) {
  const userInfo = getStore(USER_INFO);
  Taro.showLoading({
    title: '解析中...',
  });
  return new Promise((resolve, reject) => {
    Taro.uploadFile({
      url: `${BASE_OBU_URL}/vehicle/veh/card/parse`,
      filePath: file,
      header: {
        Authorization: userInfo?.token || '',
      },
      name: 'file',
      success(res) {
        Taro.hideLoading();
        if (res.statusCode != 200) {
          Taro.showToast({
            title: res?.errMsg,
            icon: 'none',
          });
          return;
        }
        const data = JSON.parse(res.data);
        if (data.code == 200) {
          Taro.showToast({
            title: '解析成功',
            icon: 'success',
          });
          const ret = data?.data;
          resolve(ret);
        } else {
          Taro.showToast({
            title: '解析错误',
            icon: 'error',
          });
          reject(false);
        }
      },
      fail(err) {
        Taro.hideLoading();
        Taro.showToast({
          title: err?.errMsg || '解析失败',
          icon: 'none',
        });
      },
    });
  });
}

/***
 * @param type
 * 车辆照片：vehicle
 * 头像： avatar
 */
export function uploadFile({ file, type }) {
  const userInfo = getStore(USER_INFO);
  Taro.showLoading();
  return new Promise((resolve, reject) => {
    Taro.uploadFile({
      url: `${BASE_URL}/vehicle/file/upload/${type}`,
      filePath: file,
      header: {
        Authorization: userInfo?.token || '',
      },
      name: 'file',
      success(res) {
        Taro.hideLoading();
        if (res.statusCode != 200) {
          Taro.showToast({
            title: res?.errMsg,
            icon: 'none',
          });
          return;
        }
        const data = JSON.parse(res.data);
        if (data.code == 200) {
          const ret = data?.data;
          resolve(ret);
        } else {
          Taro.showToast({
            title: data?.msg || '上传失败',
            icon: 'error',
          });
          reject(false);
        }
      },
      fail(err) {
        Taro.hideLoading();
        Taro.showToast({
          title: err?.errMsg || '上传失败',
          icon: 'none',
        });
      },
    });
  });
}

export function bindMaster(params) {
  return post({
    url: '/vehicle/bindMaster',
    params,
  });
}
export function parseVehicle({ file }) {
  const userInfo = getStore(USER_INFO);
  return new Promise((resolve, reject) => {
    Taro.uploadFile({
      url: `${BASE_OBU_URL}/vehicle/veh/driverCard/parse`,
      filePath: file,
      header: {
        Authorization: userInfo?.token || '',
      },
      name: 'file',
      success(res) {
        Taro.hideLoading();
        if (res.statusCode != 200) {
          Taro.showToast({
            title: res?.errMsg,
            icon: 'none',
          });
          return;
        }
        const data = JSON.parse(res.data);
        if (data.code == 200) {
          const ret = data?.data;
          resolve(ret);
        } else {
          Taro.showToast({
            title: data?.msg || '解析失败',
            icon: 'error',
          });
          reject(false);
        }
      },
      fail(err) {
        Taro.hideLoading();
        Taro.showToast({
          title: err?.errMsg || '解析失败',
          icon: 'none',
        });
      },
    });
  });
}

export function getPersonalInfo(params) {
  return get({
    url: '/member/singleMemberInfo',
    params,
    headers: {},
    opts: {
      betterData: true,
      obu: false,
    },
  });
}
export function editPersonalInfo(params) {
  return post({
    url: '/member/editProfile',
    params,
    opts: {},
  });
}

export function addObu(params) {
  return post({
    url: '/vehicle/veh/promote/add',
    params,
    opts: {
      obu: true,
    },
  });
}
export function onlineCars(params) {
  return get({
    url: '/vehicle/open/online',
    params,
    opts: {
      obu: true,
    },
  });
}

export function obuRecords(params, cb?) {
  return post({
    url: '/vehicle/veh/promote/page',
    params,
    opts: {
      obu: true,
      cb,
    },
  });
}

export function getVehList(params, cb?) {
  return post({
    url: '/vehicle/open/vehPage',
    params,
    opts: {
      obu: true,
      cb,
    },
  });
}
export function bindOther(params) {
  return post({
    url: '/vehicle/veh/app/add',
    params,
    opts: {
      obu: true,
    },
  });
}

export function getFleetToday(params) {
  return get({
    url: '/vehicle/union/todayData',
    params,
    opts: {
      obu: true,
    },
  });
}

export function getFleetHistory(params) {
  return get({
    url: '/vehicle/union/hisData',
    params,
    opts: {
      obu: true,
    },
  });
}

export function getFleetVehList(params?) {
  return get({
    url: '/vehicle/union/vehList',
    params,
    opts: {
      obu: true,
    },
  });
}

export function getCarPosition({ vinLicense }) {
  return get({
    url: `/vehicle/vehData/locationTracking/vinLicense/${vinLicense}`,
    opts: {
      obu: true,
    },
  });
}

export function hisTravel(params) {
  return post({
    url: `/vehicle/union/hisTravel`,
    params,
    opts: {
      obu: true,
    },
  });
}

export function teamRank(params) {
  return get({
    url: `/vehicle/open/teamRank`,
    params,
    opts: {
      obu: true,
    },
  });
}

export function fleetCarData(params) {
  return get({
    url: `/vehicle/union/vehData`,
    params,
    opts: {
      obu: true,
    },
  });
}

export function dashboard(params) {
  return get({
    url: `/vehicle/union/dashboard`,
    params,
    opts: {
      obu: true,
    },
  });
}

export function carDataHis(params) {
  return get({
    url: `/vehicle/union/vehHis`,
    params,
    opts: {
      obu: true,
    },
  });
}

export function driveScore(params) {
  return post({
    url: `/vehicle/driver/score/page`,
    params,
    opts: {
      obu: true,
    },
  });
}
export function vehEvent(params) {
  return post({
    url: `/vehicle/union/vehEvent`,
    params,
    opts: {
      obu: true,
    },
  });
}

export function faultList(params) {
  return post({
    url: `/vehicle/fault/page`,
    params,
    opts: {
      obu: true,
    },
  });
}
export function getAllData(params) {
  return post({
    url: `/vehicle/union/allDataRank`,
    params,
    opts: {
      obu: true,
    },
  });
}

export function getCarDetail(params) {
  return get({
    url: `/vehicle/union/detail`,
    params,
    opts: {
      obu: true,
    },
  });
}

export function getCarOtherInfo(params) {
  return get({
    url: `/vehicle/vehicleFile/query`,
    params,
    opts: {},
  });
}

export function updateVehicleFile(params) {
  return post({
    url: `/vehicle/vehicleFile/edit`,
    params,
    opts: {},
  });
}
export function editCarInfo(params) {
  return post({
    url: '/vehicle/veh/update',
    params,
    opts: {
      obu: true,
    },
  });
}

export function delCarInfo(id) {
  return httpDelete({
    url: `/vehicle/veh/delete/${id}}`,
    opts: {
      obu: true,
    },
  });
}

export function vehScore({ vinLicense }) {
  return get({
    url: `/vehicle/union/vehScore`,
    params: { vinLicense },
    opts: {
      obu: true,
    },
  });
}

export function findRecBanner() {
  return get({
    url: `/info/recommend/banner`,
    opts: {},
  });
}

export function findMap() {
  return get({
    url: `/info/recommend/navigate`,
    opts: {},
  });
}

export function findConsult(params) {
  return post({
    url: `/info/recommend/recommend`,
    params,
    opts: {},
  });
}

// 活动类型 type 0推荐页进行中活动 1- 发现页进行中活动 2- 历史活动
export function findActivity(params) {
  return post({
    url: `/info/foundActivity/list`,
    params,
    opts: {},
  });
}

export function scienceList(params) {
  return post({
    url: `/info/science/list`,
    params,
    opts: {},
  });
}

export function knowledge(params) {
  return get({
    url: `/info/brand/knowledge`,
    params,
    opts: {},
  });
}

export function honor(params) {
  return post({
    url: `/info/brand/honor`,
    params,
    opts: {},
  });
}

export function monthData(params) {
  return get({
    url: '/vehicle/union/monthData',
    params,
    opts: { obu: true },
  });
}

export function inviteRecord(params) {
  return post({
    url: '/member/invite/inviteRecord',
    params,
    opts: { obu: false },
  });
}
export function studyClass(params) {
  return post({
    url: '/vehicle/vehicle/pageUseCarClass',
    params,
  });
}

export function mileageCalcConfig() {
  return get({
    url: '/vehicle/vehicle/mileageCalcConfig',
  });
}
export function getCarYearData(params) {
  return post({
    url: '/vehicle/union/monthChart',
    params,
    opts: { obu: true },
  });
}

export function teamMonthChart(params) {
  return post({
    url: '/vehicle/union/teamMonthChart',
    params,
    opts: { obu: true },
  });
}

export function peerRank(params) {
  return post({
    url: '/vehicle/union/peerRank',
    params,
    opts: { obu: true },
  });
}

export function dsConfig(params) {
  return post({
    url: '/vehicle/driver/score/config',
    params,
    opts: { obu: true },
  });
}

export function dsDetail() {
  return get({
    url: '/vehicle/driver/score/config/detail',
    opts: { obu: true },
  });
}
