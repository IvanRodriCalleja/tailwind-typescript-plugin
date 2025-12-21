<script setup lang="ts">
import { tv } from 'tailwind-variants';

const validBase = 'flex items-center';
const button = tv({
		base: [validBase, 'gap-2']
	});

// ✅ Valid: Array base with variable element
// @validClasses [flex, items-center, gap-2]
</script>

<template>
  <button :class="button()">Valid Array Variable</button>
</template>
