<script setup lang="ts">
import { clsx } from 'clsx';

// ✅ Valid: Empty array as value
// @validClasses [flex]
</script>

<template>
  <div :class="clsx({ flex: [] })">Empty array value</div>
</template>
