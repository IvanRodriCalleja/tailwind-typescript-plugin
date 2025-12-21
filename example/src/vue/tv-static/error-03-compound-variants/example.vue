<script setup lang="ts">
import { tv } from 'tailwind-variants';

const button = tv({
		base: 'font-semibold',
		variants: {
			color: { primary: 'bg-blue-500' }
		},
		compoundVariants: [{ color: 'primary', class: 'invalid-compound-class font-bold' }]
	});

// ❌ Invalid: Compound variants with invalid class
// @invalidClasses [invalid-compound-class]
// @validClasses [font-bold]
</script>

<template>
  <button :class="button({ color: 'primary' })">Invalid Compound</button>
</template>
