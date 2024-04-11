import {
  mine_add_car,
  mine_car_order,
  mine_car_team,
  mine_charge_collect,
  mine_delivery_process,
  mine_fleet_car,
  mine_goods_collect,
  mine_goods_order,
  mine_instructions,
  mine_invite_record,
  mine_invoice_issued,
  mine_obu_promotion,
  mine_service_order,
  mine_yjzd,
  charge_often,
  charge_order,
} from './icon';
import { Routes } from '@/utils/index';

export const COMPONENT_NAME = 'wx-qr';
export const DEFAULT_SIZE = '200rpx';
const screenWidth = my.getSystemInfoSync()['screenWidth'];
export function getPxFromRpx(rpx) {
  return Math.round((rpx * screenWidth) / 750);
}
export function getRpxFromPx(px) {
  return Math.round((px * 750) / screenWidth);
}
export function loadImage(canvas, imgSrc) {
  return new Promise((reslove, reject) => {
    const img = canvas.createImage();
    img.src = imgSrc;
    img.onload = () => {
      reslove(img);
    };
    img.onerror = (e) => {
      reject(e);
    };
  });
}
export function resetCanvasHeighAndWidth(canvas, size, scale) {
  const ctx = canvas.getContext('2d');
  let dpr = my.getSystemInfoSync().pixelRatio;
  if (scale) {
    dpr = scale;
  }
  canvas.width = size * dpr;
  canvas.height = size * dpr;
  ctx.scale(dpr, dpr);
  return canvas;
}
export function getRoundNum(num, fixedNum = 0) {
  return Number(num.toFixed(fixedNum));
}
export function getPxFromStringOrNumber(pixel) {
  let px = 0;
  if (!pixel) {
    return px;
  }
  if (typeof pixel !== 'string') {
    return getPxFromRpx(pixel);
  }
  px = Number(pixel.match(/\d+\.?\d+?/)[0]);
  if (pixel.endsWith('px')) {
    return px;
  } else {
    return getPxFromRpx(px);
  }
}
export function getRpxFromStringOrNumber(rpx) {
  let px = 0;
  if (!rpx) {
    return px;
  }
  if (typeof rpx === 'number') {
    return rpx;
  }
  px = Number(rpx.match(/\d+\.?\d+?/)[0]);
  if (rpx.endsWith('px')) {
    return getRpxFromPx(px);
  } else {
    return px;
  }
}
let MODULE_OTHER = 'other-pages';
let MODULE_CHARGE = 'chargeModule';

export const entryList = [
  {
    text: '我的车队',
    imageUrl: mine_car_team,
    type: 3,
    route: Routes.fleetHome,
    moduleName: Routes.fleetModul,
  },
  {
    text: '所属车队',
    imageUrl: mine_fleet_car,
    route: Routes?.belongFleet,
  },
  {
    text: '添加车辆',
    imageUrl: mine_add_car,
    type: 4,
    route: '1',
    moduleName: '',
  },
  {
    text: 'OBU推广',
    imageUrl: mine_obu_promotion,
    type: 20,
    route: Routes.ownerAddCar,
    params: {
      title: 'OBU推广',
      type: '3',
    },
  },
  {
    text: '车辆订单',
    imageUrl: mine_car_order,
    type: 5,
    route: 'carOrderList',
    moduleName: MODULE_OTHER,
  },
  {
    text: '充电订单',
    imageUrl: charge_order,
    type: 6,
    route: 'chargeOrderList',
    moduleName: MODULE_CHARGE,
  },
  {
    text: '服务订单',
    imageUrl: mine_service_order,
    type: 7,
    route: 'servicesOrderList',
    moduleName: MODULE_OTHER,
  },
  {
    text: '商品订单',
    imageUrl: mine_goods_order,
    type: 8,
    route: 'mallOrder',
    moduleName: MODULE_OTHER,
  },
  {
    text: '收藏电站',
    imageUrl: mine_charge_collect,
    type: 9,
    route: 'collectOftenStationList',
    params: { type: 2 },
    moduleName: MODULE_CHARGE,
  },
  {
    text: '常去电站',
    imageUrl: charge_often,
    type: 10,
    route: 'collectOftenStationList',
    params: { type: 1 },
    moduleName: MODULE_CHARGE,
  },
  {
    imageUrl: mine_invite_record,
    text: '邀请记录',
    type: 11,
    route: Routes?.fleetInviteRecord,
  },
  {
    text: '收货地址',
    imageUrl: mine_goods_collect,
    route: Routes?.mallAddr,
    moduleName: '',
  },
  {
    text: '交付流程',
    imageUrl: mine_delivery_process,
    type: 13,
    route: 'confirmation',
    params: {
      type: 1,
    },
    moduleName: MODULE_OTHER,
  },
  {
    text: '使用说明',
    imageUrl: mine_instructions,
    type: 14,
    route: 'confirmation',
    params: {
      type: 2,
    },
    moduleName: MODULE_OTHER,
  },
  {
    text: '应急指导',
    imageUrl: mine_yjzd,
    type: 15,
    route: 'confirmation',
    moduleName: MODULE_OTHER,
    params: {
      type: 4,
    },
  },
  {
    text: '已开发票',
    imageUrl: mine_invoice_issued,
    route: 'invoiceList',
    moduleName: MODULE_CHARGE,
  },
];
