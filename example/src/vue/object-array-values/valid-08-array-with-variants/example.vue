<script setup lang="ts">
import { clsx } from 'clsx';

// ✅ Valid: Array with Tailwind variants
// @validClasses [flex, hover:bg-blue-500, md:flex-col, dark:text-white]
</script>

<template>
  <div :class="clsx({ flex: ['hover:bg-blue-500', 'md:flex-col', 'dark:text-white'] })">
  			With variants
  		</div>
</template>
