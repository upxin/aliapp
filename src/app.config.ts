export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/mine/index',
    'pages/shop/index',
    'pages/message/index',
    'pages/consult/index',
  ],
  subpackages: [
    {
      root: 'posterModule',
      pages: ['pages/poster/index'],
    },
    {
      root: 'noCarCharge',
      pages: [
        'pages/signinCalendar/index',
        'pages/chargingOtherCar/index',
        'pages/taskCenter/index',
      ],
    },
    {
      root: 'fleetModul',
      pages: [
        'pages/mileCalculatorPage/index',
        'pages/operationConfig/index',
        'pages/peersRank/index',
        'pages/useCarClassroomPage/index',
        'pages/carteamMonthData/index',
        'pages/carFullYearData/index',
        'pages/fleetFullYearData/index',
        'pages/fleetHome/index',
        'pages/fleetData/index',
        'pages/fleetInviteRecord/index',
        'pages/fleetLocation/index',
        'pages/fleetTrail/index',
        'pages/drivingScore/index',
        'pages/drivingScoreDetail/index',
        'pages/faultWarn/index',
        'pages/allData/index',
        'pages/rankingData/index',
        'pages/carData/index',
        'pages/carRecord/index',
        'pages/eventLog/index',
        'pages/carScore/index',
        'pages/ownerAddCar/index',
        'pages/addDriver/index',
        'pages/obuResult/index',
        'pages/obuRecords/index',
      ],
    },
    {
      root: 'other-pages',
      pages: [
        'pages/sign-up/index',
        'pages/forgotPsw/index',
        'pages/addCar/index',
        'pages/selectMr/index',
        'pages/chooseCarType/index',
        'pages/applyPartner/index',
        'pages/dispatchShare/index',
        'pages/test-webview/index',
        'pages/car-team/index',
        'pages/no/index',
        'pages/cropper/index',
        'pages/viewImage/index',
        'pages/viewVideo/index',
        'pages/setMine/index',
        'pages/mineEditPersonalData/index',
        // 商城 start
        'pages/mallGoodsDetail/index',
        'pages/mallGoodsList/index', // 前晨好物
        'pages/mallGoodsPay/index', // 结算页面
        'pages/mallReceiveAddressEdit/index', // 编辑新增收货地址
        'pages/mall-addr/index', // 编辑新增收货地址
        'pages/mallOrder/index', // 商城订单
        'pages/mallOrderDetail/index', // 商城订单
        'pages/mallLogisticsInfo/index', // 商城物流详情
        'pages/mallOrderComment/index', // 商品评价列表
        'pages/chooseCoupon/index',
        // 商城 end
        'pages/activity/index', // 活动页
        'pages/coupon/index', // 活动页
        // 'pages/cityList/index', // 城市列表
        'pages/confirmation/index',
        'pages/ranking/index', // 排行
        'pages/shopMap/index', // 门店地址导航
        'pages/carConfig/index', // 选择配件
        'pages/overview-parts/index', // 预览配置
        'pages/bookCar/index', // EC1预定
        'pages/protocol/index', // 前晨隐私协议
        'pages/success/index', // 预定成功
        'pages/carInstallmentCalculator/index',
        'pages/carVideoAtlas/index',
        'pages/scoreList/index', // 积分列表
        'pages/webview/index',
        'pages/orderList/index',
        'pages/carOrderList/index', // 车辆订单
        'pages/carOrderDetail/index',
        'pages/servicesOrderList/index',
        'pages/carTransferMoney/index', // 转账汇款
        'pages/servicesOrderDetail/index', // 保养订单详情
        'pages/repairDetail/index', // 维修订单详情
        'pages/driverAddCar/index', // 添加司机
        'pages/driverList/index', // 司机列表
        'pages/updateCar/index', // 车辆信息 更新
        'pages/partsDetail/index', // 配件详情（name）
        'pages/maintains/index', // 保养
        'pages/repair/index', // 维修
        'pages/carShopList/index', // 门店查询
        'pages/testDrive/index', // 预约试驾
        'pages/shopeDetail/index', // 售后服务中心 城市展厅 特约维修店 售后门店详情
        'pages/search-after-service/index', // 售后门店查询 or 门店选择
        'pages/login/index',
        'pages/carDiary/index', // 车日记
        'pages/use-car-track/index', // 用车日记-轨迹
        'pages/carUseTimeLineDetail/index', // 用车时间轴
        'pages/shop-location/index', // 门店地图
        'pages/map/index', // 周边餐饮 周边超时 周边停车
        'pages/carDetail/index', // 车介绍
        'pages/maintainsRecord/index', // 保修凭证
        'pages/carViolateRegulations/index', // 违章查询
        'pages/searchAutoParts/index', //搜查配件
      ],
    },
    {
      root: 'chargeModule',
      pages: [
        'pages/beforeCharge/index',
        'pages/commendList/index', // 电站评论更多列表
        'pages/invoiceDetail/index', // 发票图片
        'pages/editInvoiceTitleFull/index', // 编辑发票抬头全校验
        'pages/chargeWalletHome/index', // 充电钱包
        'pages/chargeWalletBalance/index', // 充电钱包可用充电币
        'pages/drawbackCoin/index', // 退币
        'pages/chargeWalletCoinBuy/index', // 购币
        'pages/chargeWalletBillDetails/index', // 钱包明细
        'pages/chargeOrderList/index', // 充电订单
        'pages/chargeOrderDetail/index', // 充电订单详情
        'pages/receiptPhotoDetail/index', // 充电发票
        'pages/chargingMap/index', // 充电地图
        'pages/chargeMapStationList/index', // 充电站 列表
        'pages/chargeSearch/index', // 搜索充电站
        'pages/chargeSiteDetail/index', // 充电站详情
        'pages/chargePriceTimeRangeList/index', // 价格详情
        'pages/invoiceList/index', // 已开发票
        'pages/chargeFindPileRecordList/index', // 摸桩记录
        'pages/chargeFindPileActionPage/index', // 找桩行动
        'pages/collectOftenStationList/index', // 收藏电站
        'pages/applyInvoice/index', // 申请开发票
        'pages/invoiceTitle/index', // 我的发票抬头
        'pages/addInvoiceTitle/index', // 添加发票
        'pages/editInvoiceTitle/index', // 编辑发票
      ],
    },
  ],
  tabBar: {
    color: '#7A7E83',
    selectedColor: '#11264d',
    borderStyle: 'black',
    backgroundColor: '#fff',
    list: [
      {
        pagePath: 'pages/consult/index',
        iconPath: 'assets/icons/tab_news_off.png',
        selectedIconPath: 'assets/icons/tab_news_on.png',
        text: '发现',
      },
      {
        pagePath: 'pages/message/index',
        iconPath: 'assets/icons/tab_msg_off.png',
        selectedIconPath: 'assets/icons/tab_msg_on.png',
        text: '消息',
      },
      {
        pagePath: 'pages/index/index',
        iconPath: 'assets/icons/tab_car_off.png',
        selectedIconPath: 'assets/icons/tab_car_on.png',
        text: '爱车',
      },
      {
        pagePath: 'pages/shop/index',
        iconPath: 'assets/icons/tab_mall_off.png',
        selectedIconPath: 'assets/icons/tab_mall_on.png',
        text: '商城',
      },
      {
        pagePath: 'pages/mine/index',
        iconPath: 'assets/icons/tab_mine_off.png',
        selectedIconPath: 'assets/icons/tab_mine_on.png',
        text: '我的',
      },
    ],
  },
  permission: {
    'scope.userLocation': {
      desc: '你的位置信息将用于小程序位置接口的效果展示', // 附近门店展示，商城购物地址相关展示
    },
  },
  window: {
    backgroundTextStyle: 'dark',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '前晨汽车',
    navigationBarTextStyle: 'black',
    enablePullDownRefresh: false,
    backgroundColor: '#fff',
  },
  usingComponents: {},
  requiredPrivateInfos: ['getLocation'],
});
