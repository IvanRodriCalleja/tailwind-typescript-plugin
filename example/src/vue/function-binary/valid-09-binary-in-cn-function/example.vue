<script setup lang="ts">
import { clsx as cn } from 'clsx';

const isError = false;

// ✅ Valid: Binary in cn() function
// @validClasses [flex, text-red-500]
</script>

<template>
  <div :class="cn('flex', isError && 'text-red-500')">Binary in cn()</div>
</template>
