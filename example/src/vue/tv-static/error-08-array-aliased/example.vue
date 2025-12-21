<script setup lang="ts">
import { tv as myTv } from 'tailwind-variants';

const component = myTv({
		base: ['flex', 'items-center', 'invalid-combo-class']
	});

// ❌ Invalid: Array with aliasing and invalid class
// @invalidClasses [invalid-combo-class]
// @validClasses [flex, items-center]
</script>

<template>
  <div :class="component()">Invalid Array + Aliased</div>
</template>
