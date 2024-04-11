import Taro from '@tarojs/taro';
import { getStore } from './weapp';
import { onlineKefu } from './app';
import { filterNull } from './request';
import qs from 'query-string';
import { makePhoneCall, USER_INFO, WEBVIEW_PREFIX } from './index';

export function parseRouteInfo(route) {
  // route格式
  // nrz://com.qianchen/app/needToPath?type=2&msg=当前车辆暂不支持&url=https://xxxxx
  const prefix: string = route.split('?')?.[0]; // nrz://com.qianchen/app/toast
  const paramsStr = route.split('?')?.[1]; // type=2&msg=当前车辆暂不支持&url=https://xxxxx
  const _path = prefix.replace('nrz://com.qianchen/app/', '');
  const remoteParams = qs.parse(paramsStr);
  return { _path: _path?.trim(), remoteParams };
}

const _useToast = ['toast'];
const _Call = ['call'];
const _HOME = 'app/main?'; // index=3" 从左往右0-4
const homeMap = {
  0: 'consult',
  1: 'message',
  2: 'index',
  3: 'shop',
  4: 'mine',
};
function _IsNeedLogin(url: string): boolean {
  return url.includes('isNeedLogin=true');
}
//   url=https://h5.newrizon.cloud/html/1671245088642.html&hasShare=true&key=jgId&key=https://nrz-app.su.bcebos.com/news/1671245088642.jpg
export function goCommWebview(route: string, success?, cParams?) {
  const i = route.indexOf('?');
  let info = route.slice(i + 1);

  if (cParams) {
    for (const key in cParams) {
      if (Object.prototype.hasOwnProperty.call(cParams, key)) {
        const element = cParams[key];
        info = info + `&${key}=${element}`;
      }
    }
  }
  const url = `/other-pages/pages/webview/index?info=${encodeURIComponent(
    info
  )}`;
  console.log('webview=============', url);
  Taro.navigateTo({
    success: () => {
      success?.();
    },
    url,
  });
}

function regParams(obj) {
  const newObj = {};
  for (const k in obj) {
    if (obj[k] === undefined || obj[k] === null) {
      newObj[k] = '';
      continue;
    }
    newObj[k] = obj[k];
  }
  return newObj;
}
export function navigateToPage({
  route,
  params = {},
  success,
  cb,
  module = 'chargeModule',
}: {
  route?;
  params?;
  success?;
  cb?;
  module?;
}) {
  //
  if (!route) {
    return;
  }
  params = regParams(params);
  const pages = Taro.getCurrentPages();
  const { _path, remoteParams } = parseRouteInfo(route);

  if (_IsNeedLogin(route)) {
    if (!getStore(USER_INFO)) {
      Taro.navigateTo({
        url: `/other-pages/pages/login/index?url=${
          pages[pages.length - 1]?.route
        }`,
      });
      return;
    }
  }

  if (route.includes(_HOME)) {
    const i = remoteParams?.index as string;
    Taro.switchTab({
      url: `/pages/${homeMap[i]}/index`,
    });
    return;
  }

  if (_Call.includes(_path)) {
    makePhoneCall(remoteParams?.tel as string);
    return;
  }

  // toast提示的
  if (_useToast.includes(_path)) {
    Taro.showToast({
      icon: 'none',
      title:
        decodeURIComponent(remoteParams?.msg as string) || '暂未开通此功能',
    });
    return;
  }

  // 需要直接去webview的
  // 直接单独处理
  if (route.includes(WEBVIEW_PREFIX)) {
    goCommWebview(route, success, params);
    return;
  }

  const finalParams = {
    ...filterNull(params),
    ...remoteParams,
  };
  const stringifyFinalParams = `${
    Object.keys(finalParams)?.length ? '?' + qs.stringify(finalParams) : ''
  }`;

  const url = `/${module}/pages/${_path}/index${decodeURIComponent(
    stringifyFinalParams
  )}`;
  // hack小程序路由最大堆栈
  console.log(`url==========================:${url}`);

  if (pages.length >= 9) {
    Taro.redirectTo({
      url,
    });
  } else {
    Taro.navigateTo({
      url,
      success: () => {
        success?.();
      },
      fail: () => {
        //
      },
    });
  }
}

export function nrNavigateTo(
  route: string,
  params = {},
  cb?: (p: any, path?) => any,
  success?: () => any
) {
  if (!route) {
    return;
  }

  const pages = Taro.getCurrentPages();
  const { _path, remoteParams } = parseRouteInfo(route);
  console.log(_path, '_path_path_path_path_path_path_path_path_path_path_path');

  // 需要登录的
  if (route.includes('customerService')) {
    onlineKefu(remoteParams?.url as string);
    return;
  }
  if (_IsNeedLogin(route)) {
    if (!getStore(USER_INFO)) {
      Taro.navigateTo({
        url: `/other-pages/pages/login/index?url=${
          pages[pages.length - 1]?.route
        }`,
      });
      return;
    }
  }

  if (route.includes(_HOME)) {
    const i = remoteParams?.index as string;
    Taro.switchTab({
      url: `/pages/${homeMap[i]}/index`,
    });
    return;
  }

  if (_Call.includes(_path)) {
    makePhoneCall(remoteParams?.tel as string);
    return;
  }

  // toast提示的
  if (_useToast.includes(_path)) {
    Taro.showToast({
      icon: 'none',
      title:
        decodeURIComponent(remoteParams?.msg as string) || '暂未开通此功能',
    });
    return;
  }

  // 需要直接去webview的  有可能有的webview也要登录 或者添加车辆需要在 cb中处理了
  // 直接单独处理
  if (route.includes(WEBVIEW_PREFIX)) {
    goCommWebview(route, success, params);
    return;
  }

  const finalParams = {
    ...filterNull(params),
    ...remoteParams,
  };
  const stringifyFinalParams = `?${qs.stringify(finalParams)}`;

  // hack小程序路由最大堆栈
  let _navigateTo;
  if (pages.length >= 9) {
    _navigateTo = Taro.redirectTo;
  } else {
    _navigateTo = Taro.navigateTo;
  }

  if (params?.redirect) {
    _navigateTo = Taro.redirectTo;
  }

  const moduleList = [
    'other-pages',
    'fleetModul',
    'chargeModule',
    'noCarCharge',
  ];
  const go = async (url, index) => {
    return new Promise((resolve) => {
      _navigateTo({
        url,
        success() {
          success?.();
          resolve(true);
        },
        fail() {
          if (index == moduleList?.length - 1) {
            Taro.navigateTo({
              url: '/other-pages/pages/no/index',
            });
          }
          resolve(false);
        },
      });
    });
  };
  const run = async () => {
    for (let index = 0; index < moduleList.length; index++) {
      const m = moduleList[index];
      const url = `/${m}/pages/${_path}/index${decodeURIComponent(
        stringifyFinalParams
      )}`;

      console.log(`goOthersPges===============：${url}`);

      const flag = await go(url, index);

      if (flag) return;
    }
  };
  run();
}

export function goPages(path) {
  if (!path) return;
  Taro.switchTab({
    url: `/pages/${path}/index`,
  });
}
