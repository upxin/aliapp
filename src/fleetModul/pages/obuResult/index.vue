<template>
  <div class="px-14px pt-10px">
    <section class="flex bg-main p-10px">
      <NrImg
        class="w-120px h-90px"
        :only-img="true"
        :url="state.vehicleImg"
      ></NrImg>
      <div class="flex flex-col py-6px pl-10px">
        <span>{{ state.licensePlateNumber }}</span>
        <span class="text-12px opacity-40 my-2px">{{ state.vinCode }}</span>
        <span class="text-12px opacity-40 my-2px">{{ state.model }}</span>
        <span class="mt-auto text-12px opacity-60">{{ state.teamName }}</span>
      </div>
    </section>
    <section class="bg-main p-10px mt-16px">
      <div class="flex items-center justify-center mt-10px mb-20px">
        <span
          class="rounded-full w-10px h-10px mr-4px"
          :class="{
            'bg-danger': noSim,
            'bg-green-400': !noSim,
          }"
        ></span>
        <span>{{ !noSim ? '设备信息' : '未获取到设备信息' }}</span>
      </div>
      <div class="flex py-6px pl-10px">
        <span>设备号码：</span>
        <span class="opacity-50">{{
          state?.simNumber || '未匹配到车辆和设备，请点击重试'
        }}</span>
      </div>
      <div class="flex py-6px pl-10px">
        <span>更新时间：</span>
        <span class="opacity-50">{{ state?.updateTime || '--' }}</span>
      </div>
    </section>

    <section v-if="noSim" class="bg-main p-10px mt-16px">
      <div class="flex items-center justify-center mt-10px mb-20px">
        <span>输入设备号码辅助添加车辆</span>
      </div>
      <div class="flex">
        <NrImg
          style="width: 97px; height: 125px"
          :only-img="true"
          class="w-97px h-125px"
          :url="SIM_IMG"
        ></NrImg>
        <section class="box-border flex flex-col justify-between flex-1 py-6px">
          <div class="box-border flex items-center py-6px pl-10px">
            <span class="">设备号码：</span>
            <input
              v-model="state.simNumber"
              type="text"
              class="bg-fff p-6px w-120px"
              placeholder="请输入"
            />
          </div>
          <div class="leading-normal opacity-50 text-12px pl-10px">
            如右图所示，设备号码为红色线框内 ID:后面的数字部分，请正确输入。
          </div>
        </section>
      </div>
    </section>

    <section class="opacity-60 text-12px p-10px">
      <div class="my-6px">
        1. 请确保设备已安装到车辆上，并且车辆和设备一一对应
      </div>
      <div>2. 如未获取到设备信息，请输入设备SIM卡号或重试、排查。</div>
    </section>
    <div class="flex justify-center pt-20px pb-60px">
      <nut-button
        v-if="!noSim"
        class="m-auto rounded-none py-10px bg-primary text-fff"
        style="width: 237px"
        @click="
          () => {
            goPages('index');
          }
        "
      >
        完成
      </nut-button>
      <nut-button
        v-else
        class="m-auto rounded-none py-10px bg-primary text-fff"
        style="width: 237px"
        @click="retry"
      >
        重试
      </nut-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
//
import NrImg from '@/components/img/img.vue';
import { ref, reactive, onBeforeMount } from 'vue';
import { addObu } from '@/api/index';
import Taro, { useRouter } from '@tarojs/taro';
import { goPages, useToast, jGcustomCount, JG } from '@/utils';
let SIM_IMG = 'https://nrz-app.su.bcebos.com/resources/sim.png';

definePageConfig({
  navigationStyle: 'default',
  navigationBarTitleText: '激活结果',
});
let state = reactive({
  vehicleImg: '',
  licensePlateNumber: '',
  vinCode: '',
  model: '',
  teamName: '',
  simNumber: '',
  updateTime: '',
});
let noSim = ref();
let params = useRouter()?.params;
const retry = () => {
  if (!state.simNumber) return useToast('请输入设备号码');
  Taro.showLoading();
  addObu({
    ...params,
    simNumber: state.simNumber,
  }).then((res) => {
    if (res.code === 200) {
      jGcustomCount(JG.USER_008);
      jGcustomCount(JG.BV_006);

      for (let key in state) {
        state[key] = res?.data?.[key];
      }
      noSim.value = res?.data?.simNumber ? false : true;
      Taro.hideLoading({
        success() {
          useToast(res?.msg);
        },
      });
    } else {
      Taro.hideLoading({
        success() {
          useToast(res?.msg);
        },
      });
    }
  });
};
onBeforeMount(() => {
  for (let key in state) {
    state[key] = params?.[key];
  }
  noSim.value = useRouter()?.params?.simNumber ? false : true;
});
</script>
<style>
page {
  background-color: #fff;
}
</style>
