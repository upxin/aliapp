<template>
  <view class="container">
    <view class="tui-page__hd">
      <view class="tui-page__title">poster</view>
      <view class="tui-page__desc">配置数据绘制海报</view>
    </view>
    <view class="tui-page__bd tui-page__spacing">
      <nut-button @click="basicDraw">基础使用</nut-button>
      <nut-button @click="goodsPoster">商品海报</nut-button>
    </view>
    <Poster ref="poster" :width="560" :height="890" @ready="ready"></Poster>
  </view>
</template>

<script>
//注意：绘制顺序按照数组数据先后顺序
import Taro from '@tarojs/taro';
import Poster from '@/components/poster/index.vue';
export default {
  components: { Poster },
  data() {
    return {
      init: false,
      basicPosterUrl: '',
      basicPosterData: [
        {
          type: 'rect',
          style: {
            left: 0,
            top: 0,
            width: 560,
            height: 890,
            backgroundColor: '#ffffff',
          },
        },
        {
          type: 'text',
          text: 'ThorUI组件库',
          style: {
            left: 280,
            top: 60,
            fontSize: 32,
            color: '#333333',
            width: 560,
            fontWeight: 'bold',
            textAlign: 'center',
          },
        },
        {
          type: 'text',
          text: '简约而不简单一直是ThorUI的追求。 除了组件库ThorUI还会陆续发布一些常用模板，使开发更加高效。',
          style: {
            left: 24,
            top: 120,
            fontSize: 20,
            lineHeight: 32,
            color: '#333333',
            width: 500,
            rows: 2,
          },
        },
        {
          type: 'rect',
          style: {
            left: 30,
            top: 200,
            width: 120,
            height: 120,
            borderWidth: 1,
            borderColor: '#ff7900',
          },
        },
        {
          type: 'rect',
          style: {
            left: 180,
            top: 200,
            width: 120,
            height: 120,
            borderRadius: 120,
            backgroundColor: '#ff7900',
          },
        },
        {
          type: 'rect',
          style: {
            left: 320,
            top: 200,
            width: 120,
            height: 120,
            borderRadius: 20,
            backgroundColor: '#ff7900',
          },
        },
        {
          type: 'image',
          src: '/static/images/logo.png',
          style: {
            left: 30,
            top: 360,
            width: 120,
            height: 120,
            borderRadius: 120,
          },
        },
        {
          type: 'image',
          src: '/static/images/logo.png',
          style: {
            left: 180,
            top: 360,
            width: 120,
            height: 120,
            borderRadius: 20,
          },
        },
        {
          type: 'line',
          style: {
            left: 30,
            top: 600,
            endLeft: 520,
            endTop: 600,
            color: '#ff7900',
            width: 1,
          },
        },
        {
          type: 'line',
          style: {
            left: 30,
            top: 620,
            endLeft: 420,
            endTop: 620,
            color: '#ff7900',
            width: 2,
          },
        },
        {
          type: 'line',
          style: {
            left: 30,
            top: 640,
            endLeft: 320,
            endTop: 640,
            color: '#ff7900',
            width: 4,
          },
        },
        {
          type: 'text',
          text: '￥36.50',
          style: {
            left: 30,
            top: 720,
            fontSize: 20,
            color: '#999999',
            width: 200,
            lineThrough: true,
          },
        },
        {
          type: 'text',
          text: '￥11199.80',
          frontText: '￥36.50',
          style: {
            left: 30,
            top: 720,
            fontSize: 20,
            color: '#999999',
            width: 200,
            lineThrough: true,
            frontSize: 20,
            spacing: 12,
          },
        },
      ],
      goodsPosterUrl: '',
      goodsPosterData: [
        {
          type: 'rect',
          style: {
            left: 0,
            top: 0,
            width: 560,
            height: 890,
            backgroundColor: '#ffffff',
          },
        },
        {
          type: 'image',
          src: 'https://thorui.cn/extend/common/img_book.jpg',
          imgType: 2,
          style: {
            left: 30,
            top: 30,
            width: 500,
            height: 500,
          },
        },
        {
          type: 'text',
          text: '一个人的修养，看失意时的善良 陶瓷兔子 北京联合出版有限公司',
          style: {
            left: 30,
            top: 580,
            fontSize: 28,
            color: '#343434',
            width: 468,
            rows: 2,
            lineHeight: 36,
          },
        },
        {
          type: 'text',
          text: '￥36.50',
          style: {
            left: 30,
            top: 680,
            fontSize: 36,
            color: '#EB0909',
            width: 180,
          },
        },
        {
          type: 'text',
          text: '￥99.80',
          frontText: '￥36.50',
          style: {
            left: 30,
            top: 680,
            fontSize: 20,
            color: '#999999',
            width: 200,
            lineThrough: true,
            frontSize: 36,
            spacing: 12,
          },
        },
        {
          type: 'text',
          text: 'ThorUI示例小程序',
          style: {
            left: 30,
            top: 780,
            fontSize: 32,
            color: '#333333',
          },
        },
        {
          type: 'text',
          text: '长按识别·立即体验',
          style: {
            left: 30,
            top: 835,
            fontSize: 24,
            color: '#333333',
          },
        },
        {
          type: 'image',
          src: 'https://thorui.cn/extend/share/applets.png',
          imgType: 2,
          style: {
            left: 384,
            top: 735,
            width: 130,
            height: 130,
          },
        },
      ],
    };
  },
  methods: {
    ready() {
      this.init = true;
    },
    basicDraw() {
      if (!this.init || !this.$refs.poster) return;
      if (this.basicPosterUrl) {
        Taro.previewImage({
          urls: [this.basicPosterUrl],
        });
        return;
      }
      Taro.showLoading({
        title: '绘制中...',
      });
      this.$refs.poster.draw(this.basicPosterData, (filePath) => {
        //绘制图片路径
        console.log(filePath);
        this.basicPosterUrl = filePath;
        Taro.previewImage({
          urls: [filePath],
        });
        Taro.hideLoading();
      });
    },
    goodsPoster() {
      if (!this.init || !this.$refs.poster) return;
      if (this.goodsPosterUrl) {
        Taro.previewImage({
          urls: [this.goodsPosterUrl],
        });
        return;
      }
      Taro.showLoading({
        title: '绘制中...',
      });
      this.$refs.poster.draw(this.goodsPosterData, (filePath) => {
        //绘制图片路径
        console.log(filePath);
        this.goodsPosterUrl = filePath;
        Taro.previewImage({
          urls: [filePath],
        });
        Taro.hideLoading();
      });
    },
  },
};
</script>
