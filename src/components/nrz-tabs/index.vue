<template>
  <scroll-view
    class="nrz-scroll__view h-40px"
    :class="[
      isFixed && !isSticky ? 'nrz-tabs__fixed' : '',
      isSticky ? 'nrz-tabs__sticky' : '',
      classView,
    ]"
    :style="{
      background: backgroundColor,
      top: isFixed || isSticky ? top + 'px' : 'auto',
      zIndex: isFixed || isSticky ? zIndex : 'auto',
    }"
    :scroll-x="scrolling"
    :scroll-with-animation="scrolling"
    :show-scrollbar="false"
    :scroll-left="scrollLeft"
  >
    <view class="nrz-tabs__wrap h-full">
      <view
        class="nrz-tabs__list h-full"
        :class="[scroll ? 'nrz-tabs__scroll' : '']"
      >
        <view
          v-for="(item, index) in tabs"
          :key="index"
          class="nrz-tabs__item h-full"
          :data-index="index"
          @tap="handleClick"
        >
          <view
            class="nrz-item__child"
            :class="[
              childClass,
              currentTab == index ? 'text-16px' : 'text-14px',
            ]"
            :style="{
              color: currentTab == index ? getSelectedColor : color,
              fontWeight: bold && currentTab == index ? 'bold' : 'normal',
              transform: `scale(${currentTab == index ? scale : 1})`,
              ...getStyle(index),
            }"
          >
            {{ item.title ? item.title : item }}
          </view>
        </view>
        <view
          class="nrz-tabs__line h-3px"
          :class="[needTransition ? 'nrz-transition' : '']"
          :style="{
            background: getSliderBgColor,
            borderRadius: sliderRadius,
            bottom: bottom,
            width: lineWidth + 'px',
            transform: `translateX(${translateX}px)`,
          }"
        >
        </view>
      </view>
    </view>
  </scroll-view>
</template>

<script>
import Taro from '@tarojs/taro';

export default {
  name: 'TuiTab',
  props: {
    // 标签页数据源
    tabs: {
      type: Array,
      default() {
        return [];
      },
    },
    // 当前选项卡
    current: {
      type: Number,
      default: 0,
    },
    // 是否可以滚动
    scroll: {
      type: Boolean,
      default: false,
    },
    //组件左侧距离屏幕的间隙 单位rpx
    leftGap: {
      type: [Number, String],
      default: 0,
    },
    backgroundColor: {
      type: String,
      default: '#fff',
    },
    //字体大小
    size: {
      type: Number,
      default: 0,
    },
    //字体颜色
    color: {
      type: String,
      default: '#666',
    },
    //选中后字体颜色
    selectedColor: {
      type: String,
      default: '',
    },
    //选中后 是否加粗 ，未选中则无效
    bold: {
      type: Boolean,
      default: false,
    },
    //2.3.0+
    scale: {
      type: [Number, String],
      default: 1,
    },
    //滑块背景颜色
    sliderBgColor: {
      type: String,
      default: '',
    },
    //滑块 radius
    sliderRadius: {
      type: String,
      default: '6px',
    },
    //滑块bottom
    bottom: {
      type: String,
      default: '0',
    },
    //是否固定
    isFixed: {
      type: Boolean,
      default: false,
    },
    //吸顶效果，为true时isFixed失效
    isSticky: {
      type: Boolean,
      default: false,
    },
    //isFixed=true时，tab top值 px
    top: {
      type: Number,
      default: 0,
    },
    zIndex: {
      type: [Number, String],
      default: 996,
    },
  },
  emits: ['change', 'update:current'],
  options: {
    virtualHost: true,
  },
  data() {
    let childClass = `tui_10_${Math.ceil(Math.random() * 10e5).toString(36)}`;
    let classView = `tui_01_${Math.ceil(Math.random() * 10e5).toString(36)}`;
    return {
      childClass,
      classView,
      /* 未渲染数据 */
      windowWidth: 0, // 屏幕宽度
      tabItems: [], // 所有 tab 节点信息

      /* 渲染数据 */
      scrolling: true, // 控制 scroll-view 滚动以在异步加载数据的时候能正确获得 dom 信息
      needTransition: false, // 下划线是否需要过渡动画
      translateX: 0, // 下划 line 的左边距离
      lineWidth: 0, // 下划 line 宽度
      scrollLeft: 0, // scroll-view 左边滚动距离
      currentTab: 0,
      gap: -1,
    };
  },
  computed: {
    getSelectedColor() {
      return this.selectedColor || '#11264d';
    },
    getSliderBgColor() {
      return this.sliderBgColor || '#11264d';
    },
  },
  watch: {
    /**
     * 监听数据变化, 如果改变重新初始化参数
     */
    tabs(newVal, oldVal) {
      this.scrolling = false;
      // 异步加载数据时候, 延迟执行 init 方法, 防止无法正确获取 dom 信息
      setTimeout(() => this.init(), 200);
    },
    /**
     *  监听 currentTab 变化, 做对应处理
     */
    current(newVal, oldVal) {
      this.scrollByIndex(newVal);
    },
    leftGap(newVal) {
      this.gap = Number(newVal);
    },
  },
  created() {
    this.currentTab = this.current;
  },
  mounted() {
    this.gap = Number(this.leftGap);
    setTimeout(() => {
      this.init();
    }, 300);
  },
  methods: {
    getStyle(i) {
      if (this.size) {
        return {
          fontSize:
            this.currentTab == i
              ? Taro.pxTransform(this.size + 2)
              : Taro.pxTransform(this.size),
        };
      }
      return {};
    },
    /**
     * 切换菜单
     */
    handleClick(e) {
      let index = Number(e.currentTarget.dataset.index);
      this.$emit('change', {
        index: index,
      });
      this.$emit('update:current', index);
      this.scrollByIndex(index);
    },
    /**
     * 滑动到指定位置
     * @param tabCur: 当前激活的tabItem的索引
     * @param needTransition: 下划线是否需要过渡动画, 第一次进来应设置为false
     */
    scrollByIndex(tabCur, needTransition = true) {
      console.log('this.currentTab1111', this.tabItems, tabCur);
      let item = this.tabItems[tabCur];

      if (!item) return;
      let itemWidth = item.width || 0,
        itemLeft = item.left || 0;
      this.needTransition = needTransition;
      this.currentTab = tabCur;
      // 超出滚动的情况
      if (this.scroll) {
        // 保持滚动后当前 item '尽可能' 在屏幕中间
        let scrollLeft = itemLeft - (this.windowWidth - itemWidth) / 2;
        this.scrollLeft = scrollLeft;
        this.translateX = itemLeft - this.gap;
        this.lineWidth = itemWidth;
      } else {
        // 不超出滚动的情况
        this.translateX = itemLeft - this.gap;
        this.lineWidth = itemWidth;
      }
    },
    /**
     *  初始化函数
     */
    init() {
      const { windowWidth } = Taro.getSystemInfoSync();
      const query = my.createSelectorQuery();
      query
        .select('.nrz-scroll__view')
        .boundingClientRect()
        .exec((res) => {
          if (res) {
            this.windowWidth = res.width || windowWidth;
          }
        });

      query
        .selectAll('.nrz-item__child')
        .boundingClientRect()
        .exec((res) => {
          this.scrolling = true;
          this.tabItems = res?.[1];
          this.scrollByIndex(this.currentTab, false);
        });
    },
  },
};
</script>

<style>
.nrz-scroll__view {
  width: 100%;
  overflow: hidden;
}

.nrz-tabs__fixed {
  position: fixed;
  left: 0;
}

.nrz-tabs__sticky {
  position: sticky;
  left: 0;
}

.nrz-tabs__wrap {
  padding-bottom: 20rpx;
}

.nrz-tabs__list {
  position: relative;
  display: flex;
}

.nrz-tabs__scroll {
  white-space: nowrap !important;
  display: block !important;
}

.nrz-tabs__scroll .nrz-tabs__item {
  padding: 0 30rpx;
  display: inline-flex;
}

.nrz-tabs__scroll .nrz-item__child {
  display: block !important;
}

.nrz-tabs__item {
  flex: 1;
  text-align: center;
  padding: 0 10rpx;
  box-sizing: border-box;
  transition: color 0.3s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 2;
}

.nrz-item__child {
  display: inline-block;
  transition: transform 0.15s;
  transform-origin: center center;
}

.nrz-tabs__line {
  position: absolute;
  left: 0;
  width: 0;
  display: inline-block;
  z-index: 1;
}

.nrz-tabs__line.nrz-transition {
  transition: width 0.3s, transform 0.3s;
}
/* #ifndef APP-NVUE */
::-webkit-scrollbar {
  width: 0 !important;
  height: 0 !important;
  color: transparent !important;
  display: none;
}
/* #endif */
</style>
