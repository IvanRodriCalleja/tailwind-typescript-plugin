<script setup lang="ts">
import { clsx as cn } from 'clsx';

const isActive = true;

// ✅ Valid: Ternary with empty string in false branch
// @validClasses [flex, bg-blue-500]
</script>

<template>
  <div :class="cn(['flex', isActive ? 'bg-blue-500' : ''])">Empty false branch</div>
</template>
