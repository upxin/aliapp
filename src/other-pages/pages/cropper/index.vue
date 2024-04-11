<template>
  <view style="width: 100%; height: 500px">
    <image-cropper
      id="image-cropper"
      :limit_move="state.limit_move"
      :disable_rotate="state.disable_rotate"
      :width="state.width"
      :height="state.height"
      :img-src="state.src"
      :max_width="state.max_width"
      :max_height="state.max_height"
      :disable_ratio="state.disable_ratio"
      :quality="state.quality"
      scale="0.5"
      @load="cropperload"
    >
    </image-cropper>
  </view>
  <view class="bottom nrz-safe">
    <nut-button
      class="mr-40px text-fff text-14px px-16px"
      shape="square"
      @click="upload"
      >上传</nut-button
    >
    <nut-button
      class="text-fff text-14px px-16px"
      shape="square"
      @click="submit"
      >确定</nut-button
    >
  </view>
</template>
<script lang="ts" setup>
import Taro, { useRouter, getCurrentInstance } from '@tarojs/taro';
import { reactive } from 'vue';
import { store } from '@/stores';
definePageConfig({
  usingComponents: {
    'image-cropper': '../../../components/image-cropper/image-cropper',
  },
});
const { page = {} } = getCurrentInstance() || {};

let app = Taro.getApp();
let params = useRouter()?.params;
let cropper;
let state = reactive({
  src: '',
  width: 250, //宽度
  height: 250, //高度
  max_width: 300,
  max_height: 300,
  disable_rotate: true, //是否禁用旋转
  disable_ratio: false, //锁定比例
  limit_move: true, //是否限制移动
  quality: 0.3,
});

function cropperload() {
  cropper = page?.selectComponent('#image-cropper');
  state.src = params?.imgSrc || '';
  Taro.getFileInfo({
    filePath: params?.imgSrc,
    success: function (res) {
      console.log('res1===========', res?.size / 1024);
    },
  });
  if (!params.imgSrc) {
    cropper.upload(); //上传图片
  }
}

function submit() {
  cropper.getImg((obj) => {
    console.log(obj);
    Taro.getFileInfo({
      filePath: obj.url,
      success: function (res) {
        console.log('res2', res?.size / 1024);
      },
    });
    store()?.setCropperImgUrl(obj.url);
    my.navigateBack({
      delta: -1,
    });
  });
}
function upload() {
  Taro.chooseMedia({
    count: 1,
    sizeType: ['original', 'compressed'],
    sourceType: ['album', 'camera'],
    success(res) {
      Taro.hideLoading();
      const tempFilePaths = res?.tempFiles?.[0]?.tempFilePath;
      //重置图片角度、缩放、位置
      cropper.imgReset();
      state.src = tempFilePaths;
    },
  });
}
</script>
<style>
.top {
  position: absolute;
  width: 100%;
  top: 10px;
  display: flex;
  flex-flow: wrap;
  z-index: 10;
  color: white;
  justify-content: space-around;
}

.hint {
  position: absolute;
  top: 10px;
  width: 100%;
  font-size: 33px;
  text-align: center;
  color: white;
  z-index: 10;
}

page {
  background: white;
}

.bottom {
  position: absolute;
  width: 100%;
  bottom: 0;
  display: flex;
  z-index: 10;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  height: 200px;
}
</style>
