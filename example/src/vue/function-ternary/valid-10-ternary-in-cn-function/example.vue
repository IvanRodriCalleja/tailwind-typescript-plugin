<script setup lang="ts">
import { clsx as cn } from 'clsx';

const isActive = true;

// ✅ Valid: Ternary in cn() function
// @validClasses [flex, bg-blue-500, bg-gray-500]
</script>

<template>
  <div :class="cn('flex', isActive ? 'bg-blue-500' : 'bg-gray-500')">Ternary in cn()</div>
</template>
