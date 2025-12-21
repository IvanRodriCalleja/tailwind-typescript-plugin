<script setup lang="ts">
import clsx from 'clsx';

// ✅ Valid: Function with arbitrary values
// @validClasses [h-[50vh], w-[100px], bg-[#ff0000]]
</script>

<template>
  <div :class="clsx('h-[50vh]', 'w-[100px]', 'bg-[#ff0000]')">
  			Function with arbitrary values
  		</div>
</template>
