<template>
  <div class="box-border absolute top-0 left-0 flex flex-col justify-end w-full h-full bg-black bg-opacity-20 text-fff px-14px">
          <div class="overflow-ellipsis">{{title}}</div>
          <div class="my-10px">￥{{price}}</div>
        </div>
</template>
<script setup lang="ts">

withDefaults(defineProps<{title:string,price:string | number}>(),{title:'',price:''})
</script>