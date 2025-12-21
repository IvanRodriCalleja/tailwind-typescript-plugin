<script setup lang="ts">
import { tv as tvLite } from 'tailwind-variants/lite';

// ✅ Valid: Lite version with array syntax
// @validClasses [flex, items-center, gap-4, text-sm, font-medium]
</script>

<template>
  <div :class="component({ size: 'sm' })">Valid Lite Array</div>
</template>
