<script setup lang="ts">
import { clsx as cn } from 'clsx';

// ✅ Valid: Self-closing element with array
// @validClasses [w-full, h-auto, rounded-lg]
</script>

<template>
  <img :class="cn(['w-full', 'h-auto', 'rounded-lg'])" src="test.jpg" alt="test" />
</template>
