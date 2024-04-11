export function regDataList(list) {
  return list?.map((item) => {
    return {
      ...item,
      text: item.value,
      value: +item.key,
      active: false,
    };
  });
}
