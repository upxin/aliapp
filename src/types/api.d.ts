export interface CarsListItem {
  name: string; // 车名
  imgUrl?: string | null;
  type?: string | null; // 车型 for example： EC1
  vin?: string;
  bat?: string | null;
  owner_mobile?: string | null;
  battery_life?: string | null;
  [propName: string]: any;
}
interface Diary {
  name?: string;
  router?: string;
  imgUrl: string;
  car_params?: {
    time?: number | string; // 今日行驶时长
    mileage?: number | string; //今日行驶里程
  };
}
export interface CarBehavior {
  name?: string;
  state?: string; // 车辆状态	mock: 断电
  remaining_battery?: number; //剩余电量	mock: 88
  remaining_mileage?: number; // 剩余里程
  total_time?: number | string; //总行驶时间
  total_mileage?: number | string; // 总行驶里程
  energy_saving?: number | string; //共节能减排
  days?: number | string; // 陪伴天数
  diary?: Diary;
}

export interface Response<K> {
  code: number;
  msg: string;
  data: K;
}

export interface CarInfo {
  name: string;
  vin: string;
}
