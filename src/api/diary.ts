import { get, post, formatDate } from '@/utils/index';
import { Response } from '@/types/index';
export function getDiary({ vin, start, end }) {
  return get({
    url: '/vehicle/diary',
    params: { vin, start, end },
  });
}

export function getDiaryDetail(params) {
  return get<Response<any>>({
    url: '/vehicle/diary/data/detail',
    params,
  });
}

// vin 是 LASVAG123341531 车辆识别码
// start 2022-01-01 开始日期
// end 2022-01-29结束日期
// mtype 1：能耗，2：电量
export function getLineChart(params) {
  return get({
    url: '/vehicle/diary/energy/consumption',
    params,
  });
}
