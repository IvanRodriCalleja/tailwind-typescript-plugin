<script setup lang="ts">
import { cn } from '../utils';

const baseClasses = ['flex', 'items-center'];

// ⚠️ Warning: Spread operator with duplicate classes
// @duplicateClasses [flex, flex, items-center, items-center]
</script>

<template>
  <div :class="cn(...baseClasses, 'flex', 'items-center', 'p-4')">Spread with duplicates</div>
</template>
