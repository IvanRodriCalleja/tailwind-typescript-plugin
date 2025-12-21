<script setup lang="ts">
import { cva } from 'class-variance-authority';

const button = cva(['font-semibold'], {
		variants: {
			intent: { primary: 'bg-blue-500', secondary: 'bg-white' },
			size: { small: 'text-sm', medium: 'text-base' }
		},
		compoundVariants: [
				intent: 'primary',
				size: 'medium',
				class: 'hover:bg-blue-600 uppercase'
		]
	});

// ✅ Valid: Compound variants with valid classes
// @validClasses [hover:bg-blue-600, uppercase]
</script>

<template>
  <button :class="button({ intent: 'primary', size: 'medium' })">Valid Compound</button>
</template>
