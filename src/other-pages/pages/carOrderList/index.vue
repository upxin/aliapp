<template>
  <section class="flex flex-col w-full h-full">
    <custom-bar :border="true" background-color="#fff" position="unset">
      <template #title> 车辆订单 </template>
    </custom-bar>
    <section class="flex-1 overflow-hidden">
      <MainScroll
        v-model:loading="loading"
        :pt="0"
        :has-more="hasMore"
        :has-data="!!list?.length"
        :height="'100%'"
        :init-loading="initLoading"
        bg="#f5f5f5"
        @scroll-reach-bottom="loadMore"
        @end-pull-down="refresh"
      >
        <section
          v-for="(k, index) in list"
          :key="k.id"
          class="box-border flex flex-col items-center w-full pb-15px px-20px pt-18px mb-16px"
          @click.stop="
            () => {
              nrNavigateTo(path, {
                order_id: k?.order_id,
              });
            }
          "
        >
          <div class="relative z-10 w-162px h-119px -mb-40px">
            <img :src="k?.imgUrl" alt="" class="w-full h-full" />
          </div>
          <div
            class="box-border w-full bg-fff border rounded-md border-solid border-hex-f5f5f5 px-14px pt-20px pb-18px"
          >
            <div class="flex justify-between mb-24px">
              <span class="text-16px">前晨{{ k?.name }}</span>
              <span>￥{{ formatThousands(k.amount, 2) }}</span>
            </div>
            <section class="text-black text-opacity-67 text-14px">
              <div class="flex justify-between mb-16px">
                <div class="flex">
                  <span>定金状态：</span><span>{{ k.status_desc }}</span>
                </div>
                <div>定金金额：￥{{ formatThousands(k?.deposit, 2) }}</div>
              </div>
              <div
                v-if="k?.pay_detail?.pay_type || k?.pay_detail?.balance_status"
                class="flex justify-between mb-16px"
              >
                <div v-if="k?.pay_detail?.pay_type">
                  付款方式：{{ k?.pay_detail?.pay_type }}
                </div>
                <div v-if="k?.pay_detail?.balance_status">
                  尾款状态：{{ k?.pay_detail?.balance_status }}
                </div>
              </div>
              <div class="mb-16px">
                下定时间：{{ dayjs(k?.create_time).format('YYYY-MM-DD HH:mm') }}
              </div>
              <div class="flex leading-normal text-12px text-normal">
                <span>{{ k?.accessories?.join(' | ') }}</span>
              </div>
            </section>
            <div
              class="border-0 border-gray-400 border-dashed my-20px border-b-1px"
            ></div>
            <section>
              <template
                v-if="
                  !['已付清', '已办理'].includes(k?.pay_detail?.balance_status)
                "
              >
                <div
                  class="flex justify-between my-16px text-14px text-primary"
                >
                  <div>
                    {{ k?.remark }}
                  </div>
                  <div v-if="k?.bookingDays" class="flex">
                    <span>已预定</span>
                    <span class="font-bold">{{ k?.bookingDays }}</span>
                    <span>天</span>
                  </div>
                </div>
              </template>
              <template
                v-if="
                  !['已付清', '已办理'].includes(k?.pay_detail?.balance_status)
                "
                class="w-full"
              >
                <nut-steps
                  :current="(k?.vehBookingStatues?.length || '').toString()"
                >
                  <nut-step
                    title="预定"
                    :content="
                      regTime(k?.vehBookingStatues?.[0]?.create_time, index)
                    "
                    >预定</nut-step
                  >
                  <nut-step
                    title="排产"
                    :content="
                      regTime(k?.vehBookingStatues?.[1]?.create_time, index)
                    "
                  ></nut-step>
                  <nut-step
                    icon=""
                    title="运发"
                    :content="
                      regTime(k?.vehBookingStatues?.[2]?.create_time, index)
                    "
                  ></nut-step>
                  <nut-step
                    title="交车"
                    :content="
                      regTime(k?.vehBookingStatues?.[3]?.create_time, index)
                    "
                  ></nut-step>
                </nut-steps>
              </template>
              <template v-if="k?.status !== 1">
                <div class="flex justify-end pt-10px">
                  <nut-button
                    class="border border-gray-300 border-solid w-140px text-normal nrz-thin"
                    plain
                    shape="square"
                    @click.stop="
                      () => {
                        delOrder(k?.order_id);
                      }
                    "
                    >删除订单</nut-button
                  >
                </div>
              </template>
              <template v-else-if="!!k?.deliveryDate">
                <div
                  class="flex justify-between mt-16px text-14px text-primary"
                >
                  <div>
                    交付日期：{{
                      dayjs(k?.deliveryDate).format('YYYY年MM月DD')
                    }}
                  </div>
                  <div
                    class="flex"
                    @click.stop="
                      () => {
                        nrNavigateTo(Routes.carData, {
                          vin: k?.vin,
                          vinLicense: k?.vin,
                          licensePlateNumber: k?.licensePlateNum,
                        });
                      }
                    "
                  >
                    {{ '车辆数据>>' }}
                  </div>
                </div>
              </template>

              <template
                v-else-if="
                  ['已付清', '已办理'].includes(k?.pay_detail?.balance_status)
                "
              >
                <section class="flex items-center justify-between text-primary">
                  <div class="font-bold text-12px">
                    {{ k?.remark }}
                  </div>
                  <div
                    style="background-color: #bccbdd"
                    class="flex items-center justify-center border border-solid w-90px h-33px border-second"
                    @click.stop="
                      () => {
                        makePhoneCall(k?.consultationTelephone || NEWRIZON_TEL);
                      }
                    "
                  >
                    <span
                      class="iconfont icon-phone text-primary text-14px"
                    ></span>
                    <div class="ml-4px text-primary text-12px">交付专员</div>
                  </div>
                </section>
              </template>
              <!-- 运发状态 -->
              <template v-else-if="k?.vehBookingStatues?.length === 3">
                <!-- pay_type 1 全款但是没付款 2分期 -->
                <div
                  v-if="k?.pay_detail?.pay_type_code == 2"
                  class="flex justify-between"
                >
                  <nut-button
                    shape="square"
                    class="border flex-1 border-solid mt-30px h-33px border-second"
                    color="#bccbdd"
                    @click.stop="
                      () => {
                        makePhoneCall(k?.consultationTelephone || NEWRIZON_TEL);
                      }
                    "
                  >
                    <div class="flex items-center">
                      <span class="iconfont icon-phone text-primary"></span>
                      <div class="ml-4px text-primary">交付专员</div>
                    </div>
                  </nut-button>
                  <nut-button
                    shape="square"
                    class="flex-1 mt-30px h-33px bg-primary border-primary text-light-50 ml-10px"
                    @click.stop="
                      () => {
                        nrNavigateTo('carTransferMoney');
                      }
                    "
                  >
                    转账汇款￥{{ k?.pay_detail?.full_payment?.balance_price }}
                  </nut-button>
                </div>
                <nut-button
                  v-else
                  shape="square"
                  class="w-full border border-solid mt-30px h-33px border-second"
                  color="#bccbdd"
                  @click.stop="
                    () => {
                      makePhoneCall(k?.consultationTelephone || NEWRIZON_TEL);
                    }
                  "
                >
                  <div class="flex items-center">
                    <span class="iconfont icon-phone text-primary"></span>
                    <div class="ml-4px text-primary">交付专员</div>
                  </div>
                </nut-button>
              </template>

              <!-- deliveryDate为空没交车 status为1付款了 -->
              <template v-else>
                <nut-button
                  shape="square"
                  class="w-full border border-solid mt-30px h-33px border-primary"
                  @click.stop="
                    () => {
                      makePhoneCall(k?.consultationTelephone || NEWRIZON_TEL);
                    }
                  "
                >
                  <div class="flex items-center">
                    <span class="iconfont icon-phone text-primary"></span>
                    <div class="ml-4px text-primary">进度咨询</div>
                  </div>
                </nut-button>
              </template>
            </section>
          </div>
        </section>
      </MainScroll>
    </section>
  </section>
</template>
<script lang="ts">
import { onShareAppMessage, onShareTimeline } from '@/utils/index';
export default {
  onShareAppMessage,
  onShareTimeline,
};
</script>
<script lang="ts" setup>
import { onBeforeMount, ref, watch } from 'vue';
import CustomBar from '@/components/customHeader/index.vue';
import * as dayjs from 'dayjs';

import {
  formatThousands,
  nrNavigateTo,
  makePhoneCall,
  USER_INFO,
  getStore,
  CODE,
  NEWRIZON_TEL,
  useToast,
  Routes,
} from '@/utils/index';
import { getCarOrderList, deleteOrder } from '@/api/index';
import MainScroll from '@/components/scroll-main/index.vue';
import Taro from '@tarojs/taro';
//  k.status = 1 定金已支付
//  k.pay_detail.balance_status=已支付 是全款已付清 或者 贷款已办理
// 未支付 已交车 不显示预定按钮
// k?.deliveryDate 不为空 已交车  不显示任何按钮

definePageConfig({
  transparentTitle: 'auto',
  titlePenetrate: 'YES',
  defaultTitle: '',
});
const path = ref('carOrderDetail');
const initLoading = ref(true);
const loading = ref(false);
let list = ref<any[]>([]);
let nt = null;
let pt = null;
let hasMore = ref(false);
async function _getCarOrderList() {
  console.log(999999);
  const { code, data } = await getCarOrderList({
    member_id: getStore(USER_INFO)?.member_id,
    nt,
    pt,
  });
  console.log(8888888888);

  initLoading.value = false;

  if (code !== CODE) return;
  setTimeout(() => {
    initLoading.value = false;
  }, 300);
  hasMore.value = data?.list?.length == data?.pageSize;
  list.value = [...list.value, ...data?.list];
  nt = data?.nt;
  pt = data?.pt;
}
onBeforeMount(() => {
  _getCarOrderList();
});

function delOrder(order_id) {
  Taro.showModal({
    title: '提醒',
    content: `确定删除该订单${order_id}?删除后不可恢复!`,
    success: async (res) => {
      if (res.confirm) {
        let { msg, code } = await deleteOrder({ order_id });
        if (code === CODE) {
          useToast(msg || '');
          refresh();
        }
      } else if (res.cancel) {
      }
    },
  });
}
function regTime(time, i) {
  if (!time) {
    return '待定';
  }
  return dayjs(time).format('MM月DD日');
}
function loadMore() {
  console.log('haseMore', hasMore.value);
  if (hasMore.value) {
    _getCarOrderList();
  }
}
async function refresh() {
  try {
    nt = null;
    pt = null;
    const { code, data } = await getCarOrderList({
      member_id: getStore(USER_INFO)?.member_id,
      nt,
      pt,
    });
    setTimeout(() => {
      loading.value = false;
    }, 300);
    if (code !== CODE) return;

    hasMore.value = data?.list?.length == data?.pageSize;

    list.value = [...data?.list];
    nt = data?.nt;
    pt = data?.pt;
  } catch (error) {
    loading.value = false;
    console.log(error);
  }
}

watch(
  () => initLoading.value,
  (v) => {
    console.log(v, '--1203-193-4jflkjvjfj');
  },
  {
    deep: true,
    immediate: true,
  }
);
</script>
<style lang="scss">
.nut-step-content {
  color: #11264d;
}

.nut-step.nut-step-wait .nut-step-content {
  color: rgba(17, 38, 77, 0.47);
}
.nut-step.nut-step-wait .nut-step-head {
  color: rgba(17, 38, 77, 0.47);
  border-color: rgba(17, 38, 77, 0.47);
}
.nut-step.nut-step-wait .nut-step-icon.is-text {
  border: 0;
  .nut-step-inner {
    opacity: 0;
  }
}
.nut-step-line {
  background-color: rgba(17, 38, 77, 0.47);
}
.nut-step-content {
  font-size: 10px;
}
.nut-step-title {
  margin-bottom: 6px;
  font-size: 12px;
  color: #11264d;
}
page {
  height: 100%;
  width: 100%;
}
</style>
