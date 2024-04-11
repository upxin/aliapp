import { useToast } from '@/utils';
import { onBeforeMount, ref } from 'vue';

interface Opts {
  defaultParams?: any;
  format?: ((res: any) => any) | null;
  [propKey: string]: any;
}

export function usePagination(
  fn: (params: any) => Promise<any>,
  { defaultParams = {}, format = null }: Opts,
  immediate = true
) {
  const data = ref<any[]>([]);
  const pageSize = 10;
  let pageNum = 1;
  const hasMore = ref(false);
  const loading = ref(false);
  const initLoading = ref(false);

  function init(p: any = {}) {
    return new Promise((rv, rj) => {
      loading.value = true;
      if (p.refresh) {
        pageNum = 1;
      }
      fn({ pageNum, pageSize, ...defaultParams, ...p })
        .then((res) => {
          rv(res);
          initLoading.value = false;
          loading.value = false;
          if (res.code === 200) {
            pageNum = res.data.pageNum * 1 + 1;

            if (typeof format === 'function') {
              data.value = p.refresh
                ? format(res)
                : [...data.value, ...format(res)];
            } else {
              data.value = p?.refresh
                ? res.data?.list
                : [...data.value, ...res.data?.list];
            }

            hasMore.value =
              res.data?.total > res?.data?.pageSize * res?.data?.pageNum;
          }
        })
        .catch((err) => {
          initLoading.value = false;
          loading.value = false;
          rj(err);
        });
    });
  }

  const run = (p: any) => {
    return init(p).then(() => {
      useToast('刷新成功', 1500);
    });
  };

  onBeforeMount(() => {
    initLoading.value = true;
    if (immediate) {
      init(defaultParams);
    }
  });

  return {
    run,
    pageNum,
    loading,
    pageSize,
    data,
    hasMore,
    initLoading,
  };
}
