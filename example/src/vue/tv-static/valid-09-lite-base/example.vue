<script setup lang="ts">
import { tv as tvLite } from 'tailwind-variants/lite';

const button = tvLite({
		base: 'font-bold text-blue-600 px-4 py-2 rounded-lg'
	});

// ✅ Valid: Lite version with valid base classes
// @validClasses [font-bold, text-blue-600, px-4, py-2, rounded-lg]
</script>

<template>
  <button :class="button()">Valid Lite Base</button>
</template>
