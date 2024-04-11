<template>
  <view
    class="tui-waterfall__box"
    :style="{
      paddingLeft: leftGap,
      paddingRight: rightGap,
      background: backgroundColor,
      borderRadius: radius,
    }"
  >
    <view
      id="tui-waterfall__left"
      class="tui-waterfall__list"
      :style="{ marginRight: columnGap }"
    >
      <view v-for="(item, index) in state.leftList" :key="'r' + index">
        <slot name="left" :entity="item" :index="index"></slot>
      </view>
    </view>
    <view id="tui-waterfall__right" class="tui-waterfall__list">
      <view v-for="(item, index) in state.rightList" :key="'r' + index">
        <slot name="right" :entity="item" :index="index"></slot>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import Taro from '@tarojs/taro';
import { watch, reactive, onMounted } from 'vue';
interface Props {
  columnGap?: string;
  listData?: any[];
  //每页数据条数(固定条数),当总数据长度小于等于该数时表示第一页数据，刷新重置
  type?: number | string;
  //瀑布流列数，目前支持最大值为2
  columnCount?: number | string;
  //列与列的间隙
  //左侧和列表的间隙
  leftGap?: number | string;
  //右侧和列表的间隙
  rightGap?: number | string;
  //列表背景色，可使用渐变色
  backgroundColor?: string;
  //列表外层容器圆角值
  radius?: number | string;
}
const storeData = [];
const props = withDefaults(defineProps<Props>(), {
  listData: () => [],
  pageSize: 10,
  type: 1,
  columnCount: 2,
  columnGap: '5px',
  leftGap: 0,
  rightGap: 0,
  backgroundColor: 'transparent',
  radius: 0,
});

const state = reactive<any>({
  leftList: [],
  rightList: [],
  init: true,
});

onMounted(() => {
  setTimeout(() => {
    updateData(props?.listData);
  }, 300);
});
async function updateData(data) {
  for (let item of data) {
    await render(item);
  }
}
async function render(item) {
  let obj: any = await getContainerHeight();
  return await new Promise((resolve, reject) => {
    if (obj && typeof obj.leftHeight === 'number') {
      console.log('333aa', obj.leftHeight, obj.rightHeight);

      if (obj.leftHeight <= obj.rightHeight) {
        state.leftList.push(item);
      } else {
        state.rightList.push(item);
        console.log('1aa');
      }
      setTimeout(() => {
        resolve(true);
      }, 0);
    } else {
      reject(false);
    }
  });
}
async function getContainerHeight() {
  return await new Promise((resolve, reject) => {
    const query = Taro.createSelectorQuery();
    query
      .selectAll('#tui-waterfall__left, #tui-waterfall__right')
      .boundingClientRect((res) => {
        if (res && res[0]) {
          const leftHeight = res[0]?.height;
          const rightHeight = res[1]?.height;
          resolve({
            leftHeight: leftHeight,
            rightHeight: rightHeight,
          });
        } else {
          reject(res);
        }
      })
      .exec();
  });
}

watch(
  () => props?.listData,
  (v) => {
    if (!v?.length) return;
    updateData(v);
  }
);
</script>

<style>
.tui-waterfall__box {
  width: 100%;
  display: inline-flex;
  justify-content: space-between;
  flex-direction: row;
  flex-wrap: wrap;
  box-sizing: border-box;
  align-items: flex-start;
}

.tui-waterfall__list {
  flex: 1;
}
</style>
