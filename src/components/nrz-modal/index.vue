<template>
  <view>
    <view
      v-if="show"
      class="nrz-dialog"
      :style="{ background: backgroundColor, borderRadius: radius }"
      @tap.stop="stopEvent"
    >
      <view class="nrz-dialog__hd">
        <view class="nrz-dialog__title" :style="{ color: titleColor }">
          {{ title }}
          <slot name="title"></slot>
        </view>
      </view>
      <view class="nrz-dialog__bd" :style="{ color: contentColor, textAlign }">
        {{ content }}
        <slot name="content"></slot>
      </view>
      <template v-if="$slots.footer">
        <slot name="footer"></slot>
      </template>
      <template v-else-if="splitBtns">
        <div class="flex justify-around w-full pb-20px px-10px box-border">
          <button
            class="w-5_12 bg-g rounded-none text-fff py-10px"
            :data-index="0"
            @click="buttonTap"
          >
            取消
          </button>
          <button
            :data-index="1"
            class="w-5_12 bg-primary rounded-none text-fff py-10px"
            @click="buttonTap"
          >
            确定
          </button>
        </div>
      </template>
      <template v-else>
        <view class="nrz-dialog__ft">
          <view
            v-for="(item, index) in buttons"
            :key="index"
            :style="{ color: item.color || '#333' }"
            class="nrz-dialog__btn"
            :data-index="index"
            @tap="buttonTap"
          >
            {{ item.text }}
          </view>
        </view>
      </template>
    </view>
    <view
      v-if="mask"
      class="nrz-dialog__mask"
      :class="{ 'nrz-mask_hidden': !show }"
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
  backgroundColor: {
    type: String,
    default: '#fff',
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
});
const emits = defineEmits(['click', 'close', 'update:show', 'cancel', 'ok']);
function buttonTap(e) {
  const { index } = e.currentTarget.dataset;
  emits('click', {
    index,
    item: props.buttons[index],
  });
  if (index == 0) {
    emits('update:show', false);
    emits('cancel');
  } else {
    emits('ok');
  }
}
function close() {
  if (!props.maskClosable) return;
  emits('close', {});
  emits('update:show', false);
}
function stopEvent() {}
</script>
