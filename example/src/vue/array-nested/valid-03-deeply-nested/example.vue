<script setup lang="ts">
import { cn } from '../utils';

// ✅ Valid: Deeply nested arrays (3 levels)
// @validClasses [flex, items-center, justify-center]
</script>

<template>
  <div :class="cn([[['flex', 'items-center', 'justify-center']]])">Deeply nested</div>
</template>
