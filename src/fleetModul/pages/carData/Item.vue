<template>
  <div
    class="flex flex-col items-center justify-center flex-1 py-22px"
    :style="{ 'background-color': bg }"
  >
    <div class="text-24px mb-6px" :style="{ color: valColor }">
      {{ val || '--' }}
    </div>
    <div class="text-10px" :style="{ color: textColor }">{{ text }}</div>
  </div>
</template>
<script lang="ts" setup>
interface Props {
  val: any;
  text: any;
  bg: any;
  textColor: any;
  valColor: any;
}
withDefaults(defineProps<Props>(), {});
</script>
