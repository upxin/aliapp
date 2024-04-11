<template>
  <CustomBar :border="false">
    <template #title>前晨牛指</template>
  </CustomBar>

  <FullLoading :loading="floading">
    <section :style="{ paddingTop: `${headerHeight}px` }">
      <canvas
        :id="myCanvas"
        :canvas-id="myCanvas"
        type="2d"
        class="w-full h-400px"
      ></canvas>
    </section>
    <div class="flex flex-col items-center my-20px">
      <span class="my-10px">{{ result?.scoreTotal }} </span>
      <span>{{ result?.scoreName }}</span>
    </div>
    <section
      class="flex justify-center text-center mb-20px px-20px nrz-thin text-10px"
    >
      <span class="flex-1 grabg py-10px"
        >评分时间：{{ result?.computeDate }}</span
      >
      <div class="w-20px"></div>
      <span class="flex-1 grabg py-10px" @click="goDetail">评分细则?</span>
    </section>
    <section
      class="flex justify-between text-center nrz-thin px-20px mb-40px text-10px"
    >
      <span class="flex-1 grabg py-10px">车辆</span>
      <div class="w-20px"></div>
      <span class="flex-1 grabg py-10px" @click="goPromote"
        >如何提升车辆评分?</span
      >
    </section>
    <section
      class="flex flex-col items-center leading-normal rounded nrz-thin nrz-safe"
    >
      <div style="background-color: #ddd" class="px-10px py-6px my-10px">
        综合建议
      </div>
      <div>「车身」得分您已超过{{ result?.scoreBodyPercentage }}%用户</div>
      <div>「电池」得分您已超过{{ result?.scoreBatteryPercentage }}%用户</div>
      <div>
        「维保」得分您已超过{{ result?.scoreMaintenancePercentage }}%用户
      </div>
      <div>
        「驾驶行为」得分您已超过{{ result?.travelActionsPercentage }}%用户
      </div>

      <div class="my-20px nrz-safe">
        下次评估时间：{{ result?.nextCalculateDate }}
      </div>
    </section>
  </FullLoading>
</template>
<script lang="ts">
import { onShareAppMessage, onShareTimeline } from '@/utils/index';
export default {
  onShareAppMessage,
  onShareTimeline,
};
</script>
<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import CustomBar from '@/components/customHeader/index.vue';
import { useRouter } from '@tarojs/taro';
import { vehScore } from '@/api/index';
import { CODE, nrNavigateTo, WEBVIEW_PREFIX, useToast } from '@/utils/index';
import { useHeaderHeight } from '@/hooks/index';
import { useDraw, miniPointsArcRadius, drawCurvePath } from './draw';
import { vrData } from './vr';
import { loveCarStore } from '@/stores/index';
import FullLoading from '@/components/full-loading/index.vue';

definePageConfig({ navigationStyle: 'custom' });
const { headerHeight } = useHeaderHeight();
const { draw, drawCircular } = useDraw();
let activeColor = '#84C1E3';
let floading = ref(true);
let pointsMap = (p) => {
  let i = 0;
  if (p >= 80) {
    i = 4;
  }
  if (p >= 60 && p < 80) {
    i = 3;
  }
  if (p >= 40 && p < 60) {
    i = 2;
  }
  if (p >= 20 && p < 40) {
    i = 1;
  }
  if (p < 20) {
    i = 0;
  }
  return i;
};
// id 绑定变量解决第二次进入 找不到节点的bug 大概率是taro的bug
let myCanvas = ref('myCanvas');
let result = ref();
let ctx;
const readyCanvas = ({
  carBody,
  behaviour,
  maintain,
  battery,
  scoreBody,
  scoreBattery,
  scoreTravelActions,
  scoreMaintenance,
}) => {
  // 圆点是从中心点往四边方向画的  即从小到大画 0-4 20%-100%
  let carBodyIndex = pointsMap(scoreBody);
  let maintainIndex = pointsMap(scoreMaintenance);
  let behaviourIndex = pointsMap(scoreTravelActions);
  let batteryIndex = pointsMap(scoreBattery);

  let x1 = carBody[carBodyIndex]?.[0];
  let y1 = carBody[carBodyIndex]?.[1];

  let x3 = behaviour[behaviourIndex]?.[0];
  let y3 = behaviour[behaviourIndex]?.[1];

  let x2 = maintain[maintainIndex]?.[0];
  let y2 = maintain[maintainIndex]?.[1];

  let x4 = battery[batteryIndex]?.[0];
  let y4 = battery[batteryIndex]?.[1];

  // console.log([x1, y1], [x2, y2], [x3, y3], [x4, y4]);
  drawCurvePath(ctx, [x1, y1], [x2, y2], 0.3);
  drawCurvePath(ctx, [x2, y2], [x3, y3], 0.3);
  drawCurvePath(ctx, [x3, y3], [x4, y4], 0.3);
  drawCurvePath(ctx, [x4, y4], [x1, y1], 0.3);
  console.log([x1, y1], [x2, y2], [x3, y3], [x4, y4]);
  for (let item of [
    [x1, y1],
    [x2, y2],
    [x3, y3],
    [x4, y4],
  ]) {
    drawCircular({
      x: item[0],
      y: item[1],
      r: miniPointsArcRadius + carBodyIndex / 2,
      ctx,
      color: activeColor,
    });
  }
};
function getDataAndStartDraw({ carBody, behaviour, maintain, battery }) {
  if (loveCarStore()?.isVr) {
    let { scoreBody, scoreBattery, scoreTravelActions, scoreMaintenance } =
      vrData;
    result.value = vrData;

    readyCanvas({
      carBody,
      behaviour,
      maintain,
      battery,
      scoreBody,
      scoreBattery,
      scoreTravelActions,
      scoreMaintenance,
    });
    return;
  }
  vehScore({ vinLicense: useRouter().params?.vin })
    .then((res) => {
      floading.value = false;

      if (res?.code !== CODE) return useToast(res?.msg);
      result.value = res?.data;
      let { scoreBody, scoreBattery, scoreTravelActions, scoreMaintenance } =
        res?.data ?? {};
      readyCanvas({
        carBody,
        behaviour,
        maintain,
        battery,
        scoreBody,
        scoreBattery,
        scoreTravelActions,
        scoreMaintenance,
      });
    })
    .catch(() => {
      floading.value = false;
    });
}
onMounted(() => {
  setTimeout(() => {
    const query = my.createSelectorQuery();
    query
      .select('#myCanvas')
      .fields({ node: true, size: true })
      .exec((res) => {
        const canvas = res?.[0].node;
        ctx = canvas.getContext('2d');
        draw({
          ctx,
          canvas,
          el: res,
          success: getDataAndStartDraw,
        });
      });
  }, 300);
});
function goPromote() {
  nrNavigateTo(
    `${WEBVIEW_PREFIX}?url=https://h5.newrizon.cloud/extra/RIV-Suggest.html`
  );
}

function goDetail() {
  nrNavigateTo(
    `${WEBVIEW_PREFIX}?url=https://h5.newrizon.cloud/extra/RIV-Tips.html`
  );
}
</script>
<style>
page {
  background-color: #eff4f8;
}
.grabg {
  background: rgb(255, 255, 255);
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 1) 18%,
    rgba(225, 229, 231, 1) 49%,
    rgba(255, 255, 255, 1) 82%
  );
}
</style>
