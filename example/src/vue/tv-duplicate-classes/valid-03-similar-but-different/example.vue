<script setup lang="ts">
import { tv } from 'tailwind-variants';

const button = tv({
		base: 'p-4 pt-2 px-6 py-3'
	});

// ✅ Valid: Similar but different classes
</script>

<template>
  <button :class="button()">Similar classes</button>
</template>
