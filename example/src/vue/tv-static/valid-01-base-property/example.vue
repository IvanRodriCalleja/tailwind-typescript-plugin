<script setup lang="ts">
import { tv } from 'tailwind-variants';

const button = tv({
		base: 'font-semibold text-white text-sm py-1 px-4 rounded-full active:opacity-80'
	});

// ✅ Valid: All classes exist in base
// @validClasses [font-semibold, text-white, text-sm, py-1, px-4, rounded-full, active:opacity-80]
</script>

<template>
  <button :class="button()">Valid Base</button>
</template>
