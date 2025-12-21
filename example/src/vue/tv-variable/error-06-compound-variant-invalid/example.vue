<script setup lang="ts">
import { tv } from 'tailwind-variants';

const invalidBase = 'invalid-tv-base-var';
const button = tv({
		base: 'font-semibold',
		variants: {
			color: { primary: 'bg-blue-500' }
		},
		compoundVariants: [{ color: 'primary', class: invalidBase }]
	});

// ❌ Invalid: Compound variant with invalid variable class
// @invalidClasses [invalid-tv-base-var]
</script>

<template>
  <button :class="button({ color: 'primary' })">Invalid Compound Variable</button>
</template>
