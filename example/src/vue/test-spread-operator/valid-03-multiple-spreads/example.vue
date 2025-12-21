<script setup lang="ts">
import { cn } from '../utils';

const layoutClasses = ['flex', 'items-center'];
const spacingClasses = ['p-4', 'm-2'];
const textClasses = ['text-lg', 'font-bold'];

// ✅ Valid: Multiple spread operators in array
// @validClasses [flex, items-center, p-4, m-2, text-lg, font-bold]
</script>

<template>
  <div :class="cn([...layoutClasses, ...spacingClasses, ...textClasses])">
  			Multiple spreads
  		</div>
</template>
