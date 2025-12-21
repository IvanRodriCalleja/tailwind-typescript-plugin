<script setup lang="ts">
import { cn } from '../utils';

const layoutClasses = ['flex', 'items-center'];
const containerClasses = ['flex', 'justify-center'];

// ⚠️ Warning: Multiple spreads with duplicate classes between them
// @duplicateClasses [flex, flex]
</script>

<template>
  <div :class="cn(...layoutClasses, ...containerClasses)">
  			Multiple spreads with duplicates
  		</div>
</template>
