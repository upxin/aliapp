<template>
  <div
    class="box-border flex items-center nr-border h-36px w-full px-8px"
    :class="{ 'rounded-full': true }"
  >
    <span
      class="mr-8px opacity-60 iconfont icon-search text-18px text-normal"
    ></span>
    <input
      :value="modelValue"
      type="text"
      class="flex-1"
      v-bind="$attrs"
      @change="valChange"
    />
    <span
      v-if="modelValue"
      class="p-8px opacity-60 iconfont icon-close1 text-18px text-normal"
      @click="clearVal"
    ></span>
  </div>
</template>
<script lang="ts" setup>
interface Props {
  modelValue?: string;
}
withDefaults(defineProps<Props>(), {
  modelValue: '',
});

const emits = defineEmits(['update:modelValue', 'change']);

function valChange(e) {
  emits('update:modelValue', e.detail.value);
  emits('change', e.detail.value);
}
function clearVal() {
  emits('update:modelValue', '');
}
</script>
<style>
input {
  color: rgb(16, 16, 16, 0.8);
}
</style>
