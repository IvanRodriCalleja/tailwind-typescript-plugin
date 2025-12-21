<script setup lang="ts">
import { cva } from 'class-variance-authority';

const button = cva(['font-semibold'], {
		variants: {
			intent: { secondary: 'bg-white' }
		},
		compoundVariants: [
				intent: 'secondary',
				className: 'hover:bg-gray-100 font-bold'
		]
	});

// ✅ Valid: Compound variant using className property
// @validClasses [hover:bg-gray-100, font-bold]
</script>

<template>
  <button :class="button({ intent: 'secondary' })">Valid className</button>
</template>
