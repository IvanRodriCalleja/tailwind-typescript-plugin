<script setup lang="ts">
import { tv } from 'tailwind-variants';

const validBase = 'flex items-center';
const button = tv({
		base: validBase
	});

// ✅ Valid: Variable with valid classes in base
// @validClasses [flex, items-center]
</script>

<template>
  <button :class="button()">Valid Base Variable</button>
</template>
