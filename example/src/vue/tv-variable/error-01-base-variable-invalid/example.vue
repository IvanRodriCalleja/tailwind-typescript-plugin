<script setup lang="ts">
import { tv } from 'tailwind-variants';

const invalidBase = 'invalid-tv-base-var';
const button = tv({
		base: invalidBase
	});

// ❌ Invalid: Variable with invalid class in base
// @invalidClasses [invalid-tv-base-var]
</script>

<template>
  <button :class="button()">Invalid Base Variable</button>
</template>
