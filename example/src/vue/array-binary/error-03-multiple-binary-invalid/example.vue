<script setup lang="ts">
import { clsx as cn } from 'clsx';

const isError = true;
const hasWarning = false;

// ❌ Invalid: Multiple binary expressions with invalid classes
// @invalidClasses [invalid-error, invalid-warning]
// @validClasses [flex]
</script>

<template>
  <div :class="cn(['flex', isError && 'invalid-error', hasWarning && 'invalid-warning'])">
  			Multiple binary with invalid
  		</div>
</template>
