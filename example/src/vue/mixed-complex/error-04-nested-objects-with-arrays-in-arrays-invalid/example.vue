<script setup lang="ts">
import { cn } from '../utils';

// ❌ Invalid: Nested objects with arrays, invalid in nested array value
// @invalidClasses [invalid-bg]
// @validClasses [flex, items-center, justify-center, text-white]
</script>

<template>
  <div
  			:class="cn([
  				'flex',
  				{ 'items-center': ['justify-center', 'invalid-bg'] },
  				[{ 'text-white': true }]
  			])">
  			Invalid nested
  		</div>
</template>
