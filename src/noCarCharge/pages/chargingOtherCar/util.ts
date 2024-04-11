export class Vector {
  m: number; // 线段长度
  a: number; // 角度
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
