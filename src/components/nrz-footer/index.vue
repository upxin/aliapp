<template>
  <NrImg
    :src="LOGO_IMG_BOTTOM"
    :width="width"
    :height="height"
    class="m-auto py-30px"
    :mode="mode"
    backgroundColor="transparent"
  ></NrImg>
</template>
<script setup>
import { LOGO_IMG_BOTTOM } from '@/utils/index';
import NrImg from '@/components/nrz-img/index.vue';

defineProps({
  width: {
    type: Number,
    default: 100,
  },
  height: {
    type: Number,
    default: 32,
  },
  mode: {
    type: String,
    default: 'widthFix',
  },
});
</script>
