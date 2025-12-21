<script setup lang="ts">
import { tv } from 'tailwind-variants';

const button = tv({
		base: 'font-semibold invalid-base-class text-white'
	});

// ❌ Invalid: Contains invalid class in base
// @invalidClasses [invalid-base-class]
// @validClasses [font-semibold, text-white]
</script>

<template>
  <button :class="button()">Invalid Base</button>
</template>
