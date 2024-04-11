// https://pinia.esm.dev/introduction.html
import { defineStore } from 'pinia';

export const systemInfo = defineStore('systemInfo', {
  state: () => {
    return {
      app: {
        statusBarHeight: 0,
        windowHeight: 0,
        screenHeight: 0,
        pixelRatio: 1,
        windowWidth: 0,
        safeArea: {
          bottom: 0,
          top: 0,
          height: 0,
        },
        model: '',
        system: '',
      },
      weappKey: 'c49d718470d12dbbf163bdf312402f38',
      webServerApiKey: '22c8d318fca785d59d651775f30edede',
      RightBtnRect: {
        // 用来计算自定义tabbar高度  跟右边按钮对齐
        h: 0, //小程序右上角按钮的高度
        t: 0, // 小程序右上角按钮距离顶部距离
        w: 0,
      },
    };
  },
  actions: {
    setSystemInfo(ret) {
      this.app = ret;
    },
    SetRightBtnRect(ret) {
      this.RightBtnRect = ret;
    },
  },
});
