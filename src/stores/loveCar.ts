// https://pinia.esm.dev/introduction.html
import { defineStore } from 'pinia';

interface State {
  status: number;
  shopInfo: {
    shopId: string;
    shopName: string;
  };
  isVr: boolean;
}
export const loveCarStore = defineStore('loveCarStore', {
  state: (): State => {
    return {
      status: 0,
      shopInfo: {
        shopId: '',
        shopName: '',
      },
      isVr: false,
      // initVr: false,
    };
  },
  actions: {
    setMainStatus(ret) {
      this.status = ret;
    },
    setShopInfo(ret) {
      this.shopInfo = ret;
    },
    setIsVr(ret) {
      this.isVr = ret;
    },
    // setInitVr(v) {},
  },
});
