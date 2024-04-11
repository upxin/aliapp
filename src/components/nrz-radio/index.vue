<template>
  <view class="flex text-normal mr-4px items-center">
    <view
      class="tui-checkbox__input"
      :class="{ 'tui-checkbox__disabled': disabled }"
      :style="{
        backgroundColor: getBackgroundStyle(val, isCheckMark),
        border: getBorderStyle(val, isCheckMark),
        transform: `scale(${scaleRatio})`,
      }"
      @tap.stop="radioChange"
    >
      <view
        v-if="val"
        class="iconfont icon-check text-fff text-18px"
        :style="{
          borderBottomColor: checkMarkColor,
          borderRightColor: checkMarkColor,
        }"
      ></view>
      <view
        v-if="disabled"
        class="icon-jinzhide iconfont text-fleet text-20px"
      ></view>
      <radio
        class="tui-radio__hidden"
        style="position: absolute; opacity: 0"
        hidden
        :color="getColor"
        :disabled="disabled"
        :value="value"
        :checked="val"
      ></radio>
    </view>
    <view class="px-4px" :class="{ 'tui-checkbox__disabled': disabled }">
      <slot></slot>
    </view>
  </view>
</template>

<script>
export default {
  name: 'TuiRadio',
  props: {
    value: {
      type: String,
      default: '',
    },
    checked: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    //radio选中背景颜色
    color: {
      type: String,
      default: '',
    },
    //radio未选中时边框颜色
    borderColor: {
      type: String,
      default: '#ccc',
    },
    //是否只展示对号，无边框背景
    isCheckMark: {
      type: Boolean,
      default: false,
    },
    //对号颜色
    checkMarkColor: {
      type: String,
      default: '#fff',
    },
    scaleRatio: {
      type: [Number, String],
      default: 1,
    },
  },
  emits: ['change'],
  behaviors: ['uni://form-field'],
  options: {
    virtualHost: true,
  },
  data() {
    return {
      val: false,
    };
  },
  computed: {
    getColor() {
      return this.color || '#11264d';
    },
  },
  watch: {
    checked(newVal) {
      this.val = newVal;
    },
    val(newVal) {
      console.log(newVal, this.group);
      if (newVal && this.group) {
        this.group.changeValue(this.value, this);
      }
    },
  },
  created() {
    this.val = this.checked;
    this.group = this.getParent();
    if (this.group) {
      this.group.childrens.push(this);
      if (this.group.value) {
        this.val = this.value === this.group.value;
      }
      if (this.group.modelValue) {
        this.val = this.value === this.group.modelValue;
      }
    }
  },
  methods: {
    getBackgroundStyle(val, isCheckMark) {
      let color = val ? this.getColor : '#fff';
      if (isCheckMark) {
        color = 'transparent';
      }
      return color;
    },
    getBorderStyle(val, isCheckMark) {
      let color = val ? this.getColor : this.borderColor;
      if (isCheckMark) {
        color = 'transparent';
      }
      return `1px solid ${color}`;
    },
    radioChange(e) {
      if (this.disabled || this.val) return;
      this.val = true;
      this.$emit('change', {
        checked: this.val,
        value: this.value,
      });
    },
    getParent(name = 'TuiRadioGroup') {
      let parent = this.$parent;
      let parentName = parent.$options.name;

      while (parentName !== name) {
        parent = parent.$parent;
        if (!parent) return false;
        parentName = parent.$options.name;
      }
      return parent;
    },
  },
};
</script>

<style>
.tui-checkbox__input {
  position: relative;
  width: 40rpx;
  height: 40rpx;
  border-width: 1px;
  border-style: solid;
  border-radius: 50%;
  display: inline-flex;
  box-sizing: border-box;
  vertical-align: top;
  flex-shrink: 0;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  font-size: 0;
  color: rgba(0, 0, 0, 0);
}

.tui-radio__hidden {
  /* #ifndef APP-NVUE */
  width: 100%;
  height: 100%;
  border: 0 none;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  pointer-events: none;
  /* #endif */
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  z-index: 2;
}

.tui-checkbox__disabled {
  opacity: 0.5;
}
</style>
