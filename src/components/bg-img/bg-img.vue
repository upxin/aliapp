<template>
  <div :style="{ backgroundImage: `url(${newUrl})` }" class="bg-no-repeat">
    <slot></slot>
  </div>
</template>
<script lang="ts" setup>
import { watch, ref } from 'vue';
import DEFAULT_IMG from '@/assets/imgs/alt.jpeg';

interface Props {
  url?: string;
}
const newUrl = ref(DEFAULT_IMG);
const props = withDefaults(defineProps<Props>(), {
  url: '',
});
watch(
  () => props.url,
  (v) => {
    if (v) {
      newUrl.value = v;
    }
  },
  { immediate: true }
);
</script>
