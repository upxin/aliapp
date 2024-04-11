<template>
  <view
    :catch-move="true"
    class="nrz-actionsheet flex flex-col bg-fff nrz-safe"
    :class="{
      'nrz-actionsheet-show': show,
      'nrz-actionsheet-radius': radius,
    }"
    :style="{ zIndex: getZIndex }"
  >
    <view
      v-if="tips"
      class="nrz-actionsheet-tips font-normal flex h-50px items-center justify-between"
      :style="{ fontSize: size + 'rpx', color: color }"
    >
      <span
        class="iconfont icon-close ml-auto text-22px p-10px opacity-0"
      ></span>
      <span class="flex-1 text-center"> {{ tips }}</span>
      <span
        class="iconfont icon-close ml-auto text-22px p-10px text-second font-bold"
        @click="handleClickCancel"
      ></span>
    </view>
    <slot name="top"></slot>

    <view
      :class="[isCancel ? 'nrz-operate-box' : '']"
      class="bg-fff text-center flex-1 overflow-hidden pb-10px"
    >
      <scroll-view :scroll-y="true" :style="{ maxHeight }">
        <block v-for="(item, index) in itemList" :key="index">
          <view
            class="h-40px leading-40px text-16px"
            :class="{ 'pt-20px': !tips && index == 0 }"
            :hover-stay-time="150"
            :data-index="index"
            hover-class="bg-fleet"
            :style="{
              color: item.color || '#2B2B2B',
              display: item.hidden ? 'none' : 'block',
            }"
            @tap="handleClickItem"
            @longpress="handleLong"
          >
            <slot v-if="$slots.item" name="item" :item="item"></slot>
            <template v-else>
              {{ item.text || item.name }}
            </template>
          </view>
        </block>
      </scroll-view>
    </view>

    <slot name="bottom"></slot>

    <view
      v-if="isCancel"
      hover-class="bg-fleet"
      class="nrz-actionsheet-btn"
      :hover-stay-time="150"
      @tap="handleClickCancel"
      >取消</view
    >
  </view>
  <view
    :catch-move="true"
    class="nrz-actionsheet-mask"
    :class="{ 'nrz-mask-show': show }"
    :style="{ background: maskColor, zIndex: zIndex }"
    @tap="handleClickMask"
  ></view>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Item {
  name?: string;
  text?: string;
  color?: string;
  [propKey: string]: any;
}
interface Props {
  maxHeight?: string;
  show?: boolean;
  current?: Item | undefined;
  itemList: Item[];
  //点击遮罩 是否可关闭
  maskClosable?: true;
  //v2.1.0
  maskColor?: string;
  //提示文字
  tips?: string;
  //提示文字颜色
  color?: string;
  //提示文字大小 rpx
  size?: number;
  //是否需要圆角
  radius?: boolean;
  //是否需要取消按钮
  isCancel?: boolean;
  zIndex?: number;
}

const props = withDefaults(defineProps<Props>(), {
  maxHeight: '240px',
  show: false,
  maskClosable: true,
  maskColor: 'rgba(0, 0, 0, 0.4)',
  //提示文字
  tips: '',
  //提示文字颜色
  color: '#101010',
  //提示文字大小 rpx
  size: 36,
  //是否需要圆角
  radius: true,
  //是否需要取消按钮
  isCancel: false,
  zIndex: 1000,
  current: undefined,
});
const emits = defineEmits([
  'click',
  'choose',
  'cancel',
  'update:show',
  'update:current',
  'handleLong',
]);
const getZIndex = computed(() => {
  return Number(props.zIndex) + 2;
});
function handleClickMask() {
  if (!props.maskClosable) return;
  handleClickCancel();
}
function handleClickItem(e) {
  if (!props.show) return;
  const index = Number(e.currentTarget.dataset.index);
  emits('click', {
    index: index,
    ...props.itemList?.[index],
  });
  emits('choose', {
    index: index,
    ...props.itemList?.[index],
  });
  emits('update:current', props.itemList[index]);
  handleClickCancel();
}
function handleClickCancel() {
  emits('cancel');
  emits('update:show', false);
}
function handleLong(e) {
  const index = Number(e.currentTarget.dataset.index);
  emits('handleLong', props.itemList?.[index]);
}
</script>

<style lang="scss">
.nrz-actionsheet {
  width: 100%;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  visibility: hidden;
  transform: translate3d(0, 100%, 0);
  transform-origin: center;
  transition: all 0.25s ease-in-out;
  min-height: 100rpx;
}

.nrz-actionsheet-radius {
  border-top-left-radius: 20rpx;
  border-top-right-radius: 20rpx;
  overflow: hidden;
}

.nrz-actionsheet-show {
  transform: translate3d(0, 0, 0);
  visibility: visible;
}

.nrz-operate-box {
  padding-bottom: 12rpx;
}

.nrz-actionsheet-btn {
  width: 100%;
  height: 100rpx;
  background-color: #fff;
  display: flex;
  align-items: center;
  text-align: center;
  font-size: 28rpx;
  position: relative;
  justify-content: center;
}

.nrz-actionsheet-divider::before {
  content: '';
  width: 100%;
  border-top: 1rpx solid #e7e7e7;
  position: absolute;
  top: 0;
  left: 0;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
}
</style>
