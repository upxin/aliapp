<template>
  <div class="flex my-15px text-12px">
    <span class="opacity-70 mr-28px">{{ title }}</span>
    <span
      class="underline decoration-solid"
      :class="{ 'text-blue-500': isPhone, 'underline-blue-400': isPhone }"
      @click="callPhone"
    >
      {{ text }}
    </span>
  </div>
</template>
<script lang="ts" setup>
import { makePhoneCall } from '@/utils/index';

interface Props {
  title: string;
  text: string | number | null;
  isPhone?: boolean;
}
let props = withDefaults(defineProps<Props>(), {
  title: '',
  text: '',
  isPhone: false,
});

function callPhone() {
  if (props.isPhone) {
    makePhoneCall(props.text as string);
  }
}
</script>
