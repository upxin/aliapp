<template>
  <div class="px-16px bg-fff py-14px" @click="naviTo">
    <div class="flex items-center justify-end">
      <span class="mr-auto nrz-thin">{{ title }}</span>
      <span class="opacity-50 mr-4px">{{ text }}</span>
      <span class="opacity-50">{{
        val === 'Invalid Date' ? '请选择时间' : val
      }}</span>
      <span class="opacity-50 iconfont icon-arrow-right-bold"></span>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { nrNavigateTo } from '@/utils';
import { watch } from 'vue';
interface Props {
  text?: string;
  route?: string;
  title: string;
  val?: string;
}
let props = withDefaults(defineProps<Props>(), {
  text: '',
  route: '',
  val: '',
  title: '',
});

watch(
  () => props.val,
  (v) => {
    console.log('pppp====aa=', v);
  }
);

const naviTo = () => {
  nrNavigateTo(props.route);
};
</script>
