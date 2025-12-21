<script setup lang="ts">
import { clsx as cn } from 'clsx';

const isError = true;
const hasWarning = false;

// ✅ Valid: Multiple binary expressions in array, all valid
// @validClasses [flex, text-red-500, bg-yellow-100]
</script>

<template>
  <div :class="cn(['flex', isError && 'text-red-500', hasWarning && 'bg-yellow-100'])">
  			Multiple binary in array
  		</div>
</template>
