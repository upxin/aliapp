<template>
  <div
    v-if="goods?.length === 3"
    class="box-border flex justify-between w-full h-240px px-14px"
  >
    <div
      class="box-border w-1_2 pr-2px"
      @click="
        () => {
          hanlde_goods(goods?.[0]);
        }
      "
    >
      <BgImg
        class="relative w-full h-full bg-center bg-cover"
        :url="goods?.[0]?.thumbnails?.[0]"
      >
        <Overlay
          :title="goods?.[0]?.summary"
          :price="goods?.[0]?.price"
        ></Overlay>
      </BgImg>
    </div>
    <div class="flex flex-col w-1_2 pl-2px">
      <BgImg
        class="relative flex-1 bg-center bg-cover mb-1px"
        :url="goods?.[1]?.thumbnails?.[0]"
        @click="
          () => {
            hanlde_goods(goods?.[1]);
          }
        "
      >
        <Overlay
          :title="goods?.[1]?.summary"
          :price="goods?.[1]?.price"
        ></Overlay>
      </BgImg>
      <BgImg
        class="relative flex-1 bg-center bg-cover mt-1px"
        :url="goods?.[2]?.thumbnails?.[0]"
        @click="
          () => {
            hanlde_goods(goods?.[2]);
          }
        "
      >
        <Overlay
          :title="goods?.[2]?.summary"
          :price="goods?.[2]?.price"
        ></Overlay>
      </BgImg>
    </div>
  </div>
  <div v-if="goods?.length === 1" class="flex justify-center px-14px">
    <NrzImg
      class="w-full"
      mode="widthFix"
      :only-img="true"
      :url="goods?.[0]?.thumbnails?.[0]"
      @click="
        () => {
          hanlde_goods(goods?.[0]);
        }
      "
    >
      <Overlay
        :title="goods?.[0]?.summary"
        :price="goods?.[0]?.price"
      ></Overlay>
    </NrzImg>
  </div>

  <div
    v-if="goods?.length === 2"
    class="box-border flex justify-center w-full px-14px"
  >
    <NrzImg
      mode="widthFix"
      class="flex-1"
      :only-img="true"
      :url="goods?.[0]?.thumbnails?.[0]"
      @click="
        () => {
          hanlde_goods(goods?.[0]);
        }
      "
    >
      <Overlay
        :title="goods?.[0]?.summary"
        :price="goods?.[0]?.price"
      ></Overlay>
    </NrzImg>
    <div class="h-10px w-4px"></div>
    <NrzImg
      mode="widthFix"
      class="flex-1"
      :only-img="true"
      :url="goods?.[1]?.thumbnails?.[0]"
      @click="
        () => {
          hanlde_goods(goods?.[1]);
        }
      "
    >
      <Overlay
        :title="goods?.[1]?.summary"
        :price="goods?.[1]?.price"
      ></Overlay>
    </NrzImg>
  </div>
</template>
<script lang="ts" setup>
import BgImg from '@/components/bg-img/bg-img.vue';
import NrzImg from '@/components/img/img.vue';
import Overlay from './overlay.vue';
import { nrNavigateTo } from '@/utils/index';

interface Props {
  goods: any[];
}
withDefaults(defineProps<Props>(), { goods: () => [] });
function hanlde_goods({ spuId = '' }) {
  nrNavigateTo('mallGoodsDetail', {
    spuId,
  });
}
</script>
