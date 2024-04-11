<template>
  <div class="relative w-full">
    <canvas
      :id="cid"
      canvas-id="carPanel"
      type="2d"
      @ready="onReady"
      class="w-full h-160px"
    ></canvas>
    <div class="triangle" :style="getStyles"></div>
    <div
      class="absolute bottom-0 flex flex-col items-center font-bold x-center text-20px pb-10px"
      style="color: #02c93d"
    >
      <div>{{ data?.totalEfficiency }}%</div>
      <div class="font-thin text-normal text-12px mt-10px">车队运营效率</div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, ref } from 'vue';
import { Canvas, Vector } from '../../utils';

let props = withDefaults(defineProps<{ data: any; cid: string }>(), {
  data: () => {
    return {};
  },
  // taro 编译后会吃掉标签的id 这里用props传进来可以解决问题
  cid: () => '',
});

const dpr = my.getSystemInfoSync().pixelRatio;
const r = 130 * dpr;

const cx = ref();
const cy = ref();
const radius = 130;

function rotatePointer(rate) {
  // 0-100
  const dis = radius - 30;
  const diff = Math.PI + Math.PI * 2 * (rate / 200);
  // 把整圆分成200份
  const v = new Vector(dis, diff);
  const x = v?.getX() + cx.value - 6;
  const y = v?.getY() + cy.value - 6;
  const d = (rate / 100) * 180;
  return {
    x,
    y,
    d,
  };
}

function divid({ ctx, c }) {
  // 绘制刻度
  ctx.lineWidth = 2;
  for (let i = 0; i < 41; i++) {
    //刻度
    const l = 10; // 刻度距离圆弧长度像素
    const dis = r - l;
    const v = new Vector(dis, Math.PI * 2 * (i / 80) + Math.PI);
    if (i % 5 === 0) {
      ctx.lineWidth = 5;
      ctx.strokeStyle = 'rgba(0, 0, 0, 1)';
      ctx.beginPath();
      ctx.moveTo(v.getX() + c.x, v.getY() + c.y);
      v.setMag(dis - 22);
      ctx.lineTo(v.getX() + c.x, v.getY() + c.y);
      ctx.stroke();
    } else {
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.beginPath();
      ctx.moveTo(v.getX() + c.x, v.getY() + c.y);
      v.setMag(dis - 14);
      ctx.lineTo(v.getX() + c.x, v.getY() + c.y);
      ctx.stroke();
    }
  }
}

const offsetText = [
  [-30, 18],
  [-26, -12],
  [-20, -26],
  [24, -30],
];
function rotateText({ k, i, diff, ctx, c }) {
  // 每次叠加 1/8 弧度画字体
  const v = new Vector(r, Math.PI + diff + Math.PI * 2 * (10 / 80) * i);
  const rotateDiffList = [-65, -20, 20, 80];

  ctx.save();
  ctx.beginPath();
  ctx.translate(
    v.getX() + c.x + offsetText[i][0],
    v.getY() + c.y + offsetText[i][1]
  );
  ctx.rotate((rotateDiffList[i] * Math.PI) / 180);
  ctx.fillText(k, 0, 0);
  ctx.closePath();
  ctx.restore();
}
function addText(ctx, c) {
  const textList = ['优秀', '良好', '一般', '较差'];
  ctx.beginPath();
  ctx.font = '24px serif';

  const diff = Math.PI * 2 * (5 / 80);
  textList.forEach((k, i) => {
    rotateText({ k, i, diff, ctx, c });
  });
}
function draw(res) {
  const w = res?.[0]?.width * dpr;
  const h = (res?.[0]?.height - 10) * dpr;
  // 给非canvas节点用的仪表盘中心点 不需要乘dpr
  cx.value = res?.[0]?.width / 2;
  cy.value = res?.[0]?.height - 10;
  console.log('res?.[0].node', res?.[0].node);
  const c = { x: w / 2, y: h };
  const ctx = res?.[0].node.getContext('2d');
  const cs = new Canvas(res?.[0].node, res);
  const angle = Math.PI / 4;
  const angleList = [
    [4 * angle, 5 * angle],
    [5 * angle, 6 * angle],
    [6 * angle, 7 * angle],
    [7 * angle, 8 * angle],
  ];
  const colors = ['red', '#F8DC75', '#7BD7F6', '#9EFBB9'];
  angleList.forEach((item, i) => {
    cs.addArc({
      x: w / 2,
      y: h,
      r,
      startAngle: item[0],
      endAngle: item[1],
      color: colors[i],
      lineWidth: 4,
    });
  });
  divid({ ctx, c });
  addText(ctx, c);
}

const getStyles = computed(() => {
  // 得分0-100分
  let p = rotatePointer(100 - Math.ceil(props?.data?.totalEfficiency || 0));
  return {
    transform: `translateX(${p.x}px) translateY(${p.y}px) rotate(${p.d}deg)`,
  };
});

function onReady() {
  const query = my.createSelectorQuery();
  query
    .select('#carPanel')
    .fields({ node: true, size: true })
    .exec((res) => {
      draw(res);
    });
}
</script>
<style>
.triangle {
  width: 0;
  height: 0;
  border-top: 4px solid transparent;
  border-right: 12px solid skyblue;
  border-bottom: 4px solid transparent;
  position: absolute;
  top: 0;
  left: 0;
}
</style>
