<script setup lang="ts">
import { cn } from '../utils';

// ❌ Invalid: Two nested arrays, invalid in first
// @invalidClasses [invalid-error]
// @validClasses [items-center, justify-center, bg-blue-500]
</script>

<template>
  <div
  			:class="cn([
  				['invalid-error', 'items-center'],
  				['justify-center', 'bg-blue-500']
  			])">
  			Invalid in first
  		</div>
</template>
