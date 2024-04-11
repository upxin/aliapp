import Taro from '@tarojs/taro';
import { getStore, JG, jGcustomCount, USER_INFO } from '@/utils/index';
import { BTN_SHARE, PYQ_SHARE } from '@/utils/index';

export function onShareAppMessage(res) {
  if (res.from === 'button') {
    // 来自页面内转发按钮
    console.log(res.target);
  }
  console.log('share', res);
  return {
    title: '前晨汽车 智能网联商用车引领者',
    path: `/pages/index/index`,
    imageUrl: BTN_SHARE,
  };
}
export function regVal(val) {
  if (isNaN(val)) return '--';
  return val ?? '--';
}

export function onShareTimeline() {
  return {
    title: '前晨汽车 智能网联商用车引领者',
    path: `/pages/index/index`,
    imageUrl: PYQ_SHARE,
  };
}

export function isLogin() {
  return !!getStore(USER_INFO);
}
export function upDataApp() {
  //版本更新

  if (Taro.canIUse('getUpdateManager')) {
    //判断当前微信版本是否支持版本更新

    const updateManager = Taro.getUpdateManager();

    updateManager.onCheckForUpdate(function (res) {
      if (res.hasUpdate) {
        // 请求完新版本信息的回调

        updateManager.onUpdateReady(function () {
          Taro.showModal({
            title: '更新提示',

            content: '新版本已经准备好，是否重启应用？',

            success: function (res) {
              if (res.confirm) {
                // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启

                updateManager.applyUpdate();
              }
            },
          });
        });

        updateManager.onUpdateFailed(function () {
          Taro.showModal({
            // 新的版本下载失败

            title: '已经有新版本了哟~',

            content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
          });
        });
      }
    });
  } else {
    Taro.showModal({
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
      title: '提示',
      content: '当前微信版本过低，请升级到最新微信版本后重试。',
    });
  }
}
// 联系在线客服
export function onlineKefu(
  url = 'https://work.weixin.qq.com/kfid/kfcb04c97ae4fb1a2b3'
) {
  jGcustomCount(JG.CS_003);
  my.openCustomerServiceChat({
    extInfo: {
      url,
    },
    corpId: 'wwba3c2469eb113a20',
    success(res) {
      console.log(res);
    },
    fail(err) {
      console.log(err);
    },
  });
}
export function shareApp({
  res,
  title = '前晨汽车 智能网联商用车引领者',
  destination,
  imgUrl = 'https://nrz-app.su.bcebos.com/miniprogram/app/normal/min_app_share.jpg',
}) {
  if (res.from === 'button') {
    // 来自页面内转发按钮
    console.log(res.target);
  }
  console.log('share', res);
  return {
    title,
    path: `/other-pages/pages/dispatchShare/index?url=${destination}`,
    imageUrl: imgUrl,
  };
}
