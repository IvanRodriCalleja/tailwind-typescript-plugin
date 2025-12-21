<script setup lang="ts">
import { cn } from '../utils';

// ❌ Invalid: Two nested arrays, invalid in second
// @invalidClasses [invalid-class]
// @validClasses [flex, items-center, justify-center]
</script>

<template>
  <div
  			:class="cn([
  				['flex', 'items-center'],
  				['justify-center', 'invalid-class']
  			])">
  			Invalid in second
  		</div>
</template>
