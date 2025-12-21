<script setup lang="ts">
import { cva } from 'class-variance-authority';

const button = cva(['font-semibold'], {
		variants: {
			intent: { primary: 'bg-blue-500' }
		},
		compoundVariants: [
				intent: 'primary',
				class: 'hover:bg-blue-600 invalid-compound-class'
		]
	});

// ❌ Invalid: Compound variant with invalid class
// @invalidClasses [invalid-compound-class]
// @validClasses [hover:bg-blue-600]
</script>

<template>
  <button :class="button({ intent: 'primary' })">Invalid Compound</button>
</template>
