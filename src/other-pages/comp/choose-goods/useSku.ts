export function isContain(a1: string[], a2: string[]): boolean {
  let long: string[] = [];
  let short: string[] = [];

  //这样处理 不管谁长度大都能区别a1 ,a2是否为包含关系
  if (a1.length >= a2.length) {
    long = a1;
    short = a2;
  } else {
    long = a2;
    short = a1;
  }

  // 遍历短的 短的每一个都在长的内
  return short.every((item) => {
    return long.includes(item);
  });
}

export function getChoosedKeys(skuInfo) {
  const keys: string[] = []; // [x,x,x]
  for (const item of skuInfo) {
    const ret = item.value
      .filter((k: any) => k.checked)
      .map((item) => item.specificationValue);
    keys.push(...ret);
  }
  return keys;
}

export function diff(a1: string[], a2: string[]) {
  // 遍历长的  查看每一项在不在短的内
  let long: string[] = [];
  let short: string[] = [];

  //这样处理 不管谁长度大都能区别a1 ,a2是否为包含关系
  if (a1.length >= a2.length) {
    long = a1;
    short = a2;
  } else {
    long = a2;
    short = a1;
  }

  return long.filter((item) => {
    return !short.includes(item);
  });
}
export function findNeedDisabledKeys(skuList, skuInfo) {
  const choosedKeys = getChoosedKeys(skuInfo);
  const needDisable: string[] = [];

  for (const item of skuList) {
    const specs: string[] = item.specs.split(',');
    if (choosedKeys.length > 2) {
      if (
        isContain(specs, [choosedKeys[0], choosedKeys[1]]) &&
        item.stock <= 0
      ) {
        needDisable.push(...diff(specs, choosedKeys));
      }
      if (
        isContain(specs, [choosedKeys[0], choosedKeys[2]]) &&
        item.stock <= 0
      ) {
        needDisable.push(...diff(specs, choosedKeys));
      }
      if (
        isContain(specs, [choosedKeys[1], choosedKeys[2]]) &&
        item.stock <= 0
      ) {
        needDisable.push(...diff(specs, choosedKeys));
      }
    } else {
      if (isContain(specs, choosedKeys) && item.stock <= 0) {
        needDisable.push(...diff(specs, choosedKeys));
      }
    }
  }

  return needDisable;
}
