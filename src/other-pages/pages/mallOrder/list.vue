<template>
  <MainScroll
    :has-more="hasMore"
    :height="height"
    :has-data="!!list?.length"
    :init-loading="initLoading"
    :pt="0"
    @scroll-reach-bottom="loadMore"
    @end-pull-down="refresh"
  >
    <section
      v-for="(item, index) in list"
      :key="item?.spuId"
      :class="{ 'nr-border-b': index < list?.length - 1 }"
      @click="
        () => {
          naviTodetail(item);
        }
      "
    >
      <view class="flex px-15px py-16px bg-fff">
        <BgImg
          class="bg-center bg-cover w-100px h-100px"
          only-img
          :url="item?.imageUrl"
        >
        </BgImg>
        <view class="box-border flex flex-col justify-between flex-1 pl-15px">
          <view class="text-16px">{{ item?.title }}</view>
          <view class="flex opacity-40 text-12px">
            <span> {{ item?.spec }}</span>
            <span class="ml-10px">x</span>
            <span>{{ item?.amount }}</span>
          </view>
          <div class="flex items-center opacity-40">
            <view class="flex items-center mr-10px">
              <view class="mr-2px nrz-thin">￥</view>
              <view>{{ item?.price }}</view>
            </view>
            <view class="flex items-center">
              <view
                class="icon-jinbi iconfont text-14px mr-2px nrz-thin"
              ></view>
              <view>{{ item?.price * 100 }}</view>
            </view>
          </div>
          <view class="flex items-center justify-end">
            <div>实付：</div>
            <view class="flex items-center">
              <view class="nrz-thin">￥</view>
              <view>{{ item?.payMoney }}</view>
            </view>
            <span class="mx-10px">+</span>
            <view class="flex items-center">
              <view
                class="icon-jinbi iconfont text-14px mr-2px nrz-thin"
              ></view>
              <view>{{ item?.payPoints }}</view>
            </view>
          </view>
        </view>
      </view>
      <Item
        :detail-item="item"
        @update="refresh"
        @comment="_showCommentPanel"
        @goDetail="naviTodetail(item)"
      ></Item>
    </section>
  </MainScroll>
  <NrzBottomPopup v-model:show="showComment" tips="商品评价" @click.stop="">
    <div class="flex px-15px">
      <div>
        <nut-rate
          v-model="commentScore"
          active-color="#EF8A3C"
          icon-size="24"
        />
        <div class="flex justify-between text-12px opacity-34 pr-14px mt-8px">
          <span>很差</span>
          <span>差</span>
          <span>一般</span>
          <span>好</span>
          <span>很好</span>
        </div>
      </div>
      <div class="ml-10px">{{ commentScore }}/5</div>
    </div>
    <div class="flex items-center justify-end mt-20px text-12px px-15px">
      <NrzCheckBox
        v-model:checked="isAnonymous"
        color="#11264d"
        borderColor="#11264d"
        size="28rpx"
      >
        匿名评论
      </NrzCheckBox>
      <div class="opacity-42 ml-6px">对门店和其他用户隐藏用户名和头像</div>
    </div>
    <div class="flex justify-center my-20px px-26px">
      <NrzBtn class="w-full" @click="_comment"> 提交评价 </NrzBtn>
    </div>
  </NrzBottomPopup>
</template>
<script lang="ts">
import { onShareAppMessage, onShareTimeline } from '@/utils/index';
export default {
  onShareAppMessage,
  onShareTimeline,
};
</script>
<script lang="ts" setup>
import MainScroll from '@/components/scroll-main/index.vue';
import { watch, ref } from 'vue';
import { get_order_list, commentGoods } from '@/api/index';
import { useRequest } from '@/hooks/index';
import NrzBottomPopup from '@/components/nrz-bottom-popup/index.vue';
import NrzBtn from '@/components/nrz-button/index.vue';
import BgImg from '@/components/bg-img/bg-img.vue';
import { nrNavigateTo } from '@/utils/index';
import Item from './item.vue';
import NrzCheckBox from '@/components/nrz-checkbox/index.vue';

definePageConfig({ transparentTitle: 'always',titlePenetrate: 'YES',defaultTitle: '', });
let orderStatusMap = {
  0: '待支付',
  1: '待发货',
  2: '待收货',
  3: '已完成',
  4: '订单关闭',
};
let expressMap = {
  JD: 0,
  SFEXPRESS: 1,
  YTO: 2,
  STO: 3,
  EMS: 4,
  YUNDA: 5,
  ZTO56: 6,
  JITU: 7,
};
interface Props {
  height: string | number;
  type: string | number;
}
let props = withDefaults(defineProps<Props>(), {
  height: '',
  type: '',
});
let isAnonymous = ref(false);
let commentScore = ref(5);
let pageNum = 1;
let pageSize = 10;
let list = ref<any[]>([]);
let hasMore = ref(true);
let initLoading = ref(true);

function naviTodetail({ orderId, orderStatus }) {
  orderId;
  nrNavigateTo('mallOrderDetail', {
    orderId,
    orderStatus: orderStatusMap[orderStatus],
  });
}

function getList(more?) {
  get_order_list({ type: props.type, pageSize, pageNum }).then((res) => {
    setTimeout(() => {
      initLoading.value = false;
    }, 1000);
    if (res.code !== 200) return;
    if (more) {
      list.value = [...list.value, ...res?.data?.list];
    } else {
      list.value = res?.data?.list;
    }
    hasMore.value = res?.data?.total > pageNum * pageSize;
    pageNum = pageNum + 1;
  });
}
async function refresh(finished?) {
  pageNum = 1;
  await getList();
  setTimeout(() => {
    finished && finished();
  }, 1000);
}
function loadMore() {
  if (hasMore.value) {
    getList(true);
  }
}
let showComment = ref(false);
let { run: _commentGoods } = useRequest(commentGoods, {
  showToast: true,
  showLoading: true,
  onSuccess: () => {
    showComment.value = false;
    refresh();
  },
});
let currentId;
function _showCommentPanel(orderId) {
  showComment.value = true;
  currentId = orderId;
}
function _comment() {
  console.log(currentId);

  _commentGoods({
    orderId: currentId,
    commentScore: commentScore.value,
    isAnonymous: isAnonymous.value ? '0' : '1',
  });
}

watch(
  () => props?.type,
  () => {
    pageNum = 1;
    initLoading.value = true;
    getList();
  },
  { immediate: true }
);

// bottom
</script>
