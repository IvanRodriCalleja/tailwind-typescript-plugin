<script setup lang="ts">
import { cva } from 'class-variance-authority';

const button = cva(['flex', 'items-center'], {
		variants: {
			intent: { primary: 'bg-blue-500' },
			size: { lg: 'text-lg' }
		},
		compoundVariants: [{ intent: 'primary', size: 'lg', class: 'flex font-bold' }]
	});

// ⚠️ Warning: Class in base repeated in compoundVariants
// @duplicateClasses [flex, flex]
</script>

<template>
  <button :class="button({ intent: 'primary', size: 'lg' })">Compound duplicate</button>
</template>
