<script setup lang="ts">
import { clsx } from 'clsx';

const isActive = true;

// ❌ Invalid: Multiple objects mixed nesting with invalid
// @invalidClasses [invalid-font]
// @validClasses [flex, items-center, justify-center, bg-blue-500, text-white, p-4]
</script>

<template>
  <div
  			:class="clsx(
  				{ flex: ['items-center', 'justify-center'] },
  				{ 'bg-blue-500': [{ 'text-white': true, 'invalid-font': isActive }] },
  				'p-4'
  			)">
  			Invalid multiple objects
  		</div>
</template>
