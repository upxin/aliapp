/** @type {HTMLCanvasElement} */

export class Canvas {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private dpr;
  constructor(canvas: HTMLCanvasElement, node) {
    this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    this.dpr = my.getSystemInfoSync().pixelRatio;
    const w = node?.[0]?.width;
    const h = node?.[0]?.height;

    canvas.width = this.regNum(w);
    canvas.height = this.regNum(h);
    this.canvas = canvas;
  }
  regNum(v) {
    return this.dpr * v;
  }

  addLine({
    fromX,
    fromY,
    toX,
    toY,
    lineCap = 'butt',
    lineWidth = 2,
    color = 'blue',
  }) {
    this.ctx.beginPath();
    this.ctx.moveTo(fromX, fromY);
    this.ctx.lineWidth = lineWidth;
    this.ctx.lineCap = lineCap as CanvasLineCap;
    this.ctx.lineTo(toX, toY);
    this.ctx.strokeStyle = color;
    this.ctx.stroke();
  }

  addArc({
    x,
    y,
    r,
    startAngle = 0,
    endAngle = Math.PI * 2,
    color = '#000',
    lineWidth = 1,
  }) {
    this.ctx.beginPath();
    this.ctx.arc(x, y, r, startAngle, endAngle, false);
    this.ctx.lineWidth = this.regNum(lineWidth);
    this.ctx.strokeStyle = color;
    this.ctx.stroke();
  }

  addText(text = 'Hello world') {
    this.ctx.font = '50px serif';
    this.ctx.fillText(text, 50, 90);
  }
}
export class Vector {
  m;
  a;
  constructor(magnitude, angle) {
    this.m = magnitude;
    this.a = angle;
  }
  getY() {
    //计算y轴坐标
    return this.m * Math.sin(this.a);
  }

  getX() {
    return this.m * Math.cos(this.a);
  }
  setMag(newM) {
    this.m = newM;
  }
}
