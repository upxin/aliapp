import WebsocketHeartbeat from '@/utils/socket';
import { getStore, USER_INFO, navigateToPage } from '@/utils/index';
import { jGcustomCount, JG } from './jgKeys';
import Taro from '@tarojs/taro';
import { homeStore } from '@/stores';

interface SocketDataItem {
  vin: string;
  carCharging: any;
  carBehavior: any;
}
const dev = 'wss://appdev-api.newrizon.cloud:8188/ws/vInfo';
const prod = 'wss://app-api.newrizon.cloud/ws/vInfo';
const local = 'ws://localhost:8282';
const baseUrl = `${process.env.NODE_ENV === 'development' ? dev : prod}`;

// const wssStore = chargeSocketStore();
// confirmColor cancelColor

function clearChargingState() {
  homeStore().setState('charginCar', {});
}

export function chargeSocketErr(v) {
  const orderId = v?.carCharging?.startChargeSeq || '';
  if (v?.carCharging?.errInfo && v?.carCharging?.startChargeSeqStat == 4) {
    clearChargingState();
    jGcustomCount(JG.CHARGE_006);

    const socketErrCode = v?.carCharging?.errInfo?.errCode;
    Taro.showModal({
      title: '错误提示',
      confirmText: '已知悉',
      cancelText: '查看订单',
      content: `⚠️\n故障码：${socketErrCode}\n请尝试重新插枪，确认并扫描充电\n枪对应的二维码，或更换充电枪`,
      success: (res) => {
        if (res.confirm) {
        } else if (res.cancel) {
          navigateToPage({
            route: 'chargeOrderDetail',
            params: {
              orderId,
            },
          });
        }
      },
    });
    return;
  }
  if (v?.carCharging?.errInfo) {
    clearChargingState();
    jGcustomCount(JG.CHARGE_006);

    Taro.showModal({
      title: `${v?.carCharging?.errInfo?.errMsg}`,
      confirmText: '已知悉',
      content: `⚠️\n${v?.carCharging?.errInfo?.errDesc}`,
      success: (res) => {
        if (res.confirm) {
        } else if (res.cancel) {
        }
      },
    });
    return;
  }

  if (v?.carCharging?.startChargeSeqStat == 4) {
    clearChargingState();
    jGcustomCount(JG.CHARGE_005);

    // 正常结束 提示是否跳订单详情
    Taro.showModal({
      title: '提示',
      content: '充电已完成，是否立即跳转查看订单详情',
      success: (res) => {
        if (res.confirm) {
          navigateToPage({
            route: 'chargeOrderDetail',
            params: {
              orderId,
            },
          });
        } else if (res.cancel) {
        }
      },
    });
    return;
  }
}

// const socketMock = false;
function regUrl() {
  const user = getStore(USER_INFO);
  return `${baseUrl}?memberId=${user.member_id}`;
}

export function onMessage(res: any) {
  console.log('socket data======', JSON.parse(res?.data));
  if (typeof res !== 'object') return;

  const list: SocketDataItem[] = JSON.parse(res?.data);
  if (!list?.length) return;
  homeStore().setState('carBehavior', list?.[0].carBehavior);

  const temp = list?.filter((item) => {
    return !!item?.carCharging;
  })[0];

  if (temp) {
    homeStore().setState('charginCar', temp.carCharging);
    chargeSocketErr(temp);
  } else {
    homeStore().setState('charginCar', {});
  }
}
export function initSocket() {
  return new Promise((resolve) => {
    WebsocketHeartbeat({
      miniprogram: wx,
      connectSocketParams: {
        url: regUrl(),
      },
    }).then((task: any) => {
      resolve(task);
    });
  });
}
export function showCharginCar(vin) {
  homeStore().setState('charginCar', {
    vin,
  });
  homeStore().setState('needRefresh', true);
  const temp = homeStore().state.cars.find((item) => item.vin === vin);
  homeStore().setState('currentCar', temp);
}
