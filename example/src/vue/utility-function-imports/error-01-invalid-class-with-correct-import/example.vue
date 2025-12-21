<script setup lang="ts">
import { combine } from '@/lib/styles';

// ❌ Invalid: Function imported from correct package with invalid class
// @utilityFunctions [{"name": "combine", "from": "@/lib/styles"}]
// @invalidClasses [invalid-tailwind-class]
// @validClasses [flex, items-center]
</script>

<template>
  <div :class="combine('flex', 'items-center', 'invalid-tailwind-class')">
  			Correct import - should validate and find error
  		</div>
</template>
