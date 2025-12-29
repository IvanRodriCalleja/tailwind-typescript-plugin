<script setup lang="ts">
import { cva } from 'class-variance-authority';

const button = cva(['font-semibold'], {
	variants: {
		intent: {
			primary: 'bg-blue-500 invalid-string-variant text-white'
		}
	}
});

// ❌ Invalid: Variant string with invalid class
// @invalidClasses [invalid-string-variant]
// @validClasses [bg-blue-500, text-white]
</script>

<template>
  <button :class="button({ intent: 'primary' })">Invalid String Variant</button>
</template>
