<script setup lang="ts">
import { cva } from 'class-variance-authority';

const button = cva(['flex'], {
		compoundVariants: [
			{ intent: 'primary', class: 'font-bold' },
			{ intent: 'secondary', class: 'font-bold italic' }
		]
	});

// ⚠️ Warning: Duplicate across multiple compoundVariants
// @duplicateClasses [font-bold, font-bold]
</script>

<template>
  <button :class="button()">Duplicate across compounds</button>
</template>
