<script setup lang="ts">
import { tv as myTv } from 'tailwind-variants';

// ✅ Valid: Import aliasing - using myTv instead of tv
// @validClasses [flex, items-center, gap-2, bg-blue-500]
</script>

<template>
  <div :class="component({ variant: 'primary' })">Valid Aliased</div>
</template>
