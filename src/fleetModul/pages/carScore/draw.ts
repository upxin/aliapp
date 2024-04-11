import { ref } from 'vue';

export const offetMiniArc = 4;
export const miniPointsArcRadius = 3;
const IMG_URL = 'https://nrz-app.su.bcebos.com/resources/nrz_vehiel_score.png';
function regDpr(v) {
  return my.getSystemInfoSync().pixelRatio * v;
}
/**
 * 绘制一条曲线路径
 * @param  {Object} ctx canvas渲染上下文
 * @param  {Array<number>} start 起点
 * @param  {Array<number>} end 终点
 * @param  {number} curveness 曲度(0-1)
 */
export function drawCurvePath(ctx, start, end, curveness) {
  // 计算中间控制点
  ctx.beginPath();

  ctx.lineWidth = regDpr(2);
  ctx.strokeStyle = '#fff';
  const cp = [
    (start[0] + end[0]) / 2 - (start[1] - end[1]) * curveness,
    (start[1] + end[1]) / 2 - (end[0] - start[0]) * curveness,
  ];
  ctx.moveTo(regDpr(start[0]), regDpr(start[1]));
  ctx.quadraticCurveTo(
    regDpr(cp[0]),
    regDpr(cp[1]),
    regDpr(end[0]),
    regDpr(end[1])
  );
  ctx.stroke();
}

function drawCircular({ x, y, r, ctx, color = '#fff' }) {
  ctx.beginPath();
  ctx.arc(regDpr(x), regDpr(y), regDpr(r), 0, Math.PI * 2, false);
  ctx.fillStyle = color;
  ctx.fill();
}

function drawGradientCircular({
  ctx,
  r1,
  r2,
  x,
  y,
  color1 = '#fff',
  color2 = '#ddd',
  stroke,
  strokeColor = '#fff',
}) {
  ctx.beginPath();
  // 添加圆弧
  ctx.arc(regDpr(x), regDpr(y), regDpr(r2), 0, Math.PI * 2, false);
  ctx.closePath();
  ctx.lineWidth = regDpr(4);
  // 再次创建圆形渐变
  const lg2 = ctx.createRadialGradient(
    regDpr(x),
    regDpr(y),
    regDpr(r1),
    regDpr(x),
    regDpr(y),
    regDpr(r2)
  );
  // 向圆形渐变上添加颜色
  lg2.addColorStop(0, color1);
  lg2.addColorStop(1, color2);
  // 设置使用圆形渐变作为填充颜色
  ctx.fillStyle = lg2;
  ctx.fill();

  ctx.strokeStyle = strokeColor;
  if (stroke) {
    ctx.stroke();
  }
}

function drawText({ ctx, x, y, text }) {
  ctx.beginPath();
  ctx.font = `${regDpr(10)}px Arial`;
  ctx.fillStyle = '#11264d';
  ctx.textAlign = 'center';
  ctx.fillText(text, regDpr(x), regDpr(y + 5));
}
function drawTextWithBg({ ctx, x, y, r, text, text2 = '' }) {
  drawGradientCircular({
    ctx,
    x: x,
    y: y,
    r1: 0,
    r2: r,
    color1: '#CADEEE',
    color2: '#fff',
    stroke: false,
  });
  if (text2) {
    drawText({ x, y: y - 7, ctx, text });
    drawText({ x, y: y + 6, ctx, text: text2 });
  } else {
    drawText({ x, y, ctx, text });
  }
}

export function useDraw() {
  const carBody = ref<any>([]);
  const battery = ref<any>([]);
  const maintain = ref<any>([]);
  const behaviour = ref<any>([]);

  function draw({ canvas, ctx, el, success }) {
    const dpr = my.getSystemInfoSync().pixelRatio;
    const w = el[0].width;
    const h = el[0].height;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    // canvas的中心点
    const cx = w / 2;
    const ch = h / 2;
    // 大小圆半径
    const arcRadiusMin = 130;
    const arcRadiusMax = 150;

    //  渐变大圆
    drawGradientCircular({
      ctx,
      x: cx,
      y: ch,
      r1: 0,
      r2: arcRadiusMax,
      color2: '#CADEEE',
      color1: '#fff',
      stroke: true,
    });
    //  渐变小圆
    drawGradientCircular({
      ctx,
      x: cx,
      y: ch,
      r1: arcRadiusMin - 90,
      r2: arcRadiusMin,
      color1: '#CADEEE',
      color2: '#fff',
      stroke: false,
    });

    // 中心小圆半径
    //  中心小圆，内嵌车辆
    const radiusInner = 40;
    drawGradientCircular({
      ctx,
      x: cx,
      y: ch,
      r1: radiusInner - 30,
      r2: radiusInner,
      color1: '#CADEEE',
      color2: '#fff',
      stroke: false,
    });

    // 绘制纵横圆点
    // 从中心点开始向下画，第一个点为radiusInner + 3 后续加 offset
    for (let i = 0; i < 5; i++) {
      const offset = 16 * i;
      const r = miniPointsArcRadius + i / 2;
      const x = cx;
      const y = ch + radiusInner + offetMiniArc + offset;
      behaviour.value?.push([x, y]);
      drawCircular({
        x,
        y,
        ctx,
        r,
      });
    }
    // 从中心点开始向上画
    for (let i = 0; i < 5; i++) {
      const offset = 16 * i;
      const r = miniPointsArcRadius + i / 2;
      const x = cx;
      const y = ch - (radiusInner + offetMiniArc + offset);
      carBody.value?.push([x, y]);
      drawCircular({
        x,
        y,
        ctx,
        r,
      });
    }

    // 向右绘制横向圆点
    for (let i = 0; i < 5; i++) {
      const offset = 16 * i;
      const r = miniPointsArcRadius + i / 2;
      const x = cx + (radiusInner + offetMiniArc + offset);
      const y = ch;
      maintain.value?.push([x, y]);
      drawCircular({
        x,
        y,
        ctx,
        r,
      });
    }
    // left
    for (let i = 0; i < 5; i++) {
      const offset = 16 * i;
      const r = miniPointsArcRadius + i / 2;
      const x = cx - (radiusInner + offetMiniArc + offset);
      const y = ch;
      battery.value?.push([x, y]);
      drawCircular({
        x,
        y,
        ctx,
        r,
      });
    }

    // 画文字及圆
    const arcWithTextRadius = arcRadiusMax - arcRadiusMin;
    // top
    drawTextWithBg({
      x: cx,
      y: ch - arcRadiusMax,
      ctx,
      r: arcWithTextRadius,
      text: '车身',
    });
    // bottom
    drawTextWithBg({
      x: cx,
      y: ch + arcRadiusMax,
      ctx,
      r: arcWithTextRadius,
      text: '驾驶',
      text2: '行为',
    });
    // left
    drawTextWithBg({
      x: cx - arcRadiusMax,
      y: ch,
      ctx,
      r: arcWithTextRadius,
      text: '电池',
    });
    // right
    drawTextWithBg({
      x: cx + arcRadiusMax,
      y: ch,
      ctx,
      r: arcWithTextRadius,
      text: '维保',
    });
    const headerImg = canvas.createImage();
    headerImg.src = IMG_URL; //微信请求返回头像
    headerImg.onload = () => {
      ctx.drawImage(
        headerImg,
        regDpr(cx - 20),
        regDpr(ch - 25),
        regDpr(44),
        regDpr(50)
      );
    };

    success &&
      success({
        carBody: carBody.value,
        behaviour: behaviour.value,
        maintain: maintain.value,
        battery: battery.value,
      });
    console.log({
      battery: battery.value,
    });
  }
  return {
    draw,
    carBody,
    behaviour,
    maintain,
    battery,
    drawCircular,
  };
}
