<script setup lang="ts">
import { tv } from 'tailwind-variants';

const button = tv({
		base: ['font-semibold', 'text-white', 'px-4', 'py-2', 'rounded-full']
	});

// ✅ Valid: Array syntax for base property
// @validClasses [font-semibold, text-white, px-4, py-2, rounded-full]
</script>

<template>
  <button :class="button()">Valid Array Base</button>
</template>
