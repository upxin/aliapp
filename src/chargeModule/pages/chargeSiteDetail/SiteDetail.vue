<template>
  <div class="px-10px py-14px bg-fff">
    <section>
      <div class="flex items-center">
        <span
          class="flex items-center justify-center bg-hex-f20317 mr-8px font-800 w-14px h-14px text-8px text-fff"
        >
          <span>￥</span>
        </span>
        <span class="text-14px">价格信息</span>
      </div>
      <section class="pl-20px mt-15px">
        <div class="flex items-center justify-between mb-10px nrz-thin">
          <span
            >当前时段：{{ detailData.startTime }}-{{ detailData.endTime }}</span
          >
          <div class="flex items-center" @click="goPriceDetail">
            <span class="text-hex-04C3F6">各时段价格</span>
            <span
              class="iconfont ml-6px icon-arrow-right-bold text-hex-04C3F6 text-12px"
            ></span>
          </div>
        </div>
        <PriceSite :detailData="detailData"></PriceSite>
        <div class="mt-14px text-hex-555 opacity-60 text-12px">
          * 展示价格为当前策略，实际价格以充电扫码时为准
        </div>
      </section>
    </section>
    <div class="nr-border-b my-22px"></div>

    <section>
      <div class="flex items-center">
        <span
          class="flex items-center justify-center bg-hex-04C3F6 mr-8px font-800 w-14px h-14px text-8px text-fff"
        >
          <span>P</span>
        </span>
        <span class="text-14px">停车参考</span>
      </div>
      <div class="leading-normal pl-20px text-12px opacity-70 mt-15px">
        {{ detailData?.parkFee }}
      </div>
    </section>
    <div class="nr-border-b my-22px"></div>

    <section>
      <div class="flex items-center">
        <span
          class="flex items-center justify-center bg-hex-C904F6 mr-8px font-800 w-14px h-14px text-8px text-fff"
        >
          <span class="iconfont icon-biaoqian text-8px"></span>
        </span>
        <span class="text-14px">站点标签</span>
      </div>
      <aside
        v-if="detailData?.tags?.length"
        class="flex flex-wrap mt-15px pl-20px"
      >
        <div
          v-for="k in detailData?.tags"
          :key="k.tagId"
          class="flex flex-col items-center mb-10px w-1_4"
        >
          <span
            class="text-center rounded min-w-70px overflow-ellipsis bg-info text-fff text-10px py-4px"
          >
            {{ k?.tagName }}
          </span>
        </div>
      </aside>
    </section>
    <div class="nr-border-b my-22px"></div>

    <section>
      <div class="flex items-center">
        <span
          class="flex items-center justify-center bg-hex-C904F6 mr-8px font-800 w-14px h-14px text-8px text-fff"
        >
          <span class="iconfont icon-xinxi text-8px"></span>
        </span>
        <span class="text-14px">站点信息</span>
      </div>
      <div class="pl-20px">
        <SiteInfoItem
          v-if="detailData?.operatorName"
          title="桩企名称"
          :text="detailData?.operatorName"
        ></SiteInfoItem>
        <SiteInfoItem
          v-if="detailData?.busineHours"
          title="营业时间"
          :text="detailData?.busineHours"
        ></SiteInfoItem>
        <SiteInfoItem
          v-if="detailData?.dict?.stationType"
          title="站点类型"
          :text="detailData?.dict?.stationType"
        ></SiteInfoItem>
        <SiteInfoItem
          v-if="detailData?.matchCars"
          title="可用车型"
          :text="detailData?.matchCars"
        ></SiteInfoItem>
        <SiteInfoItem
          v-if="detailData?.construction"
          title="车位楼层"
          :text="detailData?.construction"
        ></SiteInfoItem>

        <SiteInfoItem
          v-if="detailData?.stationTel"
          title="站点电话"
          :text="detailData?.stationTel"
          is-phone
        ></SiteInfoItem>
        <SiteInfoItem
          v-if="detailData?.serviceTel"
          title="服务电话"
          is-phone
          :text="detailData?.serviceTel"
        ></SiteInfoItem>
      </div>
    </section>
  </div>
</template>
<script lang="ts" setup>
import { store } from '@/stores/index';
import { navigateToPage, nullText } from '@/utils/index';
import SiteInfoItem from './SiteInfoItem.vue';
import PriceSite from '../../components/Price/index.vue';
interface Props {
  detailData: { [propKey: string]: any };
}
let props = withDefaults(defineProps<Props>(), {
  detailData: () => ({}),
});

function goPriceDetail() {
  store().setPriceList(props?.detailData?.priceList);
  navigateToPage({
    route: 'chargePriceTimeRangeList',
  });
}
</script>
