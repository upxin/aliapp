<template>
  <NrzModal
    :show="true"
    title="添加车辆"
    :buttons="[
      {
        text: '成为司机',
        color: '#586c94',
      },
      {
        text: '成为车主',
        color: '#586c94',
      },
    ]"
    @cancel="addDriver"
    @ok="addOwner"
  >
    <template #content> 点击成为前晨车主或前晨车辆司机 </template>
  </NrzModal>
</template>
<script setup lang="ts">
import { nrNavigateTo, Routes } from '@/utils/index';
import NrzModal from '@/components/nrz-modal/index.vue';
const addDriver = () => {
  nrNavigateTo(Routes.addDriver);
};
const addOwner = () => {
  nrNavigateTo(Routes.ownerAddCar);
};
</script>
