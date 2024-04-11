<template>
  <view
    class="flex flex-1 justify-between items-center"
    @click.stop="handleIpt"
  >
    <slot name="left"></slot>
    <input
      :value="value"
      :type="type"
      :placeholder="placeholder"
      class="flex-1 text-left nrz-light"
      :class="inpClass"
      :placeholderStyle="`color:rgba(0, 0, 0, 0.36);${placeholderStyle}`"
      :disabled="readonly || disabled"
      :readonly="readonly"
      @change="change"
    />
    <view
      v-if="value && clearable"
      class="iconfont icon-close1 text-g text-22px"
      @click.stop="clear"
    ></view>
  </view>
</template>
<script lang="ts" setup>
interface Props {
  placeholder?: string;
  value: string;
  type?: string;
  disabled?: boolean;
  placeholderStyle?: string;
  inpClass?: Record<string, any>;
  readonly?: boolean;
  clearable?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  value: '',
  placeholder: '',
  type: 'text',
  disabled: false,
  placeholderStyle: '',
  readonly: false,
  clearable: false,
  inpClass: () => ({}),
});

const emit = defineEmits(['update:value', 'change', 'click']);
function change(v) {
  emit('update:value', v.detail.value);
}
function clear() {
  emit('update:value', '');
}

function handleIpt() {
  if (props.disabled) return;
  emit('click');
}
</script>
