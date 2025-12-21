<script setup lang="ts">
import { clsx } from 'clsx';
import { cn } from '../utils';

// ❌ Invalid: Nested function calls with invalid
// @invalidClasses [invalid-nested-fn]
// @validClasses [flex, items-center, justify-center, bg-blue-500]
</script>

<template>
  <div
  			:class="cn(clsx('flex', { 'items-center': ['justify-center'] }), [
  				clsx({ 'bg-blue-500': true }),
  				'invalid-nested-fn'
  			])">
  			Invalid nested fn
  		</div>
</template>
