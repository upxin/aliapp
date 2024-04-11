<template>
  <div class="flex items-center justify-between px-16px bg-fff py-14px">
    <span
      v-if="imgUrl"
      class="bg-center bg-cover mr-6px w-22px h-22px"
      :style="{ backgroundImage: `url(${imgUrl})` }"
    ></span>
    <span v-else class="iconfont mr-6px" :class="[iconName]"></span>
    <div class="flex items-center justify-between flex-1">
      <span>{{ text }}</span>
      <span class="iconfont icon-arrow-right-bold"></span>
    </div>
  </div>
</template>
<script lang="ts" setup>
interface Props {
  text?: string;
  imgUrl?: string;
  iconName?: string;
  iconSize?: string | number;
  icon?: string;
}
withDefaults(defineProps<Props>(), {
  text: '',
  imgUrl: '',
  iconName: '',
  icon: '',
  iconSize: 14,
});
</script>
