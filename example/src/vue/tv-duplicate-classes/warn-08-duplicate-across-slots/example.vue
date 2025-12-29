<script setup lang="ts">
import { tv } from 'tailwind-variants';

// ⚠️ Warning: Duplicate across slots
// @duplicateClasses [flex, flex]

const component = tv({
	slots: {
		base: 'flex items-center',
		icon: 'flex mr-2'
	}
});
</script>

<template>
  <div :class="component().base">Duplicate across slots</div>
</template>
