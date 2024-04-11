<template>
  <canvas
    :id="progressCanvasId"
    type="2d"
    @ready="onReady"
    :canvas-id="progressCanvasId"
  ></canvas>
</template>

<script lang="ts" setup>
import { usePullDownRefresh } from '@tarojs/taro';
import Taro from '@tarojs/taro';
import { watch, onMounted } from 'vue';

interface Props {
  progressCanvasId: string;
  percent?: number;
  progressWidth?: number;
  radius?: number;
  percentSignSize?: number;
  percentNumSize?: number;
}
let props = withDefaults(defineProps<Props>(), {
  percent: 0, // 0 - 100
  progressWidth: 7,
  radius: 40,
  percentNumSize: 50,
  percentSignSize: 14,
});
let context: CanvasRenderingContext2D;
let canvas: HTMLCanvasElement;
let radius = 50;

function regNum(v) {
  return my.getSystemInfoSync().pixelRatio * v;
}
interface Progress {
  start: number;
  end: number;
  strokeStyle: string;
  lineCap: CanvasLineCap;
  radius: any;
}

function getDeg(p) {
  let getDeg = (p / 100) * 270;
  let currentDeg = getDeg + 135;

  let end;
  if (currentDeg >= 360) {
    end = currentDeg - 360;
  } else {
    end = currentDeg;
  }
  console.log('deg===', Math.ceil(end));
  return Math.ceil(end);
}
function drawProgress({ start, end, strokeStyle, lineCap, radius }: Progress) {
  context!.beginPath();
  context!.lineWidth = regNum(props.progressWidth);
  context!.strokeStyle = strokeStyle;
  context!.lineCap = lineCap;
  context!.arc(
    canvas!.width / 2,
    canvas!.height / 2,
    radius,
    start,
    end,
    false
  );
  context!.stroke();
  context!.closePath();
}
function drawText() {
  context!.fillStyle = '#7FE5F9';

  context!.beginPath();
  context!.font = `${regNum(props.percentNumSize)}px bold serif`;
  const text = context!.measureText(`${props.percent}`);
  context!.fillText(
    `${props.percent ? props.percent : '--'}`,
    canvas!.width / 2 - text.width / 2 - regNum(8),
    canvas!.height / 2 + regNum(10)
  );

  context!.closePath();
  context!.font = `${regNum(props.percentSignSize)}px bold serif`;
  if (props.percent) {
    context!.fillText(
      '%',
      canvas!.width / 2 + (text.width / 2 - regNum(6)),
      canvas!.height / 2 + regNum(8)
    );
  }
}
function init() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  drawProgress({
    start: (Math.PI / 180) * 135,
    end: getDeg(props.percent) * (Math.PI / 180),
    strokeStyle: '#33F065',
    lineCap: 'round',
    radius,
  });

  drawProgress({
    start: (Math.PI / 180) * getDeg(props.percent - 2),
    end: (Math.PI / 180) * getDeg(props.percent),
    strokeStyle: '#F7D215',
    lineCap: 'round',
    radius,
  });
  drawText();
}

function onReady() {
  const query = my.createSelectorQuery();
  query
    .select(`#${props.progressCanvasId}`)
    .fields({ node: true, size: true })
    .exec((res) => {
      const w = res?.[0]?.width;
      const h = res?.[0]?.height;

      canvas = res?.[0]?.node;
      canvas!.width = regNum(w);
      canvas!.height = regNum(h);
      context = canvas?.getContext('2d') as CanvasRenderingContext2D;
      radius = regNum(props?.radius);

      init();
    });
}
watch(
  () => props.percent,
  (v) => {
    console.log('perperpep$$$$$$$$$$$', v);
    if (v && context && canvas) {
      init();
    }
  },
  {
    deep: true,
    immediate: true,
  }
);
usePullDownRefresh(() => {
  Taro.stopPullDownRefresh();
});
</script>
