<script setup lang="ts">
import { tv } from 'tailwind-variants';

// ⚠️ Warning: Duplicate within same slot
// @duplicateClasses [flex, flex]

const component = tv({
	slots: {
		base: 'flex flex items-center',
		content: 'p-4'
	}
});
</script>

<template>
  <div :class="component().base">Duplicate within slot</div>
</template>
