<template>
  <view
    class="tui-form__box"
    :style="{
      backgroundColor: backgroundColor,
      borderRadius: radius,
    }"
  >
    <slot></slot>
    <view
      v-if="showMessage && showErr"
      class="tui-form__errmsg"
      :style="{
        padding: tipPadding,
        backgroundColor: getTipBgColor,
        borderRadius: tipRidus,
      }"
      :class="{ 'tui-message__show': errorMsg.msg }"
      ><text
        class="tui-form__text"
        :style="{ fontSize: tipSize + 'rpx', color: tipColor }"
        >{{ errorMsg.msg }}</text
      ></view
    >
    <view v-if="disabled" class="tui-form__mask"></view>
  </view>
</template>

<script>
import form from './validation.js';
export default {
  name: 'TuiForm',
  provide() {
    return {
      err: () => this.errorMsg,
    };
  },
  props: {
    //表单数据对象，即将废弃
    model: {
      type: Object,
      default() {
        return {};
      },
    },
    //表单验证规则，即将废弃
    rules: {
      type: Array,
      default() {
        return [];
      },
    },
    //表单背景颜色
    backgroundColor: {
      type: String,
      default: 'transparent',
    },
    //是否显示校验错误信息
    showMessage: {
      type: Boolean,
      default: true,
    },
    //表单圆角值
    radius: {
      type: String,
      default: '0',
    },
    //是否禁用该表单内的所有组件,透明遮罩层
    disabled: {
      type: Boolean,
      default: false,
    },
    //提示框top值 px
    tipTop: {
      type: [Number, String],
      default: 0,
    },
    //错误提示框padding值
    tipPadding: {
      type: String,
      default: '20rpx',
    },
    //错误提示框背景色
    tipBackgroundColor: {
      type: String,
      default: '',
    },
    //错误提示字体大小
    tipSize: {
      type: [Number, String],
      default: 28,
    },
    //错误提示字体颜色
    tipColor: {
      type: String,
      default: '#fff',
    },
    //错误提示框圆角值
    tipRidus: {
      type: String,
      default: '12rpx',
    },
    //错误消息显示时间 ms
    duration: {
      type: [Number, String],
      default: 200000,
    },
  },
  data() {
    return {
      errorMsg: {},
      timer: null,
      showErr: false,
    };
  },
  computed: {
    getTipBgColor() {
      return this.tipBackgroundColor || '#f74d54';
    },
  },
  beforeUnmount() {
    this.clearTimer();
  },
  methods: {
    clearTimer() {
      clearTimeout(this.timer);
      this.timer = null;
    },
    //{Object} model 表单数据对象
    //{Array} rules 表单验证规则
    validate(model, rules) {
      model = model || this.model;
      rules = rules || this.rules;
      return new Promise((resolve, reject) => {
        let checkRes = form.validation(model, rules);
        let obj = {
          isPass: true,
          errorMsg: checkRes,
        };
        this.errorMsg = checkRes;

        if (!checkRes) {
          resolve(obj);
        } else {
          if (this.showMessage) {
            this.clearTimer();
            this.showErr = true;
            const duration = this.duration || 2000;
            this.timer = setTimeout(() => {
              this.showErr = false;
            }, Number(duration));
          }
          obj.isPass = false;
          reject(obj);
        }
      });
    },
  },
};
</script>

<style>
.tui-form__box {
  width: 100%;
  box-sizing: border-box;
  flex: 1;
  position: relative;
}

.tui-form__errmsg {
  position: fixed;
  z-index: 900;
  text-align: center;
  top: 50%;
  left: 50%;
  box-sizing: border-box;
  display: flex;
  word-break: break-all;
  align-items: center;
  justify-content: center;
  padding: 24rpx;
  opacity: 0;
  transform: translate3d(-50%, -50%, 0);
}

.tui-form__text {
  text-align: center;
}

.tui-message__show {
  opacity: 1;
}

.tui-form__mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0);
  z-index: 99;
}
</style>
