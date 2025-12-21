<script setup lang="ts">
import { tv as tvLite } from 'tailwind-variants/lite';

const button = tvLite({
		base: 'font-bold invalid-lite-class text-blue-600'
	});

// ❌ Invalid: Lite version with invalid base class
// @invalidClasses [invalid-lite-class]
// @validClasses [font-bold, text-blue-600]
</script>

<template>
  <button :class="button()">Invalid Lite Base</button>
</template>
