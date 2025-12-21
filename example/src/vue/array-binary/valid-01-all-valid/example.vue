<script setup lang="ts">
import { clsx as cn } from 'clsx';

const isError = true;

// ✅ Valid: Array with binary expression, all valid
// @validClasses [flex, text-red-500]
</script>

<template>
  <div :class="cn(['flex', isError && 'text-red-500'])">Array with binary</div>
</template>
