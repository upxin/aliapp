import Taro from '@tarojs/taro';
import { store, systemInfo } from '@/stores/index';
const fs = Taro.getFileSystemManager();

export function getStore(key) {
  let ret;
  let max = 0;
  const helper = () => {
    if (max > 10) return;
    try {
      ret = Taro.getStorageSync(key);
    } catch (error) {
      max += 1;
      helper();
    }
  };
  helper();
  if (!ret) return null;
  return JSON.parse(ret);
}

export function getStorage(key) {
  return new Promise((rv) => {
    my.getStorage({
      key,
      success(res) {
        rv(JSON.parse(res.data));
      },
      fail() {
        rv(null);
      },
    });
  });
}

export function removeStore(key) {
  Taro.removeStorageSync(key);
}
export function setStore(key, val) {
  if (key === 'USER_INFO') {
    store().setLoginStatus(true);
  }
  if (val === undefined) return;
  return Taro.setStorageSync(key, JSON.stringify(val));
}

export function readFileAsync({ path, encoding }) {
  return new Promise<{ data: any; errMsg: string }>((resolve, reject) => {
    fs.readFile({
      filePath: path,
      encoding,
      success(res) {
        resolve(res);
      },
      fail(res) {
        reject(res);
      },
    });
  });
}

export function initRightBtnRect() {
  const h = Taro.getMenuButtonBoundingClientRect().height; // 右上角按钮的高度
  const t = Taro.getMenuButtonBoundingClientRect().top; // 右上角按钮距离顶部的高度
  const w = Taro.getMenuButtonBoundingClientRect().width; // 右上角按钮距离顶部的高度
  systemInfo().SetRightBtnRect({ h, t, w });
}

export function useToast(title?, duration?) {
  Taro.showToast({
    title: title ?? '异常错误',
    icon: 'none',
    duration: duration ? duration : 3500,
  });
}

export function useCall(phone = '') {
  if (!phone) {
    Taro.showToast({
      title: '手机号有误',
      icon: 'none',
    });
    return;
  }
  Taro.showModal({
    title: '提示',
    content: `确定拨打电话：${phone}?`,
    success: function (res) {
      if (res.confirm) {
        Taro.makePhoneCall({
          phoneNumber: phone,
        });
      }
    },
  });
}
