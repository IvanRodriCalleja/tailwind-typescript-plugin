<script setup lang="ts">
import { cn } from '../utils';

const baseClasses = ['flex', 'p-4'];

// ⚠️ Warning: Spread operator with conflicting classes
// @conflictClasses [p-4, p-2]
</script>

<template>
  <div :class="cn(...baseClasses, 'p-2', 'items-center')">Spread with conflicts</div>
</template>
