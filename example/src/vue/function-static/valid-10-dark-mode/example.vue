<script setup lang="ts">
import clsx from 'clsx';

// ✅ Valid: Function with dark mode variants
// @validClasses [bg-white, dark:bg-gray-900, text-black, dark:text-white]
</script>

<template>
  <div :class="clsx('bg-white dark:bg-gray-900', 'text-black dark:text-white')">
  			Function with dark mode
  		</div>
</template>
