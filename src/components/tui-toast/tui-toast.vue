<template>
  <view
    class="nrz-toast"
    :class="[
      visible ? 'nrz-toast-show' : '',
      content ? 'nrz-toast-padding' : '',
      icon ? '' : 'nrz-unicon-padding',
    ]"
    :style="{ width: getWidth(icon, content), zIndex: zIndex }"
  >
    <image v-if="icon" :src="imgUrl" class="nrz-toast-img"></image>
    <view class="nrz-toast-text" :class="[icon ? '' : 'nrz-unicon']">{{
      title
    }}</view>
    <view v-if="content" class="nrz-toast-text nrz-content-ptop">{{
      content
    }}</view>
  </view>
</template>

<script>
export default {
  name: 'TuiToast',
  props: {
    zIndex: {
      type: Number,
      default: 99999,
    },
    content: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      autoClose: false,
      timer: null,
      //是否显示
      visible: false,
      //显示标题
      title: '操作成功',
      //显示内容
      //是否有icon
      icon: false,
      imgUrl: '',
    };
  },
  methods: {
    show: function (options) {
      console.log(9888888);
      let { duration = 2000, icon = false } = options;
      clearTimeout(this.timer);
      this.visible = true;
      this.title = options.title || '';
      this.icon = icon;
      if (icon && options.imgUrl) {
        this.imgUrl = options.imgUrl;
      }
      if (this.autoClose) {
        this.timer = setTimeout(() => {
          this.visible = false;
          clearTimeout(this.timer);
          this.timer = null;
        }, duration);
      }
    },
    close() {
      this.visible = false;
    },
    getWidth(icon, content) {
      let width = 'auto';
      if (icon) {
        width = content ? '420rpx' : '360rpx';
      }
      return width;
    },
  },
};
</script>

<style>
.nrz-toast {
  background-color: rgba(0, 0, 0, 0.75);
  border-radius: 10rpx;
  position: fixed;
  visibility: hidden;
  opacity: 0;
  left: 50%;
  top: 48%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  transition: 0.3s ease-in-out;
  transition-property: opacity, visibility;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 60rpx 20rpx 54rpx 20rpx;
  box-sizing: border-box;
}

.nrz-toast-padding {
  padding-top: 50rpx !important;
  padding-bottom: 50rpx !important;
}
.nrz-unicon-padding {
  padding: 24rpx 40rpx !important;
  word-break: break-all;
}

.nrz-toast-show {
  visibility: visible;
  opacity: 1;
}

.nrz-toast-img {
  width: 120rpx;
  height: 120rpx;
  display: block;
  margin-bottom: 28rpx;
}

.nrz-toast-text {
  font-size: 30rpx;
  line-height: 30rpx;
  font-weight: 400;
  color: #fff;
  text-align: center;
}
.nrz-unicon {
  line-height: 40rpx !important;
  font-size: 32rpx !important;
}
.nrz-content-ptop {
  padding-top: 10rpx;
  font-size: 26rpx !important;
}
</style>
