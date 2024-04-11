import { get, post } from '@/utils/index';

export function ownerAddCar(params) {
  return post({ url: '/vehicle/owner/add', params });
}
export function driverAddCar(params) {
  return post({ url: '/vehicle/driver/add', params });
}
export function unbindDriver(params) {
  return post({
    url: '/vehicle/unbind/driver',
    params,
  });
}
export function getToken() {
  return get({
    url: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wxc39371980701becd&secret=628a052f043da4aa30b7720a94c2f30a',
  });
}
