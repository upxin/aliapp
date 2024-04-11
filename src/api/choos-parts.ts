import { get, post, httpDelete } from '@/utils/index';

export function getCarConfig(params) {
  return get({
    url: '/vehicle/open/booking/config',
    params: {
      type: params?.type.toLowerCase(),
    },
  });
}

export function saveCarConf(params) {
  // type: type,
  // title: type,
  // price: getPrice(),
  // amount: getPrice(),
  // optional: getAllOptions(),
  // must: getAllOptions(),
  // color: nrzColor,
  // customerType: customerType,
  // imgUrl
  return post({
    url: '/vehicle/optional/view',
    params,
  });
}

export function getDeliveryCenter(params) {
  return get<any[]>({
    url: '/vehicle/delivery/center',
    params,
  });
}

export function createOrder(params) {
  return post({
    url: '/vehicle/booking/applet/order/create',
    params,
  });
}

export function getCalcData(params) {
  return get({
    url: '/vehicle/calculatorData',
    params,
  });
}
export function calc(params) {
  return post({
    url: '/vehicle/calculator',
    params,
  });
}
export function delRemoteConf(params = {}) {
  return httpDelete({
    url: '/vehicle/optional/delete',
    params,
  });
}

export function checkChoosedParts(params = {}) {
  return post({
    url: '/vehicle/booking/optional/check',
    params,
  });
}
