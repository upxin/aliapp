<template>
  <section class="box-border flex items-center w-full h-50px bg-hex-fff">
    <div class="flex items-center min-w-80px" @click="chooseCity">
      <span class="icon-weizhi iconfont text-14px text-normal"></span>
      <span class="text-black text-12px mx-4px text-opacity-65">{{
        city
      }}</span>
      <span class="icon-sanjiao iconfont text-14px text-normal"></span>
    </div>
    <div
      class="box-border flex items-center flex-1 ml-4px pl-10px pr-4px nr-border h-36px"
    >
      <span
        class="mr-8px opacity-60 iconfont icon-search text-16px text-normal"
      ></span>
      <input
        v-model="childVal"
        type="text"
        v-bind="$attrs"
        class="flex-1"
        @change="valChange"
      />
    </div>
  </section>
</template>
<script lang="ts" setup>
import { ref } from 'vue';

interface Props {
  modelValue?: string;
  city: string;
}
withDefaults(defineProps<Props>(), {
  modelValue: '',
  city: '中国',
});

const childVal = ref('');

const emits = defineEmits(['update:modelValue', 'chooseCity']);
function valChange(e) {
  emits('update:modelValue', e.detail.value);
}
function chooseCity() {
  // nrNavigateTo('choose-city');
  emits('chooseCity');
}
</script>
<style>
input {
  color: rgb(16, 16, 16, 0.8);
}
</style>
