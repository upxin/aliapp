<template>
  <qr-code id="qrImg" :code="url" :width="160" :height="160"></qr-code>
</template>
<script setup lang="ts">
import { Base64 } from '@/utils/index';
import QrCode from "@/components/qr/kk.vue";
let props = withDefaults(
  defineProps<{ nickName?: string; mobile?: string }>(),
  {
    nickName: 'xx',
    mobile: '12331231',
  }
);

let base64Json = Base64.encode(
  JSON.stringify({
    name: props.nickName,
    mobile: props.mobile,
  })
);

let url = `https://bevwjw.jgmlink.cn/Aa6F?info=${base64Json}`;
</script>
