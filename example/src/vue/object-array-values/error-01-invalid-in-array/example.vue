<script setup lang="ts">
import { clsx } from 'clsx';

// ❌ Invalid: Object with array value, invalid class in array
// @invalidClasses [invalid-class]
// @validClasses [flex, items-center]
</script>

<template>
  <div :class="clsx({ flex: ['items-center', 'invalid-class'] })">Invalid in array</div>
</template>
