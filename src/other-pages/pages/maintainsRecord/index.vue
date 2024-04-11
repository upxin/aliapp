<template>
  <CustomBar class="fixed" background-color="#fff"
    ><template #title>保修凭证</template></CustomBar
  >
  <div
    :style="{ paddingTop: `${CalcPt}px` }"
    class="box-border h-full overflow-y-auto px-20px"
  >
    <div class="text-center">
      <div class="pt-30px pb-10px">首保卡</div>
      <NrImg :url="_data?.receipt" class="w-full h-216px"></NrImg>
      <div class="pt-40px pb-10px">发票</div>
      <NrImg :url="_data?.card" class="w-full h-216px"></NrImg>
    </div>
  </div>
</template>
<script lang="ts">
import { onShareAppMessage, onShareTimeline } from '@/utils/index';
export default {
  onShareAppMessage,
  onShareTimeline,
};
</script>

<script lang="ts" setup>
import { computed, onBeforeMount, ref } from 'vue';
import CustomBar from '@/components/customHeader/index.vue';
import { systemInfo } from '@/stores/systemInfo';
import { maintainsRecord } from '@/api/index';
import { useRouter } from '@tarojs/taro';
import NrImg from '@/components/img/img.vue';
import { CODE } from '@/utils/index';

definePageConfig({ transparentTitle: 'always',titlePenetrate: 'YES',defaultTitle: '', });

let CalcPt = computed(
  () => systemInfo().RightBtnRect.h + systemInfo().RightBtnRect.t + 10
);
interface Data {
  receipt: string; // 发票
  card: string;
}
let _data = ref<Data>();
function _maintainsRecord() {
  maintainsRecord({
    vin: useRouter().params?.vin,
  }).then((res) => {
    if (res.code != CODE) return;
    _data.value = res.data;
  });
}
onBeforeMount(() => {
  _maintainsRecord();
});
</script>
