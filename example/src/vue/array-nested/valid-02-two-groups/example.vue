<script setup lang="ts">
import { cn } from '../utils';

// ✅ Valid: Two nested arrays at same level
// @validClasses [flex, items-center, justify-center, bg-blue-500]
</script>

<template>
  <div
  			:class="cn([
  				['flex', 'items-center'],
  				['justify-center', 'bg-blue-500']
  			])">
  			Two groups
  		</div>
</template>
