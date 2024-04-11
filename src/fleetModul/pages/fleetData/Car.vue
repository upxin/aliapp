<template>
  <div class="box-border w-full p-20px bg-fff">
    <view
      class="flex justify-between w-full rounded nr-border"
      style="border-color: rgba(187, 187, 187, 0.3)"
    >
      <section
        style="border-color: rgba(187, 187, 187, 0.3)"
        class="flex flex-col items-center justify-between flex-1 py-10px nr-border-r"
      >
        <aside class="flex">
          <div class="flex items-center text-12px mr-8px">
            <div class="text-fff p-2px" style="background-color: #15db65">
              电车
            </div>
            <div class="text-18px mx-4px">
              {{ cars?.eleOnline + cars?.eleOffline }}
            </div>
            <div class="opacity-50">辆</div>
          </div>
          <div class="flex items-center text-12px">
            <div class="text-fff p-2px" style="background-color: #f2a93b">
              油车
            </div>
            <div class="text-18px mx-4px">
              {{ cars?.oilOnline + cars?.oilOffline }}
            </div>
            <div class="opacity-50">辆</div>
          </div>
        </aside>
        <aside class="flex items-end my-10px">
          <div class="rounded nr-border px-4px py-8px">
            {{ totalCar?.length === 3 ? totalCar?.[0] : 0 }}
          </div>
          <div class="rounded nr-border px-4px py-8px mx-6px">
            {{ totalCar?.length >= 2 ? totalCar?.[1] : 0 }}
          </div>
          <div class="rounded nr-border px-4px py-8px">
            {{ totalCar?.[totalCar?.length - 1] }}
          </div>
          <div class="opacity-50 ml-4px">辆</div>
        </aside>
        <div class="opacity-60 text-10px">车辆总数</div>
      </section>
      <section
        class="flex flex-col items-center justify-between flex-1 py-10px"
      >
        <aside class="flex">
          <div class="flex items-center text-12px mr-8px">
            <div class="text-fff p-2px" style="background-color: #15db65">
              电车
            </div>
            <div class="text-18px mx-4px">
              {{ cars?.eleOnline }}
            </div>
            <div class="opacity-50">辆</div>
          </div>
          <div class="flex items-center text-12px">
            <div class="text-fff p-2px" style="background-color: #f2a93b">
              油车
            </div>
            <div class="text-18px mx-4px">{{ cars?.oilOnline }}</div>
            <div class="opacity-50">辆</div>
          </div>
        </aside>
        <aside class="flex items-end my-10px">
          <div class="rounded nr-border px-4px py-8px">
            {{ onlineCar?.length === 3 ? totalCar?.[0] : 0 }}
          </div>
          <div class="rounded nr-border px-4px py-8px mx-6px">
            {{ onlineCar?.length >= 2 ? totalCar?.[1] : 0 }}
          </div>
          <div class="rounded nr-border px-4px py-8px">
            {{ onlineCar?.[totalCar?.length - 1] }}
          </div>
          <div class="opacity-50 ml-4px">辆</div>
        </aside>
        <div class="opacity-60 text-10px">在线车辆</div>
      </section>
    </view>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { CODE, useToast } from '@/utils';
import { onlineCars } from '@/api';

let cars = ref();
let props = withDefaults(defineProps<{ isLeader?: boolean }>(), {
  isLeader: true,
});
let totalCar = computed(() => {
  if (!cars.value) return '0';
  return (
    cars?.value.eleOffline +
    cars?.value?.eleOnline +
    cars?.value?.oilOffline +
    cars?.value?.oilOnline +
    ''
  );
});

let onlineCar = computed(() => {
  if (!cars.value) return '0';
  return cars?.value?.eleOnline + cars?.value?.oilOnline + '';
});
onMounted(() => {
  onlineCars({ isLeader: props.isLeader }).then((res) => {
    if (res?.code !== CODE) return useToast(res?.msg || '接口异常');
    cars.value = res?.data;
  });
});
</script>
