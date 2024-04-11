import { defineStore } from 'pinia';
import { reactive } from 'vue';

interface MainStore {
  priceList: any[];
  checkedInvoice: any[];
  chargeUrl: string;
  carConfParts: any;
  carConfBase: any;
  choosedBuyType: string;
  discount: any;
  totalPrice: any;
  cityInfo: {
    latitude: number | string;
    longitude: number | string;
    currentCityName: string;
    adcode: string;
    building: any;
    businessAreas: any;
    city: string | any[];
    citycode: string;
    country: string;
    district: string;
    neighborhood: any;
    province: string;
    streetNumber: any;
    towncode: string;
    township: string;
    formatted_address: string;
  };
  loginStateShop: boolean;
  loginStateCar: boolean;
  openPrepay: boolean;
  location: { latitude: number | string; longitude: number | string };
  [propKey: string]: any;
}
export const store = defineStore('store', {
  state: (): MainStore => {
    return {
      // 价格详情列表
      noScroll: false,
      cropperImgUrl: '',
      priceList: [],
      // 选择开发票
      checkedInvoice: [],
      isVr: false,
      openPrepay: false,
      location: {
        latitude: '',
        longitude: '',
      },
      cityInfo: {},
      formData: {},
      ownerCarInfo: {
        vin: '',
        name: '',
      },
      driverCarInfo: {
        vin: '',
        name: '',
      },
      identityStatus: 0, // 当前在车主页还是司机页 0车主页  1司机页
      totalPrice: 0,
      discount: 0,
      carConfBase: { imgUrl: '', description: '', price: '' },
      carConfParts: [], // 配件
      choosedBuyType: '0', // 0：个人 ， 1：企业
      selectCarType: '',
      loginStateShop: false,
      loginStateCar: false,
      chargeUrl: '',
    };
  },
  actions: {
    setNoScroll(ret: boolean) {
      this.noScroll = ret;
    },
    setCropperImgUrl(ret) {
      this.cropperImgUrl = ret;
    },
    setPriceList(ret) {
      this.priceList = ret;
    },
    setCheckedInvoice(ret) {
      this.checkedInvoice = ret;
    },
    setChargeUrl(ret) {
      this.chargeUrl = ret;
    },
    setSelectCarType(ret) {
      this.selectCarType = ret;
    },
    setLocation(ret) {
      this.location = ret;
    },
    setCityInfo(ret) {
      this.cityInfo = ret;
    },
    setFormData(ret) {
      this.formData = ret;
    },
    setIsOwner(ret) {
      this.isOwner = ret;
    },
    setHasCar(ret) {
      this.hasCar = ret;
    },
    setDriverCarInfo(ret) {
      this.driverCarInfo = ret;
    },
    setOwnerCarInfo(ret) {
      this.ownerCarInfo = ret;
    },
    setIdentityStatus(ret) {
      this.identityStatus = ret;
    },
    // 选配部分
    setCarConfParts(ret) {
      this.carConfParts = ret;
    },
    setChoosedBuyType(ret) {
      this.choosedBuyType = ret;
    },
    setDeposit(ret) {
      this.discount = ret;
    },
    setCarConfBase(ret) {
      this.carConfBase = ret;
    },
    setLoginStatus(ret) {
      this.loginStateShop = ret;
      this.loginStateCar = ret;
    },
    setLoginStateCar(ret) {
      this.loginStateCar = ret;
    },
    setLoginStateShop(ret) {
      this.loginStateShop = ret;
    },
    setPrepay(v) {
      this.openPrepay = v;
    },
  },
});

export interface Part {
  accessoryType: string;
  accessoryTypeParam: string;
  description: string;
  imgUrl: string;
  kind: number;
  price: number;
  priceDiscount: number;
}

interface State {
  totalPrice?: number;
  box?: Part;
  basePrice?: number;
  optional?: Part[];
  color?: Part;
  type?: string;
  typeText?: string;
  lead_time?: string;
  name?: string;
  imgUrl?: string;
  deposit?: number;
  discount?: any[];
  extra?: Part[];
}
type StateKeys = keyof State;
// 如果不单独管理每个数据  监听的时候会导致过度监听从而出bug
export const CarConf = defineStore('carConf', () => {
  const state = reactive<State>({
    basePrice: 0,
    optional: [],
  });

  function setState<K extends StateKeys>(key: K, ret: State[K]) {
    state[key] = ret;
  }
  return {
    state,
    setState,
  };
});
