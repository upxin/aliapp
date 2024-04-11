import Taro from '@tarojs/taro';
import { VERSION, USER_INFO, OBU_USER } from './constant';
import { getStore } from './weapp';
import { useToast } from './weapp';
import { Response } from '@/types/index';

const dev = 'https://appdev-api.newrizon.cloud';
const prod = 'https://app-api.newrizon.cloud';

const OBU_DEV = 'https://obu-gateway-dev.newrizon.cloud';
const OBU_PROD = 'https://fms.newrizon.com/api';
// 'https://yapi.newrizon.work/mock/11'
export const BASE_URL = `${
  process.env.NODE_ENV === 'development' ? dev : prod
}`;
export const BASE_OBU_URL = `${
  process.env.NODE_ENV === 'development' ? OBU_DEV : OBU_PROD
}`;

enum HTTP_STATUS {
  SUCCESS = 200,
  NOT_FOUND = 404,
  AUTHENTICATE = 401,
  SERVER_ERROR = 5,
}
const TIMEOUT = 15000;
const mock = 'https://yapi.newrizon.work/mock/11';

export function filterNull(obj) {
  const newObj = {};
  for (const key in obj) {
    if ([null, undefined].includes(obj[key])) {
      continue;
    }
    newObj[key] = obj[key];
  }
  return newObj;
}
function regUrl(path: string) {
  return path.includes('http') ? path : BASE_URL + path;
}
function regObuUrl(path: string) {
  return path.includes('http') ? path : BASE_OBU_URL + path;
}

function regResponse(res, resolve, reject) {
  if (res.statusCode === HTTP_STATUS.SUCCESS) {
    if (res.data.status == '1') {
      return resolve(res.data);
    }
    if (res.data.code === 200) {
      return resolve(res.data);
    } else {
      if (res.data.code === -2) {
        return resolve(res?.data); // 登录的时候微信会返回 code 50101
      }
      // Taro.showToast({
      //   title: res?.data?.msg || '请求错误',
      //   icon: 'none',
      //   duration: 5000,
      // });
      return resolve(res?.data); // 登录的时候微信会返回 code 50101
    }
  }

  if (res.statusCode === HTTP_STATUS.NOT_FOUND) {
    useToast('请求资源不存在');
    reject(res.data);
    return;
  }

  if (/^5\d{0,}$/.test(res.statusCode)) {
    useToast('服务器错误');
    return reject({ msg: res?.data?.msg || '服务器错误' });
  }
  if (/^4\d{0,}$/.test(res.statusCode)) {
    useToast('接口异常');
    return reject({ msg: '接口异常' });
  }

  return reject(res?.data ?? {});
}
export function fetch(method, url, params, headers = {}, opts): Promise<any> {
  // let contentType = "application/x-www-form-urlencoded";
  const userInfo = getStore(USER_INFO);
  const obuInfo = getStore(OBU_USER);
  params = filterNull(params);
  return new Promise((resolve, reject) => {
    Taro.request({
      url: opts?.obu ? regObuUrl(url) : regUrl(url), //地址
      data: params, //传参
      method: method, //请求方式
      timeout: TIMEOUT, // 超时时间
      header: {
        //请求头
        'content-type': 'application/json;charset=UTF-8',
        platform: 'weapp',
        version: VERSION,
        'member-id': userInfo?.member_id || '',
        Authorization: !opts?.obu ? userInfo?.token : obuInfo?.token,
        'app-token': userInfo?.token,
        ...headers,
      },
      success(res) {
        regResponse(res, resolve, reject);
      },
      fail(err) {
        reject(err);
        Taro.showToast({
          title: err.errMsg || '请求错误',
          icon: 'none',
        });
      },
    });
  });
}
export function get<T>({
  url,
  params = {},
  headers = {},
  opts = { obu: false },
}: any): Promise<Response<T>> {
  return fetch('GET', url, params, headers, opts);
}
export function post<T>({
  url,
  params,
  headers = {},
  opts = { obu: false },
}: any): Promise<Response<T>> {
  return fetch('POST', url, params, headers, opts);
}
export function httpDelete({
  url,
  params = {},
  headers = {},
  opts = { obu: false },
}: any) {
  return fetch('DELETE', url, params, headers, opts);
}

export function mockGet({
  url,
  params = {},
  headers = {},
  opts = { obu: false },
}) {
  return fetch('GET', mock + url, params, headers, opts);
}
export function mockPost({ url, params, headers = {}, opts = { obu: false } }) {
  return fetch('POST', mock + url, params, headers, opts);
}

enum ERR_MSG {
  NOT_FOUND = 'Not Found',
  TIMEOUT = 'request:fail timeout',
}

export function regErr(err): string {
  if (err.error === ERR_MSG.NOT_FOUND) return '资源不存在';
  if (err.errMsg === ERR_MSG.TIMEOUT) return '网络错误';

  return '加载失败';
}
