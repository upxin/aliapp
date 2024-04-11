<template>
  <div
    v-for="item in normalList"
    :key="item?.value"
    class="flex bg-hex-f9f9f9 p-10px nrz-thin text-12px mb-2px ani"
  >
    <div class="w-60px">{{ item?.name }}</div>
    <div class="flex-1">{{ item?.value }}</div>
  </div>
  <Transition name="nz-slide">
    <section
      v-show="showMore"
      style="animation-duration: 0.3s"
      class="overflow-hidden"
    >
      <div
        v-for="item in showList"
        :key="item?.value"
        class="flex bg-hex-f9f9f9 p-10px nrz-thin text-12px mb-2px ani"
      >
        <div class="w-60px">{{ item?.name }}</div>
        <div class="flex-1">{{ item?.value }}</div>
      </div>
    </section>
  </Transition>
  <template v-if="list?.length > 3">
    <div
      v-if="!showMore"
      class="flex items-center justify-center mt-10px"
      @click="
        () => {
          showMore = true;
        }
      "
    >
      <span>展开</span>
      <span class="iconfont icon-zhankai"></span>
    </div>
    <div
      v-else
      class="flex items-center justify-center mt-10px"
      @click="
        () => {
          showMore = false;
        }
      "
    >
      <span>收起</span>
      <span class="iconfont icon-shouqi"></span>
    </div>
  </template>
</template>
<script lang="ts" setup>
import { computed, ref, reactive } from 'vue';

interface Item {
  name?: string;
  value?: string;
}

type Props = {
  list: Item[];
};
let props = withDefaults(defineProps<Props>(), {
  list: () => [],
});
let showMore = ref(false);
let showList = computed(() => {
  return props.list.slice(3);
});
let normalList = computed(() => {
  return props.list.slice(0, 3);
});
</script>
<style>
.nz-slide-enter-from {
  max-height: 10px;
}
.nz-slide-enter-active {
  transition: max-height 0.3s;
}
.nz-slide-enter-to {
  max-height: 400px;
}

.nz-slide-leave-from {
  max-height: 400px;
}
.nz-slide-leave-active {
  transition: max-height 0.3s;
}
.nz-slide-leave-to {
  max-height: 10px;
}
</style>
