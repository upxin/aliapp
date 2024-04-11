import { ref } from 'vue';
export function useScrollAbout() {
  //
  const gradualColor = ref('');
  const gradualColorIcon = ref('');
  const hasBorder = ref(false);

  function changeHeaderBg(scrollTop) {
    const opacity = Math.min(1, scrollTop / 80);
    gradualColor.value = `rgba(255,255,255,${opacity})`;
    if (opacity === 1) {
      hasBorder.value = true;
    } else {
      hasBorder.value = false;
    }

    if (scrollTop < 1) {
      gradualColorIcon.value = `#fff`;
    } else {
      gradualColorIcon.value = `rgba(0,0,0,${opacity})`;
    }
  }
  return { gradualColor, gradualColorIcon, hasBorder, changeHeaderBg };
}
