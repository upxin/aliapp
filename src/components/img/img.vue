<script lang="tsx">
import { defineComponent, onBeforeMount, ref, watch } from 'vue';
import ALT_IMG from '@/assets/imgs/alt.jpeg';

export default defineComponent({
  name: 'Img',
  props: {
    download: { type: Boolean, default: false },
    url: {
      type: String,
      default: '',
    },
    onlyImg: {
      default: false,
      type: Boolean,
    },
    defaultImg: {
      type: String,
      default: ALT_IMG,
    },
    mode: {
      default: 'aspectFit', // scaleToFill ===cover aspectFit===contain
      type: String,
    },
    blur: {
      type: Boolean,
      default: false,
    },
    overlay: { type: Boolean, default: false },
    style: {
      // 修改图片布局行为
      type: Object,
      default: () => ({}),
    },
  },
  emits: [],
  setup(props, { slots }) {
    let imgUrl = ref();

    let renderBgImg = () => {
      return (
        <div
          style={{ backgroundImage: `url(${props?.url})`, ...props.style }}
          class="relative w-full h-full bg-center bg-no-repeat bg-cover"
        >
          {slots?.default?.()}
          {props?.overlay && (
            <div
              class={`${
                props?.blur ? 'nr-blur' : ''
              } absolute top-0 left-0 w-full h-full bg-black bg-opacity-15`}
            ></div>
          )}
        </div>
      );
    };

    watch(
      () => props.url,
      (v) => {
        imgUrl.value = v ? v : props?.defaultImg;
      },
      {
        immediate: true,
      }
    );
    function error() {
      imgUrl.value = ALT_IMG;
    }
    let renderNormalImg = () => {
      return (
        <div class="relative w-full h-full">
          {slots?.default?.() && (
            <div class="absolute w-full h-full">{slots?.default?.()}</div>
          )}
          {props?.overlay && (
            <div
              class={`${
                props?.blur ? 'nr-blur' : ''
              } absolute top-0 left-0 w-full h-full bg-black bg-opacity-10`}
            ></div>
          )}
          <img
            src={imgUrl.value}
            class="w-full h-full"
            mode={props.mode}
            show-menu-by-longpress={props.download}
            onError={error}
          />
        </div>
      );
    };

    function renderImg() {
      if (props.onlyImg) {
        return renderNormalImg();
      } else {
        if (!props.url) return renderNormalImg();
        return renderBgImg();
      }
    }

    return () => {
      return <div style={{ ...props.style }}>{renderImg()}</div>;
    };
  },
});
</script>
