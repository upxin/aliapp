<template>
  <div class="sign flex justify-around pt-130px box-border text-fff text-12px">
    <div class="flex flex-col items-center justify-between h-100px flex-1">
      <section class="flex flex-col items-center justify-center h-50px">
        <div class="flex items-end mb-4px">
          <div class="text-18px">{{ nullText(signData?.signInDays) }}</div>
          <div class="nrz-thin pb-2px pl-2px">次</div>
        </div>
        <span class="nrz-thin">连续签到</span>
      </section>
      <section class="flex flex-col items-center">
        <div class="flex items-end mb-4px">
          <div class="text-18px">{{ nullText(signData?.totalDays) }}</div>
          <div class="nrz-thin pb-2px pl-2px">次</div>
        </div>
        <span class="nrz-thin">累计签到</span>
      </section>
    </div>
    <div class="sign-line h-114px"></div>
    <div class="flex flex-col items-center justify-between h-100px flex-1">
      <section
        v-if="!signData?.hasSignOrNot"
        class="flex flex-col items-center relative w-full w-50px h-50px"
        @click="_signIn"
      >
        <span class="sign-btn sign-index1 center"></span>
        <span class="sign-btn sign-index2 center"></span>
        <span class="sign-btn sign-index3 center"></span>
        <div
          class="absolute center z-4 text-12px w-full text-center"
          style="color: #f6414c"
        >
          签到
        </div>
      </section>
      <view
        v-else
        class="flex items-center justify-center w-full w-70px h-50px"
      >
        <view
          class="px-10px py-6px nr-border border-fff rounded nrz-thin text-10px"
          @tap="tapToPage"
          >查看积分</view
        >
      </view>

      <section class="flex flex-col items-center">
        <div class="flex items-end mb-4px">
          <div class="text-18px">{{ nullText(signData?.days) }}</div>
          <div class="nrz-thin pb-2px pl-2px">次</div>
        </div>
        <span class="nrz-thin">{{ month }}连续签到</span>
      </section>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { signIn, getMinePageData } from '@/api/index';
import {
  JG,
  jGcustomCount,
  useToast,
  CODE,
  getStore,
  USER_INFO,
  nrNavigateTo,
  Routes,
  nullText,
} from '@/utils';
const emits = defineEmits(['succ']);
withDefaults(defineProps<{ signData: any; month: string }>(), {
  signData: () => ({}),
  month: '',
});

function _signIn() {
  signIn().then((res) => {
    if (res?.data) {
      jGcustomCount(JG.USER_005);
    } else {
      useToast(res?.msg);
    }
    if (res?.code == CODE) {
      emits('succ', res);
    }
  });
  jGcustomCount(JG.ALL_007);
}

function tapToPage() {
  nrNavigateTo(Routes.scoreList);
}
</script>
<style lang="scss">
.sign {
  height: 364px;
  width: 100%;
  background: linear-gradient(to bottom right, #fea07b, #f6414c);
  &-line {
    border-right: 1px dashed #fff;
  }
  &-btn {
    border-radius: 50%;
    position: absolute;
    background-color: #fff;
  }
  &-index3 {
    width: 50px;
    height: 50px;
    z-index: 3;
  }
  &-index2 {
    opacity: 0.6;
    width: 60px;
    height: 60px;
    z-index: 2;
  }
  &-index1 {
    opacity: 0.4;
    width: 70px;
    height: 70px;
    z-index: 1;
  }
}
</style>
