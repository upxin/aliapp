<template>
  <div
    v-for="item in list"
    :key="item.value"
    class="flex justify-between px-20px pt-16px text-14px"
    @click="handleItem(item)"
  >
    <span :class="{ 'text-danger': item.value == value }">
      {{ item.text }}
    </span>
    <span
      class="iconfont icon-a-gou2x"
      :class="{
        'text-danger': item.value == value,
        'text-transparent': item.value != value,
      }"
    ></span>
  </div>
</template>
<script setup lang="ts">
interface Item {
  value: string;
  text: string;
  label?: string;
}
interface Props {
  value: number | string;
  list: Item[];
  text?: string;
}

withDefaults(defineProps<Props>(), {
  text: '',
});

const emits = defineEmits(['update:value', 'update:text', 'changeItem']);

function handleItem(item) {
  emits('update:value', item.value);
  emits('update:text', item.text);
  emits('changeItem', item);
}
</script>
