<script setup lang="ts">
import clsx from 'clsx';

const isError = false;
const hasWarning = false;

// ❌ Invalid: Mix of valid and invalid binary arguments
// @invalidClasses [invalid-warning]
// @validClasses [flex, text-red-500]
</script>

<template>
  <div :class="clsx('flex', isError && 'text-red-500', hasWarning && 'invalid-warning')">
  			Mixed binary arguments
  		</div>
</template>
