<script setup lang="ts">
import { clsx } from 'clsx';
import { cn } from '../utils';

// ✅ Valid: Different utility functions
// @validClasses [flex, items-center, justify-center, bg-blue-500]
</script>

<template>
  <>
  			<div :class="clsx({ flex: ['items-center'] })">clsx</div>
  			<div :class="cn({ 'justify-center': ['bg-blue-500'] })">cn</div>
  		</>
</template>
