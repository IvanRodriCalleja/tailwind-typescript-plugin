<script setup lang="ts">
import { clsx as cn } from 'clsx';

const isError = true;
const hasWarning = false;

// ❌ Invalid: Mix of valid and invalid binary in array
// @invalidClasses [invalid-warning]
// @validClasses [flex, text-red-500]
</script>

<template>
  <div :class="cn(['flex', isError && 'text-red-500', hasWarning && 'invalid-warning'])">
  			Mixed binary in array
  		</div>
</template>
