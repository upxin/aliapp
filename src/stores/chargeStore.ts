import { defineStore } from 'pinia';
import {
  getStore,
  initSocket,
  onMessage,
  CHARGING_VIN,
  USER_INFO,
} from '@/utils/index';

interface SocketChargeState {
  isCharging: boolean; // 调起充电接口手动设置的 是否在充电
  vins: any[]; // 首页 车主 司机
  socketData: any[];
  socketTask: any;
  chargingVin: string;
  lockStop: boolean;
  showTimer: boolean;
  countDown: number;
  scanInfoFromMapDetail: {
    vin: string;
    licensePlateNum: string;
  };
}
let chargeTimer;
export const chargeSocketStore = defineStore('chargeSocketStore', {
  state: (): SocketChargeState => {
    return {
      isCharging: false,
      vins: [],
      socketData: [],
      socketTask: {},
      chargingVin: getStore(CHARGING_VIN) || '',
      lockStop: false,
      showTimer: false,
      countDown: 60,
      scanInfoFromMapDetail: {
        vin: '',
        licensePlateNum: '',
      },
    };
  },
  actions: {
    setScanInfoFromMapDetail(ret) {
      this.scanInfoFromMapDetail = ret;
    },
    closeSocket() {
      this.socketTask?.close();
    },
    setCountDown(ret) {
      this.countDown = ret;
    },
    createTimer() {
      this.countDown = 60;
      chargeTimer = setInterval(() => {
        if (this.countDown <= 0) {
          clearInterval(chargeTimer);
          chargeTimer = null;
          return;
        }
        this.countDown -= 1;
      }, 1000);
    },
    setShowTimer(ret) {
      this.showTimer = ret;
    },
    setLockStop(ret) {
      this.lockStop = ret;
    },
    setIsCharging(ret) {
      this.isCharging = ret;
    },
    setVins(ret) {
      this.vins = ret;
      this.sendVin();
    },
    setSocketData(ret) {
      this.socketData = ret;
    },
    setSocketTask(ret) {
      this.socketTask = ret;
    },
    setChargingVin(ret) {
      this.chargingVin = ret;
      this.sendVin();
    },
    sendVin() {
      if (!this.socketTask.send) return;
      const vinList = [...this.vins, this.chargingVin].filter(
        (item) => item != ''
      );
      const vins = Array.from(new Set(vinList));
      console.log(
        'send msg sendVinsendVinsendVin=============',
        vins.join(',')
      );
      this.socketTask.send({
        data: vins.join(','),
      });
    },
    connectSocket() {
      const user = getStore(USER_INFO);
      if (!user) return;
      initSocket().then((task: any) => {
        this.socketTask = task;
        task.onOpen = () => {
          //钩子函数
          console.log('open socket===========================');
          this.sendVin();
        };
        task.onClose = () => {
          //钩子函数
          console.log('close socket=============================');
        };
        task.onError = (e) => {
          //钩子函数
          console.log('onError socket===========================', e);
        };
        task.onMessage = (data) => {
          //钩子函数
          console.log(
            'onMessage onMessage onMessage============================',
            JSON.parse(data?.data)
          );
          if (data?.data == '1') return;
          this.socketData = JSON.parse(data?.data);

          this.socketData?.forEach((item) => {
            if (item?.carCharging?.startChargeSeqStat == 2) {
              // setStore(CHARGING_VIN, item?.vin);
              // this.setChargingVin(item?.vin);
              this.setIsCharging(true);
            }
          });
          onMessage(data);
        };
        task.onReconnect = () => {
          //钩子函数
          console.log('reconnect socket&&&&&&&&&&&&&&&&&&&&&&&&&&');
        };
      });
    },
  },
});
