<script setup lang="ts">
import clsx from 'clsx';

const isError = false;
const hasWarning = false;

// ❌ Invalid: Multiple binary arguments with invalid classes
// @invalidClasses [invalid-error, invalid-warning]
// @validClasses [flex]
</script>

<template>
  <div :class="clsx('flex', isError && 'invalid-error', hasWarning && 'invalid-warning')">
  			Multiple binary with invalid
  		</div>
</template>
