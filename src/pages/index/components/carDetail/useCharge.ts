import { computed, onBeforeMount, ref, watch } from 'vue';
// import dayjs from 'dayjs';
import { stopCharge } from '@/api/index';
import { useToast, CODE, removeStore, CHARGING_VIN } from '@/utils/index';
import Taro from '@tarojs/taro';
import { chargeSocketStore } from '@/stores/chargeStore';

export function useStop() {
  const lock = ref(false);
  function clearCharge() {
    chargeSocketStore().setIsCharging(false);
    chargeSocketStore().setChargingVin('');
    removeStore(CHARGING_VIN);
  }
  function _stopCharge({ vin }, cb?) {
    if (lock.value) return useToast('启动中,请稍后...');
    Taro.showModal({
      title: '提示',
      showCancel: true,
      content: '是否结束充电',
      success(res) {
        if (res.confirm) {
          stopCharge({ vin }).then((res) => {
            clearCharge();
            cb && cb();

            if (res?.msg) {
              useToast(res?.msg);
            }
          });
        } else if (res.cancel) {
          console.log('用户点击取消');
        }
      },
    });
  }

  return {
    _stopCharge,
    clearCharge,
  };
}
