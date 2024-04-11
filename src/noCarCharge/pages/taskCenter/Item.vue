<template>
  <view class="flex items-center nr-border-b py-10px px-20px">
    <NrImg :url="item?.icon" class="w-35px h-35px"></NrImg>
    <view class="pl-16px nrz-thin">{{ item?.taskName }}</view>
    <view
      v-if="!item?.done || type == 'dairy'"
      class="ml-auto text-fff nrz-thin text-12px py-6px px-14px rounded-full"
      style="background-color: rgba(2, 115, 240, 0.55)"
      @tap="tapToPages(item)"
    >
      {{ type == 'dairy' ? '赚积分' : '去完成' }}
    </view>
    <view v-else class="text-12px ml-auto nrz-thin px-14px">已完成</view>
  </view>

  <NrzOverlay v-model:show="show" :z-index="1000">
    <div class="reactive w-full wrapper z-999">
      <div class="content">
        <img
          :src="LOGO_IMG_BOTTOM"
          class="w-120px h-30px mt-10px"
          mode="scaleToFill"
        />
        <div class="w-full nr-border-b--dashed mt-10px"></div>
        <div
          class="flex flex-col items-center flex-1 w-full overflow-hidden text-center bg-primary text-fff"
        >
          <div class="arc text-primary nrz-thin">
            {{ nickName }}
          </div>
          <QRImage></QRImage>
          <div class="nrz-thin mt-10px">请使用前晨APP扫描</div>
          <div class="nrz-thin">*长按图片保存本地</div>
        </div>
      </div>
      <span
        class="icon-close1 iconfont mt-10px text-40px text-fff"
        @click="show = false"
      ></span>
    </div>
  </NrzOverlay>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import NrImg from '@/components/img/img.vue';
import { getStore, USER_INFO, LOGO_IMG_BOTTOM } from '@/utils';
import QRImage from './QRImage.vue';
import NrzOverlay from '@/components/nrz-overlay/index.vue';

withDefaults(defineProps<{ item: any; type: string }>(), {
  item: () => ({}),
  type: '',
});
let emits = defineEmits(['tapItem']);
let show = ref(false);
let nickName = ref(getStore(USER_INFO)?.nickName);
function tapToPages({ router }: { router: string }) {
  if (router?.includes('inviteFriend')) {
    show.value = true;
    return;
  }
  emits('tapItem', router);
}
</script>
<style lang="scss">
.wrapper {
  display: flex;
  height: 100%;
  align-items: center;
  flex-direction: column;
  overflow: hidden;
  justify-content: center;
  .content {
    display: flex;
    flex-direction: column;
    width: 240px;
    height: 360px;
    background: #fff;
    border-radius: 8px;
    overflow: hidden;
    align-items: center;
  }
}
</style>
