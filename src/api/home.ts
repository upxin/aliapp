import { get, post } from '@/utils/index';

export function getHomepage(params) {
  return get<any>({
    url: '/vehicle/open/homepage',
    params,
  });
}
export function inviteSuccess(mobile) {
  return get({
    url: `/member/invite/inviteSuccess`,
    params: { mobile },
  });
}

const pp = '/vehicle/remote/getVehCtrState';
export function getVehCtrState(params) {
  return get<any>({
    url: pp,
    params,
  });
}

// 车架号
// 流水号
// 结果上报时间
// 控制指令
// 控制结果
// 创建时间
// 控制结果
interface D {
  id: string;
  vin: string;
  flowld: string;
  uploadTime: string;
  controllnstruction: string;
  controlResult: number;
  createTime: string;
  controlResultText: string;
}
export function getRemoteControlResult(params) {
  return get<D>({
    url: '/vehicle/remote/getRemoteControlResult',
    params,
  });
}

// controlInstruction 5:寻车，16：车门控制，71：空调温度控制，64：空调关闭
// parameterValue 寻车(3：闪灯鸣笛)，车门控制（1:解锁，2：上锁)，空调温 度控制(15-30，最小单位1)，空调关闭：2

const u = '/vehicle/remote/commandDown';
export function commandDown(params, headers) {
  return post({
    url: u,
    params,
    headers,
  });
}

export function financial(params) {
  return get({
    url: '/vehicle/open/financial',
    params,
  });
}

export function videoAtlases() {
  return get({
    url: '/vehicle/open/videoAtlases',
  });
}

export function setDefault({ vin }) {
  return post({
    url: '/vehicle/setDefault?vin=' + vin,
  });
}

export function homeNearby(params) {
  return get({
    url: '/vehicle/open/shop/nearby',
    params,
  });
}
export function dynamicMenu(vin) {
  return get({
    url: '/vehicle/open/dynamicMenu',
    params: { vin },
  });
}
