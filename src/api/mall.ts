import { get, post, httpDelete } from '@/utils/index';

export function mallHome(params) {
  return get({
    url: '/mall/newGoods/nzGoods',
    params,
  });
}

export function get_order_list(params) {
  return post({
    url: '/mall/newOrder/orderList',
    params,
  });
}

export function getArea(params) {
  return get({
    url: 'https://restapi.amap.com/v3/config/district',
    params,
  });
}

export function get_spu(params) {
  return get({
    url: '/mall/newGoods/getSpuInfo',
    params,
  });
}

export function get_sku_info(params) {
  return get({
    url: '/mall/newGoods/getSkuInfo',
    params,
  });
}

export function goods_page(params) {
  return post({
    url: '/mall/newGoods/goodsPage',
    params,
  });
}
export function pay_only_points(params: { orderId: string }) {
  return post({
    url: '/mall/newOrder/pointPay',
    params,
  });
}

interface OrderGoods {
  spuId: string;
  skuId: string;
  num: number | string;
}
interface Order {
  goods: OrderGoods;
  memberId: string;
  addressId: string;
  memo: string;
  pointNum: string;
  adcode: string;
}
export function create_mall_order(params: Order) {
  return post({
    url: '/mall/newOrder/create',
    params,
  });
}

export function add_receiver_addr(params) {
  return post({
    url: '/member/receive/address/add',
    params,
  });
}
export function editReceiverAddr(params) {
  return post({
    url: '/member/receive/address/edit',
    params,
  });
}

export function get_addr_list() {
  return get({
    url: '/member/receive/address/list',
  });
}
export function createMallOrder(params) {
  return post({
    url: '/mall/newOrder/create',
    params,
  });
}
export function getMallOrderDetail(params) {
  return get({
    url: '/mall/newOrder/orderDetail',
    params,
  });
}
export function mallExpressInfo(params) {
  return get({
    url: '/mallAdmin/order/express',
    params,
  });
}
export function getCommentList(params) {
  return post({
    url: '/mall/newGoods/getComments',
    params,
  });
}
export function delAddr(params) {
  return httpDelete({
    url: `/member/receive/address/delete?id=${params?.id}`,
  });
}

export function finishOrder(params) {
  return get({
    url: '/mall/newOrder/finishOrder',
    params,
  });
}
export function commentGoods(params) {
  return post({
    url: '/mall/newOrder/goodsComment',
    params,
  });
}

export function reminder(params) {
  return get({
    url: '/mall/newOrder/reminder',
    params,
  });
}
