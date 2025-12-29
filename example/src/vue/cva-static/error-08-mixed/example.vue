<script setup lang="ts">
import { cva } from 'class-variance-authority';

const button = cva(['font-semibold', 'invalid-base'], {
	variants: {
		intent: {
			primary: 'bg-blue-500 invalid-variant'
		}
	},
	compoundVariants: [
		{
			intent: 'primary',
			class: 'invalid-compound'
		}
	]
});

// ❌ Invalid: Multiple invalid classes across different sections
// @invalidClasses [invalid-base, invalid-variant, invalid-compound]
// @validClasses [font-semibold, bg-blue-500]
</script>

<template>
  <button :class="button({ intent: 'primary' })">Mixed Invalid</button>
</template>
