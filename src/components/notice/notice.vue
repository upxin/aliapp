<script lang="ts" setup>
import { nrNavigateTo } from '@/utils/index';
import NrzBtn from '@/components/nrz-button/index.vue';

const props = defineProps({
  router: {
    type: String,
    default: '',
  },
});
const handelFlow = () => {
  nrNavigateTo(props.router + `&platform=weapp`);
};
</script>
<template>
  <div
    style="z-index: 999999"
    class="box-border bg-main fixed top-0 left-0 flex items-center justify-center w-full h-full px-15px"
  >
    <div
      class="box-border flex flex-col items-center justify-between w-full rounded shadow pt-14px pb-24px h-236px bg-fff px-24px"
    >
      <div>提醒</div>
      <div>
        欢迎您使用前晨汽车！请按照提示仔细阅读并确认《前晨汽车交付流程》、《前晨汽车使用说明》及《前晨汽车危险情况告知书》，以便您继续使用前晨APP的各项功能。
      </div>
      <NrzBtn class="px-60px" @click="handelFlow"> 查看 </NrzBtn>
    </div>
  </div>
</template>
