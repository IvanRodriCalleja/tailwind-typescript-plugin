<script setup lang="ts">
import { tv } from 'tailwind-variants';

const button = tv({
		base: ['flex', 'flex', 'items-center']
	});

// ⚠️ Warning: Duplicate in base array
// @duplicateClasses [flex, flex]
</script>

<template>
  <button :class="button()">Duplicate in base array</button>
</template>
