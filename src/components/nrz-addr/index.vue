<template>
  <NrzPicker
    v-model:show="visible"
    :pickerData="countryData"
    :layer="layer"
    zIndex="999999"
    v-bind="$attrs"
    :showCurrent="showCurrent"
    @change="change"
  ></NrzPicker>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue';
import { countryData } from '@/common/countryData';
import NrzPicker from '../nrz-picker/index.vue';

interface Props {
  show: boolean;
  value?: string;
  layer?: number;
  choosedItem?: any;
  showCurrent: boolean;
}
let emit = defineEmits([
  'update:show',
  'update:value',
  'update:choosedItem',
  'change',
]);
let props = withDefaults(defineProps<Props>(), {
  show: false,
  value: '',
  layer: 3,
  choosedItem: {},
  showCurrent: false,
});

const visible = computed({
  get() {
    return props.show;
  },
  set(val) {
    emit('update:show', val);
  },
});

let addr = ref();

function change(e: any) {
  addr.value = e.text.join('');
  emit('update:value', addr.value);
  emit('update:choosedItem', e);
  emit('change', e);
}
</script>
