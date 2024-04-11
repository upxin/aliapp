<script lang="tsx">
import { defineComponent, ref } from 'vue';
import Taro from '@tarojs/taro';
import { Routes, nrNavigateTo } from '@/utils/index';
import { store } from '@/stores/index';
import NrzImg from '@/components/nrz-img/index.vue';
import { homeNearby } from '@/api/home';
import { usePosition } from '@/hooks/index';

export default defineComponent({
  setup() {
    const nearbyShop = ref();
    usePosition({ success: getHomeNearby });

    function getHomeNearby({ latitude, longitude }) {
      const location = latitude ? `${longitude},${latitude}` : '';
      homeNearby({
        location,
      }).then((res) => {
        console.log(res);
        nearbyShop.value = res.data;
      });
    }
    function callTel(e) {
      e.stopPropagation();
      Taro.makePhoneCall({
        phoneNumber:
          nearbyShop.value?.shop?.telephone ||
          nearbyShop.value?.shop?.leader_phone,
      });
    }
    function handleAround() {
      nrNavigateTo('carShopList');
    }
    function handleBtn(e, type) {
      e.stopPropagation();
      if (type === 2) {
        nrNavigateTo('testDrive', {
          shopName: nearbyShop.value?.shop?.name,
          shopId: nearbyShop.value?.shop?.code,
        });
      } else {
        nrNavigateTo(Routes.CHOOSECARTYPE);
        return;
      }
    }

    function toMap(e) {
      e.stopPropagation();
      nrNavigateTo('shopMap', {
        addr: nearbyShop.value?.shop?.address,
        title: nearbyShop.value?.shop?.name,
      });
    }
    function toDetail(e) {
      e.stopPropagation();
      nrNavigateTo('shopeDetail', {
        id: nearbyShop.value?.shop?.code,
        commentNum: nearbyShop.value?.shop?.commentNum,
      });
    }

    return () => {
      return (
        <section>
          <view
            class="flex items-center justify-between mb-16px"
            onClick={() => {
              handleAround();
            }}
          >
            <view class="w-57px h-20px text-primary text-size-14px leading-20px">
              {nearbyShop.value?.title}
            </view>
            <span
              class="iconfont icon-down2 h-20px text-primary text-size-24px leading-20px"
              style="transform: rotate(-90deg)"
            ></span>
          </view>
          <view>
            <NrzImg
              mode="widthFix"
              src={nearbyShop.value?.shop?.pictureList?.[0]}
              class="w-full"
              onClick={toDetail}
            />
            <view class="py-14px">
              <view class="text-primary text-size-14px">
                {nearbyShop.value?.shop?.name}
              </view>
              <view class="mt-1 opacity-75 text-size-10px text-primary">
                {nearbyShop.value?.shop?.address}
              </view>
              <view class="flex items-center text-size-12px mt-10px">
                <view
                  class="flex items-center justify-between mr-10px"
                  onClick={toMap}
                >
                  <span class="iconfont icon-daohang text-primary text-size-15px"></span>
                  <view class="h-20px leading-20px ml-4px">
                    {nearbyShop.value?.shop?.km}km
                  </view>
                </view>
                <view
                  class="flex items-center justify-between"
                  onClick={callTel}
                >
                  <span class="iconfont icon-phone text-primary"></span>
                  <view class="h-20px leading-20px ml-4px">极速咨询</view>
                </view>
                {store().openPrepay ? (
                  <view class="flex justify-end flex-1 text-center h-28px leading-28px text-size-14px ml-auto">
                    <nut-button
                      shape="square"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBtn(e, 2);
                      }}
                      class="box-border border-primary nrz-thin  rounded-sm px-10px text-12px"
                    >
                      预约试驾
                    </nut-button>
                    <nut-button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBtn(e, 1);
                      }}
                      size="small"
                      shape="square"
                      class="border-primary rounded-sm ml-14px bg-primary  text-light-50 text-12px px-10px"
                    >
                      即刻预定
                    </nut-button>
                  </view>
                ) : (
                  <nut-button
                    class="box-border border-primary nrz-thin  rounded-sm px-10px text-12px ml-auto"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBtn(e, 2);
                    }}
                  >
                    试驾
                  </nut-button>
                )}
              </view>
            </view>
          </view>
        </section>
      );
    };
  },
});
</script>
<style>
.nr-shopbtn-orange {
  background-color: #f18a30;
  color: #fff;
  border-top-right-radius: 100px;
  border-bottom-right-radius: 100px;
  box-sizing: border-box;
  height: 100%;
  width: 46px;
}

.nr-shopbtn-666 {
  border-color: #666;
  color: #666;
  border-left: 1px solid #666;
  border-top: 1px solid #666;
  border-bottom: 1px solid #666;
  border-top-left-radius: 100px;
  border-bottom-left-radius: 100px;
  box-sizing: border-box;
  height: 100%;
  width: 46px;
}
</style>
