<template>
  <div class="flex items-center my-16px">
    <div class="text-right opacity-48 text-14px w-70px">{{ text }}：</div>
    <span :style="valStyle">{{ nullText(val) }}</span>
    <span class="ml-6px">{{ second }}</span>
    <span
      v-if="showCopy"
      class="text-primary icon iconfont icon-copy ml-8px"
      @click="
        () => {
          copyText(val);
        }
      "
    ></span>
  </div>
</template>
<script lang="ts" setup>
import { copyText, nullText } from '@/utils/index';

interface Props {
  text: string | number;
  val: string | number;
  showCopy?: boolean;
  valStyle?: any;
  second?: string;
}
withDefaults(defineProps<Props>(), {
  text: '',
  val: '',
  showCopy: false,
  valStyle: {},
  second: '',
});
</script>
