import { get, post } from '@/utils/index';

export function shopDetail(params) {
  return get({
    url: '/vehicle/shop/detail',
    params,
  });
}

export function shopComment(params) {
  return get({
    url: '/vehicle/shop/comment/list',
    params,
  });
}

export function companyInfo(params) {
  return get({
    url: '/vehicle/shop/companyInfo',
    params,
  });
}

export function joinUs(params) {
  return post({
    url: '/vehicle/shop/join',
    params,
  });
}
