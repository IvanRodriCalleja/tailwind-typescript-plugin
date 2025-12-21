<script setup lang="ts">
import { clsx } from 'clsx';

// ✅ Valid: Array with arbitrary values
// @validClasses [flex, h-[50vh], w-[100px], bg-[#ff0000]]
</script>

<template>
  <div :class="clsx({ flex: ['h-[50vh]', 'w-[100px]', 'bg-[#ff0000]'] })">With arbitrary</div>
</template>
