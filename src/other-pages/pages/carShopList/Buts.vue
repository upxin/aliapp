<script lang="tsx">
import { defineComponent } from 'vue';
import { homeStore } from '@/stores/home';
import { isPreSalesShop, isAfter, nrNavigateTo, Routes } from '@/utils';
export default defineComponent({
  props: {
    type: {
      type: Number,
      default: 0,
    },
    shopId: { type: String, default: '0' },
  },
  emits: ['repair'],
  setup(props, { emit }) {
    function repair(e) {
      e.stopPropagation();
      emit('repair', props.shopId);
    }

    function testDrive(e) {
      e.stopPropagation();
      nrNavigateTo('testDrive');
    }
    function reserveCar(e) {
      e.stopPropagation();
      nrNavigateTo(Routes.CHOOSECARTYPE, { type: 'ic1' });
    }
    const btn = () => {
      if (!homeStore().state.cars?.length) {
        if (isPreSalesShop(props.type)) {
          return (
            <div class="flex justify-end flex-1 text-center h-28px leading-28px text-size-14px">
              <nut-button
                shape="square"
                size="small"
                onClick={testDrive}
                class="border-solid border-1px rounded-sm h-28px border-primary text-primary  text-size-14px"
              >
                预约试驾
              </nut-button>
              <nut-button
                onClick={reserveCar}
                size="small"
                shape="square"
                class="border-none rounded-sm ml-14px bg-primary border-primary border-1px border-solid  text-light-50 text-12px px-10px"
              >
                即刻预定
              </nut-button>
            </div>
          );
        }
        return <div>{isPreSalesShop(props.type)}</div>;
      } else {
        if (isAfter(props.type)) {
          return (
            <nut-button
              shape="square"
              onClick={repair}
              class="border-solid border-1px h-28px rounded-sm  text-size-14px text-info border-info"
            >
              预约维保
            </nut-button>
          );
        }
        return (
          <>
            <nut-button
              shape="square"
              onClick={testDrive}
              class="border-solid border-1px rounded-sm h-28px border-primary text-primary  text-size-14px"
            >
              预约试驾
            </nut-button>
            <nut-button
              onClick={reserveCar}
              size="small"
              shape="square"
              class="border-none rounded-sm ml-14px bg-primary border-primary text-light-50 text-12px px-10px"
            >
              即刻预定
            </nut-button>
          </>
        );
      }
    };
    return () => {
      return <div>{btn()}</div>;
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
