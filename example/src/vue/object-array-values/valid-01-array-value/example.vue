<script setup lang="ts">
import { clsx } from 'clsx';

// ✅ Valid: Object with array value, all valid
// @validClasses [flex, items-center, justify-center]
</script>

<template>
  <div :class="clsx({ flex: ['items-center', 'justify-center'] })">Array value</div>
</template>
