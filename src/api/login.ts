import { get, post } from '@/utils/index';
import qs from 'query-string';

export function wxLogin(params) {
  // 微信登录
  return get({ url: '/member/miniProgram/login', params });
}

export function autoLogin(params) {
  // 没绑定微信  手机号登录
  return post({ url: '/member/miniProgram/autoLogin', params });
}

export function modifyUserInfo(params: {
  // 修改用户信息
  member_id: string;
  nickname: string;
  file: any;
}) {
  const p = qs.stringify(params);
  return post({
    url: `/member/modifyUserInfo?${p}`,
    params,
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
  });
}

export function passwordLogin(params) {
  return post({
    url: `/member/login`,
    params,
  });
}
export function getMinePageData(params: { member_id: string }) {
  return get({
    url: '/member/statistics',
    params,
  });
}
export function offMember() {
  return post({
    url: '/member/logout',
    params: {},
  });
}

export function TEST({ mobile }) {
  return post({
    url: `/member/autoLogin/?mobile=${mobile}`,
    params: {},
  });
}

export function refreshToken(mobile, refreshToken) {
  return post({
    url: '/member/refreshToken',
    params: {
      mobile,
      refreshToken,
    },
    opts: {
      loading: true,
      betterData: true,
    },
  });
}
export function memberLogin(params) {
  return post({
    url: '/member/login',
    params,
  });
}
export function getCodeReset(mobile) {
  return get({
    url: '/member/sms/reset/code',
    params: { mobile },
  });
}

export function reetPsw(params) {
  return post({
    url: '/member/reset',
    params,
  });
}
