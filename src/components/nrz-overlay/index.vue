<template>
  <view style="touch-action: none;">
    <view
      v-if="show"
      class="fixed z-50000 center w-full"
      :style="{ zIndex: zIndex + 1 }"
      @tap.stop="() => {}"
    >
      <slot></slot>
    </view>

    <view
      v-if="mask"
      class="nrz-dialog__mask"
      :class="{ 'nrz-mask_hidden': !show }"
      :style="{ backgroundColor: bg, zIndex }"
      @tap="close"
    ></view>
  </view>
</template>

<script setup>
const props = defineProps({
  splitBtns: {
    type: Boolean,
    default: false,
  },
  zIndex: { type: Number, default: 999 },
  textAlign: {
    type: String,
    default: 'center',
  },
  title: {
    type: String,
    default: '',
  },
  content: {
    type: String,
    default: '',
  },
  maskClosable: {
    type: Boolean,
    default: true,
  },
  mask: {
    type: Boolean,
    default: true,
  },
  show: {
    type: Boolean,
    default: false,
  },
  buttons: {
    type: Array,
    default() {
      return [
        {
          text: '取消',
          color: '#101010',
        },
        {
          text: '确定',
          color: '#586c94',
        },
      ];
    },
  },
  radius: {
    type: String,
    default: '12px',
  },
  titleColor: {
    type: String,
    default: '#333',
  },
  contentColor: {
    type: String,
    default: '#999',
  },
  bg: {
    type: String,
    default: 'rgba(0,0,0,0.3)',
  },
});
const emits = defineEmits(['click', 'close', 'update:show', 'cancel', 'ok']);
function close() {
  if (!props.maskClosable) return;
  emits('close', {});
  emits('update:show', false);
}
</script>
