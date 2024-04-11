<template>
  <aside class="table w-full border-collapse text-12px nrz-thin mt-10px">
    <div class="table-row">
      <div class="table-cell p-10px nr-border--dashed bg-hex-f9f9f9">
        行驶里程(km)
      </div>
      <div class="table-cell p-10px nr-border--dashed">
        {{ nullText(data?.driveMiles) }}
      </div>
      <div class="table-cell p-10px nr-border--dashed bg-hex-f9f9f9">
        {{ data?.vehicleType == '2' ? '耗油量(km)' : '耗电量(kW·h)' }}
      </div>
      <div class="table-cell p-10px nr-border--dashed">
        {{
          data?.vehicleType == '2'
            ? nullText(data?.fuelConsumption)
            : nullText(data?.electricityConsumption)
        }}
      </div>
    </div>

    <div class="table-row">
      <div class="table-cell p-10px nr-border--dashed bg-hex-f9f9f9">
        行驶时长(h)
      </div>
      <div class="table-cell p-10px nr-border--dashed">
        {{ nullText(data?.driverHours) }}
      </div>
      <div class="table-cell p-10px nr-border--dashed bg-hex-f9f9f9">
        {{
          data?.vehicleType == '2'
            ? '平均耗油量(L/100km)'
            : '平均能耗量(kW·h/100km)'
        }}
      </div>
      <div class="table-cell p-10px nr-border--dashed">
        {{
          data?.vehicleType == '2'
            ? nullText(data?.averageConsumption)
            : nullText(data?.eleAvgConsumption)
        }}
      </div>
    </div>

    <div class="table-row">
      <div class="table-cell p-10px nr-border--dashed bg-hex-f9f9f9">
        平均速度(km/h)
      </div>
      <div class="table-cell p-10px nr-border--dashed">
        {{ nullText(data?.driverHours) }}
      </div>
      <div class="table-cell p-10px nr-border--dashed bg-hex-f9f9f9">
        {{ data?.vehicleType == '2' ? '加油量(L)' : '充电量(kW·h)' }}
      </div>
      <div class="table-cell p-10px nr-border--dashed">
        {{
          data?.vehicleType == '2'
            ? nullText(data?.addOilVolume)
            : nullText(data?.chargingDegrees)
        }}
      </div>
    </div>

    <template v-if="showMore">
      <div class="table-row">
        <div class="table-cell p-10px nr-border--dashed bg-hex-f9f9f9">
          百公里刹车(次)
        </div>
        <div class="table-cell p-10px nr-border--dashed">
          {{ nullText(data?.hundredBrake) }}
        </div>
        <div class="table-cell p-10px nr-border--dashed bg-hex-f9f9f9">
          {{ data?.vehicleType == '2' ? '加油次数' : '充电次数' }}
        </div>
        <div class="table-cell p-10px nr-border--dashed">
          {{
            data?.vehicleType == '2'
              ? nullText(data?.addOilTimes)
              : nullText(data?.chargeTimes)
          }}
        </div>
      </div>

      <div class="table-row">
        <div class="table-cell p-10px nr-border--dashed bg-hex-f9f9f9">
          百公里加减速(次)
        </div>
        <div class="table-cell p-10px nr-border--dashed">
          {{ nullText(data?.hundredDeceleration) }}
        </div>
        <div class="table-cell p-10px nr-border--dashed bg-hex-f9f9f9">
          历史能量回收{{ data?.vehicleType == '2' ? '(L)' : '(k.W)' }}
        </div>
        <div class="table-cell p-10px nr-border--dashed">
          {{ nullText(data?.hisRecoverEnergy) }}
        </div>
      </div>
      <div class="table-row">
        <div class="table-cell p-10px nr-border--dashed bg-hex-f9f9f9">
          历史百公里刹车(次)
        </div>
        <div class="table-cell p-10px nr-border--dashed">
          {{ nullText(data?.hisHundredBrake) }}
        </div>
        <div class="table-cell p-10px nr-border--dashed bg-hex-f9f9f9">
          {{
            data?.vehicleType == '2'
              ? '历史平均油量(L/100km)'
              : '历史平均能耗(kW·h/100km)'
          }}
        </div>
        <div class="table-cell p-10px nr-border--dashed">
          {{
            data?.vehicleType == '2'
              ? nullText(data?.historyAvgConsumption)
              : nullText(data?.hisAvgEnergyConsumption)
          }}
        </div>
      </div>

      <div class="table-row">
        <div class="table-cell p-10px nr-border--dashed bg-hex-f9f9f9">
          历史百公里加减速(次)
        </div>
        <div class="table-cell p-10px nr-border--dashed">
          {{ nullText(data?.hisHundredDeceleration) }}
        </div>
        <div class="table-cell p-10px nr-border--dashed bg-hex-f9f9f9">
          {{
            data?.vehicleType == '2' ? '历史总耗油量(L)' : '历史总能耗(kW·h)'
          }}
        </div>
        <div class="table-cell p-10px nr-border--dashed">
          {{
            data?.vehicleType == '2'
              ? nullText(data?.hisTotalOilConsumption)
              : nullText(data?.hisEnergyConsumption)
          }}
        </div>
      </div>

      <div class="table-row">
        <div class="table-cell p-10px nr-border--dashed bg-hex-f9f9f9">
          历史总驾驶时长(h)
        </div>
        <div class="table-cell p-10px nr-border--dashed">
          {{ nullText(data?.hisDrivingTime) }}
        </div>
        <div class="table-cell p-10px nr-border--dashed bg-hex-f9f9f9">
          {{ data?.vehicleType == '2' ? '历史总加油次数' : '历史总充电次数' }}
        </div>
        <div class="table-cell p-10px nr-border--dashed">
          {{
            data?.vehicleType == '2'
              ? nullText(data?.hisAddOilTimes)
              : nullText(data?.hisChargeTimes)
          }}
        </div>
      </div>
    </template>
  </aside>
  <template v-if="!showMore">
    <div class="text-center mt-10px" @click="showMore = true">点击查看更多</div>
    <div
      class="flex items-center justify-center mt-4px"
      @click="showMore = true"
    >
      <span class="iconfont icon-zhankai"></span>
    </div>
  </template>
</template>
<script setup lang="ts">
import { nullText } from '@/utils';
import { ref } from 'vue';
let showMore = ref(false);
withDefaults(defineProps<{ data: any }>(), {
  data: {},
});
</script>
