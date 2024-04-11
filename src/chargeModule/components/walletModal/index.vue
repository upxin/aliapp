<template>
  <NrzOverlay v-model:show="visible" :z-index="2000" :maskClosable="false">
    <div
      class="box-border flex items-center justify-center w-full h-full px-16px"
    >
      <div
        class="box-border w-full bg-hex-fff modal-shadow h-212px rounded-10px py-20px"
      >
        <section class="px-26px">
          <div class="font-bold text-center mb-25px text-16px">{{ title }}</div>
          <div class="modal-content">{{ content }}</div>
          <div class="flex items-center mt-14px mb-18px text-12px">
            <NrzCheckBox
              v-model:checked="checked"
              color="#11264d"
              borderColor="#11264d"
            >
              已仔细阅读并同意
            </NrzCheckBox>
            <span class="text-hex-1990ff">{{ protol }}</span>
          </div>
        </section>
        <section class="flex justify-between px-24px">
          <nut-button
            shape="square"
            class="modal-btn modal-btn__border"
            @click="onCancel"
          >
            放弃
          </nut-button>
          <nut-button
            shape="square"
            class="modal-border-0 modal-btn"
            color="#11264d"
            @click="onOk"
          >
            开通
          </nut-button>
        </section>
      </div>
    </div>
  </NrzOverlay>
</template>
<script lang="ts" setup>
import NrzCheckBox from '@/components/nrz-checkbox/index.vue';
import { computed, ref } from 'vue';
import NrzOverlay from '@/components/nrz-overlay/index.vue';
interface Props {
  show: boolean;
  title?: string;
  content?: string;
  protol?: string;
}
const checked = ref(false);
const props = withDefaults(defineProps<Props>(), {
  show: false,
  title: '钱包',
  protol: '《前晨汽车充电币使用协议》',
  content:
    '开通充电钱包，可使用前晨积分或线上移动支付方式购买前晨充电币，立享受优惠',
});
const emits = defineEmits(['update:show', 'cancel', 'ok']);

const visible = computed({
  get() {
    return props.show;
  },
  set(value) {
    emits('update:show', value);
  },
});
function onCancel() {
  emits('cancel');
}
function onOk() {
  emits('ok', checked.value);
}

//
</script>
<style>
.modal-shadow {
  box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.4);
}
.modal-btn {
  width: 134px;
  background-color: rgba(187, 187, 187, 29);
  color: rgba(16, 16, 16, 38);
}
.modal-btn__border {
  border: 1px solid rgba(187, 187, 187, 29);
  color: rgba(16, 16, 16, 38);
}
.modal-border-0 {
  border: 0;
}
.modal-content {
  line-height: 1.8;
}
</style>
