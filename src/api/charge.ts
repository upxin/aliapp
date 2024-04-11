import {
  get,
  post,
  getStore,
  USER_INFO,
  jGcustomCount,
  JG,
} from '@/utils/index';
const memberId = getStore(USER_INFO)?.member_id || '';

export function getStations(params) {
  return post({
    url: '/vehicle/charging/query_stations_info1',
    params,
  });
}

export function getWalletOrderRecord(params) {
  return post({
    url: '/vehicle/charge/walletPayOrder/page',
    params,
  });
}
export function getWalletBuyOrBackRecord(params) {
  return post({
    url: '/payment/wallet/order/page',
    params,
  });
}

export function getMarkerStation(obj) {
  return post({
    url: '/vehicle/charging/station/page',
    params: {
      ...obj,
      memberId,
    },
  });
}

export function getAllEnum() {
  return get({
    url: '/vehicle/charging/station/allEnums',
  });
}

export function getStationDetail(obj = {}) {
  return post({
    url: '/vehicle/charging/station/detail',
    params: {
      ...obj,
      memberId,
    },
  });
}

export function getChargeGunList(params = {}) {
  return post({
    url: '/vehicle/charging/station/connector/list',
    params,
  });
}

// 详情评论
export function chargeCommentList(params = {}) {
  return post({
    url: '/vehicle/charging/station/comment/page',
    params,
  });
}

// 开通充电钱包
export function openWallet(params = {}) {
  return post({
    url: '/payment/wallet/open',
    params,
  });
}

// 检验是否开通了充电钱包
export function isOpenWallet(params) {
  return get({
    url: '/payment/wallet/check',
    params,
  });
}
// 充电钱包详情
export function walletDetail(params) {
  return get({
    url: '/payment/wallet/detail',
    params,
  });
}
// 购买充电币
export function buyCoin(params) {
  return post({
    url: '/payment/wallet/recharge',
    params,
  });
}

// 获取充电币充值价格列表
export function coinPriceList() {
  return get({
    url: '/payment/wallet/list/price',
  });
}
// 获取充电币折扣价
export function getSalePrice(params) {
  return get({
    url: '/payment/wallet/price',
    params,
  });
}
interface PayType {
  payType: 1 | 2 | 3 | 4;
  vin: string;
  plateNum?: string;
  connectorId?: string;
  couponId?: string | number;
}

// 结束充电
export function stopCharge(params = { vin: '' }) {
  return post({
    url: '/vehicle/charge/stop',
    params,
  });
}

// 校验充电权限
export function checkChargeAuth({ vin }) {
  return get({
    url: '/vehicle/charge/check/' + vin,
  });
}
// 退充电币

export function backCoin(coin) {
  return post({
    url: '/payment/wallet/refund',
    params: { coin, platform: 2 },
  });
}
export function chargeOrder(params) {
  return post({
    url: '/vehicle/charge/order/page',
    params,
  });
}
export function chargeOrderCanApllyInvoice(params) {
  return post({
    url: '/vehicle/charge/billOrder/page',
    params,
  });
}
export function orderDetail(orderId) {
  return get({
    url: `/vehicle/charge/order/detail/${orderId}`,
  });
}
export function getEvaluationEnum() {
  return get({
    url: '/vehicle/evaluation/getEvaluationEnum',
  });
}

export function submitEvaluation(params) {
  return post({
    url: '/vehicle/evaluation/submitEvaluation',
    params,
  });
}

export function queryEvaluation(params) {
  return post({
    url: '/vehicle/evaluation/queryEvaluation',
    params,
  });
}
//

export function collectStation(params) {
  jGcustomCount(JG.CHARGE_010);
  return post({
    url: '/vehicle/collectStation/commonCollect',
    params,
  });
}

export function commentEnum() {
  return get({
    url: '/vehicle/dict/charge/comment',
  });
}

export function applyComment(params) {
  return post({
    url: '/vehicle/charge/order/comment',
    params,
  });
}

export function collectStationList(params) {
  return post({
    url: '/vehicle/charging/member/station/page',
    params,
  });
}

// 微信支付分

export function getServiceType(serviceType = 'charge') {
  return post({
    url: `/payment/payment/payTypeList/${serviceType}`,
  });
}

// 开启充电
export function beforeChargeCheck(params: PayType) {
  return post({
    url: '/vehicle/charge/start',
    params,
  });
}

export function payTypeList(serviceType = 'charge') {
  return get({
    url: `/payment/payment/payTypeList/${serviceType}`,
  });
}

export function confirmInfo(orderId) {
  return get({
    url: `/vehicle/charge/wechat/order/confirmInfo`,
    params: {
      orderId,
    },
  });
}

export function wechatCharge(orderId) {
  return post({
    url: `/vehicle/charge/wechat/start?orderId=${orderId}`,
  });
}
export function getCouponList(params) {
  return post({
    url: '/payment/coupon/page',
    params,
  });
}
export function getAvailableCoupon(params) {
  return post({
    url: '/payment/coupon/available/count',
    params,
  });
}

export function getCouponCount(params) {
  return post({
    url: '/payment/coupon/notExpired/count',
    params,
  });
}
