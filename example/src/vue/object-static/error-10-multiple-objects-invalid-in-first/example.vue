<script setup lang="ts">
import clsx from 'clsx';

const isActive = true;
const hasError = false;

// ❌ Invalid: Multiple objects with invalid in first object
// @invalidClasses [invalid-error]
// @validClasses [items-center, justify-center, bg-blue-500]
</script>

<template>
  <div
  			:class="clsx(
  				{ 'invalid-error': hasError, 'items-center': true },
  				{ 'justify-center': isActive, 'bg-blue-500': true }
  			)">
  			Invalid in first
  		</div>
</template>
