<script setup lang="ts">
import clsx from 'clsx';

const isActive = true;

// ❌ Invalid: Self-closing with invalid in object
// @invalidClasses [invalid-class]
// @validClasses [w-full, h-auto]
</script>

<template>
  <img
  			:class="clsx({ 'w-full': true, 'invalid-class': true, 'h-auto': isActive })"
  			src="test.jpg"
  			alt="test"
  		/>
</template>
