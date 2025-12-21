<script setup lang="ts">
import { tv as myTv } from 'tailwind-variants';

const component = myTv({
		base: 'flex invalid-aliased-class items-center'
	});

// ❌ Invalid: Import aliasing with invalid class
// @invalidClasses [invalid-aliased-class]
// @validClasses [flex, items-center]
</script>

<template>
  <div :class="component()">Invalid Aliased</div>
</template>
