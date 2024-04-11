<template>
  <custom-bar class="fixed" :show-icon="true" :border="false"> </custom-bar>
  <OwnerCar></OwnerCar>
</template>
<script lang="ts">
import { onShareAppMessage, onShareTimeline } from '@/utils/index';
export default {
  onShareAppMessage,
  onShareTimeline,
};
</script>
<script lang="ts" setup>
import CustomBar from '@/components/customHeader/index.vue';
import OwnerCar from './detail.vue';

definePageConfig({
  transparentTitle: 'always',
  titlePenetrate: 'YES',
  defaultTitle: '',
});
</script>
