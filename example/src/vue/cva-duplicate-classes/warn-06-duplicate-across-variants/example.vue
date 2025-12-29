<script setup lang="ts">
import { cva } from 'class-variance-authority';

// ⚠️ Warning: Duplicates across multiple variants
// @duplicateClasses [flex, flex]
const button = cva(['flex'], {
	variants: {
		intent: {
			primary: 'bg-blue-500'
		},
		size: {
			lg: 'flex text-lg'
		}
	}
});
</script>

<template>
  <button :class="button({ intent: 'primary', size: 'lg' })">Cross-variant duplicate</button>
</template>
