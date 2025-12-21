<script setup lang="ts">
import { tv } from 'tailwind-variants';

const button = tv({
		base: ['font-semibold', 'invalid-array-class', 'text-white']
	});

// ❌ Invalid: Array with invalid class
// @invalidClasses [invalid-array-class]
// @validClasses [font-semibold, text-white]
</script>

<template>
  <button :class="button()">Invalid Array Base</button>
</template>
