<script setup lang="ts">
import { cn } from '../utils';

const classes = ['flex items-center', 'justify-center'];

// ✅ Valid: Spread of array defined from string classes (space-separated)
// @validClasses [flex, items-center, justify-center, p-4]
</script>

<template>
  <div :class="cn([...classes, 'p-4'])">Spread with string classes</div>
</template>
