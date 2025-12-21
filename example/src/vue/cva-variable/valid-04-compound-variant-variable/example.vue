<script setup lang="ts">
import { cva } from 'class-variance-authority';

const validBase = 'flex items-center';
const button = cva(['font-semibold'], {
		variants: {
			color: { primary: 'bg-blue-500' },
			size: { lg: 'text-lg' }
		},
		compoundVariants: [{ color: 'primary', size: 'lg', class: validBase }]
	});

// ✅ Valid: Compound variant with variable class
// @validClasses [flex, items-center]
</script>

<template>
  <button :class="button({ color: 'primary', size: 'lg' })">Valid Compound Variable</button>
</template>
