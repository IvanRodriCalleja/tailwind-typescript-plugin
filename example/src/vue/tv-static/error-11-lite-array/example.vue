<script setup lang="ts">
import { tv as tvLite } from 'tailwind-variants/lite';

const component = tvLite({
		base: ['flex', 'invalid-lite-array', 'items-center']
	});

// ❌ Invalid: Lite version with invalid class in array
// @invalidClasses [invalid-lite-array]
// @validClasses [flex, items-center]
</script>

<template>
  <div :class="component()">Invalid Lite Array</div>
</template>
