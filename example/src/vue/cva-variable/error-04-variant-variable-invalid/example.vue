<script setup lang="ts">
import { cva } from 'class-variance-authority';

const invalidVariant = 'invalid-cva-variant-var';
const button = cva(['font-semibold'], {
	variants: {
		color: {
			primary: invalidVariant
		}
	}
});

// ❌ Invalid: Variable with invalid class in variant
// @invalidClasses [invalid-cva-variant-var]
</script>

<template>
  <button :class="button({ color: 'primary' })">Invalid Variant Variable</button>
</template>
