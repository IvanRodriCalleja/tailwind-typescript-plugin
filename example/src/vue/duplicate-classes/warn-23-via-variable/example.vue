<script setup lang="ts">
import { clsx as cn } from 'clsx';

const baseClasses = 'flex items-center';
const duplicateVar = 'flex';

// ⚠️ Warning: Duplicate via variable - variable contains duplicate of base
// @duplicateClasses [flex, flex]
</script>

<template>
  <div :class="cn(baseClasses, duplicateVar)">Duplicate via variable</div>
</template>
