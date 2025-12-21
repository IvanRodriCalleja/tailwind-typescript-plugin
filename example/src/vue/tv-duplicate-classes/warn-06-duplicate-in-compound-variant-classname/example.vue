<script setup lang="ts">
import { tv } from 'tailwind-variants';

const button = tv({
		base: 'p-4 m-2',
		compoundVariants: [{ className: 'p-4 font-bold' }]
	});

// ⚠️ Warning: Duplicate in compoundVariants className property
// @duplicateClasses [p-4, p-4]
</script>

<template>
  <button :class="button()">Compound className duplicate</button>
</template>
