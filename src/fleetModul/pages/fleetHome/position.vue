<template>
  <span>
    {{ addr }}
  </span>
</template>
<script setup lang="ts">
import { getCityInfo } from '@/api';
import { watch, ref } from 'vue';
let props = withDefaults(
  defineProps<{
    longitude: string | number | null;
    latitude: string | number | null;
  }>(),
  {
    longitude: '',
    latitude: '',
  }
);
let addr = ref('');
watch(
  () => props,
  (v) => {
    if (v) {
      getCityInfo({
        latitude: v?.latitude,
        longitude: v?.longitude,
      }).then((res) => {
        if (res.status != '1') return;
        let address = res.regeocode.formatted_address;
        addr.value = typeof address === 'string' ? address : '--';
      });
    }
  },
  { immediate: true, deep: true }
);
</script>
