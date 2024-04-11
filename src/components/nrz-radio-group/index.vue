<template>
  <Field v-model="val" :name="name">
    <view class="tui-label flex">
      <slot></slot>
    </view>
  </Field>
</template>

<script>
import Field from './field.vue';

export default {
  name: 'TuiRadioGroup',
  components: { Field },
  props: {
    name: {
      type: String,
      default: '',
    },
    modelValue: {
      type: String,
      default: '',
    },
    value: {
      type: String,
      default: '',
    },
  },
  emits: ['change', 'input', 'update:modelValue'],
  behaviors: ['wx://form-field-group'],
  options: {
    virtualHost: true,
  },
  data() {
    return {
      val: '',
    };
  },
  watch: {
    modelValue(val) {
      this.modelChange(val);
    },
    value(val) {
      this.modelChange(val);
    },
  },
  created() {
    this.childrens = [];
  },
  methods: {
    radioChange(e) {
      this.$emit('change', e.detail.value);
      this.$emit('input', e.detail.value);
      this.$emit('update:modelValue', e.detail.value);
    },
    changeValue(value, target) {
      console.log('ppppp changeValue', value);
      if (this.val === value) return;
      this.val = value;
      this.childrens.forEach((item) => {
        if (item !== target) {
          item.val = false;
        }
      });
      let e = {
        detail: {
          value: value,
        },
      };
      this.radioChange(e);
    },
    modelChange(value) {
      console.log('pppp', value);
      this.childrens.forEach((item) => {
        if (item.value === value) {
          item.val = true;
        } else {
          item.val = false;
        }
      });
    },
  },
};
</script>
<style></style>
