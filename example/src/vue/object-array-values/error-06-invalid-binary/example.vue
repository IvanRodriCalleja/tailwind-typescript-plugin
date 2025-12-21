<script setup lang="ts">
import { clsx } from 'clsx';

const hasError = false;

// ❌ Invalid: Array value with binary expressions and invalid class
// @invalidClasses [invalid-error]
// @validClasses [flex, items-center]
</script>

<template>
  <div :class="clsx({ flex: ['items-center', hasError && 'invalid-error'] })">
  			Invalid binary in array
  		</div>
</template>
