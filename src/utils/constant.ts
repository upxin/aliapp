export const CODE = 200;
export const LOC_GO_LOGIN = 'LOC_GO_LOGIN';
export const webServerApiKey = '22c8d318fca785d59d651775f30edede';
export const IPHONE_BT = [
  'iPhone X',
  'iPhone 11',
  'iPhone 12',
  'iPhone 13',
  'iPhone 12/13 mini',
  'iPhone 12/13',
  'iPhone XS Max',
  'iPhone XS',
];

export const LOCAL_ALL_PRICE = 'LOCAL_ALL_PRICE';
export const LOCAL_DISCOUNT = 'LOCAL_DISCOUNT';
export const LOCAL_CAR_PRATS = 'LOCAL_CAR_PRATS';
export const LOCAL_CAR_COLOR = 'LOCAL_CAR_COLOR';
export const LOCAL_CAR_BASE = 'LOCAL_CAR_BASE';
export const LOCAL_BUY_TYPE = 'LOCAL_BUY_TYPE';
export const CAR_CONF = 'CAR_CONF'; // 选配
export const USER_INFO = 'USER_INFO';
export const OBU_USER = 'OBU_USER';

// ["FFFFFF", "52ACF1"]
export const NEWRIZON_TEL = '400-876-0288';

export const INSURE_COMPONY = [
  { name: '中国平安', tel: '95511', id: '1000' },
  { name: '太平洋保险', tel: '95500', id: '1001' },
  { name: '中国人寿', tel: '95519', id: '1002' },
  { name: '中国人保', tel: '95518', id: '1003' },
  { name: '太平财险', tel: '95589', id: '1004' },
  { name: '大地财险', tel: '95590', id: '1005' },
  { name: '天安财险', tel: '95505', id: '1006' },
  { name: '安盛天平', tel: '95550', id: '1007' },
  { name: '永诚财险', tel: '95552', id: '1008' },
  { name: '永安财险', tel: '95502', id: '1009' },
  { name: '华安财险', tel: '95556', id: '1010' },
  { name: '大家财险', tel: '95569', id: '1011' },
  { name: '中银保险', tel: '95566', id: '1012' },
  { name: '阳光财险', tel: '95510', id: '1013' },
  { name: '长安责任', tel: '95592', id: '1014' },
  { name: '都邦保险', tel: '95586', id: '1015' },
  { name: '亚太财险', tel: '95506', id: '1016' },
  { name: '安诚财险', tel: '95544', id: '1017' },
  { name: '华泰财险', tel: '400-609-5509', id: '1018' },
  { name: '中意财产', tel: '400-600-2700', id: '1019' },
  { name: '紫金财险', tel: '400-828-0018', id: '1020' },
  { name: '浙商财产', tel: '400-866-6777', id: '1021' },
  { name: '鼎和财产', tel: '400-888-8136', id: '1022' },
  { name: '渤海财险', tel: '400-611-6666', id: '1023' },
  { name: '众诚保险', tel: '400-860-0600', id: '1024' },
  { name: '安联财险', tel: '400-800-2020', id: '1025' },
  { name: '三星财险', tel: '400-810-5858', id: '1026' },
  { name: '东京海上', tel: '400-885-8008', id: '1027' },
  { name: '中原农业', tel: '400-665-6789', id: '1028' },
];

// 售前-销售服务中心
export const PRE_SALES_SERVICE_CENTER = 1; //0b001;
// 售前-城市展厅
export const PRE_SALES_CITY_EXHIBITION_HALL = 2; //0b010;
// 售后-特约维修店
export const CUSTOMER_SERVICE_REPAIR_SHOP = 4; //0b100;
// 直营店
export const DIRECT_SHOP = 8; //0b100;

export const ID_MAP = [
  {
    name: '居民身份证',
    text: '居民身份证',
    id: 1,
  },
  {
    name: '护照',
    text: '护照',

    id: 2,
  },
  {
    name: '军官证',
    text: '军官证',

    id: 3,
  },
  {
    name: '香港身份证',
    text: '香港身份证',

    id: 4,
  },
  {
    name: '澳门居民身份证',
    text: '澳门居民身份证',

    id: 5,
  },
  {
    name: '台胞证',
    text: '台胞证',

    id: 6,
  },
];

export const YMD_EN = 'YYYY-MM-DD';
export const YMD_CH = 'YYYY年MM月DD日';
export const YMDHM_EN = 'YYYY-MM-DD HH:mm';
export const YMDHMS_EN = 'YYYY-MM-DD HH:mm:ss';
export const weekdays = [
  '星期日',
  '星期一',
  '星期二',
  '星期三',
  '星期四',
  '星期五',
  '星期六',
];

export const LOCAL_ISVR = 'LOCAL_ISVR';
export const NEWRIZON_DOMAIN = 'https://app.newrizon.cloud';
export const WEBVIEW_PREFIX = 'nrz://com.qianchen/app/webview';
export const WEAPP_H5 = 'https://h5.newrizon.cloud';

export const VERSION = '1.0.5';

// 充电
export const CITY_INFO_KEY = 'CITY_INFO_KEY';
export const VIN_KEY = 'VIN_KEY';
export const NRZ_TEL = '400-876-0288';
export const CHARGING_VIN = 'CHARGING_VIN';

// 发票

export const SET_INVOICE_TITLE = 'SET_INVOICE_TITLE';
export const payTypeMap = {
  1: '微信支付',
  2: '支付宝支付',
  3: '积分支付',
};

export const invoiceMap = {
  1: '整车',
  2: '商品',
  3: '充电服务（充电订单）',
  4: '充电服务（充电币充值）',
  5: '服务',
};
export enum OrderType {
  //  整车
  VEHICLE = 1,
  /**
   * 商品
   */
  GOODS = 2,
  /**
   * 充电服务
   */
  CHARGE = 3,
  /**
   * 充值服务
   */
  WALLET = 4,
  /**
   * 服务
   */
  SERVICE = 5,
}
export const COLLECT_CHARGE =
  'https://nrz-app.su.bcebos.com/resources/mine_station_collect.png';
export const SERVICE_ORDER =
  'https://nrz-app.su.bcebos.com/resources/mine_service_order.png';
export const NORMAL_GO =
  'https://nrz-app.su.bcebos.com/resources/mine_often_station_collect.png';
export const GOODS_ORDER =
  'https://nrz-app.su.bcebos.com/resources/mine_goods_order.png';
export const CHARGE_ORDER =
  'https://nrz-app.su.bcebos.com/resources/mine_charge_order.png';
export const MY_TEAM = 'https://nrz-app.su.bcebos.com/resources/mine_cars.png';
export const CAR_ORDER =
  'https://nrz-app.su.bcebos.com/resources/mine_car_order.png';
export const COLLECT_GOODS =
  'https://nrz-app.su.bcebos.com/resources/mine_goods_collect.png';

export const MY_CONFIRM =
  'https://nrz-app.su.bcebos.com/resources/mine_confirm.png';
export const MY_USE =
  'https://nrz-app.su.bcebos.com/resources/mine_instruction_record.png';
export const MY_emergency =
  'https://nrz-app.su.bcebos.com/resources/mine_emergency_record.png';
export const MY_receipt =
  'https://nrz-app.su.bcebos.com/resources/mine_receipt_record.png';
export const lineUrl =
  'https://nrz-app.su.bcebos.com/resources/charge_list_btn.png';
export const CHRAGE_BANNER =
  'https://nrz-app.su.bcebos.com/resources/charge_list_banner.png';

export const OIL_COLOR = '#F2A93B';
export const ELE_COLOR = '#15DB65';
export class VehInfo {
  static 2 = '油车';
  static 1 = '电车';
  static OIL_COLOR = '#F2A93B';
  static ELE_COLOR = '#15DB65';
}
export class VehColor {
  static 1 = '#15DB65';
  static 2 = '#F2A93B';
}
export enum Routes {
  // noCarCharge
  taskCenter = 'taskCenter',
  chargingOtherCar = 'chargingOtherCar',
  // charge
  beforeCharge = 'beforeCharge',
  chargingMap = 'chargingMap',
  // other-pages
  addCar = 'addCar',
  signinCalendar = 'signinCalendar',
  scoreList = 'scoreList',
  setMine = 'setMine',
  carViolateRegulations = 'carViolateRegulations', // 违章查询
  coupon = 'coupon',
  // 预定选车的型号
  CHOOSECARTYPE = 'chooseCarType',
  // fleet
  mileCalculatorPage = 'mileCalculatorPage',
  operationConfig = 'operationConfig',
  peersRank = 'peersRank',
  useCarClassroomPage = 'useCarClassroomPage',
  carFullYearData = 'carFullYearData',
  fleetFullYearData = 'fleetFullYearData',
  fleetModul = 'fleetModul',
  fleetLocation = 'fleetLocation',
  fleetInviteRecord = 'fleetInviteRecord',
  fleetData = 'fleetData',
  fleetHome = 'fleetHome',
  fleetTrail = 'fleetTrail',
  drivingScore = 'drivingScore',
  drivingScoreDetail = 'drivingScoreDetail',
  faultWarn = 'faultWarn',
  allData = 'allData',
  rankingData = 'rankingData',
  carData = 'carData',
  carRecord = 'carRecord',
  eventLog = 'eventLog',
  belongFleet = 'belongFleet',
  vehicleScore = 'carScore',
  ownerAddCar = 'ownerAddCar',
  addDriver = 'addDriver',
  addOwner = 'addOwner',
  obu = 'obu',
  obuResult = 'obuResult',
  obuRecords = 'obuRecords',
  carteamMonthData = 'carteamMonthData',
  mallAddr = 'mall-addr',
}
