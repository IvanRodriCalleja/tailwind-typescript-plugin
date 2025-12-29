<script setup lang="ts">
import { cva } from 'class-variance-authority';

// ⚠️ Warning: Class in base repeated in variant
// @duplicateClasses [flex, flex]
const button = cva(['flex', 'items-center'], {
	variants: {
		intent: {
			primary: ['flex', 'bg-blue-500']
		}
	}
});
</script>

<template>
  <button :class="button({ intent: 'primary' })">Duplicate base + variant</button>
</template>
