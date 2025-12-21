<script setup lang="ts">
import { clsx as cn } from 'clsx';

const isActive = true;

// ✅ Valid: Ternary with null result in array (ignored)
// @validClasses [flex, bg-blue-500]
</script>

<template>
  <div :class="cn(['flex', isActive ? 'bg-blue-500' : null])">Ternary with null</div>
</template>
