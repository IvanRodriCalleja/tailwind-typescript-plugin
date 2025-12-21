<script setup lang="ts">
import { tv as myTv } from 'tailwind-variants';

// ✅ Valid: Combining arrays and aliasing
// @validClasses [flex, items-center, gap-2, text-sm, px-2, text-lg, px-6]
</script>

<template>
  <div :class="component({ size: 'lg' })">Valid Array + Aliased</div>
</template>
