import { systemInfo, store } from '@/stores/index';
import { computed, onBeforeMount, ref } from 'vue';
import Taro from '@tarojs/taro';
import { useToast, noop, useLocation } from '@/utils';
import { getCityInfo } from '@/api/index';

interface Rect {
  left?: number;
  height?: number;
  bottom?: number;
}
export function useRect(id: string) {
  const query = Taro.createSelectorQuery();
  return new Promise<Rect>((resolve) => {
    query
      .select(id)
      .boundingClientRect((rec) => {
        resolve(rec);
      })
      .exec();
  });
}

export function useHeaderHeight() {
  const headerHeight = computed(
    () => systemInfo().RightBtnRect.h + systemInfo().RightBtnRect.t
  );
  return {
    headerHeight,
  };
}

export function useGetNavigateBackParams(key): { [propName: string]: any } {
  const pages = Taro.getCurrentPages();
  const currPage = pages[pages.length - 1]; // 获取当前页面
  console.log(currPage.__data__);
  return currPage.__data__?.[key];
}

export function useNavigateBackSetData(params, cb?) {
  const pages = Taro.getCurrentPages(); // 获取当前的页面栈
  const prevPage = pages[pages.length - 2]; //  获取上一页面

  prevPage.setData(params);

  Taro.navigateBack({
    delta: 1,
    success: () => {
      cb && cb();
    },
  });
}
interface Opts {
  success: (any) => void;
}

export function usePosition(opt?: Opts) {
  const currentCityName = ref();
  const position = ref();
  const lon = ref();
  const lat = ref();

  useLocation()
    .then(({ longitude, latitude, ...rest }) => {
      lon.value = longitude;
      lat.value = latitude;
      store().setLocation({ longitude, latitude });
      opt?.success?.({ latitude, longitude });

      getCityInfo({
        longitude,
        latitude,
        ...rest,
      }).then((res) => {
        console.log('getCityInfo from network=======', res);
        if (res.status !== '1') return;
        currentCityName.value =
          typeof res?.regeocode?.addressComponent?.city === 'string'
            ? res?.regeocode?.addressComponent?.city
            : res?.regeocode?.addressComponent?.province;

        position.value = res.regeocode;

        store().setCityInfo({
          ...res.regeocode.addressComponent,
          formatted_address: res.regeocode.formatted_address,
          latitude,
          longitude,
          currentCityName: currentCityName.value,
        });
        store().setLocation({
          longitude,
          latitude,
        });
      });
    })
    .catch(() => {
      lon.value = store().location.longitude;
      lat.value = store().location.latitude;

      opt?.success?.({
        latitude: store().location.latitude,
        longitude: store().location.longitude,
      });
    });

  return {
    currentCityName,
    lat,
    lon,
    position,
  };
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export function useModal({
  title = '提醒',
  content,
  success = noop,
  cancel = noop,
}) {
  Taro.showModal({
    title,
    content,
    success: (res) => {
      if (res.confirm) {
        success();
      } else if (res.cancel) {
        cancel();
      }
    },
  });
}
interface UseResquest {
  immediate?: boolean;
  params?: any;
  onSuccess?: (res: any) => void;
  onError?: () => void;
  format_data?: () => void;
  showLoading?: boolean;
  showToast?: boolean;
  toastText?: string;
  initLoading?: boolean;
  initSuccess?: (res: any) => void;
}
export function useRequest(
  cb: (params?: any) => Promise<any>,
  opts: UseResquest = {
    immediate: false,
    params: {},
    format_data: noop,
    onSuccess: noop,
    onError: noop,
    showLoading: true,
    showToast: true,
    toastText: '',
  }
) {
  let init = true;
  const data = ref<any>();
  const error = ref<any>(false);
  const initData = ref<any>();
  const loading = ref(false);
  const initLoading = ref(true);
  function fn(p?: any) {
    loading.value = true;
    if (init) {
      initLoading.value = true;
    }
    opts.showLoading &&
      Taro.showLoading({
        title: '加载中...',
      });
    return new Promise((resolve, reject) => {
      cb({ ...opts.params, ...p })
        .then((res) => {
          initLoading.value = false;
          loading.value = false;
          error.value = false;
          opts.showLoading && Taro.hideLoading();

          if (res.code === 200) {
            if (init) {
              initData.value = res?.data;
              opts?.initSuccess && opts?.initSuccess(res);
            }
            data.value = res.data;
            resolve(res.data);
            opts.showToast && useToast(opts?.toastText || res?.msg);
            opts?.onSuccess && opts?.onSuccess(res.data);
          }
          init = false;
        })
        .catch((err) => {
          initLoading.value = false;
          loading.value = false;
          error.value = true;
          Taro.hideLoading();
          reject(err);
          if (opts?.onError) {
            opts.onError();
          }
        });
    });
  }
  onBeforeMount(() => {
    if (opts.immediate) {
      fn();
    }
  });
  const run = (p?) => {
    return fn(p);
  };
  return { data, run, loading, error, initLoading };
}

export function useNavigateBack(params) {
  const pages = Taro.getCurrentPages(); // 获取当前的页面栈
  const prevPage = pages[pages.length - 2]; //  获取上一页面

  prevPage.setData(params);

  Taro.navigateBack({
    delta: 1,
  });
}
