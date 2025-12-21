<script setup lang="ts">
import clsx from 'clsx';

const isError = true;

// ✅ Valid: Binary in function call wrapper
// Note: This is a function pattern, not pure expression
// @validClasses [flex, text-red-500]
</script>

<template>
  <div :class="clsx('flex', isError && 'text-red-500')">Binary in function</div>
</template>
