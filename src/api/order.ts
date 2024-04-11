import { get, post } from '@/utils/index';

export function allOrder(params) {
  return get({
    url: '/order/all',
    params,
  });
}

export function getCarOrderList(params) {
  return get({
    url: '/order/vehicle/orders',
    params,
  });
}

export function getBookingDetail(params) {
  return get({
    url: '/vehicle/booking/detail',
    params,
  });
}

export function maintainsOrd(params) {
  return post({
    url: '/vehicle/maintains/preOrder',
    params,
  });
}

export function fixedOrder(params) {
  return post({
    url: '/vehicle/repair/preOrder',
    params,
  });
}

export function serverOrderList(params) {
  return get({
    url: '/vehicle/services/order/list',
    params,
  });
}

export function postComment(params) {
  return post({
    url: '/vehicle/services/comment',
    params,
  });
}

export function getBank(params) {
  return get({
    url: '/order/vehicle/bank/detail',
    params,
  });
}

export function deleteOrder({ order_id }) {
  return post({
    url: `/order/vehicle/delete/?order_id=${order_id}`,
    params: {},
  });
}

// 所有车辆订单列表
export function getAllOrderList(params) {
  return get({
    url: '/vehicle/services/order/detail',
    params,
  });
}
// 车辆订单详情
export function orderSingleDetail(params) {
  return get({
    url: '/vehicle/booking/detail',
    params,
  });
}

// 里程排行
export function mileageRanking(params) {
  return get({
    url: '/vehicle/diary/mileage/ranking',
    params,
  });
}
// 耗能排行
export function energyConsumption(params) {
  return get({
    url: '/vehicle/diary/energyConsumption/ranking',
    params,
  });
}

// 用车时间轴
export function timeAxis(params) {
  return get({
    url: '/vehicle/diary/timeAxis',
    params,
  });
}
