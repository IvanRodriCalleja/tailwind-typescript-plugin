<script setup lang="ts">
import { clsx as cn } from 'clsx';

// ✅ Valid: Array with arbitrary values
// @validClasses [h-[50vh], w-[100px], bg-[#ff0000]]
</script>

<template>
  <div :class="cn(['h-[50vh]', 'w-[100px]', 'bg-[#ff0000]'])">Array with arbitrary values</div>
</template>
