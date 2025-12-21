<script setup lang="ts">
import { clsx as cn } from 'clsx';

const isActive = true;

// ✅ Valid: Ternary with empty string in true branch
// @validClasses [flex, bg-gray-500]
</script>

<template>
  <div :class="cn(['flex', isActive ? '' : 'bg-gray-500'])">Empty true branch</div>
</template>
