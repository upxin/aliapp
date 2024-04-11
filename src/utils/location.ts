import { systemInfo, store } from '@/stores/index';
import { getCityInfo } from '@/api/index';
import Taro from '@tarojs/taro';

interface Location {
  accuracy: number; // 位置的精确度
  altitude: number; // 高度，单位 m
  horizontalAccuracy: number; //	水平精度，单位 m
  latitude: number; // 纬度，范围为 -90~90，负数表示南纬
  longitude: number; // 经度，范围为 -180~180，负数表示西经
  speed: number; // 速度，单位 m/s
  verticalAccuracy: number; // 垂直精度，单位 m（Android 无法获取，返回 0）
  errMsg: string;
}

export function initLocation() {
  Taro.startLocationUpdate({
    success: function (res) {
      console.log(res);
      // locationChange();
    },
  });
}

export function locationChange(): Promise<{
  latitude: number;
  longitude: number;
}> {
  return new Promise((resolve, reject) => {
    try {
      Taro.onLocationChange((location) => {
        // 实时监听位置变化
        console.log('onLocationChange', location);
        resolve(location);
      });
    } catch (error) {
      reject(error);
    }
  });
}
export function offLocChange() {
  Taro.offLocationChange((res) => {
    console.log('offLocChange', res);
  });
}

// 根据经纬度调取高德 webServerApi 获取城市信息
export function saveCityInfo({ latitude, longitude, ...rest }) {
  return new Promise((resolve) => {
    getCityInfo({
      longitude,
      latitude,
      ...rest,
    }).then((res) => {
      const ret = {
        ...res.regeocode.addressComponent,
        latitude,
        longitude,
      };
      if (res.status !== '1') return;
      store().setCityInfo(ret);
      resolve(ret);
    });
  });
}

export function initSystemInfo() {
  return new Promise((resolve, reject) => {
    Taro.getSystemInfo({
      success: (ret) => {
        const appInfo = systemInfo();
        appInfo.setSystemInfo(ret);
        resolve(ret);
      },
      fail: (error) => {
        Taro.showToast({
          title: error.errMsg,
        });
        reject({
          err: error,
        });
      },
    });
  });
}

export function useLocation(): Promise<Location> {
  return new Promise((resolve, reject) => {
    Taro.getLocation({
      type: 'wgs84',
      success: (res) => {
        console.log('useLocation==== success', res);
        resolve(res);
      },
      fail: function (err) {
        console.log('useLocation==== fail', err);
        reject(err);
      },
    });
  });
}
