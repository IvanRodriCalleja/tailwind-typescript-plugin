<script setup lang="ts">
import { tv } from 'tailwind-variants';

const button = tv({
		base: 'flex block items-center'
	});

// ⚠️ Warning: Conflict in tv() base
// @conflictClasses [flex, block]
</script>

<template>
  <button :class="button()">TV base conflict</button>
</template>
