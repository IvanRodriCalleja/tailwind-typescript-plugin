<script setup lang="ts">
import clsx from 'clsx';

const isError = false;
const hasWarning = false;

// ✅ Valid: Multiple arguments with binary expressions, all valid
// @validClasses [flex, text-red-500, bg-yellow-100]
</script>

<template>
  <div :class="clsx('flex', isError && 'text-red-500', hasWarning && 'bg-yellow-100')">
  			Multiple binary arguments
  		</div>
</template>
