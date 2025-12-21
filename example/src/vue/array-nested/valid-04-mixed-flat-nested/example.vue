<script setup lang="ts">
import { cn } from '../utils';

// ✅ Valid: Mixed flat and nested arrays
// @validClasses [flex, items-center, justify-center, bg-blue-500]
</script>

<template>
  <div :class="cn(['flex', ['items-center', 'justify-center'], 'bg-blue-500'])">
  			Mixed nesting
  		</div>
</template>
