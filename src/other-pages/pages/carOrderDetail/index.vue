<template>
  <custom-bar background-color="#fff">
    <template #title>车辆订单详情</template>
  </custom-bar>
  <FullLoading :loading="fl">
    <div
      :style="{ paddingTop: `${CalcPt}px` }"
      class="box-border relative h-full overflow-y-auto bg-gradient-to-b text-normal from-hex-DBE7F0 to-light-50 text-14px pb-50px"
    >
      <!-- 订单 -->
      <section class="w-full nrz-thin">
        <LazyImg
          :src="_detail?.imgUrl"
          :height="210"
          :width="270"
          mode="aspectFit"
          class="m-auto mt-30px"
        />
        <aside class="box-border w-full mt-33px mb-10px px-35px">
          <div
            v-if="
              !['已付清', '已办理'].includes(
                _detail?.pay_detail?.balance_status
              )
            "
            class="flex items-center justify-center w-full text-center h-45px text-16px"
          >
            <span>已经预定</span>
            <span class="font-bold text-20px ml-6px">{{
              _detail?.bookingDays
            }}</span>
            <span class="mr-6px">天</span>
            <span>前晨{{ _detail?.name }}</span>
          </div>
          <div
            class="flex justify-between h-20px leading-20px my-11px text-14px text-primary"
          >
            <div v-if="_detail?.remark">{{ _detail?.remark }}</div>
            <div v-else>交付日期：{{ _detail?.deliveryDate }}</div>
            <div class="flex">
              ￥{{ formatThousands(_detail?.amount || '', 2) }}
            </div>
          </div>
          <div
            v-if="
              ['已付清', '已办理'].includes(
                _detail?.pay_detail?.balance_status
              ) || _detail?.deliveryDate
            "
            class="flex justify-between my-16px"
          >
            <div>交付中心：{{ _detail?.delivery?.address }}</div>
            <div
              v-if="
                ['已付清', '已办理'].includes(
                  _detail?.pay_detail?.balance_status
                )
              "
            >
              <span v-if="!_detail?.deliveryDate">待线下提车</span>
              <span v-else>{{ _detail?.remark }}</span>
            </div>
          </div>
          <div v-if="_detail?.order_id" class="flex items-center mb-20px">
            <div>订单编号：{{ _detail?.order_id }}</div>
            <span
              class="text-primary icon iconfont icon-copy ml-8px"
              @click="
                () => {
                  copyText(_detail?.order_id || '');
                }
              "
            ></span>
          </div>
          <template
            v-if="
              _detail?.status === 1 &&
              !['已付清', '已办理'].includes(
                _detail?.pay_detail?.balance_status
              )
            "
          >
            <div class="w-full pb-29px">
              <nut-steps
                :current="(_detail?.vehBookingStatues?.length || '').toString()"
              >
                <nut-step
                  title="预定"
                  :content="
                    regTime(_detail?.vehBookingStatues?.[0]?.create_time)
                  "
                  >预定</nut-step
                >
                <nut-step
                  title="排产"
                  :content="
                    regTime(_detail?.vehBookingStatues?.[1]?.create_time)
                  "
                ></nut-step>
                <nut-step
                  icon=""
                  title="运发"
                  :content="
                    regTime(_detail?.vehBookingStatues?.[2]?.create_time)
                  "
                ></nut-step>
                <nut-step
                  title="交车"
                  :content="
                    regTime(_detail?.vehBookingStatues?.[3]?.create_time)
                  "
                ></nut-step>
              </nut-steps>
            </div>
          </template>

          <div
            v-if="_detail?.vehBookingStatues?.[0]?.veh_booking_statue == 3"
            class="flex justify-between"
          >
            <nut-button
              shape="square"
              color="#bccbdd"
              class="flex-1 h-33px border-second"
              @click.stop="call"
            >
              <div class="flex items-center">
                <span class="iconfont icon-phone text-primary"></span>
                <div class="ml-4px text-primary">交付专员</div>
              </div>
            </nut-button>
            <template
              v-if="['待支付']?.includes(_detail?.pay_detail?.balance_status)"
            >
              <nut-button
                shape="square"
                class="px-0 flex-1 bg-primary h-33px text-light-50 border-primary ml-10px"
                @click="
                  () => {
                    nrNavigateTo('carTransferMoney');
                  }
                "
              >
                <div class="flex items-center justify-center">
                  <div class="ml-4px text-fff">转账汇款</div>
                  <span
                    >￥{{
                      formatThousands(
                        _detail?.pay_detail?.full_payment?.balance_price,
                        2
                      )
                    }}</span
                  >
                </div>
              </nut-button>
            </template>
            <nut-button
              v-else
              class="w-full h-33px border-second"
              shape="square"
              color="#bccbdd"
              @click.stop="
                () => {
                  makePhoneCall(_detail?.consultationTelephone || NEWRIZON_TEL);
                }
              "
            >
              <div class="flex items-center">
                <span class="iconfont icon-phone text-primary"></span>
                <div class="ml-4px text-primary">交付专员</div>
              </div>
            </nut-button>
          </div>
          <template v-else>
            <nut-button
              v-if="!_detail?.deliveryDate"
              shape="square"
              class="w-full bg-hex-11264d h-33px bg-opacity-20"
              @click.stop="call"
            >
              <div class="flex items-center">
                <span class="iconfont icon-phone text-primary"></span>
                <div class="ml-4px text-primary">进度咨询</div>
              </div>
            </nut-button>
          </template>
          <div
            class="border-0 border-gray-400 border-dashed my-20px border-b-1px"
          ></div>
        </aside>
      </section>
      <!-- 付款信息 -->
      <section class="w-full nrz-thin">
        <aside class="box-border w-full mt-33px mb-10px px-35px">
          <div class="text-hex-11264d mb-20px">付款信息</div>
          <div
            class="flex justify-between mb-16px text-hex-000 text-opacity-70"
          >
            <div>定金状态：{{ _detail?.status_desc }}</div>
            <div class="w-120px">
              定金金额：￥{{ formatThousands(_detail?.deposit, 2) }}
            </div>
          </div>
          <div
            v-if="
              _detail?.pay_detail?.pay_type ||
              _detail?.pay_detail?.balance_status
            "
            class="flex justify-between mb-16px text-hex-000 text-opacity-70"
          >
            <div>付款方式：{{ regPayType(_detail?.pay_detail?.pay_type) }}</div>
            <div class="w-120px">
              尾款状态：{{ _detail?.pay_detail?.balance_status }}
            </div>
          </div>
          <div v-if="_detail?.create_time">
            下定时间：{{
              dayjs(_detail?.create_time).format('YYYY-MM-DD HH:mm:ss')
            }}
          </div>
          <!-- 全款付清 -->
          <div
            v-if="
              _detail?.pay_detail?.full_payment &&
              ['已付清', '已办理'].includes(_detail?.pay_detail?.balance_status)
            "
            class="bg-hex-DBE7F0 h-62px text-12px px-14px py-7px mt-15px mb-20px"
          >
            <div
              class="flex justify-between my-16px text-hex-000 text-opacity-70"
            >
              <div>
                尾款金额：￥{{
                  formatThousands(
                    _detail?.pay_detail?.full_payment?.balance_price || '',
                    2
                  )
                }}
              </div>
              <div class="w-120px">
                尾款方式：{{ _detail?.pay_detail?.full_payment?.balance_type }}
              </div>
            </div>
            <div>
              尾款时间：{{
                dayjs(_detail?.pay_detail?.full_payment?.balance_time).format(
                  'YYYY-MM-DD HH:mm:ss'
                )
              }}
            </div>
          </div>
          <!-- 分期付清 -->
          <div
            v-if="_detail?.pay_detail?.staging"
            class="bg-hex-DBE7F0 h-130px text-12px px-14px py-7px mt-15px mb-20px"
          >
            <div
              class="flex justify-between my-16px text-hex-000 text-opacity-70"
            >
              <div class="flex items-center w-full">
                <div class="mr-4px">
                  分期机构：{{ _detail?.pay_detail?.staging?.staging_agency }}
                </div>
                <div
                  :style="{
                    backgroundImage: `url(${_detail?.pay_detail?.staging?.staging_agency_img})`,
                  }"
                  class="bg-center bg-no-repeat bg-cover w-74px h-17px"
                ></div>
                <div class="ml-auto">
                  分期数：{{
                    _detail?.pay_detail?.staging?.number_of_installment
                  }}个月
                </div>
              </div>
            </div>
            <div
              class="flex justify-between my-16px text-hex-000 text-opacity-70"
            >
              <div>
                办理时间：{{
                  dayjs(_detail?.pay_detail?.full_payment?.balance_time).format(
                    'YYYY-MM-DD HH:mm:ss'
                  )
                }}
              </div>
              <div>
                利息总额：{{
                  formatThousands(
                    _detail?.pay_detail?.staging?.total_interest,
                    2
                  )
                }}
              </div>
            </div>
            <div class="flex justify-between mt-23px mb-13px">
              <div
                class="flex flex-col items-center justify-center flex-1 border-0 border-solid h-34px border-r-gray-400"
                :class="{ 'border-r-1px': true }"
              >
                <span class="mb-4px text-hex-000 text-opacity-77">
                  分期本金
                </span>
                <span
                  >￥{{
                    formatThousands(
                      _detail?.pay_detail?.staging?.total_installment,
                      2
                    )
                  }}</span
                >
              </div>
              <div
                class="flex flex-col items-center justify-center flex-1 border-0 border-solid h-34px border-r-gray-400"
                :class="{ 'border-r-1px': true }"
              >
                <span class="mb-4px text-hex-000 text-opacity-77">
                  月供金
                </span>
                <span
                  >￥{{
                    formatThousands(
                      _detail?.pay_detail?.staging?.monthly_payment,
                      2
                    )
                  }}</span
                >
              </div>
              <div class="flex flex-col items-center flex-1">
                <span class="mb-6px text-hex-000 text-opacity-77">
                  年化率
                </span>
                <span class="text-hex-000 text-opacity-88"
                  >{{
                    formatThousands(
                      _detail?.pay_detail?.staging?.annualized_rate,
                      2
                    )
                  }}%</span
                >
              </div>
            </div>
          </div>
          <div
            class="border-0 border-gray-400 border-dashed my-20px border-b-1px"
          ></div>
        </aside>
      </section>
      <!-- 配置信息 -->
      <section class="box-border w-full nrz-thin px-35px mt-53px mb-10px">
        <div class="text-hex-11264d mb-16px">配置信息</div>
        <div class="w-full leading-normal text-12px text-hex-000 opacity-77">
          {{ _detail?.accessories?.join(' | ') }}
        </div>
        <div
          class="border-0 border-gray-400 border-dashed my-20px border-b-1px"
        ></div>
      </section>
      <!-- 买家信息 -->
      <section class="box-border w-full nrz-thin mt-53px mb-10px px-35px">
        <div class="text-hex-11264d mb-22px">买家信息</div>
        <div class="mb-19px text-hex-000 opacity-77">
          购车类型：{{ _detail?.user?.type == 1 ? '企业购车' : '个人购车' }}
        </div>
        <div v-if="_detail?.user?.name" class="mb-19px text-hex-000 opacity-77">
          买家姓名：{{ _detail?.user?.name }}
        </div>
        <div v-if="_detail?.user?.city" class="mb-19px text-hex-000 opacity-77">
          上牌城市：{{ _detail?.user?.city }}
        </div>
        <div v-if="_detail?.shop_name" class="mb-29px text-hex-000 opacity-77">
          交付中心：{{ _detail?.shop_name }}
        </div>
        <div
          class="border-0 border-gray-400 border-dashed my-20px border-b-1px"
        ></div>
      </section>

      <!-- 企业信息 -->
      <section
        v-if="_detail?.user?.type == 1"
        class="box-border w-full nrz-thin mt-53px mb-22px px-35px"
      >
        <div class="text-hex-11264d mb-22px">车主信息</div>
        <div v-if="_detail?.ownerName" class="mb-19px text-hex-000 opacity-77">
          企业名称：{{ _detail?.ownerName }}
        </div>
        <div v-if="_detail?.card_no" class="mb-19px text-hex-000 opacity-77">
          企业代码：
          {{ _detail?.card_no }}
        </div>
        <div
          v-if="_detail?.user?.contact"
          class="mb-19px text-hex-000 opacity-77"
        >
          手机号码：{{ _detail?.user?.contact }}
        </div>
      </section>
      <!-- 车主信息 -->
      <section
        v-else
        class="box-border w-full nrz-thin mt-53px mb-22px px-35px"
      >
        <div class="text-hex-11264d mb-22px">车主信息</div>
        <div v-if="_detail?.ownerName" class="mb-19px text-hex-000 opacity-77">
          车主姓名：{{ _detail?.ownerName }}
        </div>
        <div v-if="_detail?.ownerPhone" class="mb-19px text-hex-000 opacity-77">
          车主手机：{{ _detail?.ownerPhone }}
        </div>
        <div v-if="_detail?.card_type" class="mb-19px text-hex-000 opacity-77">
          证件类型：{{
            ID_MAP.find((item) => item.id == _detail?.card_type)?.name || ''
          }}
        </div>
        <div v-if="_detail?.card_no" class="text-hex-000 opacity-77">
          证件号码：{{ _detail?.card_no }}
        </div>
      </section>
      <div v-if="_detail?.status !== 1" class="px-36px mt-68px">
        <nut-button
          class="w-full border border-solid border-hex-101010 text-normal"
          plain
          shape="square"
          @click="delOrder"
          >删除订单</nut-button
        >
      </div>
    </div>
  </FullLoading>
</template>
<script lang="ts">
import { onShareAppMessage, onShareTimeline } from '@/utils/index';
export default {
  onShareAppMessage,
  onShareTimeline,
};
</script>
<script lang="ts" setup>
import { computed, ref, onBeforeMount } from 'vue';
import CustomBar from '@/components/customHeader/index.vue';
import { systemInfo } from '@/stores/systemInfo';
import { useRouter } from '@tarojs/taro';
import {
  formatThousands,
  copyText,
  CODE,
  NEWRIZON_TEL,
  makePhoneCall,
  useToast,
  ID_MAP,
  nrNavigateTo,
} from '@/utils/index';
import { orderSingleDetail, deleteOrder } from '@/api/index';
import Taro from '@tarojs/taro';
import * as dayjs from 'dayjs';
import FullLoading from '@/components/full-loading/index.vue';
import LazyImg from '@/components/nrz-img/index.vue';

definePageConfig({
  transparentTitle: 'auto',
  titlePenetrate: 'YES',
  defaultTitle: '',
});
let fl = ref(true);
let CalcPt = computed(
  () => systemInfo().RightBtnRect.h + systemInfo().RightBtnRect.t + 10
);
function regTime(time) {
  console.log('time', _detail.value?.vehBookingStatues);
  if (!time) {
    return '待定';
  }
  return dayjs(time).format('MM月DD日');
}
function regPayType(type) {
  if (typeof type === 'string') return type;
  return { 1: '全款', 2: '分期' }[type];
}
function delOrder() {
  let order_id = _detail.value?.order_id;
  Taro.showModal({
    title: '提醒',
    content: `确定删除该订单${order_id}?删除后不可恢复!`,
    success: async (res) => {
      if (res.confirm) {
        let { msg, code } = await deleteOrder({ order_id });
        if (code === CODE) {
          useToast(msg || '');
          setTimeout(() => {
            Taro.navigateBack();
          }, 1500);
        }
      } else if (res.cancel) {
      }
    },
  });
}
let _detail = ref<any>();
async function _orderSingleDetail() {
  try {
    let { data, code } = await orderSingleDetail({
      order_id: useRouter()?.params?.order_id || '',
    });
    fl.value = false;
    if (code !== CODE) return;
    _detail.value = data;
  } catch (error) {
    fl.value = false;
  }
}
function call() {
  console.log(_detail.value?.consultationTelephone || NEWRIZON_TEL);
  makePhoneCall(_detail.value?.consultationTelephone || NEWRIZON_TEL);
}
onBeforeMount(() => {
  _orderSingleDetail();
});
</script>
<style lang="scss">
.nr-shadow {
  box-shadow: 0px -1px 4px 0px rgba(0, 0, 0, 0.3);
}
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
</style>
