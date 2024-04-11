<template>
  <view class="tui-landscape__box" :catch-move="true">
    <view v-if="show" class="tui-landscape__inner" :style="{ zIndex: zIndex }">
      <view class="relative" :class="{ tada: show }">
        <slot></slot>
        <view
          v-if="closeIcon"
          class="tui-icon__close"
          :style="{
            top: position != 1 ? iconTop : 'auto',
            bottom: position == 1 ? iconBottom : 'auto',
            left: position == 3 ? iconLeft : position == 1 ? '50%' : 'auto',
            right: position == 2 ? iconRight : 'auto',
          }"
          :class="{ 'tui-icon__bottom': position == 1 }"
          @tap.stop="close"
        >
          <icon type="clear" :color="iconColor" :size="iconSize"></icon>
        </view>
      </view>
    </view>
    <view
      v-if="mask"
      :style="{ backgroundColor: maskBgColor, zIndex: maskZIndex }"
      class="tui-landscape__mask"
      :class="{ 'tui-mask_hidden': !show }"
      @tap.stop="close(1)"
    ></view>
  </view>
</template>

<script>
export default {
  name: 'TuiLandscape',
  props: {
    //是否显示
    show: {
      type: Boolean,
      default: false,
    },
    //显示内容区z-index
    zIndex: {
      type: Number,
      default: 1001,
    },
    //是否需要关闭图标
    closeIcon: {
      type: Boolean,
      default: true,
    },
    //关闭图标颜色
    iconColor: {
      type: String,
      default: '#fff',
    },
    //关闭图标大小 px
    iconSize: {
      type: Number,
      default: 25,
    },
    //icon位置：1-底部 2-右上角 3-左上角
    position: {
      type: [Number, String],
      default: 1,
    },
    //关闭图标top值，position为2或3的时候生效
    iconTop: {
      type: String,
      default: '-40px',
    },
    //关闭图标bottom值，position为1的时候生效
    iconBottom: {
      type: String,
      default: '-40px',
    },
    //关闭图标left值，position为3的时候生效
    iconLeft: {
      type: String,
      default: '0',
    },
    //关闭图标right值，position为2的时候生效
    iconRight: {
      type: String,
      default: '0',
    },
    //点击遮罩是否可以关闭
    maskClosable: {
      type: Boolean,
      default: true,
    },
    //是否需要遮罩
    mask: {
      type: Boolean,
      default: true,
    },
    //遮罩背景色
    maskBgColor: {
      type: String,
      default: 'rgba(0,0,0,.6)',
    },
    //遮罩z-index值
    maskZIndex: {
      type: Number,
      default: 1000,
    },
    //自定义参数
    params: {
      type: [Number, String],
      default: 0,
    },
  },
  emits: ['close'],
  methods: {
    close(isMask) {
      if (isMask == 1 && !this.maskClosable) return;
      this.$emit('close', {
        params: this.params,
      });
    },
  },
};
</script>

<style>
.tui-landscape__box {
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

.tui-landscape__inner {
  max-width: 100%;
  position: fixed;
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.tui-icon__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: absolute;
  z-index: 10;
}

.tui-icon__bottom {
  left: 50% !important;
  transform: translateX(-50%);
}

.tui-landscape__mask {
  position: fixed;
  z-index: 1000;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  opacity: 1;
  transform: scale3d(1, 1, 1);
  transition: all 0.2s ease-in;
}

.tui-mask_hidden {
  opacity: 0 !important;
  transform: scale3d(1, 1, 0) !important;
}

@keyframes tada {
  from {
    transform: scale3d(1, 1, 1);
  }

  10%,
  20% {
    transform: scale3d(0.9, 0.9, 0.9) rotate3d(0, 0, 1, -3deg);
  }

  30%,
  50%,
  70%,
  90% {
    transform: scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg);
  }

  40%,
  60%,
  80% {
    transform: scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, -3deg);
  }

  to {
    transform: scale3d(1, 1, 1);
  }
}

.tada {
  animation-name: tada;
  animation-delay: 0.3s;
  animation-duration: 1.2s;
}
</style>
