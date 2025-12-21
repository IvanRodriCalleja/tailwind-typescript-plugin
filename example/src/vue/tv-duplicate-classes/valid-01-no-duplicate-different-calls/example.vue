<script setup lang="ts">
import { tv } from 'tailwind-variants';

const button = tv({
		base: 'flex items-center'
	});
const card = tv({
		base: 'flex justify-center'
	});

// ✅ Valid: Same class in different tv() calls
</script>

<template>
  <>
  			<button :class="button()">Button</button>
  			<div :class="card()">Card</div>
  		</>
</template>
