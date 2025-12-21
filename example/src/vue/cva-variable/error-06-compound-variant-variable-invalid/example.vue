<script setup lang="ts">
import { cva } from 'class-variance-authority';

const invalidBase = 'invalid-cva-base-var';
const button = cva(['font-semibold'], {
		variants: {
			color: { primary: 'bg-blue-500' }
		},
		compoundVariants: [{ color: 'primary', class: invalidBase }]
	});

// ❌ Invalid: Compound variant with invalid variable class
// @invalidClasses [invalid-cva-base-var]
</script>

<template>
  <button :class="button({ color: 'primary' })">Invalid Compound Variable</button>
</template>
