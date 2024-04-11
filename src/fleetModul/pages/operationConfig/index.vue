<template>
  <section class="flex flex-col w-full h-full">
    <CustomBar background-color="#fff" position="unset">
      <template #title>运营效率配置</template>
    </CustomBar>
    <section class="flex-1 overflow-hidden">
      <MainScroll
        :has-more="hasMore"
        :init-loading="initLoading"
        :refresher-enabled="false"
        end-text=""
        :pt="0"
      >
        <div style="padding: 0 34px">
          <div class="text-center py-30px">各项指标占比</div>
          <div class="flex text-fff justify-between mb-20px text-center">
            <div
              :style="{ backgroundColor: VehColor[1] }"
              class="w-100px py-4px"
            >
              电车
            </div>
            <div
              :style="{ backgroundColor: VehColor[2] }"
              class="w-100px py-4px"
            >
              油车
            </div>
          </div>
          <!-- <div class="flex justify-between nrz-thin text-10px my-20px">
            <div class="w-100px flex flex-col items-center"></div>
            <div class="w-100px flex flex-col items-center"></div>
          </div> -->
          <div class="flex justify-between nrz-thin text-10px my-20px">
            <div class="w-100px flex flex-col items-center">
              <div class="text-12px opacity-50">
                当前：{{ old?.eleMileageRatio }}
              </div>
              <nut-inputnumber
                v-model="state.eleMileageRatio"
                class="my-10px"
                min="1"
                max="98"
              />
              <div class="ml-8px">行驶里程占比（%）</div>
            </div>
            <div class="w-100px flex flex-col items-center">
              <div class="text-12px opacity-50">
                当前：{{ old?.oilMileageRatio }}
              </div>

              <nut-inputnumber
                v-model="state.oilMileageRatio"
                class="my-10px"
                min="1"
                max="98"
              />
              <div class="ml-8px">行驶里程占比（%）</div>
            </div>
          </div>

          <div class="flex justify-between nrz-thin text-10px my-20px">
            <div class="w-100px flex flex-col items-center">
              <div class="text-12px opacity-50">
                当前：{{ old?.eleAvgConsumptionRatio }}
              </div>

              <nut-inputnumber
                v-model="state.eleAvgConsumptionRatio"
                class="my-10px"
                min="1"
                max="98"
              />
              <div class="ml-8px">平均能耗占比（%）</div>
            </div>
            <div class="w-100px flex flex-col items-center">
              <div class="text-12px opacity-50">
                当前：{{ old?.oilAvgConsumptionRatio }}
              </div>

              <nut-inputnumber
                v-model="state.oilAvgConsumptionRatio"
                class="my-10px"
                min="1"
                max="98"
              />
              <div class="ml-8px">平均油耗占比（%）</div>
            </div>
          </div>

          <div class="flex justify-between nrz-thin text-10px">
            <div class="w-100px flex flex-col items-center">
              <div class="text-12px opacity-50">
                当前：{{ old?.eleRunTimeRatio }}
              </div>
              <nut-inputnumber
                v-model="state.eleRunTimeRatio"
                class="my-10px"
                min="1"
                max="98"
              />
              <div class="ml-8px">行驶时长占比（%）</div>
            </div>
            <div class="w-100px flex flex-col items-center">
              <div class="text-12px opacity-50">
                当前：{{ old?.oilRunTimeRatio }}
              </div>
              <nut-inputnumber
                v-model="state.oilRunTimeRatio"
                class="my-10px"
                min="1"
                max="98"
              />
              <div class="ml-8px">行驶时长占比（%）</div>
            </div>
          </div>

          <div class="mt-40px mb-30px">
            上次调整时间：{{ old?.efficiencyTime || '--' }}
          </div>
          <div class="opacity-50 text-12px leading-normal">
            <div>注意：</div>
            <div>1. 每个月仅可调整一次参数配置；</div>
            <div>2. 调整后的数据次月生效；</div>
            <div>3.调整后的各项指标不影响历史数据值。</div>
          </div>
          <div class="flex justify-center">
            <button
              shape="square"
              class="w-200px py-10px mt-20px text-fff bg-primary"
              @click="submit"
            >
              修改
            </button>
          </div>
        </div>
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
import MainScroll from '@/components/scroll-main/index.vue';
import { reactive, ref } from 'vue';
import CustomBar from '@/components/customHeader/index.vue';
import Taro, { useReady } from '@tarojs/taro';
import { dsConfig, dsDetail } from '@/api/index';
import { CODE, useToast, VehColor } from '@/utils/index';
definePageConfig({ navigationStyle: 'custom' });
let state = reactive({
  eleAvgConsumptionRatio: 0,
  eleMileageRatio: 0,
  eleRunTimeRatio: 0,

  oilAvgConsumptionRatio: 0,
  oilMileageRatio: 0,
  oilRunTimeRatio: 0,
});

const old = reactive({
  efficiencyTime: '',
  eleAvgConsumptionRatio: 0,
  eleMileageRatio: 0,
  eleRunTimeRatio: 0,

  oilAvgConsumptionRatio: 0,
  oilMileageRatio: 0,
  oilRunTimeRatio: 0,
});
let hasMore = ref(false);
let initLoading = ref(true);
function submit() {
  let eleAll =
    Number(state.eleAvgConsumptionRatio) +
    Number(state.eleMileageRatio) +
    Number(state.eleRunTimeRatio);

  let oilAll =
    Number(state.oilAvgConsumptionRatio) +
    Number(state.oilMileageRatio) +
    Number(state.oilRunTimeRatio);

  console.log(eleAll, eleAll !== 100);
  if (eleAll !== 100) {
    console.log(eleAll, eleAll !== 100);

    return useToast('电车各项总和需为100');
  }
  if (oilAll !== 100) {
    return useToast('油车各项总需和为100');
  }

  dsConfig({
    oilEfficiencyConfig: {
      mileageRatio: state.oilMileageRatio,
      runTimeRatio: state.oilRunTimeRatio,
      avgConsumptionRatio: state.oilAvgConsumptionRatio,
    },
    eleEfficiencyConfig: {
      mileageRatio: state.eleMileageRatio,
      runTimeRatio: state.eleRunTimeRatio,
      avgConsumptionRatio: state.eleAvgConsumptionRatio,
    },
  }).then((res) => {
    useToast(res?.msg);
    if (res?.code === CODE) {
      setTimeout(() => {
        Taro.navigateBack();
      }, 1500);
    }
  });
}
useReady(() => {
  dsDetail()
    .then((res) => {
      initLoading.value = false;
      if (res?.code !== CODE) return;
      old.efficiencyTime = res?.data?.efficiencyTime;
      old.eleAvgConsumptionRatio =
        res?.data?.eleEfficiencyConfig?.avgConsumptionRatio;
      old.eleMileageRatio = res?.data?.eleEfficiencyConfig?.mileageRatio;
      old.eleRunTimeRatio = res?.data?.eleEfficiencyConfig?.runTimeRatio;

      old.oilAvgConsumptionRatio =
        res?.data?.oilEfficiencyConfig?.avgConsumptionRatio;
      old.oilMileageRatio = res?.data?.oilEfficiencyConfig?.mileageRatio;
      old.oilRunTimeRatio = res?.data?.oilEfficiencyConfig?.runTimeRatio;

      state.eleAvgConsumptionRatio =
        res?.data?.eleEfficiencyConfig?.nextAvgConsumptionRatio ??
        res?.data?.eleEfficiencyConfig?.avgConsumptionRatio;
      state.eleMileageRatio =
        res?.data?.eleEfficiencyConfig?.nextMileageRatio ??
        res?.data?.eleEfficiencyConfig?.mileageRatio;
      state.eleRunTimeRatio =
        res?.data?.eleEfficiencyConfig?.nextRunTimeRatio ??
        res?.data?.eleEfficiencyConfig?.runTimeRatio;

      state.oilAvgConsumptionRatio =
        res?.data?.oilEfficiencyConfig?.nextAvgConsumptionRatio ??
        res?.data?.oilEfficiencyConfig?.avgConsumptionRatio;
      state.oilMileageRatio =
        res?.data?.oilEfficiencyConfig?.nextMileageRatio ??
        res?.data?.oilEfficiencyConfig?.mileageRatio;
      state.oilRunTimeRatio =
        res?.data?.oilEfficiencyConfig?.nextRunTimeRatio ??
        res?.data?.oilEfficiencyConfig?.runTimeRatio;
    })
    .catch(() => {
      initLoading.value = false;
    });
});
// bottom
</script>
