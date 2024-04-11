<template>
  <section class="box-border w-full px-20px">
    <div v-if="state.frontImg" class="relative w-full">
      <img class="w-full h-200px" mode="aspectFit" :src="state.frontImg" />
      <div
        class="absolute flex items-center justify-center rounded-full w-100px h-100px center"
        style="background-color: rgba(222, 36, 33, 0.6)"
        @click="delFront"
      >
        <span
          class="iconfont icon-changyonggoupiaorenshanchu text-40px text-fff"
        ></span>
      </div>
    </div>
    <section v-else class="relative bg-main h-200px" @click="paserFrontImg">
      <div class="pt-20px pl-20px text-hex-bbbbbb">机动车行驶证主页</div>
      <div
        class="absolute flex items-center justify-center rounded-full w-100px h-100px center"
        style="background-color: rgba(91, 250, 166, 0.8)"
      >
        <span class="icon-photograph iconfont text-40px text-fff"></span>
      </div>
    </section>
    <div class="text-center py-10px">行驶证主页</div>
  </section>

  <section class="box-border w-full px-20px mt-30px">
    <div v-if="state.backImg" class="relative w-full">
      <img class="w-full h-200px" mode="aspectFit" :src="state.backImg" />
      <div
        class="absolute flex items-center justify-center rounded-full w-100px h-100px center"
        style="background-color: rgba(222, 36, 33, 0.6)"
        @click="delBack"
      >
        <span
          class="iconfont icon-changyonggoupiaorenshanchu text-40px text-fff"
        ></span>
      </div>
    </div>
    <section v-else class="relative bg-main h-200px" @click="paserBackImg">
      <div class="pt-20px pl-20px text-hex-bbbbbb">机动车行驶证副页</div>
      <div
        class="absolute flex items-center justify-center rounded-full w-100px h-100px center"
        style="background-color: rgba(91, 250, 166, 0.8)"
      >
        <span class="icon-photograph iconfont text-40px text-fff"></span>
      </div>
    </section>
    <div class="text-center py-10px">行驶证副页</div>
  </section>
</template>
<script lang="ts" setup>
//
import { reactive } from 'vue';
import Taro from '@tarojs/taro';
import { useModal } from '@/hooks';
import { parseLisence } from '@/api/index';
import { JG, jGcustomCount, useToast } from '@/utils';

withDefaults(defineProps<{ front: any; back: any }>(), {
  front: () => ({}),
  back: () => ({}),
});

let emits = defineEmits(['update:front', 'update:back']);
let state = reactive({
  frontImg: '',
  backImg: '',
});

const paserFrontImg = () => {
  Taro.chooseMedia({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success(res) {
      const tempFilePaths = res?.tempFiles?.[0]?.tempFilePath;
      state.frontImg = tempFilePaths;

      Taro.getFileInfo({
        filePath: tempFilePaths,
        success: function (res) {
          console.log('tempFilePaths compressed', res?.size / 1024);
        },
      });
      jGcustomCount(JG.CV_001);
      parseLisence({
        file: tempFilePaths,
      }).then((data) => {
        if (!data?.faceData) {
          return useToast('请上传行驶证主页');
        }
        emits('update:front', data?.faceData);
      });
    },
  });
};
const paserBackImg = () => {
  Taro.chooseMedia({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success(res) {
      const tempFilePaths = res?.tempFiles?.[0]?.tempFilePath;
      state.backImg = tempFilePaths;
      parseLisence({
        file: tempFilePaths,
      }).then((data) => {
        if (!data?.backData) {
          return useToast('请上传行驶证副页');
        }
        emits('update:back', data?.backData);
      });
    },
  });
};

const delFront = () => {
  useModal({
    title: '提醒',
    content: '确认删除？删除后可以重新上传！',
    success: () => {
      //
      state.frontImg = '';
    },
  });
};
const delBack = () => {
  useModal({
    title: '提醒',
    content: '确认删除？删除后可以重新上传！',
    success: () => {
      //
      state.backImg = '';
    },
  });
};
</script>
<style>
page {
  background-color: #fff;
}
</style>
