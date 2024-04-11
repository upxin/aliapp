<template>
  <aside class="flex items-center rounded-full bg-main h-28px">
    <span
      class="ml-14px mr-8px opacity-60 iconfont icon-search text-16px text-normal"
    ></span>
    <input
      :value="modelValue"
      type="text"
      class="flex-1 text-12px min-h-26px h-26px leading-26px"
      :placeholder="placeholder"
      :disabled="disabled"
      @input="onInput"
    />
    <div class="flex items-center justify-center w-28px h-28px" @click="clear">
      <span v-show="modelValue" class="iconfont icon-closefill"></span>
    </div>
  </aside>
</template>
<script lang="ts" setup>
interface Props {
  modelValue: string;
  placeholder?: string;
  disabled?: boolean;
}

const emits = defineEmits(['update:modelValue', 'input']);
withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: '请输入搜索内容',
  disabled: false,
});

function onInput(e) {
  console.log(e);
  emits('update:modelValue', e.target.value);
  emits('input', e.target.value);
}
function clear() {
  console.log(12);
  emits('update:modelValue', '');
}
</script>
