import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { registerGlobComp } from '@/components/registerGlobComp';

import {
  initSystemInfo,
  initRightBtnRect,
  CODE,
  upDataApp,
  JG,
  jGcustomCount,
} from '@/utils/index';
import { store } from '@/stores/index';
import { hasPrepay } from '@/api/index';
import Taro from '@tarojs/taro';

import '@/assets/font/iconfont.css';
import '@/assets/styles/nut-cover.scss';
import './app.scss';
import './nrz.scss';
import 'windi.css';

const JAnalyticsInterface = require('./utils/janalytics-m-1.1.0.js');
const prod = process.env.NODE_ENV === 'development' ? false : true;

const App = createApp({
  // 入口组件不需要实现 render 方法，即使实现了也会被 taro 所覆盖
  onLaunch() {
    store().setLoginStatus(false);
    initSystemInfo();
    initRightBtnRect();

    hasPrepay({}).then((res) => {
      if (res.code !== CODE) return;
      store().setPrepay(prod ? res.data : true);
    });
    JAnalyticsInterface.init(Taro);
    setTimeout(() => {
      jGcustomCount(JG.ALL_006);
    }, 0);
    // my.startLocationUpdate({
    //   success() {
    //     const _locationChangeFn = function (res) {
    //       //可以得到经纬度
    //       console.log('定位成功', res);
    //       my.offLocationChange(_locationChangeFn);
    //     };
    //     my.onLocationChange(_locationChangeFn);
    //   },
    //   fail(error) {
    //     console.log('开始定位失败', error);
    //   },
    // });
  },
  onShow() {
    upDataApp();
  },
});

App.use(createPinia());

registerGlobComp(App);

export default App;
