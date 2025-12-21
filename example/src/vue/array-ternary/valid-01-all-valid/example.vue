<script setup lang="ts">
import { clsx as cn } from 'clsx';

const isActive = true;

// ✅ Valid: Array with ternary expression, all valid
// @validClasses [flex, bg-blue-500, bg-gray-500]
</script>

<template>
  <div :class="cn(['flex', isActive ? 'bg-blue-500' : 'bg-gray-500'])">Array with ternary</div>
</template>
