export const vrCarInfoData = {
  code: 200,
  msg: '操作成功',
  data: {
    books: null,
    optional: null,
    delivery: null,
    cars: [
      {
        name: '物流1号',
        imgUrl: 'https://nrz-app.su.bcebos.com/vehicle/EC1/EC1_new_bind.jpg',
        type: 'EC1',
        vin: 'LSVIRTUAL1XXXXXXX',
        bat: '',
        insurer: {
          name: '中国人保',
          id: '1003',
          time: '2032-10-24',
          tel: '95518',
        },
        sim: {
          no: '',
        },
        owner_mobile: null,
        battery_life: '',
        licensePlateNum: '沪AD11111',
      },
    ],
    car_service: {
      name: '用车服务',
      router: 'nrz://com.qianchen/app/toast?type=0&msg=用车服务',
      status_params: [
        {
          name: '基础服务',
          list: [
            {
              name: '添加车辆',
              imgUrl: 'https://nrz-app.su.bcebos.com/vehicle/common/c_add.png',
              router: 'nrz://com.qianchen/app/toast?type=0&msg=添加成功',
            },
            {
              name: '用车数据',
              imgUrl: 'https://nrz-app.su.bcebos.com/vehicle/common/c_data.png',
              router: 'nrz://com.qianchen/app/carDiary?vin=LSVIRTUAL1XXXXXXX',
            },
            {
              name: '门店查询',
              imgUrl: 'https://nrz-app.su.bcebos.com/vehicle/common/c_mdcx.png',
              router: 'nrz://com.qianchen/app/carShopList',
            },
            {
              name: '一键维保',
              imgUrl: 'https://nrz-app.su.bcebos.com/vehicle/common/c_yjwb.png',
              router: 'nrz://com.qianchen/app/selectMr?isVirtual=1',
            },
            {
              name: '保修手册',
              imgUrl: 'https://nrz-app.su.bcebos.com/vehicle/common/c_bxsc.png',
              router:
                'nrz://com.qianchen/app/webview?url=https://app.newrizon.cloud/services/warranty-manual.html&title=保修手册',
            },
            {
              name: '使用说明',
              imgUrl: 'https://nrz-app.su.bcebos.com/vehicle/common/c_sysm.png',
              router:
                'nrz://com.qianchen/app/webview?url=https://app.newrizon.cloud/services/instructions/EC1.html&title=使用说明',
            },
            {
              name: '在线客服',
              imgUrl: 'https://nrz-app.su.bcebos.com/vehicle/common/c_zxkf.png',
              router:
                'nrz://com.qianchen/app/customerService?url=https://work.weixin.qq.com/kfid/kfcb04c97ae4fb1a2b3',
            },
            {
              name: '前晨牛指',
              imgUrl: 'https://nrz-app.su.bcebos.com/vehicle/common/c_qcnz.png',
              router: 'nrz://com.qianchen/app/carScore',
            },
          ],
        },
        {
          name: '保障服务',
          list: [
            {
              name: '前晨客服',
              imgUrl: 'https://nrz-app.su.bcebos.com/vehicle/common/c_tel.png',
              router:
                'nrz://com.qianchen/app/customerService?url=https://work.weixin.qq.com/kfid/kfcb04c97ae4fb1a2b3',
            },
            {
              name: '一键救援',
              imgUrl: 'https://nrz-app.su.bcebos.com/vehicle/common/c_yjjy.png',
              router: 'nrz://com.qianchen/app/toast?type=0&msg=救援电话已拨打',
            },
            {
              name: '保修凭证',
              imgUrl: 'https://nrz-app.su.bcebos.com/vehicle/common/c_bxpz.png',
              router:
                'nrz://com.qianchen/app/maintainsRecord?vin=LSVIRTUAL1XXXXXXX',
            },
            {
              name: '违章查询',
              imgUrl: 'https://nrz-app.su.bcebos.com/vehicle/common/c_wzcx.png',
              router: 'nrz://com.qianchen/app/toast?type=0&msg=已查询',
            },
          ],
        },
        {
          name: '生活服务',
          list: [
            {
              name: '周边餐饮',
              imgUrl: 'https://nrz-app.su.bcebos.com/vehicle/common/c_zbct.png',
              router: 'nrz://com.qianchen/app/map?keyword=餐饮&title=周边餐饮',
            },
            {
              name: '周边超市',
              imgUrl: 'https://nrz-app.su.bcebos.com/vehicle/common/c_zbcs.png',
              router: 'nrz://com.qianchen/app/map?keyword=超市&title=周边超市',
            },
            {
              name: '周边停车',
              imgUrl: 'https://nrz-app.su.bcebos.com/vehicle/common/c_zbtc.png',
              router:
                'nrz://com.qianchen/app/map?keyword=停车场&title=周边停车',
            },
            {
              name: '积分商城',
              imgUrl: 'https://nrz-app.su.bcebos.com/vehicle/common/c_jfsc.png',
              router: 'nrz://com.qianchen/app/main?index=3',
            },
          ],
        },
      ],
    },
  },
};
