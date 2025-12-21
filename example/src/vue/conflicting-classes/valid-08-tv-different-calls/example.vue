<script setup lang="ts">
import { tv } from 'tailwind-variants';

const tvButton = tv({
		base: 'text-left'
	});
const tvCard = tv({
		base: 'text-center'
	});

// ✅ Valid: No conflict between different tv() calls
</script>

<template>
  <>
  			<button :class="tvButton()">Button</button>
  			<div :class="tvCard()">Card</div>
  		</>
</template>
