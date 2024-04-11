<script lang="tsx">
// 视频合集

import { defineComponent, ref } from 'vue';
import { nrNavigateTo } from '@/utils';
import { videoAtlases } from '@/api/home';
export default defineComponent({
  setup() {
    const videoAtlas = ref();
    function handleAltas() {
      nrNavigateTo(videoAtlas.value.router);
    }
    function getVideo() {
      videoAtlases().then((res) => {
        videoAtlas.value = res.data;
      });
    }
    getVideo();

    return () => {
      return (
        <section onClick={handleAltas}>
          <div class="flex items-center justify-between mb-16px">
            <div class="w-57px h-20px text-primary text-size-14px leading-20px">
              视频合集
            </div>
            <span class="iconfont icon-right h-20px text-primary text-size-24px leading-20px"></span>
          </div>
          <div class="flex justify-between">
            <div
              style={{
                backgroundImage: `url(${videoAtlas.value?.imgs?.[0]?.imgUrl})`,
              }}
              class="bg-center bg-cover w-151px h-217px bg-fleet"
            />
            <div class="flex flex-col justify-between">
              <div
                style={{
                  backgroundImage: `url(${videoAtlas.value?.imgs?.[1]?.imgUrl})`,
                }}
                class="bg-center bg-no-repeat bg-cover w-171px h-122px bg-fleet"
              />
              <div class="relative w-171px h-93px mt-2px">
                <div class="absolute flex items-center justify-center w-full h-full z-999">
                  <span class="iconfont icon-list-start text-fff absolute center text-40px"></span>
                </div>
                <div
                  style={{
                    backgroundImage: `url(${videoAtlas.value?.imgs?.[2]?.imgUrl})`,
                  }}
                  class="absolute w-full h-full bg-center bg-no-repeat bg-cover bg-fleet"
                />
              </div>
            </div>
          </div>
        </section>
      );
    };
  },
});
</script>
