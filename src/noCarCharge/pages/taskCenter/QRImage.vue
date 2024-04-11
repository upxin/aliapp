<template>
  <canvas
    id="canvas"
    canvas-id="canvas"
    type="2d"
    @ready="onReady"
    class="w-120px h-120px"
  ></canvas>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { Base64, getStore, USER_INFO } from '@/utils/index';
import QRCode from 'qrcode';
import Taro from '@tarojs/taro';

let nickName = ref(getStore(USER_INFO)?.nickName);
let mobile = ref(getStore(USER_INFO)?.mobile);

function onReady() {
  let base64Json = Base64.encode(
    JSON.stringify({
      name: nickName.value,
      mobile: mobile.value,
    })
  );
  let url = `https://bevwjw.jgmlink.cn/Aa6F?info=${base64Json}`;
  let q = Taro.createSelectorQuery().select('#canvas');
  q.node().exec((res) => {
    const canvas = res[0].node;
    console.log(canvas, 1111);
    QRCode.toCanvas(canvas, url, function (error) {
      if (error) console.error(error);
      console.log('success!');
    });
  });
}
</script>
