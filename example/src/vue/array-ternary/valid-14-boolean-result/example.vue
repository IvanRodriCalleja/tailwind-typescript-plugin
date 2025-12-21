<script setup lang="ts">
import { clsx as cn } from 'clsx';

const isActive = true;

// ✅ Valid: Ternary with boolean result in array (ignored)
// @validClasses [flex, bg-blue-500]
</script>

<template>
  <div :class="cn(['flex', isActive ? 'bg-blue-500' : false])">Ternary with boolean</div>
</template>
