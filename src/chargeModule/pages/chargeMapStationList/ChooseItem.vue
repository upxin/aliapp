<template>
  <section>
    <span class="font-bold mb-14px">{{ title }}</span>
    <div class="flex flex-wrap justify-between">
      <nut-button
        v-for="(k, i) in repairListForFlexWrap(dataList, wrapLen)"
        :key="`${k?.text}__${i}`"
        :disabled="k?.hidden"
        class="border-0 rounded-4px w-100px h-34px mb-10px text-12px"
        :class="{
          'bg-hex-FFEDD1': k?.active,
          'text-info': k?.active,
          'bg-hex-f0f0f0': !k?.active,
          invisible: k?.hidden,
        }"
        @click="
          () => {
            handleChoose(k);
          }
        "
      >
        {{ k?.text }}
      </nut-button>
    </div>
  </section>
</template>
<script lang="ts" setup>
import { repairListForFlexWrap } from '@/utils/index';
import { computed } from 'vue';

interface Props {
  list: any[];
  wrapLen: number;
  title: string;
}

const emits = defineEmits(['update:modelValue', 'handleChoose']);

let props = withDefaults(defineProps<Props>(), {
  list: () => [],
  wrapLen: 0,
  title: '',
});
// const;
const dataList = computed(() => props.list);

function handleChoose(v) {
  v.active = !v.active;
  emits('handleChoose', v);
  emits('update:modelValue', v);
}
// bottom
</script>
