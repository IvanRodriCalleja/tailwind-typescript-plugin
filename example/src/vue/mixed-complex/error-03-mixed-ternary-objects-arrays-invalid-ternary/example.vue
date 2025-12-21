<script setup lang="ts">
import { clsx } from 'clsx';

const isActive = true;

// ❌ Invalid: Mix with invalid in ternary
// @invalidClasses [invalid-grid]
// @validClasses [flex, items-center, bg-blue-500, justify-center]
</script>

<template>
  <div
  			:class="clsx(
  				isActive ? 'flex' : 'invalid-grid',
  				{ 'items-center': true, 'bg-blue-500': true },
  				['justify-center']
  			)">
  			Invalid ternary
  		</div>
</template>
