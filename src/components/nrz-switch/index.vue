<template>
  <view
    class="nrz-switch__input"
    :style="{
      zoom: scaleRatio,
      transform: `scale(${scaleRatio})`,
    }"
  >
    <switch
      v-if="type === 'switch'"
      :class="{ 'nrz-pevents': isLabel }"
      :name="name"
      :checked="val"
      :disabled="disabled"
      :color="getColor"
      @change="change"
    >
    </switch>
    <view
      v-else
      class="nrz-checkbox__self"
      :class="{ 'nrz-checkbox__disabled': disabled }"
      :style="{
        backgroundColor: val ? getColor : '#fff',
        border: val ? `1px solid ${getColor}` : `1px solid ${borderColor}`,
      }"
    >
      <view
        v-if="val"
        class="nrz-check__mark"
        :style="{
          borderBottomColor: checkMarkColor,
          borderRightColor: checkMarkColor,
        }"
      ></view>
      <switch
        class="nrz-switch__hidden"
        :class="{ 'nrz-pevents': isLabel }"
        style="position: absolute; opacity: 0"
        :name="name"
        type="checkbox"
        :checked="val"
        :disabled="disabled"
        @change="change"
      ></switch>
    </view>
  </view>
</template>

<script>
export default {
  name: 'TuiSwitch',
  props: {
    //开关选择器名称
    name: {
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
    //样式，有效值：switch, checkbox
    type: {
      type: String,
      default: 'switch',
    },
    //switch选中颜色
    color: {
      type: String,
      default: '',
    },
    //边框颜色，type=checkbox时生效
    borderColor: {
      type: String,
      default: '#ccc',
    },
    //对号颜色，type=checkbox时生效
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
  behaviors: ['wx://form-field-group'],
  data() {
    return {
      val: false,
      isLabel: false,
    };
  },
  computed: {
    getColor() {
      return this.color || '#00e266';
    },
  },
  watch: {
    checked(val) {
      this.val = val;
    },
  },
  created() {
    this.val = this.checked;
    this.label = this.getParent();
    if (this.label) {
      this.isLabel = true;
      this.label.childrens.push(this);
    }
  },
  methods: {
    change(e, label) {
      if (this.label && !label) return;
      this.val = e.detail.value;
      this.$emit('change', e.detail.value);
      this.$emit('update:checked', this.val);
    },
    labelClick() {
      if (this.disabled) return;
      let e = {
        detail: {
          value: !this.val,
        },
      };
      this.change(e, true);
    },
    getParent(name = 'nrz-label') {
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
.nrz-switch__input {
  display: inline-block;
}
.nrz-checkbox__self {
  font-size: 0;
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  display: inline-flex;
  box-sizing: border-box;
  vertical-align: top;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
}

.wx-switch-input {
  margin-right: 0 !important;
}

.nrz-check__mark {
  width: 20rpx;
  height: 40rpx;
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

.nrz-switch__hidden {
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  z-index: 2;
  width: 100%;
  height: 100%;
  border: 0 none;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

.nrz-pevents {
  pointer-events: none;
}

.nrz-checkbox__disabled {
  opacity: 0.6;
}
</style>
