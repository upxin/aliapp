import { defineStore } from 'pinia';
import { reactive } from 'vue';
interface Optional {
  amount?: number;
  extra?: any[];
  imgUrl?: string;
  more?: any;
  options?: any[];
  router?: string;
  title?: string;
  type?: string;
  typeText?: string;
}
export interface CarInfo {
  typeText?: string;
  imgUrl?: string;
  vin?: string;
  licensePlateNum?: string;
  insurance?: string;
  defaultFlag?: boolean;
  identity?: number; // 1车主, 2司机
  lifetimeWarranty?: boolean;
  ownerMobile?: string | number;
  chargeImgUrl?: string;
}
interface CarBehavior {
  chargerLimitStatus?: any;
  createTime?: any;
  days?: string;
  energySaving?: any;
  eventTime?: any;
  hisAvgSpeed?: any;
  hisChargingTimes?: any;
  historyEgyConsumption?: any;
  hundredEnergyConsumption?: any;
  id?: any;
  latitude?: any;
  longitude?: any;
  remainMileage?: any;
  remainingBattery?: any;
  remainingChargingTime?: any;
  state?: any;
  tenEnergyConsumption?: any;
  todayChargeEnergy?: any;
  todayChargeTime?: any;
  todayChargeTimes?: any;
  todayEnergyConsumption?: any;
  todayMileage?: any;
  todayTime?: any;
  totalMileage?: any;
  totalTime?: any;
  updateTime?: any;
  vehicleSpeed?: any;
  vin?: any;
}
interface ChargingCar {
  chargeDetails?: any;
  chargeStatus?: string;
  connectorId?: string;
  connectorStatus?: any;
  currentA?: any;
  currentB?: any;
  currentC?: any;
  elecMoney?: any;
  endTime?: any;
  errInfo?: any;
  estimatePeriod?: any;
  identCode?: string;
  initSoc?: any;
  licensePlateNumber?: any;
  period?: any;
  seviceMoney?: any;
  soc?: any;
  startChargeSeq?: string;
  startChargeSeqStat?: number;
  startTime?: string;
  stationName?: string;
  sumPeriod?: any;
  totalMoney?: any;
  totalPower?: any;
  vin?: string;
  voltageA?: any;
  voltageB?: any;
  voltageC?: any;
}
interface State {
  mouduleType: 'parts' | 'prepay' | 'car';

  // 选配的车
  optional: Optional | undefined;
  // 拥有的所有车
  cars: CarInfo[];
  books: any[];
  // 预定的车
  deliveries: any[];
  // 当前选择的车
  currentCar?: CarInfo;
  // 正在充电的车
  charginCar?: ChargingCar;
  carBehavior?: CarBehavior;
  // 标记是从充电页面跳回首页的，主动切到充电车辆
  fromCharging?: boolean;
  needRefresh?: boolean;
}
type StateKeys = keyof State;

// 如果不单独管理每个数据  监听的时候会导致过度监听从而出bug 这样写就能监听某个state下面的属性  或者一个个用ref声明
// 用ref声明就要写多个action  用state可以用ts 泛型约束  只要去定义接口获取提示就行
export const homeStore = defineStore('HOEM', () => {
  const state = reactive<State>({
    mouduleType: 'car',
    optional: undefined,
    deliveries: [],
    cars: [],
    books: [],
    currentCar: {},
    charginCar: {},
    carBehavior: {},
    fromCharging: false,
    needRefresh: false,
  });

  function setState<K extends StateKeys>(key: K, ret: State[K]) {
    state[key] = ret;
  }
  return {
    state,
    setState,
  };
});
