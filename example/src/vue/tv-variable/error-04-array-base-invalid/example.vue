<script setup lang="ts">
import { tv } from 'tailwind-variants';

const invalidBase = 'invalid-tv-base-var';
const button = tv({
		base: [invalidBase, 'gap-2']
	});

// ❌ Invalid: Array base with invalid variable element
// @invalidClasses [invalid-tv-base-var]
// @validClasses [gap-2]
</script>

<template>
  <button :class="button()">Invalid Array Variable</button>
</template>
