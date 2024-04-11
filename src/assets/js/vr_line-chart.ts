import * as dayjs from 'dayjs';
import { YMD_EN } from '@/utils/index';

export function normalData(start, end, max) {
  const dateArray: any[] = [];
  let index = -1;
  let currentTime;
  while (true) {
    index++;
    currentTime = dayjs(start).add(index, 'day').format(YMD_EN);
    dateArray.push({
      result: Math.min(max, Math.random() * 40).toFixed(0),
      date: currentTime,
    });
    if (currentTime == end) {
      break;
    }
  }
  return dateArray;
}
