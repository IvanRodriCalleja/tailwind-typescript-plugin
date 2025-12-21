<script setup lang="ts">
import { clsx as cn } from 'clsx';

const isError = true;

// ❌ Invalid: Array with binary expression, invalid class
// @invalidClasses [invalid-error]
// @validClasses [flex]
</script>

<template>
  <div :class="cn(['flex', isError && 'invalid-error'])">Array with invalid binary</div>
</template>
