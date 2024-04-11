<template>
  <NrzOverlay
    :show="show"
    :z-index="2000"
    @click="
      () => {
        emits('update:show', false);
      }
    "
  >
    <div
      class="flex items-center justify-center h-full px-100px w-full box-border"
    >
      <div class="text-center rounded text-normal text-14px bg-fff w-full">
        <div
          class="py-20px"
          @click.stop="
            () => {
              handleAdd(4);
            }
          "
        >
          维修
        </div>
        <div
          class="nr-border-t py-20px"
          @click.stop="
            () => {
              handleAdd(5);
            }
          "
        >
          保养
        </div>
      </div>
    </div>
  </NrzOverlay>
</template>
<script lang="ts" setup>
import { nrNavigateTo } from '@/utils/index';
import NrzOverlay from '@/components/nrz-overlay/index.vue';

interface Props {
  shopId?: string | number;
  shopName?: string;
  beforeTime?: string;
  afterTime?: string;
  show: boolean;
}
let props = withDefaults(defineProps<Props>(), {
  shopId: '',
  shopName: '',
  beforeTime: '',
  afterTime: '',
  show: false,
});
let emits = defineEmits(['update:show', 'close']);
function handleAdd(type) {
  if (type === 4) {
    nrNavigateTo('repair', {
      shopId: props?.shopId,
      shopName: props?.shopName,
      afterTime: props?.afterTime,
    });
    return;
  }
  if (type === 5) {
    nrNavigateTo('maintains', {
      shopId: props?.shopId,
      shopName: props?.shopName,
      afterTime: props?.afterTime,
    });
    return;
  }
}
// bottom
</script>
