<script setup lang="ts">
import { preciseFn } from '@/utils';

// ✅ Valid: Mixed configuration with both string and object formats
// @utilityFunctions [simpleFn, {"name": "preciseFn", "from": "@/utils"}]
// @validClasses [flex, gap-4, items-center, bg-white]
</script>

<template>
  <>
  			<div :class="simpleFn('flex', 'gap-4')">Simple string config</div>
  			<div :class="preciseFn('items-center', 'bg-white')">
  				Object config with import verification
  			</div>
  		</>
</template>
