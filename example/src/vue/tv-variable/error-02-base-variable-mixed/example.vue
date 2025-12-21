<script setup lang="ts">
import { tv } from 'tailwind-variants';

const mixedClasses = 'flex invalid-tv-mixed-var items-center';
const button = tv({
		base: mixedClasses
	});

// ❌ Invalid: Variable with mixed valid/invalid classes in base
// @invalidClasses [invalid-tv-mixed-var]
// @validClasses [flex, items-center]
</script>

<template>
  <button :class="button()">Mixed Base Variable</button>
</template>
