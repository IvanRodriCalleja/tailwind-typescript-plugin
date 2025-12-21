<script setup lang="ts">
import clsx from 'clsx';

const hasError = true;

// ⚠️ Warning: Duplicate with binary expression
// @duplicateClasses [text-red-500, text-red-500]
</script>

<template>
  <div :class="clsx('flex text-red-500', hasError && 'text-red-500')">
  			Duplicate with binary
  		</div>
</template>
