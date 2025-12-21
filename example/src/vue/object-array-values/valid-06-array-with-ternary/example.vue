<script setup lang="ts">
import { clsx } from 'clsx';

const isActive = true;

// ✅ Valid: Array value with ternary expressions
// @validClasses [flex, items-center, bg-blue-500, bg-gray-500]
</script>

<template>
  <div :class="clsx({ flex: ['items-center', isActive ? 'bg-blue-500' : 'bg-gray-500'] })">
  			Array with ternary
  		</div>
</template>
