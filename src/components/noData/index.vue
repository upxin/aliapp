<template>
  <section
    class="box-border top-0 left-0 flex items-center justify-center w-full overflow-hidden min-h-200px bg-fff"
  >
    <div class="box-border flex flex-col items-center w-full">
      <image :src="LOGO_IMG_BOTTOM" class="w-100px h-80px" mode="aspectFit" />
      <div class="py-10px text-16px text-second">暂无数据</div>
    </div>
  </section>
</template>
<script setup lang="ts">
import { LOGO_IMG_BOTTOM } from '@/utils/index';
</script>
