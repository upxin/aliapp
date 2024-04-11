<template>
  <button
    class="flex items-center justify-center box-border text-center"
    :class="{
      'rounded-full': round,
      'rounded-none': !round,

      'bg-primary': !plain,
      'bg-fff': plain,

      'text-fff': !plain,
      'text-normal': plain,
      'nr-border': plain,

      'opacity-60': disabled,
    }"
    @click="handleClick"
  >
    <slot></slot>
  </button>
</template>
<script setup lang="ts">
interface Props {
  plain?: boolean;
  round?: boolean;
  disabled?: boolean;
  // className: Record<string, boolean>;
}
const props = withDefaults(defineProps<Props>(), {
  plain: false,
  round: false,
  disabled: false,
  // className: () => ({}),
});
const emits = defineEmits(['click']);

function handleClick(e) {
  if (props.disabled) return;
  emits('click', e);
}
</script>
