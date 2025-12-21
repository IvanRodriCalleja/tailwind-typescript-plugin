<script setup lang="ts">
import clsx from 'clsx';

const isActive = true;

// ✅ Valid: Self-closing with object
// @validClasses [w-full, h-auto, rounded-lg]
</script>

<template>
  <img
  			:class="clsx({ 'w-full': true, 'h-auto': true, 'rounded-lg': isActive })"
  			src="test.jpg"
  			alt="test"
  		/>
</template>
