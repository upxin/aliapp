<template>
  <MainScroll
    v-model:loading="loading"
    :has-more="hasMore"
    :has-data="!!orderList?.length"
    :init-loading="initLoading"
    :pt="0"
    bg="#f5f5f5"
    @scroll-reach-bottom="loadMore"
    @end-pull-down="refresh"
  >
    <section class="overflow-y-auto nrz-safe text-12px">
      <div
        v-for="(k, i) in orderList"
        :key="k?.id"
        class="px-16px my-10px nrz-thin"
        @click="goDetail(k)"
      >
        <div class="flex items-center overflow-hidden rounded-5px">
          <div
            class="box-border flex flex-col justify-around w-240px h-86px boxLeft py-16px"
            :class="{ filterCouponLeft: !k.available && couponStatus != 3 }"
          >
            <div
              class="text-14px pl-24px"
              :class="{ 'opacity-50': !k?.available && couponStatus != 3 }"
            >
              {{ k.couponName }}
            </div>
            <div
              class="mt-10px pl-24px"
              :class="{
                g9: !_isToday(k.endTime),
                'text-danger': _isToday(k.endTime),
              }"
            >
              {{
                couponStatus == 3
                  ? `${k.updateTime} 使用`
                  : `${regDeadline(k.endTime)} 过期`
              }}
            </div>
            <div
              v-if="!k.available"
              class="nr-border-t--dashed pt-6px pl-24px mt-6px nrz-thin"
              :style="{
                borderColor:
                  !k.available && couponStatus != 3 ? '#ccc' : '#f5f5f5',
                color: '#585656',
              }"
            >
              {{ k.useDesc || '' }}
            </div>
          </div>

          <div
            class="border-right-dashed"
            :class="{
              'border-right-dashed--fixed': !k.available && couponStatus != 3,
            }"
          ></div>

          <div
            class="box-border flex flex-col items-center justify-around w-120px h-86px boxRight py-10px"
            :class="{ filterCouponRight: !k.available && couponStatus != 3 }"
          >
            <span
              class="flex items-baseline"
              :class="{ 'opacity-50': !k?.available && couponStatus != 3 }"
            >
              <span v-if="k.couponType === 0">￥</span>
              <span class="font-bold text-20px">{{
                regText(k.couponText)
              }}</span>
            </span>
            <span class="g4">{{ k.couponTypeTermsText }}</span>
            <button
              v-if="k?.available"
              class="useCoupon nrz-thin"
              @click="useCoupon(k)"
            >
              {{ '立即使用' }}
            </button>
          </div>
        </div>
      </div>
    </section>
  </MainScroll>
</template>
<script lang="ts" setup>
import MainScroll from '@/components/scroll-main/index.vue';
import { getCouponList } from '@/api/index';
import { nrNavigateTo, goPages } from '@/utils/index';
import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
import { usePagination } from '@/hooks/usePagi';
import { useNavigateBack } from '@/hooks/index';

import { watch } from 'vue';
import { useRouter } from '@tarojs/taro';
dayjs.extend(isToday);
const params = useRouter().params;
definePageConfig({ transparentTitle: 'always',titlePenetrate: 'YES',defaultTitle: '', });
interface Props {
  couponStatus: string | number;
  // 查询可用优惠券
  available?: boolean;
  type: number;
}

let props = withDefaults(defineProps<Props>(), {
  available: false,
  couponStatus: 1,
  type: 1,
  discount: 1,
  areaCode: '',
});
const {
  data: orderList,
  hasMore,
  run,
  initLoading,
  loading,
} = usePagination(
  getCouponList,
  {
    defaultParams: props?.available
      ? {
          areaCode: params.areaCode,
          serviceType: props?.type === 1 ? 'charge' : 'mall',
          discount: params.discount,
        }
      : {
          serviceType: props?.type === 1 ? 'charge' : 'mall',
          couponStatus: props.couponStatus,
        },
  },
  true
);

function useCoupon(k) {
  if (props?.available) {
    useNavigateBack({ coupon: k });
    return;
  }
  if (props.type === 1) {
    nrNavigateTo('chargeMapStationList');
    return;
  }
  if (props.type === 2) {
    goPages('mall');
    return;
  }
}
function regText(text: string) {
  if (text.includes('元')) return text.replace('元', '');
  return text;
}
function _isToday(time) {
  return dayjs(time).isToday();
}
function regDeadline(time: string) {
  return _isToday(time) ? '今日' + time.split(' ')[1] : time;
}
function loadMore() {
  if (!hasMore.value) return;
}
function goDetail(k) {
  if (k.orderId) {
    if (k.serviceType === 'charge') {
      nrNavigateTo('chargeOrderDetail', { orderId: k.orderId });
    } else {
      nrNavigateTo('mallOrderDetail', { orderId: k.orderId });
    }
  }
}
function refresh() {
  run({
    refresh: true,
    serviceType: props?.type === 1 ? 'charge' : 'mall',
  });
}
watch(
  () => props.type,
  () => {
    run({
      refresh: true,
      serviceType: props?.type === 1 ? 'charge' : 'mall',
    });
  }
);
// bottom
</script>
<style lang="scss">
/* 弧形缺角 */
.boxLeft {
  background: radial-gradient(transparent 0px, #fff 0) top left,
    radial-gradient(circle at top right, transparent 4px, #fff 0) top right,
    radial-gradient(circle at bottom right, transparent 4px, #fff 0) bottom
      right,
    radial-gradient(transparent 0px, #fff 0) bottom left;
  background-size: 50% 50%;
  background-repeat: no-repeat;
}

.boxRight {
  background: radial-gradient(transparent 0px, #fff 0) top right,
    radial-gradient(circle at top left, transparent 4px, #fff 0) top left,
    radial-gradient(circle at bottom left, transparent 4px, #fff 0) bottom left,
    radial-gradient(transparent 0px, #fff 0) bottom right;
  background-size: 50% 50%;
  background-repeat: no-repeat;
}
.border-right-dashed {
  width: 1px;
  height: 77px;
  position: relative;
  background-color: #fff;
  &--fixed {
    background-color: rgba(155, 153, 153, 0.07);
  }
}
.border-right-dashed::after {
  content: '';
  position: absolute;
  height: 100%;
  left: 0px;
  border-right: 1px dashed #f5f5f5;
}
.border-right-dashed--fixed::after {
  border-right: 1px dashed #ccc;
}

.g9 {
  color: #999;
}
.g4 {
  color: #444;
  opacity: 0.6;
}
.g6 {
  color: #666;
}
.useCoupon {
  padding: 4px 8px;
  background-color: #fcf1d5;
  color: #f2b20f;
  border-radius: 10px;
}

.filterCouponLeft {
  background: radial-gradient(transparent 0px, rgba(155, 153, 153, 0.07) 0) top
      left,
    radial-gradient(
        circle at top right,
        transparent 4px,
        rgba(155, 153, 153, 0.07) 0
      )
      top right,
    radial-gradient(
        circle at bottom right,
        transparent 4px,
        rgba(155, 153, 153, 0.07) 0
      )
      bottom right,
    radial-gradient(transparent 0px, rgba(155, 153, 153, 0.07) 0) bottom left;
  background-size: 50% 50%;
  background-repeat: no-repeat;
}

.filterCouponRight {
  background: radial-gradient(transparent 0px, rgba(155, 153, 153, 0.07) 0) top
      right,
    radial-gradient(
        circle at top left,
        transparent 4px,
        rgba(155, 153, 153, 0.07) 0
      )
      top left,
    radial-gradient(
        circle at bottom left,
        transparent 4px,
        rgba(155, 153, 153, 0.07) 0
      )
      bottom left,
    radial-gradient(transparent 0px, rgba(155, 153, 153, 0.07) 0) bottom right;
  background-size: 50% 50%;
  background-repeat: no-repeat;
}
</style>
