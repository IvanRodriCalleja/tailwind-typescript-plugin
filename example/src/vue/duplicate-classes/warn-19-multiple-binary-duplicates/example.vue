<script setup lang="ts">
import { clsx as cn } from 'clsx';

const hasError = true;
const isActive = true;

// ⚠️ Warning: Multiple binary duplicates
// @duplicateClasses [p-4, p-4, m-2, m-2]
</script>

<template>
  <div :class="cn('p-4 m-2', hasError && 'p-4', isActive && 'm-2')">
  			Multiple binary duplicates
  		</div>
</template>
