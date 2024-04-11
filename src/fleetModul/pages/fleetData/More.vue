<template>
  <div
    class="flex items-center justify-between px-14px bg-fff py-14px nr-border-b"
  >
    <div class="flex items-center justify-between flex-1" @click="naviTo">
      <span class="nrz-thin">{{ text }}</span>
      <span class="iconfont icon-arrow-right-bold" style="color: #999"></span>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { nrNavigateTo, OBU_USER, getStore } from '@/utils';
interface Props {
  text?: string;
  route?: string;
  type?: string;
}

let props = withDefaults(defineProps<Props>(), {
  text: '',
  route: '',
  type: '',
});
function naviTo() {
  let teamId = getStore(OBU_USER)?.teamId;
  if (props?.type === 'webview') {
    nrNavigateTo(
      `nrz://com.qianchen/app/webview?url=https://h5.newrizon.cloud/parkingHeatMap?teamId=${teamId}`
    );
  }
  nrNavigateTo(props.route);
}
</script>
