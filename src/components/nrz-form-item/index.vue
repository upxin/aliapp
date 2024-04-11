<template>
  <view
    class="tui-form__item-wrap"
    :class="{ 'tui-form__highlight': highlight }"
    :style="{
      background: getBgColor,
      marginTop: marginTop + 'rpx',
      marginBottom: marginBottom + 'rpx',
      borderRadius: getRadius,
    }"
    @tap="handleClick"
  >
    <view
      v-if="asterisk"
      class="tui-form__asterisk"
      :style="{ color: getAsteriskColor }"
      >*</view
    >
    <view v-if="label" :style="getLabelStyl">{{ label }}</view>
    <view class="tui-form__item-content">
      <slot></slot>
      <view
        v-show="errMsg"
        flex
        item-center
        class="absolute top-full w-full py-8rpx text-red-500 text-24rpx z-10"
      >
        {{ errMsg }}
      </view>
    </view>
    <slot name="right"></slot>
    <div
      v-if="bottomBorder"
      class="w-full absolute bottom-0 left-0 box-border"
      :style="{
        paddingLeft: `${fullBorder ? '' : labelWidth + labelRight + 'rpx'}`,
      }"
    >
      <view
        :style="{
          background: getBorderColor,
        }"
        class="tui-form__item-bottom"
      ></view>
    </div>

    <view
      v-if="arrow"
      class="tui-form__item-arrow"
      :style="{ 'border-color': getArrowColor }"
    >
    </view>
  </view>
</template>

<script>
export default {
  name: 'TuiFormItem',
  inject: ['err'],
  props: {
    fullBorder: {
      type: Boolean,
      default: true,
    },

    name: {
      type: String,
      default: '',
    },
    padding: {
      type: String,
      default: '',
    },
    marginTop: {
      type: [Number, String],
      default: 0,
    },
    marginBottom: {
      type: [Number, String],
      default: 0,
    },
    label: {
      type: String,
      default: '',
    },
    labelSize: {
      type: [Number, String],
      default: 0,
    },
    labelColor: {
      type: String,
      default: '',
    },
    //2.3.0+
    labelFontWeight: {
      type: [Number, String],
      default: 0,
    },
    labelWidth: {
      type: [Number, String],
      default: 140,
    },
    labelRight: {
      type: [Number, String],
      default: 16,
    },
    asterisk: {
      type: Boolean,
      default: false,
    },
    asteriskColor: {
      type: String,
      default: '',
    },
    background: {
      type: String,
      default: '',
    },
    highlight: {
      type: Boolean,
      default: false,
    },
    arrow: {
      type: Boolean,
      default: false,
    },
    arrowColor: {
      type: String,
      default: '',
    },
    bottomBorder: {
      type: Boolean,
      default: true,
    },
    borderColor: {
      type: String,
      default: '',
    },
    left: {
      type: [Number, String],
      default: 30,
    },
    right: {
      type: [Number, String],
      default: 30,
    },
    radius: {
      type: String,
      default: '',
    },
    index: {
      type: [Number, String],
      default: 0,
    },
  },
  emits: ['click'],
  computed: {
    errMsg() {
      if (this.err()?.key != this.name) return '';
      return this?.err()?.msg;
    },
    getPadding() {
      return this.padding || '26rpx 30rpx';
    },
    getBgColor() {
      return this.background || '#fff';
    },
    getRadius() {
      return this.radius || '0';
    },
    getAsteriskColor() {
      return this.asteriskColor || '#EB0909';
    },
    getLabelStyl() {
      const labelSize = this.labelSize || 28;
      const labelColor = this.labelColor || '#333';
      const weight = this.labelFontWeight || 400;
      return `width:${this.labelWidth}rpx;font-size:${labelSize}rpx;color:${labelColor};padding-right:${this.labelRight}rpx;font-weight:${weight};`;
    },
    getArrowColor() {
      return this.arrowColor || '#c0c0c0';
    },
    getBorderColor() {
      return this.borderColor || '#eaeef1';
    },
  },
  watch: {
    errMsg(v) {
      console.log(12313, v);
    },
  },
  methods: {
    handleClick() {
      this.$emit('click', {
        index: this.index,
      });
    },
  },
};
</script>

<style>
.tui-form__item-wrap {
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  flex: 1;
  align-items: center;
  position: relative;
  padding: 12px 0;
}

.tui-form__highlight:active {
  background-color: #f1f1f1 !important;
}

.tui-form__asterisk {
  position: absolute;
  left: 12rpx;
  height: 30rpx;
  top: 50%;
  transform: translateY(-50%);
  line-height: 1.15;
}

.tui-form__item-label {
  padding-right: 12rpx;
  display: inline-block;
  flex-shrink: 0;
}

.tui-form__item-content {
  position: relative;
  flex: 1;
}

.tui-form__item-bottom {
  height: 1px;
  -webkit-transform: scaleY(0.5) translateZ(0);
  transform: scaleY(0.5) translateZ(0);
  transform-origin: 0 100%;
  width: 100%;
}

.tui-form__item-arrow {
  height: 40rpx;
  width: 40rpx;
  border-width: 3px 3px 0 0;
  border-style: solid;
  transform: rotate(45deg) scale(0.5);
  border-radius: 4rpx;
  flex-shrink: 0;
  margin-left: auto;
  box-sizing: border-box;
  transform-origin: center center;
  margin-right: -5.8579rpx;
}
</style>
