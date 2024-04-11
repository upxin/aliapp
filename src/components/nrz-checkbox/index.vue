<template>
  <view class="flex items-center" @tap.stop="checkboxChange">
    <view
      class="nrz-checkbox__input mr-4px"
      :class="{ 'nrz-checkbox__disabled': disabled }"
      :style="{
        backgroundColor: getBackgroundStyle(val, isCheckMark),
        border: getBorderStyle(val, isCheckMark),
        zoom: scaleRatio,
        width: size,
        height: size,
      }"
    >
      <view
        v-if="checked"
        class="iconfont icon-a-gou2x text-fff"
        :style="{
          color: checkMarkColor,
          fontSize: size,
          transform: 'translateX(-0.5px)',
        }"
      ></view>
      <checkbox
        class="nrz-checkbox__hidden"
        style="position: absolute; opacity: 0"
        hidden
        :color="color"
        :disabled="disabled"
        :value="value"
        :checked="val"
      >
      </checkbox>
    </view>
    <span><slot></slot></span>
  </view>
</template>

<script>
export default {
  name: 'TuiCheckbox',
  props: {
    size: {
      type: String,
      default: '40rpx',
    },
    value: {
      type: String,
      default: '',
    },
    checked: {
      type: Boolean,
      default: false,
    },
    //当设置checked 属性值时是否触发父级change方法
    triggerGroup: {
      type: Boolean,
      default: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    //checkbox选中背景颜色
    color: {
      type: String,
      default: '',
    },
    //checkbox未选中时边框颜色
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
  emits: ['change', 'update:checked'],
  options: {
    virtualHost: true,
  },
  data() {
    return {
      val: false,
    };
  },
  watch: {
    checked(newVal) {
      this.val = newVal;
    },
    val(newVal) {
      if (this.triggerGroup && this.group) {
        this.group.changeValue(this.val, this);
      }
    },
  },
  created() {
    this.val = this.checked;
    this.group = this.getParent();
    if (this.group) {
      this.group.childrens.push(this);
      if (this.group.modelValue && this.group.modelValue.length > 0) {
        this.val = this.group.modelValue.includes(this.value);
      }
    }
    this.label = this.getParent('nrz-label');
    if (this.label) {
      this.label.childrens.push(this);
    }
  },
  methods: {
    getBackgroundStyle(val, isCheckMark) {
      const primary = '#5677fc';
      let color = val ? this.color || primary : '#fff';
      if (isCheckMark) {
        color = 'transparent';
      }
      return color;
    },
    getBorderStyle(val, isCheckMark) {
      const primary = '#5677fc';
      let color = val ? this.color || primary : this.borderColor;
      if (isCheckMark) {
        color = 'transparent';
      }
      return `1px solid ${color}`;
    },
    checkboxChange(e) {
      if (this.disabled) return;
      this.val = !this.val;
      if (!this.triggerGroup && this.group) {
        this.group.changeValue(this.val, this);
      }
      this.$emit('change', {
        checked: this.val,
        value: this.value,
      });
      this.$emit('update:checked', this.val);
    },
    getParent(name = 'nrz-checkbox-group') {
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

<style lang="scss">
.nrz-checkbox__input {
  font-size: 0;
  color: rgba(0, 0, 0, 0);
  border-width: 1px;
  border-style: solid;
  display: inline-flex;
  box-sizing: border-box;
  border-radius: 50%;
  vertical-align: top;
  flex-shrink: 0;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
}

.nrz-check__mark {
  border-bottom-style: solid;
  border-bottom-width: 3px;
  border-bottom-color: #ffffff;
  border-right-style: solid;
  border-right-width: 3px;
  border-right-color: #ffffff;
  transform: rotate(45deg) scale(0.5);
  transform-origin: 54% 48%;
  box-sizing: border-box;
}

.nrz-checkbox__hidden {
  width: 100%;
  height: 100%;
  border: 0 none;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  pointer-events: none;
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  z-index: 2;
}

.nrz-checkbox__disabled {
  opacity: 0.6;
}
</style>
