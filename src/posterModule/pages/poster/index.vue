<template>
  <view class="overflow-hidden h-full">
    <tui-poster
      id="poster"
      ref="poster"
      :width="width"
      :height="height"
    ></tui-poster>
    <!-- <Qr
      v-if="url"
      id="myQrcode"
      ref="qrcode"
      width="260"
      :code="url"
      style="visibility: hidden"
    ></Qr> -->
  </view>
</template>

<script setup lang="ts">
import { Base64, goPages, nrNavigateTo } from '@/utils/index';
// import Qr from '@/components/qr/kk.vue';
//注意：绘制顺序按照数组数据先后顺序
import Taro, { getCurrentInstance, useRouter } from '@tarojs/taro';
import mainImg from './main.jpg';
import { reactive, ref } from 'vue';
import { USER_INFO, getStore } from '@/utils';
import DaUrl from './da.png';
import { onMounted } from 'vue';
import { onBeforeMount } from 'vue';
definePageConfig({
  usingComponents: {
    'tui-poster': '@/components/tui-poster/tui-poster',
  },
});
const url = ref('');
const params = useRouter().params ?? {};
const { page } = getCurrentInstance();
let $poster;
let width = 400;
let height = 430;
let bb = ref();
let {
  openDate: openDatePoster = '',
  helpTimes: helpTimesPoster = '0',
  money = '400',
} = params;

const state = reactive({
  show: false,
  basicPosterUrl: '',
});

const basicPosterData: any[] = [
  {
    type: 'rect',
    style: {
      left: 0,
      top: 0,
      width,
      height,
      backgroundColor: 'transparent',
    },
  },
  {
    type: 'image',
    src: mainImg,
    style: {
      left: 0,
      top: 0,
      width,
      height,
      borderRadius: 20,
    },
  },
  {
    type: 'text',
    text: `开奖时间：${openDatePoster}`,
    style: {
      left: 100,
      top: 210,
      fontSize: 14,
      color: '#f5f5f5',
      width: 400,
      spacing: 12,
    },
  },
  {
    type: 'text',
    text: '扫码打开前晨APP',
    style: {
      left: 152,
      top: 266,
      fontSize: 14,
      color: '#666',
      width: 400,
      frontSize: 20,
      spacing: 12,
    },
  },
  {
    type: 'text',
    text: `${helpTimesPoster}人已助力`,
    style: {
      top: 326,
      left: 152,
      fontSize: 14,
      color: '#11264d',
      width: 400,
      fontWeight: 'bold',
    },
  },
  {
    type: 'text',
    text: '助TA瓜分价值',
    style: {
      top: 344,
      left: 152,
      fontSize: 14,
      color: '#11264d',
      fontWeight: 'bold',
      width: 400,
    },
  },
  {
    type: 'text',
    text: '元前晨充电币',
    style: {
      top: 344,
      left: 294,
      fontSize: 14,
      color: '#11264d',
      fontWeight: 'bold',
      width: 400,
    },
  },
];
onBeforeMount(() => {
  getUrl();
});

onMounted(() => {
  setTimeout(() => {
    let { avatar = '', mobile = '' } = getStore(USER_INFO) || {};
    Taro.canvasToTempFilePath({
      // 把画布转化成临时文件
      x: 0,
      y: 0,
      width: 260, // 截取的画布的宽
      height: 260, // 截取的画布的高
      destWidth: 260, // 保存成的画布宽度
      destHeight: 260, // 保存成的画布高度
      fileType: 'jpg', // 保存成的文件类型
      quality: 0.8, // 图片质量
      canvasId: 'myQrcode', // 画布ID
      success(res) {
        my.request({
          url: res.tempFilePath,
          responseType: 'arraybuffer', //最关键的参数，设置返回的数据格式为arraybuffer
          success: (res) => {
            //把arraybuffer转成base64
            let base64img = Taro.arrayBufferToBase64(res.data);
            //不加上这串字符，在页面无法显示的哦
            base64img = 'data:image/jpeg;base64,' + base64img;
            bb.value = base64img;
            //打印出base64字符串，可复制到网页校验一下是否是你选择的原图片呢
            setJson({ avatar, mobile, base64img });
          },
        });
      },
    });
  }, 200);
});

function basicDraw() {
  $poster = page.selectComponent('#poster');

  if (!$poster) return;
  Taro.showLoading({
    title: '生成海报中...',
  });

  $poster.draw(basicPosterData, (filePath) => {
    //绘制图片路径
    state.basicPosterUrl = filePath;
    savePic();
    Taro.hideLoading();
  });
}
function savePic() {
  Taro.showShareImageMenu({
    path: state.basicPosterUrl,
    complete() {
      goPages('index');
    },
  });
}
function getUrl() {
  let { member_id = '' } = getStore(USER_INFO) || {};
  if (!member_id) {
    nrNavigateTo('login');
    return;
  }

  let base64Json = Base64.encode(
    JSON.stringify({
      type: '2',
      router: `nrz://com.qianchen/app/webview?isNeedLogin=true&url=https://h5.newrizon.cloud/chargeCoinActivity?helpMemberId=${member_id}`,
    })
  );
  url.value = `https://bevwjw.jgmlink.cn/Aa6F?info=${base64Json}`;
}

function setJson({ avatar, mobile, base64img }) {
  basicPosterData.push({
    imgType: '3',
    type: 'image',
    src: base64img,
    style: {
      left: 34,
      top: 250,
      width: 110,
      height: 110,
      borderRadius: 0,
    },
  });
  basicPosterData.push({
    type: 'text',
    text: money,
    style: {
      top: 344,
      left: 244,
      fontSize: 26,
      color: '#11264d',
      fontWeight: 'bold',
      width: 400,
    },
  });
  basicPosterData.push({
    type: 'text',
    text: `帮助${mobile.replace(
      mobile.substring(3, 7),
      '****'
    )}助力瓜分得前晨充电币`,
    style: {
      left: 46,
      top: 180,
      fontSize: 18,
      color: '#fff',
      width: 400,
    },
  });
  Taro.downloadFile({
    url: avatar,
    success(ret) {
      if (ret.statusCode === 200) {
        basicPosterData.push({
          type: 'image',
          src: ret.tempFilePath,
          style: {
            left: 142,
            top: 16,
            width: 118,
            height: 118,
            borderRadius: 118,
          },
        });
      }
      basicDraw();
    },
    fail(err) {
      basicPosterData.push({
        type: 'image',
        src: DaUrl,
        style: {
          left: 142,
          top: 17,
          width: 119,
          height: 119,
          borderRadius: 118,
        },
      });
      basicDraw();
    },
  });
}
</script>
