<template>
  <div
    class="flex items-center border-solid border-1px min-w-60px"
    :style="{ borderColor: color }"
    :class="{
      'text-10px': size === 'mini',
    }"
  >
    <span
      class="text-center text-fff py-2px"
      :style="{ backgroundColor: color }"
      :class="{
        'w-16px': size === 'mini',
        'w-24px': size === '',
      }"
    >
      {{ short }}
    </span>
    <span class="flex-1 text-center py-2px" :style="{ color }">
      {{ info }}{{ infoValue }}
    </span>
  </div>
</template>
<script lang="ts" setup>
interface Props {
  color?: string;
  short: string;
  info?: string;
  infoValue: string;
  size?: string;
}

withDefaults(defineProps<Props>(), {
  color: '#f18a30',
  info: '闲',
  size: '',
});
</script>
